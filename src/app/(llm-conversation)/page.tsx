import { Metadata } from 'next'
import LlmConversationPanel from './_components/llm-conversation-panel'

export const metadata: Metadata = {
    title: 'Skynet @ Listen two AI models talk to each other',
    description:
        "Listen two LLM AI models talk and find out we're fucked. Fun AI website to waste your time on when bored",
}

export default function LlmConversationPage() {
    return (
        <>
            <LlmConversationPanel />
        </>
    )
}
