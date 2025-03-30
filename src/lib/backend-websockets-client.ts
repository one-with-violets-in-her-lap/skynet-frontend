import type { SocketIoSystemEventHandlersMap } from '@/lib/utils/socket-io'
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

interface EventHandlersMap extends SocketIoSystemEventHandlersMap {
    'new-llm-message': (
        llmMessage: LlmConversationMessage,
        speechAudioData: ArrayBuffer,
    ) => void

    'llm-conversation-end': () => void

    error: (error: WebsocketsBackendError) => void
}

interface EventEmittersArgsMap {
    'start-llm-conversation': []
}

const socketioClient = io(
    process.env.NEXT_PUBLIC_SKYNET_BACKEND_WEBSOCKETS_BASE_URL,
    {
        autoConnect: false,
    },
)

export function connect() {
    console.log('Connecting to WS backend...')

    const resultPromise = new Promise<void>(resolve => {
        socketioClient.on('connect', resolve)
    })

    socketioClient.connect()

    return resultPromise
}

export function disconnect() {
    console.log('Disconnecting from WebSockets backend')

    socketioClient.disconnect()
}

export function addEventHandler<TEvent extends keyof EventHandlersMap>(
    event: TEvent,
    doOnEvent: EventHandlersMap[TEvent],
) {
    socketioClient.on(event as string, doOnEvent)
}

export function emitEvent<TEvent extends keyof EventEmittersArgsMap>(
    event: TEvent,
    ...args: EventEmittersArgsMap[TEvent]
) {
    socketioClient.emit(event, ...args)
}

export function clearEventHandlers() {
    socketioClient.removeAllListeners()

    console.log('Removed all Websockets backend event handlers')
}
