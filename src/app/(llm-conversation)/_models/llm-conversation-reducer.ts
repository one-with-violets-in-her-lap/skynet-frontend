import { ConversationParticipantModelName } from '@/lib/backend-websockets-client'
import {
    LlmConversation,
    LlmConversationStatus,
    LlmMessageToPlay,
} from './llm-conversation'

interface LlmConversationReducerAddMessageAction {
    type: 'add-message'
    newMessage: LlmMessageToPlay
}

interface LlmConversationReducerUpdateStatusAction {
    type: 'update-status'
    newStatus: LlmConversationStatus
}

interface LlmConversationReducerUpdateCurrentModelAction {
    type: 'update-current-talking-model'
    newModelName: ConversationParticipantModelName
}

interface LlmConversationReducerDeleteFirstMessageInQueueAction {
    type: 'delete-first-message-in-queue'
}

type LlmConversationReducerAction =
    | LlmConversationReducerAddMessageAction
    | LlmConversationReducerUpdateStatusAction
    | LlmConversationReducerUpdateCurrentModelAction
    | LlmConversationReducerDeleteFirstMessageInQueueAction

export function llmConversationReducer(
    state: LlmConversation,
    action: LlmConversationReducerAction,
): LlmConversation {
    switch (action.type) {
        case 'add-message': {
            return {
                ...state,
                messageQueue: state.messageQueue.concat(action.newMessage),
            }
        }

        case 'update-status': {
            return {
                ...state,
                status: action.newStatus,
            }
        }

        case 'update-current-talking-model': {
            return {
                ...state,
                currentTalkingModelName: action.newModelName,
            }
        }

        case 'delete-first-message-in-queue': {
            const newMessageQueue = [...state.messageQueue]
            newMessageQueue.shift()

            return {
                ...state,
                messageQueue: newMessageQueue,
            }
        }
    }
}
