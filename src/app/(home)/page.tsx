'use client'

import noisePurpleLightingImage from '@/assets/images/noise-purple-lighting.png'

import { PlayIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import WaveformIllustration from '@/app/(home)/waveform-illustration'
import Image from 'next/image'

export default function Home() {
    const [llmConversationLoading, setLlmConversationLoading] = useState(false)

    const backdropClasses =
        'transition-all duration-500 delay-300 bg-background/30 backdrop-blur-[2px] absolute w-full h-full top-0 left-0 z-20'

    return (
        <main>
            <section className="relative pb-10 overflow-x-hidden">
                <div
                    className={
                        backdropClasses +
                        ' ' +
                        (llmConversationLoading
                            ? 'backdrop-blur-none bg-transparent'
                            : '')
                    }
                ></div>

                <div
                    className={
                        'transition-all duration-500 ease-in-out relative p-6 mb-12 z-30 flex items-center justify-center flex-col lg:p-10 ' +
                        (llmConversationLoading ? 'opacity-0 -translate-y-52' : '')
                    }
                >
                    <h1 className="scroll-m-20 text-4xl text-center font-extrabold tracking-tight lg:text-5xl">
                        Listen two AI models talk to each other
                    </h1>

                    <p className="leading-7 [&:not(:first-child)]:mt-4 text-center text-muted-foreground">
                        And other fun AI-related things
                    </p>

                    <Button
                        size="lg"
                        className="mt-6"
                        onClick={() => setLlmConversationLoading(true)}
                    >
                        <PlayIcon /> Start
                    </Button>
                </div>

                <WaveformIllustration
                    enablePulsingAnimation={llmConversationLoading}
                />

                <Image
                    src={noisePurpleLightingImage}
                    alt="Background lighting with noise"
                    className="absolute bottom-20 min-w-xs left-1/2 -translate-x-1/2 sm:bottom-2"
                />
            </section>
        </main>
    )
}
