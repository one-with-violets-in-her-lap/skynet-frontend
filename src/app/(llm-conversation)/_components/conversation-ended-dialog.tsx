import telephoneImage from '@/assets/images/telephone.png'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import Image from 'next/image'

export default function ConversationEndedDialog({
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
                    src={telephoneImage}
                    alt="Noise"
                    className="w-32 mb-2 mx-auto sm:mx-0"
                />

                <DialogHeader>
                    <DialogTitle>Conversation ended</DialogTitle>

                    <DialogDescription>
                        Server resources are limited at the moment. So you can&lsquo;t
                        have a conversation longer than 10 messages
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
