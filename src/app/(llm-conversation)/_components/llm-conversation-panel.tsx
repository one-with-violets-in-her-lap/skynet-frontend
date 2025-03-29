'use client'

import noiseCircleImage from '@/assets/images/noise-circle.png'

import { AnimatePresence, motion } from 'motion/react'
import { useRef, useReducer, useEffect } from 'react'
import Image from 'next/image'
import ErrorDialog from '@/components/error-dialog'
import {
    addWebsocketsBackendConnectionErrorHandler,
    connectToWebsocketsBackend,
    sendStartLlmConversationEvent,
    addNewLlmMessageEventHandler,
    addLlmConversationEndEventHandler,
    addBackendErrorEventHandler,
    LlmConversationMessage,
    clearWebsocketEventHandlers,
    WebsocketsBackendError,
    cancelWebsocketsBackendConnection,
} from '@/lib/backend-websockets-client'
import ConversationEndedDialog from './conversation-ended-dialog'
import CurrentTalkingModelCircle from './current-talking-model-circle'
import HeroSection from './hero-section'
import SpeechAudioLightVisualizer from '../../../components/speech-audio-light-visualizer'
import WaveformIllustration from '../../../components/waveform-illustration'
import { LlmConversationStatus, LlmConversation } from '../_models/llm-conversation'
import { llmConversationReducer } from '../_models/llm-conversation-reducer'

export default function LlmConversationPanel() {
    const audioElement = useRef<HTMLAudioElement | null>(null)

    const lastMessageId = useRef(0)

    const [llmConversation, dispatchLlmConversationReducer] = useReducer(
        llmConversationReducer,
        {
            status: LlmConversationStatus.Idle,
            allMessagesReceived: false,
            messageQueue: [],
        },
    )

    const llmConversationLoading =
        llmConversation.status === LlmConversationStatus.Loading
    const showWaveform =
        llmConversationLoading ||
        llmConversation.status === LlmConversationStatus.Idle

    async function startLlmConversation() {
        dispatchLlmConversationReducer({
            type: 'update-status',
            newStatus: LlmConversationStatus.Loading,
        })

        addWebsocketsBackendConnectionErrorHandler(() => handleErrorFromBackend())

        await connectToWebsocketsBackend()

        sendStartLlmConversationEvent()

        addNewLlmMessageEventHandler(handleNewLlmMessage)
        addLlmConversationEndEventHandler(handleLlmConversationEnd)
        addBackendErrorEventHandler(handleErrorFromBackend)
    }

    function handleNewLlmMessage(
        newMessage: LlmConversationMessage,
        speechAudioData: ArrayBuffer,
    ) {
        const speechAudioBlob = new Blob([speechAudioData], { type: 'audio/mpeg' })

        dispatchLlmConversationReducer({
            type: 'update-status',
            newStatus: LlmConversationStatus.InProgress,
        })

        dispatchLlmConversationReducer({
            type: 'add-message',
            newMessage: {
                ...newMessage,
                speechAudioData: speechAudioBlob,
                id: ++lastMessageId.current,
            },
        })
    }

    function handleLlmConversationEnd() {
        dispatchLlmConversationReducer({
            type: 'enable-all-messages-received-flag',
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

            dispatchLlmConversationReducer({
                type: 'update-current-message-playing',
                newMessagePlaying: messageToPlay,
            })

            audioElement.current.src = URL.createObjectURL(
                messageToPlay.speechAudioData,
            )
            audioElement.current.play()

            dispatchLlmConversationReducer({
                type: 'delete-first-message-in-queue',
            })
        }

        return
    }

    function handleMessagePlayingEnd() {
        if (
            llmConversation.allMessagesReceived &&
            llmConversation.messageQueue.length === 0
        ) {
            console.log('All messages received and played, conversation ended')

            dispatchLlmConversationReducer({
                type: 'update-status',
                newStatus: LlmConversationStatus.Ended,
            })

            // TODO: handle current message playing reset
        } else {
            playNewMessageFromQueueIfAvailable(llmConversation)
        }
    }

    function handleConversationReset() {
        dispatchLlmConversationReducer({
            type: 'reset',
        })

        clearWebsocketEventHandlers()
    }

    function handleErrorFromBackend(error?: WebsocketsBackendError) {
        if (error) {
            console.error(`WS backend error: ${error.detail} (${error.name})`)
        } else {
            console.error("Could't connect to WS backend")
        }

        dispatchLlmConversationReducer({
            type: 'update-status',
            newStatus: LlmConversationStatus.Error,
        })
    }

    useEffect(() => {
        playNewMessageFromQueueIfAvailable(llmConversation)
    }, [llmConversation])

    useEffect(() => {
        // Cleans up socket.io listeners and closes connection when component is destroyed
        return () => {
            clearWebsocketEventHandlers()
            cancelWebsocketsBackendConnection()
        }
    }, [])

    return (
        <main>
            <div className="relative pb-10 overflow-hidden h-[700px]">
                <section className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-start p-6 pt-24">
                    <div className="relative w-56 h-56 sm:w-64 sm:h-64 z-10">
                        <SpeechAudioLightVisualizer audioElementRef={audioElement} />

                        <Image
                            src={noiseCircleImage}
                            priority
                            alt="Noise"
                            className="absolute top-0 left-0 w-full h-full opacity-20"
                        />

                        <div
                            className={
                                'absolute transition-transform duration-700 w-full h-full top-0 left-0 ' +
                                (llmConversation.status ===
                                LlmConversationStatus.InProgress
                                    ? 'scale-100'
                                    : 'scale-0')
                            }
                        >
                            <CurrentTalkingModelCircle
                                currentModelTalking={
                                    llmConversation.currentMessagePlaying
                                        ?.from_which_model
                                }
                            />
                        </div>
                    </div>

                    <AnimatePresence mode="popLayout">
                        {showWaveform && (
                            <WaveformIllustration
                                enablePulsingAnimation={llmConversationLoading}
                            />
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="popLayout">
                        {llmConversationLoading && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="leading-7 text-center"
                            >
                                Loading
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="popLayout">
                        {llmConversation.currentMessagePlaying && (
                            <motion.p
                                key={llmConversation.currentMessagePlaying.content}
                                initial={{ opacity: 0, y: '30px' }}
                                animate={{ opacity: 1, y: '0px' }}
                                exit={{ opacity: 0, y: '30px' }}
                                className="leading-7 text-center max-w-xs mx-auto mt-14"
                            >
                                {llmConversation.currentMessagePlaying?.content}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </section>

                <AnimatePresence>
                    {llmConversation.status === LlmConversationStatus.Idle && (
                        <HeroSection onStartButtonClick={startLlmConversation} />
                    )}
                </AnimatePresence>
            </div>

            <audio ref={audioElement} onEnded={handleMessagePlayingEnd} />

            <ConversationEndedDialog
                open={llmConversation.status === LlmConversationStatus.Ended}
                onClose={handleConversationReset}
            />

            <ErrorDialog
                open={llmConversation.status === LlmConversationStatus.Error}
                onClose={() => {
                    cancelWebsocketsBackendConnection()
                    handleConversationReset()
                }}
            />
        </main>
    )
}
