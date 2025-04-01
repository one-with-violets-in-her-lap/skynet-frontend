import { FormEvent, useState } from 'react'
import { CirclePlayIcon, Settings2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { LlmConversationPreferences } from '@/lib/backend-websockets-client'
import { useScreenSize } from '@/hooks/screen-size'

export function PreferencesSheet({
    onStartButtonClick,
}: {
    onStartButtonClick: (preferences: LlmConversationPreferences) => void
}) {
    const [opened, setOpened] = useState(false)

    const screenSize = useScreenSize()

    const [preferences, setPreferences] = useState<LlmConversationPreferences>({
        letKnowTheyTalkWithAi: false,
    })

    function handleFormSubmit(event: FormEvent) {
        event.preventDefault()
        setOpened(false)
        onStartButtonClick(preferences)
    }

    return (
        <Sheet open={opened} onOpenChange={setOpened}>
            <SheetTrigger asChild>
                <Button size="lg" className="mt-6" variant="outline">
                    <Settings2Icon />
                </Button>
            </SheetTrigger>

            <SheetContent
                side={screenSize === 'smAndLarger' ? 'right' : 'bottom'}
                className="h-3/5 sm:h-full"
            >
                <SheetHeader>
                    <SheetTitle>Preferences</SheetTitle>

                    <SheetDescription>Customize the AI conversation</SheetDescription>
                </SheetHeader>

                <form
                    className="p-4 pb-7 pt-0 h-full flex flex-col justify-between sm:justify-start"
                    onSubmit={handleFormSubmit}
                >
                    <div className="flex items-center gap-x-3 mb-8 sm:mb-14">
                        <Switch
                            id="letKnowTheyTalkToAiSwitch"
                            checked={preferences.letKnowTheyTalkWithAi}
                            onCheckedChange={newCheckedValue =>
                                setPreferences({
                                    ...preferences,
                                    letKnowTheyTalkWithAi: newCheckedValue,
                                })
                            }
                        />

                        <Label htmlFor="letKnowTheyTalkToAiSwitch">
                            Let AI model know it talks to another AI
                        </Label>
                    </div>

                    <Button variant="default">
                        <CirclePlayIcon />
                        Start
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    )
}
