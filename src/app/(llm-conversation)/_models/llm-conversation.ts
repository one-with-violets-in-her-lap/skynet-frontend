import { LlmConversationMessage } from '@/lib/backend-websockets-client'

export interface LlmMessageToPlay extends LlmConversationMessage {
    id: number
    speechAudioData: Blob
}

export type LlmConversationStatus =
    | 'idle'
    | 'loading'
    | 'in-progress'
    | 'error'
    | 'ended'

export interface LlmConversation {
    status: 'idle' | 'loading' | 'in-progress' | 'error' | 'ended'
    error?: string
    messageQueue: LlmMessageToPlay[]
    currentMessagePlaying?: LlmMessageToPlay
}
