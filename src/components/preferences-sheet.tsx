import { Settings2Icon } from 'lucide-react'
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

export function PreferencesSheet() {
    return (
        <Sheet>
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
                    <form>
                        <Label>
                            <Switch id="" />
                            Let them know they talk to AI
                        </Label>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    )
}
