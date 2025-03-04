'use client'

import noiseCircleImage from '@/assets/images/noise-circle.png'

import { useEffect, useReducer, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import {
    addNewLlmMessageEventHandler,
    connectToWebsocketsBackend,
    LlmConversationMessage,
    sendStartLlmConversationEvent,
} from '@/lib/backend-websockets-client'
import { LlmConversation, LlmMessageToPlay } from './_models/llm-conversation'
import { llmConversationReducer } from './_models/llm-conversation-reducer'
import HeroSection from './_components/hero-section'
import WaveformIllustration from './_components/waveform-illustration'
import ModelSpeechVisualizerCircle from '@/app/(llm-conversation)/_components/model-speech-visualizer-circle'

export default function Home() {
    const audioElement = useRef<HTMLAudioElement | null>(null)

    const lastMessageId = useRef(0)

    const [llmConversation, dispatch] = useReducer(llmConversationReducer, {
        status: 'idle',
        messageQueue: [],
        currentTalkingModelName: 'model-1',
    })

    const llmConversationLoading = llmConversation.status === 'loading'
    const showWaveform =
        llmConversation.status === 'loading' || llmConversation.status === 'idle'

    async function startLlmConversation() {
        dispatch({
            type: 'update-status',
            newStatus: 'loading',
        })

        await connectToWebsocketsBackend()
        await sendStartLlmConversationEvent()

        addNewLlmMessageEventHandler(handleNewLlmMessage)
    }

    function handleNewLlmMessage(
        newMessage: LlmConversationMessage,
        speechAudioData: ArrayBuffer,
    ) {
        const speechAudioBlob = new Blob([speechAudioData], { type: 'audio/mpeg' })

        dispatch({
            type: 'update-status',
            newStatus: 'in-progress',
        })

        dispatch({
            type: 'add-message',
            newMessage: {
                ...newMessage,
                speechAudioData: speechAudioBlob,
                id: ++lastMessageId.current,
            },
        })
    }

    function playNewMessageFromQueueIfAvailable(
        llmConversationState: LlmConversation,
    ) {
        if (llmConversationState.messageQueue.length === 0) {
            console.log('Message queue is empty, not playing anything')
            return
        }

        if (
            audioElement.current &&
            (audioElement.current.ended || audioElement.current.src === '')
        ) {
            const messageToPlay = llmConversationState.messageQueue[0]

            console.log(
                `Picked message ${messageToPlay.id} from the queue. ` +
                    `${llmConversation.messageQueue.length - 1} messages remain. Playing the audio...`,
            )

            audioElement.current.src = URL.createObjectURL(
                messageToPlay.speechAudioData,
            )
            audioElement.current.play()

            dispatch({
                type: 'delete-first-message-in-queue',
            })
        }

        return
    }

    useEffect(() => {
        playNewMessageFromQueueIfAvailable(llmConversation)
    }, [llmConversation])

    return (
        <main>
            <div className="relative pb-10 overflow-x-hidden h-[600px]">
                <section className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-start p-6 pt-24">
                    <div className="relative w-62 h-62 z-10">
                        <div className="w-full h-full bg-purple-400 blur-3xl opacity-40"></div>

                        <Image
                            src={noiseCircleImage}
                            alt="Noise"
                            className="absolute top-0 left-0 w-full h-full opacity-60"
                        />

                        <div
                            className={
                                'absolute transition-transform duration-700 w-full h-full top-0 left-0 ' +
                                (llmConversation.status === 'in-progress'
                                    ? 'scale-100'
                                    : 'scale-0')
                            }
                        >
                            <ModelSpeechVisualizerCircle
                                currentModelTalking={
                                    llmConversation.currentTalkingModelName
                                }
                            />
                        </div>
                    </div>

                    <AnimatePresence>
                        {showWaveform && (
                            <motion.div
                                exit={{ scaleX: 0, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <WaveformIllustration
                                    enablePulsingAnimation={llmConversationLoading}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <p
                        className={
                            'transition-opacity duration-500 leading-7 text-center ' +
                            (llmConversationLoading ? 'opacity-100' : 'opacity-0')
                        }
                    >
                        Loading
                    </p>
                </section>

                <AnimatePresence>
                    {llmConversation.status === 'idle' && (
                        <HeroSection onStartButtonClick={startLlmConversation} />
                    )}
                </AnimatePresence>
            </div>

            <audio
                ref={audioElement}
                onEnded={() => playNewMessageFromQueueIfAvailable(llmConversation)}
            />
        </main>
    )
}
