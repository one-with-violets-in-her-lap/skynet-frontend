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
                { scaleY: 0.7 },
                {
                    repeatType: 'reverse',
                    repeat: Infinity,
                    duration: 0.9,
                },
            )
        }
    }, [enablePulsingAnimation])

    return (
        <div className="max-w-full overflow-hidden">
            <motion.img
                ref={scope}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.5, scaleY: 1 }}
                transition={{
                    ease: 'easeInOut',
                    duration: 0.5,
                }}
                className="z-10 w-full max-w-md mx-auto min-w-lg"
                src={waveformIllustration.src}
            />
        </div>
    )
}
