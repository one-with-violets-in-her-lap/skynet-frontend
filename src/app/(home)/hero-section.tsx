import { PlayIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'

export default function HeroSection({
    onStartButtonClick,
}: {
    onStartButtonClick: VoidFunction
}) {
    return (
        <motion.section
            className="absolute top-0 left-0 w-full bg-white/40 backdrop-blur-[2px] h-full flex flex-col items-center p-6 pt-16"
            exit={{ y: -500, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeIn' }}
        >
            <h1 className="scroll-m-20 text-4xl text-center font-extrabold tracking-tight lg:text-5xl">
                Listen two AI models talk to each other
            </h1>

            <p className="leading-7 [&:not(:first-child)]:mt-4 text-center text-muted-foreground">
                And other fun AI-related things
            </p>

            <Button size="lg" className="mt-6" onClick={onStartButtonClick}>
                <PlayIcon /> Start
            </Button>
        </motion.section>
    )
}
