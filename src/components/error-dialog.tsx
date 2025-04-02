import errorImage from '@/assets/images/error.png'

import Image from 'next/image'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

export function ErrorDialog({
    open,
    onClose,
}: {
    open: boolean
    onClose: VoidFunction
}) {
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
                    <DialogTitle>Error occurred</DialogTitle>

                    <DialogDescription>
                        Something went wrong while initiating a conversation for you.
                        Perhaps the server is busy
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
