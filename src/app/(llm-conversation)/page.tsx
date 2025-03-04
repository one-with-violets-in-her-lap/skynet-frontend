'use client'

import noiseCircleImage from '@/assets/images/noise-circle.png'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import {
    addNewLlmMessageEventHandler,
    connectToWebsocketsBackend,
    LlmConversationMessage,
    sendStartLlmConversationEvent,
} from '@/lib/backend-websockets-client'
import { LlmConversation, LlmMessageToPlay } from './_models/llm-conversation'
import WaveformIllustration from './_components/waveform-illustration'
import HeroSection from './_components/hero-section'

export default function Home() {
    const audioElement = useRef<HTMLAudioElement | null>(null)

    const lastMessageId = useRef(0)

    const [llmConversation, setLlmConversation] = useState<LlmConversation>({
        status: 'idle',
        messageQueue: [],
        currentTalkingModelName: 'model-1',
    })

    const llmConversationLoading = llmConversation.status === 'loading'
    const showWaveform =
        llmConversation.status === 'loading' || llmConversation.status === 'idle'

    async function startLlmConversation() {
        setLlmConversation({
            ...llmConversation,
            status: 'loading',
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

        setLlmConversation(llmConversationState => ({
            ...llmConversationState,
            status: 'in-progress',
            messageQueue: llmConversationState.messageQueue.concat([
                {
                    ...newMessage,
                    speechAudioData: speechAudioBlob,
                    id: ++lastMessageId.current,
                },
            ]),
        }))
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
            const newMessageQueue = [...llmConversationState.messageQueue]
            const nextMessageToPlay = newMessageQueue.shift() as LlmMessageToPlay

            console.log(
                `Picked message ${nextMessageToPlay.id} from the queue. ` +
                    `${newMessageQueue.length} messages remain. Playing the audio...`,
            )

            audioElement.current.src = URL.createObjectURL(
                nextMessageToPlay.speechAudioData,
            )
            audioElement.current.play()

            setLlmConversation({
                ...llmConversationState,
                messageQueue: newMessageQueue,
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
                    <div className="relative w-52 h-52">
                        <div className="w-full h-full bg-purple-400 blur-3xl opacity-70"></div>

                        <Image
                            src={noiseCircleImage}
                            alt="Noise"
                            className="absolute top-0 left-0 w-full h-full opacity-60"
                        />
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
