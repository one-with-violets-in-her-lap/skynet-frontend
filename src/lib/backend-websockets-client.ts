import { io } from 'socket.io-client'

export type ConversationParticipantModelName = 'model-1' | 'model-2'

export interface LlmConversationMessage {
    from_which_model: ConversationParticipantModelName
    content: string
}

export interface WebsocketsBackendError {
    name: string
    detail: string
}

export enum WebsocketServerEvent {
    NewLlmMessage = 'new-llm-message',
    LlmConversationEnd = 'llm-conversation-end',
    Error = 'error',
}

export enum WebsocketClientEvent {
    StartLlmConversation = 'start-llm-conversation',
}

const socketioClient = io(
    process.env.NEXT_PUBLIC_SKYNET_BACKEND_WEBSOCKETS_BASE_URL,
    {
        autoConnect: false,
    },
)

export function connectToWebsocketsBackend() {
    console.log('Connecting to WS backend...')

    const resultPromise = new Promise<void>(resolve => {
        socketioClient.on('connect', resolve)
    })

    socketioClient.connect()

    return resultPromise
}

export function addWebsocketsBackendConnectionErrorHandler(doOnError: VoidFunction) {
    socketioClient.on('connect_error', doOnError)
}

export function cancelWebsocketsBackendConnection() {
    console.log('Disconnecting from WebSockets backend')

    socketioClient.disconnect()
}

export function sendStartLlmConversationEvent() {
    socketioClient.emit(WebsocketClientEvent.StartLlmConversation)
}

export function addNewLlmMessageEventHandler(
    doOnNewLlmMessage: (
        llmMessage: LlmConversationMessage,
        speechAudioData: ArrayBuffer,
    ) => void,
) {
    socketioClient.on(
        WebsocketServerEvent.NewLlmMessage,
        (llmMessage: LlmConversationMessage, speechAudioData: ArrayBuffer) => {
            console.log(`New llm message: "${llmMessage.content}"`)
            doOnNewLlmMessage(llmMessage, speechAudioData)
        },
    )
}

export function addLlmConversationEndEventHandler(doOnConversationEnd: VoidFunction) {
    socketioClient.on(WebsocketServerEvent.LlmConversationEnd, doOnConversationEnd)
}

export function addBackendErrorEventHandler(
    doOnError: (error: WebsocketsBackendError) => void,
) {
    socketioClient.on(WebsocketServerEvent.Error, doOnError)
}

export function clearWebsocketEventHandlers() {
    socketioClient.removeAllListeners()

    console.log('Removed all Websockets backend event handlers')
}
