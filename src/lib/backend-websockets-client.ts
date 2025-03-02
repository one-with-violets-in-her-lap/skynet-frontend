import { io } from 'socket.io-client'

const socketioClient = io(
    process.env.NEXT_PUBLIC_SKYNET_BACKEND_WEBSOCKETS_BASE_URL,
    {
        autoConnect: false,
    },
)

export function connectToWebsocketsBackend() {
    socketioClient.connect()
}
