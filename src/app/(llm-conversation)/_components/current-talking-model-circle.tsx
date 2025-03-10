import fluidAnimatedPatternImage1 from '@/assets/images/fluid-animated-pattern-1.gif'
import fluidAnimatedPatternImage2 from '@/assets/images/fluid-animated-pattern-2.gif'

import Image, { StaticImageData } from 'next/image'
import { ConversationParticipantModelName } from '@/lib/backend-websockets-client'
import { getTypedObjectKeys } from '@/lib/utils/objects'

export const MODELS_IMAGES: Record<
    ConversationParticipantModelName,
    StaticImageData
> = {
    'model-1': fluidAnimatedPatternImage1,
    'model-2': fluidAnimatedPatternImage2,
}

const MODELS_TITLES: Record<ConversationParticipantModelName, string> = {
    'model-1': 'Model A',
    'model-2': 'Model B',
}

// Model A slides from the left, Model B slides from the right
const MODELS_DISAPPEARING_ANIMATION_CLASSES: Record<
    ConversationParticipantModelName,
    string
> = {
    'model-1': '-translate-x-24 opacity-0',
    'model-2': 'translate-x-24 opacity-0',
}

export default function CurrentTalkingModelCircle({
    currentModelTalking,
}: {
    currentModelTalking?: ConversationParticipantModelName
}) {
    const disappearingAnimationClasses = currentModelTalking
        ? MODELS_DISAPPEARING_ANIMATION_CLASSES[currentModelTalking]
        : ''

    return (
        <>
            {getTypedObjectKeys(MODELS_TITLES).map(modelName => (
                <div
                    key={modelName}
                    className={
                        'transition-all duration-500 p-6 bg-background border-accent-foreground/20 border absolute top-0 left-0 w-full h-full rounded-full flex justify-center flex-col items-center gap-5 ' +
                        (currentModelTalking !== modelName
                            ? disappearingAnimationClasses
                            : '')
                    }
                >
                    <Image
                        unoptimized
                        src={MODELS_IMAGES[modelName]}
                        alt="Fluid abstract pattern animation"
                        className="rounded-full w-32"
                    />

                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        {MODELS_TITLES[modelName]}
                    </h3>
                </div>
            ))}
        </>
    )
}
