import { io } from 'socket.io-client'

export enum WebsocketServerEvent {
    NewLlmMessage = 'new-llm-message',
}

export enum WebsocketClientEvent {
    StartLlmConversation = 'start-llm-conversation',
}

export interface LlmMessage {
    content: string
}

const socketioClient = io(
    process.env.NEXT_PUBLIC_SKYNET_BACKEND_WEBSOCKETS_BASE_URL,
    {
        autoConnect: false,
    },
)

export function connectToWebsocketsBackend() {
    console.log('Connecting to WS backend...')

    try {
        socketioClient.connect()
    } catch (error) {
        console.error('Failed to connect to WS backend. More info ' + String(error))
        throw error
    }
}

export async function sendStartLlmConversationEvent() {
    await socketioClient.emitWithAck(WebsocketClientEvent.StartLlmConversation)
}

export async function addNewLlmMessageEventHandler(
    doOnNewLlmMessage: (llmMessage: LlmMessage, speechAudioData: Blob) => void,
) {
    socketioClient.on(
        WebsocketServerEvent.NewLlmMessage,
        (speechAudioData: Blob, llmMessage: LlmMessage) => {
            console.log(`New llm message: "${llmMessage.content}"`)
            doOnNewLlmMessage(llmMessage, speechAudioData)
        },
    )
}
