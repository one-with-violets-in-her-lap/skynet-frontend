'use client'

import waveformIllustration from '@/assets/images/waveform-illustration.svg'

import { motion } from 'motion/react'

export default function WaveformIllustration() {
    return (
        <div className="max-w-full overflow-hidden">
            <motion.img
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{
                    ease: 'easeInOut',
                    duration: 0.5,
                }}
                className="z-10 w-full max-w-xl mx-auto min-w-lg"
                src={waveformIllustration.src}
            />
        </div>
    )
}
