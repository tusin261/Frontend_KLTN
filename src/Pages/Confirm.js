import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import axios from 'axios';
import * as API from '../constants/ManageURL'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
const Confirm = () => {
  const [user, setUser] = useState(null);
  let params = useParams();

  useEffect(() => {
    console.log(params);
    const authEmail = async () => {
      try {
        const response = await axios.get(API.CONFIRM + "/" + params.userId);
        setUser(response.data);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
    authEmail();
  }, [])



  return (
    <div className="striped vh-100">
      {user ?
        <div className='container'>
          <div className='row justify-content-center'>
            <div className="col-md-6 mt-5 d-flex justify-content-center flex-column align-items-center">
              <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64,textAlign:'center' }}/>
              <h3 className='text-center'>Bạn đã xác thực thành công với email {user.email}</h3>
            </div>
          </div>
        </div> :
        <p>Xác thực không thành công</p>}
    </div>
  )
}

export default Confirm