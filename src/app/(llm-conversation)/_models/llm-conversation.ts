import {
    LlmConversationMessage,
    WebsocketsBackendError,
} from '@/lib/backend-websockets-client'

export interface LlmMessageToPlay extends LlmConversationMessage {
    id: number
    speechAudioData: Blob
}

export enum LlmConversationStatus {
    /**
     * Conversation hasn't been started, waiting for the user interaction
     */
    Idle = 'idle',

    /**
     * App is connecting to the WS server and waiting for the first message
     */
    Loading = 'loading',

    /**
     * App is receiving new messages and playing them in a queue mode
     */
    InProgress = 'in-progress',

    /**
     * App has played all the messages it received from the server
     */
    Ended = 'ended',

    /**
     * Error occurred. Error message can be available in {@link LlmConversation.error} field
     */
    Error = 'error',
}

export interface LlmConversation {
    status: LlmConversationStatus

    /**
     * Flag that means the app has received all messages from the server,
     * **but messages are still in a queue to be played**
     */
    allMessagesReceived: boolean

    messageQueue: LlmMessageToPlay[]
    currentMessagePlaying?: LlmMessageToPlay

    messageList: LlmConversationMessage[]

    error: WebsocketsBackendError | null
}
