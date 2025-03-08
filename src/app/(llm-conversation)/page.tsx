'use client'

import noiseCircleImage from '@/assets/images/noise-circle.png'
import telephoneImage from '@/assets/images/telephone.png'
import errorImage from '@/assets/images/error.png'

import { useEffect, useReducer, useRef } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import {
    addBackendErrorEventHandler,
    addLlmConversationEndEventHandler,
    addNewLlmMessageEventHandler,
    addWebsocketsBackendConnectionErrorHandler,
    connectToWebsocketsBackend,
    LlmConversationMessage,
    sendStartLlmConversationEvent,
    WebsocketsBackendError,
} from '@/lib/backend-websockets-client'
import { LlmConversation, LlmConversationStatus } from './_models/llm-conversation'
import { llmConversationReducer } from './_models/llm-conversation-reducer'
import HeroSection from './_components/hero-section'
import WaveformIllustration from './_components/waveform-illustration'
import CurrentTalkingModelCircle from './_components/current-talking-model-circle'
import SpeechAudioLightVisualizer from '@/app/(llm-conversation)/_components/speech-audio-light-visualizer'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

export default function Home() {
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

        addWebsocketsBackendConnectionErrorHandler(handleErrorFromBackend)

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

    return (
        <main>
            <div className="relative pb-10 overflow-hidden h-[700px]">
                <section className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-start p-6 pt-24">
                    <div className="relative w-62 h-62 z-10">
                        <SpeechAudioLightVisualizer audioElementRef={audioElement} />

                        <Image
                            src={noiseCircleImage}
                            alt="Noise"
                            className="absolute top-0 left-0 w-full h-full"
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
                            {llmConversation.currentMessagePlaying && (
                                <CurrentTalkingModelCircle
                                    currentModelTalking={
                                        llmConversation.currentMessagePlaying
                                            .from_which_model
                                    }
                                />
                            )}
                        </div>
                    </div>

                    <AnimatePresence mode="popLayout">
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

            <Dialog
                open={llmConversation.status === LlmConversationStatus.Ended}
                onOpenChange={newOpenValue =>
                    newOpenValue === false ? handleConversationReset() : {}
                }
            >
                <DialogContent>
                    <Image
                        src={telephoneImage}
                        alt="Noise"
                        className="w-32 mb-2 mx-auto sm:mx-0"
                    />

                    <DialogHeader>
                        <DialogTitle>Conversation ended</DialogTitle>

                        <DialogDescription>
                            Server resources are limited at the moment. So you
                            can&lsquo;t have a conversation longer than 10 messages
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <Dialog
                open={llmConversation.status === LlmConversationStatus.Error}
                onOpenChange={newOpenValue =>
                    newOpenValue === false ? handleConversationReset() : {}
                }
            >
                <DialogContent>
                    <Image
                        src={errorImage}
                        alt="Noise"
                        className="w-32 mb-2 mx-auto sm:mx-0"
                    />

                    <DialogHeader>
                        <DialogTitle>Error occurred</DialogTitle>

                        <DialogDescription>
                            Something went wrong while initiating a conversation for
                            you. Perhaps the server is busy
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </main>
    )
}
