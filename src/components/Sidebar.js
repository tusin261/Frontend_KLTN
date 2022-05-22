import React, { useEffect, useState, useRef, useContext } from 'react'
import BoxConversation from './BoxConversation'
import ListOnline from './ListOnline'
import axios from 'axios'
import useAuth from '../context/AuthContext';
import Search from './Search';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { ChatContext } from '../context/ChatContext'
import Alert from '@mui/material/Alert';
import { Avatar, Box, Chip, CircularProgress, Divider, Snackbar } from '@mui/material';
import { NotificationContext } from '../context/NotificationContext'
import * as API from '../constants/ManageURL'
import SearchIcon from '@mui/icons-material/Search';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
const Sidebar = ({ setSelectedConversation, messages, socket, online,selectedConversation }) => {
  const { user } = useAuth();
  //group
  const [groupChatName, setGroupChatName] = useState('');
  const [listResult, setListResult] = useState([]);
  const [listMember, setListMember] = useState([]);
  const [successCreateGroup, setSuccessCreateGroup] = useState(false);
  const [errorCreateGroup, setErrorCreateGroup] = useState(false);
  const inputSearch = useRef();
  const { conversationState, conversationDispatch } = useContext(ChatContext);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('1');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessCreateGroup(false);
    setSuccessCreateGroup(false);
  };
  axios.defaults.baseURL = "http://localhost:5000";
  const config = {
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${user.accessToken}`
    },
  };

  const handleChangeType = (e) => {
    setValue(e.target.value);
  }

  const getList = async (active) => {
    conversationDispatch({ type: "GET_CHATS_START" });
    setLoading(true);
    try {
      const { data } = await axios.get("/api/chats", config);
      conversationDispatch({ type: "GET_CHATS_SUCCESS", payload: data });
      if (active) {
        setLoading(false);
      }
    } catch (error) {
      conversationDispatch({ type: "GET_CHATS_FAILURE" });
      console.log(error);
    }
  }

  const handleClickConversation = (conversations) => {
    setSelectedConversation(conversations);
  }

  const handleClickItemInList = (item) => {
    const existedMember = listMember.find(i => i._id === item._id);
    if (existedMember) {
      //do sth
      return;
    } else {
      setListMember([...listMember, item]);
      setListResult([]);
      inputSearch.current.value = '';
    }
  }

  const searchMember = async (e) => {
    const keyword = e.target.value;
    try {
      const rs = await axios.get("/api/users?q=" + keyword, config);
      setListResult(rs.data);
    } catch (error) {
      console.log(error)
    }
  }

  const removerFromGroup = (userFromGroup) => {
    const newGroup = listMember.filter(u => u._id !== userFromGroup._id);
    setListMember(newGroup);
  }

  const handleResetModal = () => {
    setListMember([]);
  }

  const createGroup = async () => {
    const jsonData = {
      chat_name: groupChatName,
      member: JSON.stringify(listMember.map((u) => u._id))
    }
    try {
      const { data } = await axios.post("/api/chats/group", jsonData, config);
      // setListMember([...listMember, data]);
      createNotification(data);
      socket.emit('create group', data);

      setSelectedConversation(data);
      setListMember([]);
      setSuccessCreateGroup(true);
    } catch (error) {
      setErrorCreateGroup(true);
      console.log(error);
    }
  }

  const createNotification = async (groupResponse) => {
    const jsonData = {
      type: 'add_group',
      group: groupResponse
    }
    try {
      const { data } = await axios.post(API.CREATE_NOTI_GROUP, jsonData, config);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let active = true;
    getList(active);
    return () => {
      active = false;
    };
  }, [messages]);



  return (
    <div className='col-lg-12'>
      <button className='btn btn-primary mt-2' data-bs-toggle="modal" data-bs-target="#modalGroup">Tạo Group Chat <AddOutlinedIcon /></button>
      <FormControl>
        <RadioGroup row
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={handleChangeType}
        >
          <FormControlLabel value="1" control={<Radio />} label="Trò chuyện" />
          <FormControlLabel value="2" control={<Radio />} label="Bạn bè" />
        </RadioGroup>
      </FormControl>
      {successCreateGroup && <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={successCreateGroup} autoHideDuration={2000} onClose={handleClose}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Tạo nhóm thành công !!!
        </Alert>
      </Snackbar>}
      {errorCreateGroup && <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={errorCreateGroup} autoHideDuration={2000} onClose={handleClose}>
        <Alert severity="error" sx={{ width: '100%' }}>
          Có lỗi xảy ra khi tạo nhóm!!!
        </Alert>
      </Snackbar>}
      <div className="modal fade" id="modalGroup" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleResetModal}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <input type="text" className="form-control" onChange={(e) => setGroupChatName(e.target.value)} placeholder='Nhập tên nhóm' />
                </div>
                <div className="mb-1">
                  <input type="text" className="form-control" ref={inputSearch} onChange={searchMember} placeholder='Nhập tên để thêm vào nhóm' />

                </div>
                <div className='mb-1 d-flex flex-wrap'>
                  {listMember.length > 0 && listMember.map((user, index) => (
                    <div className='my-1 me-1' key={user._id}>
                      <Chip label={user.first_name}
                        color="primary"
                        onDelete={() => removerFromGroup(user)} avatar={<Avatar src={user.image_url} />} />
                    </div>
                  ))}
                </div>
                <ul className="list-group">
                  {listResult.length > 0 && listResult.map((item, index) => (
                    <li className="list-group-item" key={index} onClick={() => handleClickItemInList(item)}>
                      <div className="d-flex w-100 align-items-center">
                        <img width="64" height="64" className='rounded-circle' alt="100x100" src={item.image_url} />
                        <div className='ms-3'>
                          <p>{item.last_name} {item.first_name}</p>
                          <p>{item.email}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </form>
              <div className='d-flex justify-content-end'>
                <button className='btn btn-primary mt-1' data-bs-dismiss="modal" onClick={createGroup}>Tạo nhóm</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Search setSelectedConversation={setSelectedConversation} socket={socket} />

      <Divider />
      {loading && <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>}
      {value == '1' ?
        <div className='list-group'>
          {conversationState.chats.map(c => (
            <div key={c._id} onClick={() => {
              handleClickConversation(c)
            }}>
              <BoxConversation con={c} selectedConversation={selectedConversation}/>
            </div>
          ))}
        </div> : <div className='row'>
          <ListOnline online={online} setSelectedConversation={setSelectedConversation} />
        </div>}
    </div>
  )
}

export default Sidebar