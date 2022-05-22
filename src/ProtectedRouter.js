import { useAuth } from "./context/hooks";
import { Routes, Route, Navigate } from 'react-router-dom'

const ProtectedRoute = ({roleAdmin,children})=>{
    const {user} = useAuth();
   
    if(!user){
        return <Navigate to='/' replace /> 
    }
    else if(user.isAdmin === roleAdmin){
        return children
    }else{
        return <Navigate to='/' replace /> 
    }
}
export default ProtectedRoute