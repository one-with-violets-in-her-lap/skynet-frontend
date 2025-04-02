import { Metadata } from 'next'
import { LlmConversationPanel } from './_components/llm-conversation-panel'

export const metadata: Metadata = {
    title: 'Skynet @ Listen two AI models talk to each other',
    description:
        'Listen to two LLM AI models talk and become anxious about AI taking over ' +
        'the world. Fun AI website to waste your time on when bored',
}

export default function LlmConversationPage() {
    return (
        <>
            <LlmConversationPanel />
        </>
    )
}
