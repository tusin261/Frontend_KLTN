import axios from "axios";
axios.defaults.baseURL = "http://localhost:5000";
const config = {
    headers: {
      "Content-type": "application/json",
    },
};
export const loginCall = async (dataUser,dispatch)=>{
    dispatch({type:'LOGIN_START'});
    try {
        const res = await axios.post("/api/auth/login",dataUser,config);    
        dispatch({type:'LOGIN_SUCCESS',payload:res.data});
        localStorage.setItem("user", JSON.stringify(res.data));
    }
    catch (error) {
        dispatch({type:'LOGIN_FAIL',payload:true});
    }
}