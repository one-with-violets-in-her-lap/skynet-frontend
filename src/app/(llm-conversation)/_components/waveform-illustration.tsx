'use client'

import waveformIllustration from '@/assets/images/waveform-illustration.svg'

import { motion, useAnimate } from 'motion/react'
import { useEffect } from 'react'

export default function WaveformIllustration({
    enablePulsingAnimation,
}: {
    enablePulsingAnimation: boolean
}) {
    const [scope, animate] = useAnimate()

    useEffect(() => {
        if (enablePulsingAnimation) {
            animate(
                scope.current,
                { scaleY: 0.8 },
                {
                    repeatType: 'reverse',
                    repeat: Infinity,
                    duration: 0.9,
                },
            )
        }
    }, [enablePulsingAnimation])

    return (
        <div className="w-sm overflow-hidden relative -top-12">
            <motion.img
                ref={scope}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{
                    ease: 'easeInOut',
                    duration: 0.5,
                }}
                className="w-full h-full"
                src={waveformIllustration.src}
            />
        </div>
    )
}
