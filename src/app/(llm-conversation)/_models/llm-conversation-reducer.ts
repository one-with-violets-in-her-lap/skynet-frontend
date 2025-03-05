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

interface LlmConversationReducerUpdateCurrentMessagePlayingAction {
    type: 'update-current-message-playing'
    newMessagePlaying: LlmMessageToPlay
}

interface LlmConversationReducerDeleteFirstMessageInQueueAction {
    type: 'delete-first-message-in-queue'
}

type LlmConversationReducerAction =
    | LlmConversationReducerAddMessageAction
    | LlmConversationReducerUpdateStatusAction
    | LlmConversationReducerUpdateCurrentMessagePlayingAction
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

        case 'update-current-message-playing': {
            return {
                ...state,
                currentMessagePlaying: action.newMessagePlaying,
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
