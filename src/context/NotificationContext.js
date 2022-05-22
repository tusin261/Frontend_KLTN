import { useState, createContext,useReducer } from 'react'
import NotificationReducer from './NotificationReducer'

export const NotificationContext = createContext();

const initialState = {
    notifications: [],
    isLoading: false,
    isError: false,
};

export const NotificationProvider = ({ children }) =>{
    const [notification, dispatch] = useReducer(NotificationReducer,initialState);

    const value = {
        notification:notification,
        notificationDispatch:dispatch
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    )
}

