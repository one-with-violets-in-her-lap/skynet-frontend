'use client'

import noiseCircleImage from '@/assets/images/noise-circle.png'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import {
    addNewLlmMessageEventHandler,
    connectToWebsocketsBackend,
    sendStartLlmConversationEvent,
} from '@/lib/backend-websockets-client'
import { LlmMessageToPlay } from './_models/llm-message-to-play'
import WaveformIllustration from './_components/waveform-illustration'
import HeroSection from './_components/hero-section'

export default function Home() {
    const [llmConversationStatus, setLlmConversationStatus] = useState<
        'idle' | 'loading' | 'success' | 'error'
    >('idle')

    const llmConversationLoading = llmConversationStatus === 'loading'

    const [messages, setMessages] = useState<LlmMessageToPlay[]>([])
    const lastMessageId = useRef(0)

    async function startLlmConversation() {
        setLlmConversationStatus('loading')

        await connectToWebsocketsBackend()
        await sendStartLlmConversationEvent()

        setLlmConversationStatus('success')

        addNewLlmMessageEventHandler((newMessage, speechAudioData) => {
            setMessages(messagesState => [
                ...messagesState,
                { ...newMessage, speechAudioData, id: ++lastMessageId.current },
            ])
        })
    }

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

                    <WaveformIllustration
                        enablePulsingAnimation={llmConversationLoading}
                    />

                    <motion.p
                        className={
                            'transition-opacity duration-500 leading-7 text-center ' +
                            (llmConversationLoading ? 'opacity-100' : 'opacity-0')
                        }
                    >
                        Loading
                    </motion.p>
                </section>

                <AnimatePresence>
                    {llmConversationStatus === 'idle' && (
                        <HeroSection onStartButtonClick={startLlmConversation} />
                    )}
                </AnimatePresence>
            </div>
        </main>
    )
}
