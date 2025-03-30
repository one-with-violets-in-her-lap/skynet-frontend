import { SocketIoSystemEventHandlersMap } from '@/lib/utils/socket-io'

export interface WebsocketsBackendError {
    name: string
    detail: string
}

export interface EventHandlersMap extends SocketIoSystemEventHandlersMap {
    'new-llm-message': (
        llmMessage: LlmConversationMessage,
        speechAudioData: ArrayBuffer,
    ) => void

    'llm-conversation-end': () => void

    error: (error: WebsocketsBackendError) => void
}

export interface EventEmittersArgsMap {
    'start-llm-conversation': [LlmConversationPreferences?]
}

export type ConversationParticipantModelName = 'model-1' | 'model-2'

export interface LlmConversationMessage {
    from_which_model: ConversationParticipantModelName
    content: string
}

export interface LlmConversationPreferences {
    /**
     * Flag option that lets LLM bots know they are talking with AI like themselves
     */
    letKnowTheyTalkWithAi?: boolean
}
