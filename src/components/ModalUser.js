import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import useAuth from '../context/AuthContext';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import * as API from '../constants/ManageURL'
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
const ModalUser = ({ show, onHide, friend, socket }) => {
    const { user, dispatch } = useAuth();
    const [listFriend, setListFriend] = useState();
    const [status, setStatus] = useState();
    const [successAdd, setSuccessAdd] = useState(false);
    const [errorAdd, setErrorAdd] = useState(false);
    axios.defaults.baseURL = "http://localhost:5000";
    const config = {
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        },
    };
    useEffect(() => {
        getListFriend();
    }, [])

    useEffect(() => {
        if (listFriend) {
            checkFriend();
        }
    }, [listFriend, friend]);

    const getListFriend = async () => {
        try {
            const { data } = await axios.get('/api/users/getFriend', config);
            setListFriend(data);
        } catch (error) {
            console.log(error);
        }
    }
    const checkFriend = () => {
        console.log('a');
        const sent_request = listFriend.sent_request;
        const friends = listFriend.listFriend;
        const request = listFriend.request;
        const id = String(friend._id);
        if (sent_request.find((e) => e._id == id)) {
            setStatus(1); // da gui kb
        } else if (friends.find((e) => e._id == id)) {
            setStatus(2);//ban be
        } else if (request.find((e) => e._id == id)) {
            setStatus(3);//dang doi xac nhan
        } else {
            setStatus(4);
        }
    }
    const addFriend = async (e, item) => {
        e.stopPropagation();
        const json = {
            userId: item._id
        }
        try {
            const { data } = await axios.post('/api/users/addFriend', json, config);
            //updateUser(data);
            createNewNotificationAddFriend(item._id);
            setStatus(1);
            setSuccessAdd(true);
            //thong bao
        } catch (error) {
            setErrorAdd(true);
            console.log(error);
        }
    }
    const createNewNotificationAddFriend = async (id) => {
        try {
            const json = {
                receiver_id: id,
                type: 'add_friend'
            }
            const { data } = await axios.post(API.CREATE_NOTI_FRIEND, json, config);
            socket.emit('add friend', { receiverId: id, data });
        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccessAdd(false);
        setErrorAdd(false);
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Thông tin cá nhân
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='container-fluid'>
                    <Snackbar open={successAdd} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                            Gửi lời mới kết bạn thành công
                        </Alert>
                    </Snackbar>
                    <Snackbar open={errorAdd} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                            Gửi lời mời kết bạn thất bại
                        </Alert>
                    </Snackbar>
                    <div className='row'>
                        <div className='col-md-12 d-flex justify-content-center'>
                            <Avatar sx={{ width: 64, height: 64 }} alt="avata" src={friend.image_url} />
                        </div>
                        <div className='col-md-12 text-center'>
                            <h5>{friend.first_name}</h5>
                        </div>
                        <div className='col-md-12'>
                            <div className='row'>
                                <div className='col-md-3 text-end'>
                                    <p>Email: </p>
                                </div>
                                <div className='col-md-8 ps-1'>
                                    <p>{friend.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-12'>
                            <div className='row'>
                                <div className='col-md-3 text-end'>
                                    <p>Giới tính: </p>
                                </div>
                                <div className='col-md-8 ps-1'>
                                    <p>{friend.gender ? 'Nữ' : 'Nam'}</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-12 d-flex justify-content-end'>
                            {status === 1 && <button className='btn btn-primary' disabled>Đã gửi lời mời kết bạn</button>}
                            {status === 2 && <button className='btn btn-primary' disabled>Bạn bè</button>}
                            {status === 3 && <button className='btn btn-primary' disabled>Đang chờ bạn xác nhận</button>}
                            {status === 4 && <button className='btn btn-primary' onClick={(e) => addFriend(e, friend)}><AddIcon sx={{ fontSize: 16 }} /> Thêm bạn</button>}

                        </div>
                        <div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalUser