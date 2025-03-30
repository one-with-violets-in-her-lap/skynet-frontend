import { io } from 'socket.io-client'
import {
    EventEmittersArgsMap,
    EventHandlersMap,
    ConversationParticipantModelName,
    LlmConversationMessage,
    LlmConversationPreferences,
    WebsocketsBackendError,
} from '@/lib/backend-websockets-client/types'

export type {
    ConversationParticipantModelName,
    LlmConversationMessage,
    LlmConversationPreferences,
    WebsocketsBackendError,
}

const socketioClient = io(
    process.env.NEXT_PUBLIC_SKYNET_BACKEND_WEBSOCKETS_BASE_URL,
    {
        autoConnect: false,
    },
)

export const backendWebsocketsClient = {
    connect() {
        console.log('Connecting to WS backend...')

        const resultPromise = new Promise<void>(resolve => {
            socketioClient.on('connect', resolve)
        })

        socketioClient.connect()

        return resultPromise
    },

    disconnect() {
        console.log('Disconnecting from WebSockets backend')

        socketioClient.disconnect()
    },

    addEventHandler<TEvent extends keyof EventHandlersMap>(
        event: TEvent,
        doOnEvent: EventHandlersMap[TEvent],
    ) {
        socketioClient.on(event as string, doOnEvent)
    },

    emitEvent<TEvent extends keyof EventEmittersArgsMap>(
        event: TEvent,
        ...args: EventEmittersArgsMap[TEvent]
    ) {
        socketioClient.emit(event, ...args)
    },

    clearEventHandlers() {
        socketioClient.removeAllListeners()

        console.log('Removed all Websockets backend event handlers')
    },
}
