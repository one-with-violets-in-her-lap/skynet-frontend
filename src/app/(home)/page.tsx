'use client'

import noiseCircleImage from '@/assets/images/noise-circle.png'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import WaveformIllustration from '@/app/(home)/waveform-illustration'
import HeroSection from '@/app/(home)/hero-section'

export default function Home() {
    const [llmConversationLoading, setLlmConversationLoading] = useState(false)

    return (
        <main>
            <div className="relative pb-10 overflow-x-hidden h-[600px]">
                <section className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-start p-6 pt-24">
                    <div className="relative w-52 h-52">
                        <div className="w-full h-full bg-purple-400 blur-3xl opacity-70"></div>

                        <Image
                            src={noiseCircleImage}
                            alt="Noise"
                            className="absolute top-0 left-0 w-full h-full opacity-30"
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
                            onStartButtonClick={() => setLlmConversationLoading(true)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </main>
    )
}
