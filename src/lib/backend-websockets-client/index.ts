import { io } from 'socket.io-client'
import {
    EventEmittersArgsMap,
    EventHandlersMap,
    ConversationParticipantModelName,
    LlmConversationMessage,
    WebsocketsBackendError,
} from '@/lib/backend-websockets-client/types'

export type {
    ConversationParticipantModelName,
    LlmConversationMessage,
    WebsocketsBackendError,
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
