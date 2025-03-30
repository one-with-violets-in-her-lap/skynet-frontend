import { FormEvent, useState } from 'react'
import { CirclePlayIcon, Settings2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { LlmConversationPreferences } from '@/lib/backend-websockets-client'

export function PreferencesSheet({
    onStartButtonClick,
}: {
    onStartButtonClick: (preferences: LlmConversationPreferences) => void
}) {
    const [opened, setOpened] = useState(false)

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

            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Preferences</SheetTitle>
                </SheetHeader>

                <div className="p-4 pt-0">
                    <form onSubmit={handleFormSubmit}>
                        <div className="flex items-center gap-x-2 mb-8">
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
                </div>
            </SheetContent>
        </Sheet>
    )
}
