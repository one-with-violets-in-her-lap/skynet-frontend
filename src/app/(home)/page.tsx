import waveformIllustration from '@/assets/images/waveform-illustration.svg'

import Image from 'next/image'

export default function Home() {
    return (
        <main className="p-10">
            <h1 className="scroll-m-20 text-4xl text-center font-extrabold tracking-tight lg:text-5xl">
                Listen two AI models talk to each other
            </h1>

            <p className="leading-7 [&:not(:first-child)]:mt-6 text-center">
                And other fun AI-related things
            </p>

            <Image
                src={waveformIllustration}
                alt="Abstract waveform illustration covered with neurons"
                className="mx-auto mt-10"
            />
        </main>
    )
}
