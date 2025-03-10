import { RefObject } from 'react'
import { useAudioAmplitudeAnalyzer } from '@/lib/utils/audio-amplitude-analyser'

const AMPLITUDE_MULTIPLIER = 1.2
const MIN_AMPLITUDE = 0.8

export default function SpeechAudioLightVisualizer({
    audioElementRef,
}: {
    audioElementRef: RefObject<HTMLAudioElement | null>
}) {
    const audioAnalyser = useAudioAmplitudeAnalyzer(audioElementRef)

    const lightElementScale = Math.max(
        MIN_AMPLITUDE,
        audioAnalyser.audioAmplitude * AMPLITUDE_MULTIPLIER,
    )

    return (
        <div
            className="w-full h-full bg-purple-400 rounded-full blur-3xl opacity-60"
            style={{
                transform: `scale(${lightElementScale})`,
            }}
        ></div>
    )
}
