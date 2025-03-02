import { LlmMessage } from '@/lib/backend-websockets-client'

export interface LlmMessageToPlay extends LlmMessage {
    id: number
    speechAudioData: Blob
}
