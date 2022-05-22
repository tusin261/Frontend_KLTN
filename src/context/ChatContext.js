import { useState, createContext,useReducer } from 'react'
import ChatReducer from '../context/ChatReducer'

const initialState = {
    chats: [],
    isLoading: false,
    isError: false,
};

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [conversation, dispatch] = useReducer(ChatReducer,initialState);

    const value = {
        conversationState:conversation,
        conversationDispatch:dispatch
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}