import errorImage from '@/assets/images/error.png'

import Image from 'next/image'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { LlmConversation } from '@/app/(llm-conversation)/_models/llm-conversation'

export function ErrorDialog({
    open,
    error,
    onClose,
}: {
    open: boolean
    error: LlmConversation['error']
    onClose: VoidFunction
}) {
    const heading =
        error?.name === 'rate-limited-error'
            ? 'Usage limit is reached'
            : 'Error occurred'

    const text =
        error?.name === 'rate-limited-error'
            ? 'Please try again later'
            : 'Something went wrong while initiating a conversation for you. ' +
              'Perhaps the server is busy'

    return (
        <Dialog
            open={open}
            onOpenChange={newOpenValue => (newOpenValue === false ? onClose() : {})}
        >
            <DialogContent>
                <Image
                    src={errorImage}
                    alt="Noise"
                    className="w-32 mb-2 mx-auto sm:mx-0"
                />

                <DialogHeader>
                    <DialogTitle>{heading}</DialogTitle>

                    <DialogDescription>{text}</DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
