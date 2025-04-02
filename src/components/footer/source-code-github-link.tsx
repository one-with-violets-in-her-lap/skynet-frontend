'use client'

import githubLogoImage from '@/assets/images/github-logo-white.svg'

import { useState } from 'react'
import { LockOpenIcon, Code2Icon } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
    TooltipProvider,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

export function SourceCodeGithubLink() {
    const [tooltipOpened, setTooltipOpened] = useState(false)

    return (
        <div className="relative w-fit">
            <TooltipProvider>
                <Tooltip open={tooltipOpened} onOpenChange={setTooltipOpened}>
                    <TooltipContent>It&lsquo;s open source</TooltipContent>

                    <TooltipTrigger asChild>
                        <a
                            target="_blank"
                            href="https://github.com/one-with-violets-in-her-lap/skynet-frontend"
                        >
                            <Button variant="outline" size="icon">
                                <Image
                                    src={githubLogoImage}
                                    alt="Github logo"
                                    className="w-5 h-5"
                                />
                            </Button>
                        </a>
                    </TooltipTrigger>
                </Tooltip>
            </TooltipProvider>

            <div
                className={
                    'transition-opacity duration-400 delay-100 absolute left-1/2 z-30 -translate-x-1/2 -top-12 ' +
                    (tooltipOpened ? 'opacity-100' : 'opacity-0')
                }
            >
                <LockOpenIcon
                    size="16px"
                    className={
                        'absolute transition-all duration-500 delay-400 ' +
                        (tooltipOpened ? 'opacity-0 -translate-y-10' : '')
                    }
                />
                <Code2Icon
                    size="16px"
                    className={
                        'duration-500 transition-all delay-400 ' +
                        (tooltipOpened ? '' : 'opacity-0 translate-y-10')
                    }
                />
            </div>
        </div>
    )
}
