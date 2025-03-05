import fluidAnimatedPatternImage1 from '@/assets/images/fluid-animated-pattern-1.gif'
import fluidAnimatedPatternImage2 from '@/assets/images/fluid-animated-pattern-2.gif'

import Image, { StaticImageData } from 'next/image'
import { ConversationParticipantModelName } from '@/lib/backend-websockets-client'
import { AnimatePresence, motion } from 'motion/react'

const MODELS_IMAGES: Record<ConversationParticipantModelName, StaticImageData> = {
    'model-1': fluidAnimatedPatternImage1,
    'model-2': fluidAnimatedPatternImage2,
}

export default function CurrentTalkingModelCircle({
    currentModelTalking,
}: {
    currentModelTalking: ConversationParticipantModelName
}) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: '0%', opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                key={currentModelTalking}
                className="p-6 bg-background border-accent-foreground/20 border absolute top-0 left-0 w-full h-full rounded-full flex justify-center flex-col items-center gap-5"
            >
                <Image
                    unoptimized
                    src={MODELS_IMAGES[currentModelTalking]}
                    alt="Fluid abstract pattern animation"
                    className="rounded-full w-32"
                />

                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    {currentModelTalking}
                </h3>
            </motion.div>
        </AnimatePresence>
    )
}
