'use client'

import noiseCircleImage from '@/assets/images/noise-circle.png'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { connectToWebsocketsBackend } from '@/lib/backend-websockets-client'
import WaveformIllustration from './waveform-illustration'
import HeroSection from './hero-section'

export default function Home() {
    const [llmConversationLoading, setLlmConversationLoading] = useState(false)

    function connectToBackendForLlmConversationStart() {
        setLlmConversationLoading(true)

        connectToWebsocketsBackend()
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
                    {!llmConversationLoading && (
                        <HeroSection
                            onStartButtonClick={
                                connectToBackendForLlmConversationStart
                            }
                        />
                    )}
                </AnimatePresence>
            </div>
        </main>
    )
}
