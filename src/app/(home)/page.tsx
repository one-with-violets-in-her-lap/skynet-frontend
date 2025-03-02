'use client'

import { PlayIcon } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import WaveformIllustration from '@/app/(home)/waveform-illustration'

export default function Home() {
    const [llmConversationRequested, setLlmConversationRequested] = useState(false)

    const backdropClasses =
        'transition-all duration-500 delay-300 bg-background/50 backdrop-blur-[2px] absolute w-full h-full top-0 left-0 z-20'

    return (
        <main>
            <section className="relative pb-10">
                <div
                    className={
                        backdropClasses +
                        ' ' +
                        (llmConversationRequested
                            ? 'backdrop-blur-none bg-transparent'
                            : '')
                    }
                ></div>

                <div className="relative p-6 mb-6 z-30 flex items-center justify-center flex-col lg:p-10">
                    <h1 className="scroll-m-20 text-4xl text-center font-extrabold tracking-tight lg:text-5xl">
                        Listen two AI models talk to each other
                    </h1>

                    <p className="leading-7 [&:not(:first-child)]:mt-4 text-center text-muted-foreground">
                        And other fun AI-related things
                    </p>

                    <AnimatePresence mode="popLayout">
                        {!llmConversationRequested && (
                            <motion.div
                                key="start-llm-conversation-button"
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Button
                                    className="mt-6"
                                    size="lg"
                                    onClick={() => setLlmConversationRequested(true)}
                                >
                                    <PlayIcon /> Start
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <WaveformIllustration />
            </section>
        </main>
    )
}
