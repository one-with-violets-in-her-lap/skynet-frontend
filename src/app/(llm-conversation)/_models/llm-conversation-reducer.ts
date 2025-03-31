import {
    LlmConversation,
    LlmConversationStatus,
    LlmMessageToPlay,
} from './llm-conversation'

interface AddMessageAction {
    type: 'add-message-to-queue-and-list'
    newMessage: LlmMessageToPlay
}

interface UpdateConversationStatusAction {
    type: 'update-status'
    newStatus: LlmConversationStatus
}

interface UpdateCurrentMessagePlayingAction {
    type: 'update-current-message-playing'
    newMessagePlaying: LlmMessageToPlay
}

interface DeleteFirstMessageInQueueAction {
    type: 'delete-first-message-in-queue'
}

interface EnableAllMessagesReceivedFlagAction {
    type: 'enable-all-messages-received-flag'
}

interface ResetConversationAction {
    type: 'reset'
}

type LlmConversationReducerAction =
    | AddMessageAction
    | UpdateConversationStatusAction
    | UpdateCurrentMessagePlayingAction
    | DeleteFirstMessageInQueueAction
    | EnableAllMessagesReceivedFlagAction
    | ResetConversationAction

export function llmConversationReducer(
    state: LlmConversation,
    action: LlmConversationReducerAction,
): LlmConversation {
    switch (action.type) {
        case 'add-message-to-queue-and-list': {
            return {
                ...state,
                messageQueue: state.messageQueue.concat(action.newMessage),
                messageList: state.messageList.concat(action.newMessage),
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

        case 'enable-all-messages-received-flag': {
            return {
                ...state,
                allMessagesReceived: true,
            }
        }

        case 'reset': {
            return {
                status: LlmConversationStatus.Idle,
                messageQueue: [],
                messageList: [],
                allMessagesReceived: false,
            }
        }
    }
}
