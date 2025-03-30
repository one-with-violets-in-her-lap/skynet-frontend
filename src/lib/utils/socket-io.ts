export interface SocketIoSystemEventHandlersMap {
    connect: () => void
    connect_error: () => void
    disconnect: () => void
}
