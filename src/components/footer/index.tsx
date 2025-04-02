import { Button } from '@/components/ui/button'
import { SourceCodeGithubLink } from '@/components/footer/source-code-github-link'

export function Footer() {
    return (
        <footer className="border-t py-3 px-5 sm:px-9 flex items-center gap-x-6 gap-y-2 flex-wrap">
            <SourceCodeGithubLink />

            <p className="text-sm text-muted-foreground">
                Built by
                <a
                    href="https://github.com/one-with-violets-in-her-lap"
                    target="_blank"
                >
                    <Button variant="link" className="px-1">
                        vet
                    </Button>
                </a>
                (was bored)
            </p>
        </footer>
    )
}
