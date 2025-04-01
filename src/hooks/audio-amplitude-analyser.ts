import { RefObject, useEffect, useState } from 'react'

export function useAudioAmplitudeAnalyzer(
    audioElementRef: RefObject<HTMLAudioElement | null>,
) {
    const [audioAmplitude, setAudioAmplitude] = useState<number>(1)

    useEffect(() => {
        if (!audioElementRef.current) {
            console.warn(
                'useAudioAnalyser hook is not initialized because passed audio ' +
                    'element ref (`audioElementRef`) is empty',
            )

            return
        }

        const audioContext = new AudioContext()

        const audioSource = audioContext.createMediaElementSource(
            audioElementRef.current,
        )

        const analyser = audioContext.createAnalyser()

        audioSource.connect(analyser)

        const totalNumberOfSamples = audioContext.sampleRate / 5
        analyser.fftSize = 2 ** Math.floor(Math.log2(totalNumberOfSamples))

        analyser.connect(audioContext.destination)
        const byteFrequencyData = new Uint8Array(analyser.frequencyBinCount)

        let currentAmplitudeUpdateFrameId: number | undefined = undefined
        function updateAmplitude() {
            analyser.getByteFrequencyData(byteFrequencyData)

            let highestFrequencyAmplitude = 0
            for (
                let frequencyIndex = 0;
                frequencyIndex < analyser.frequencyBinCount;
                frequencyIndex++
            ) {
                const amplitude = byteFrequencyData[frequencyIndex]

                if (amplitude > highestFrequencyAmplitude) {
                    highestFrequencyAmplitude = amplitude
                }
            }

            // Normalizes amplitude
            setAudioAmplitude(highestFrequencyAmplitude / 255)

            currentAmplitudeUpdateFrameId = requestAnimationFrame(updateAmplitude)
        }

        requestAnimationFrame(updateAmplitude)

        return () => {
            if (currentAmplitudeUpdateFrameId !== undefined) {
                cancelAnimationFrame(currentAmplitudeUpdateFrameId)
            }
        }
    }, [])

    return { audioAmplitude }
}
