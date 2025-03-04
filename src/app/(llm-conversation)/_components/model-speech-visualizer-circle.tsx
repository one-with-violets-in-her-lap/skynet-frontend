import fluidAnimatedPatternImage from '@/assets/images/fluid-animated-pattern-1.gif'

import { ConversationParticipantModelName } from '@/lib/backend-websockets-client'
import Image from 'next/image'

export default function ModelSpeechVisualizerCircle({
    currentModelTalking,
}: {
    currentModelTalking: ConversationParticipantModelName
}) {
    return (
        <div className="p-6 bg-background border-accent-foreground/20 border absolute top-0 left-0 w-full h-full rounded-full flex justify-center flex-col items-center gap-5">
            <Image
                src={fluidAnimatedPatternImage}
                alt="Fluid abstract pattern animation"
                className="rounded-full w-32"
            />

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {currentModelTalking}
            </h3>
        </div>
    )
}
