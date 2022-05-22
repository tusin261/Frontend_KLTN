import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { Link } from '@mui/material';
import useAuth from '../context/AuthContext';
import axios from 'axios';
import * as API from '../constants/ManageURL'

const ListRequest = ({ socket }) => {
  const { user, dispatch } = useAuth();
  const [request, setRequest] = useState([]);
  const [fetchingRequest, setFetchingRequest] = useState(true);

  axios.defaults.baseURL = "http://localhost:5000";
  const config = {
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${user.accessToken}`
    },
  };
  useEffect(() => {
    socket?.on('new request friend', data => {
      getListFriend();
    });
    socket?.on('new request accept friend' , data => {
      getListFriend();
    }); 
  }, []);

  useEffect(() => {
    let active = true;
    getListFriend(active);
    return () => {
      active = false;
    };
  }, []);

  const getListFriend = async (active) => {
    try {
      const { data } = await axios.get('/api/users/getFriend', config);
      if(active){
        setRequest(data.request);
      }
      setFetchingRequest(false);
    } catch (error) {
      console.log(error);
    }
  }
  const acceptRequest = async (item) => {
    const json = {
      userId: item._id
    }
    try {
      const { data } = await axios.post('/api/users/acceptRequest', json, config);
      //updateUser(data);
      const newList = request.filter((e)=>e._id != item._id);
      setRequest(newList);
      createNewNotificationAcceptFriend(item._id);
    } catch (error) {
      console.log(error);
    }
  }
  const rejectRequest = async (item) => {
    const json = {
      userId: item._id
    }
    try {
      const { data } = await axios.post('/api/users/rejectRequest', json, config);
      const newList = request.filter((e)=>e._id != item._id);
      setRequest(newList);
      
    } catch (error) {
      console.log(error);
    }
  }
  const createNewNotificationAcceptFriend = async (id) => {
        try {
            const json = {
                receiver_id: id,
                type: 'accept_friend'
            }
            const { data } = await axios.post(API.CREATE_NOTI_FRIEND, json, config);
            socket.emit('accept friend', { receiverId: id, data });
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='row box-request'>
      <div className='col-md-12 border rounded'>
        <div className='row'>
          <div className='col-md-12'>
            <h5>Lời mời kết bạn</h5>
            <hr />
          </div>
        </div>
        {request.map((e, i) => (
          <div className='row' key={i}>
            <div className='col-md-2'>
              <Avatar sx={{ width: 24, height: 24 }} src={e.image_url}></Avatar>
            </div>
            <div className='col-md-10'>
              {e.last_name} {e.first_name}
            </div>
            <div className='col-md-12 my-2'>
              <div className='row'>
                <div className='col-md-6'>
                  <Button variant="contained" size="small" startIcon={<CheckIcon />} 
                  onClick={() => acceptRequest(e)}>
                    Đồng ý
                  </Button>
                </div>
                <div className='col-md-6'>
                  <Button variant="contained" size="small" startIcon={<ClearIcon />} 
                    onClick={() => rejectRequest(e)}>
                    Từ chối
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListRequest