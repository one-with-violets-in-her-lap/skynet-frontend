import { PlayIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import WaveformIllustration from '@/app/(home)/waveform-illustration'

export default function Home() {
    return (
        <main>
            <section className="relative pb-10">
                <div className="bg-background/50 backdrop-blur-[3px] absolute w-full h-full top-0 left-0 z-20"></div>

                <div className="relative p-6 mb-6 z-30 flex items-center justify-center flex-col lg:p-10">
                    <h1 className="scroll-m-20 text-4xl text-center font-extrabold tracking-tight lg:text-5xl">
                        Listen two AI models talk to each other
                    </h1>

                    <p className="leading-7 [&:not(:first-child)]:mt-4 text-center text-muted-foreground">
                        And other fun AI-related things
                    </p>

                    <Button className="mt-6" size="lg">
                        <PlayIcon /> Start
                    </Button>
                </div>

                <WaveformIllustration />
            </section>
        </main>
    )
}
