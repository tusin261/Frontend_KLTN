import { createContext, useContext, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthReducer from '../context/AuthReducer';


const userFromLocalStorage = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
let INITIAL_STATE;

if (userFromLocalStorage) {
    INITIAL_STATE = {
        user: userFromLocalStorage,
        isError: false,
        isLoading: false
    }
} else {
    INITIAL_STATE = {
        user: null,
        isError: false,
        isLoading: false
    }
}


export const AuthContext = createContext(INITIAL_STATE);
export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    
    const value = {
        user: state.user,
        isLoading: state.isLoading,
        isError: state.isError,
        dispatch,
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
}
export default useAuth