import React, { useRef, useState, useEffect, useContext } from 'react'
import { Button, Modal } from 'react-bootstrap'
import axios from 'axios';
import useAuth from '../context/AuthContext';
import Alert from '@mui/material/Alert';
import { Chip, Snackbar } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ListImage from './ListImage';
import ListFile from './ListFile';
import { ChatContext } from '../context/ChatContext'
import Avatar from '@mui/material/Avatar';
import * as API from '../constants/ManageURL'
import LogoutIcon from '@mui/icons-material/Logout';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
const ModalDetailConversation = ({ showDetailConversation,
    onHide,
    selectedConversation,
    setSelectedConversation, socket, listImage, listFile, setMessages, messages }) => {
    const inputSearch = useRef();
    const imageInput = useRef();
    const [preview, setPreview] = useState();
    const [selectedImage, setSelectedImage] = useState(null);
    const { user } = useAuth();
    const [groupChatName, setGroupChatName] = useState(selectedConversation.chat_name);
    const [listResult, setListResult] = useState([]);
    const [listMember, setListMember] = useState([]);
    const [error, setError] = useState(false);
    const [open, setOpen] = useState(false);
    const [successAddMember, setSuccessAddMember] = useState(false);
    const [successKickMember, setSuccessKickMember] = useState(false);
    const [successChangeImage, setSuccessChangeImage] = useState(false);
    const [successChangeName, setSuccessChangeName] = useState(false);
    const [errorAddMember, setErrorAddMember] = useState(false);
    const [errorKickMember, setErrorKickMember] = useState(false);
    const [errorChangeImage, setErrorChangeImage] = useState(false);
    const [errorChangeName, setErrorChangeName] = useState(false);

    const [loading, setLoading] = useState(false);
    const { conversationState, conversationDispatch } = useContext(ChatContext);

    axios.defaults.baseURL = "http://localhost:5000";
    const config = {
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        },
    };
    const getImageConversation = (user, conversation) => {
        return conversation.member[0]._id === user._id ? conversation.member[1].image_url : conversation.member[0].image_url;
    }
    const getImageForTypeChat = (conversation) => {
        if (conversation.isGroupChat) {
            return conversation.group_image;
        } else {
            return getImageConversation(user, conversation)
        }
    }
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.substr(0, 5) === 'image') {
            setSelectedImage(file);
        } else {
            setSelectedImage(null);
        }
    }
    const chooseImage = (e) => {
        imageInput.current.click();
    }
    const submitImageGroup = async () => {
        if (selectedImage) {
            const formData = new FormData();
            formData.append("image", selectedImage);
            formData.append("conversationId", selectedConversation._id);
            try {
                const { data } = await axios.put("/api/chats/update-group", formData, config);
                setSelectedConversation(data);
                setSelectedImage(null);
                setSuccessChangeImage(true);
            } catch (error) {
                console.log(error);
                setErrorChangeImage(true);
            }
        }
    }

    const handleChangeName = async () => {
        if (groupChatName === selectedConversation.chat_name) {
            //set thong bao loi
            return;
        } else {
            const jsonData = {
                chat_name: groupChatName,
                conversationId: selectedConversation._id
            }
            try {
                const { data } = await axios.put("/api/chats/rename-group", jsonData, config);
                setSelectedConversation(data);
                setSuccessChangeName(true);
            } catch (error) {
                setErrorChangeName(true);
                console.log(error);
            }
        }
    }
    const handleDeleteMember = async (mem) => {
        const jsonData = {
            userId: mem._id,
            conversationId: selectedConversation._id
        }
        try {
            const { data } = await axios.put("/api/chats/remove-group", jsonData, config);
            const action = 'đã bị xóa khỏi nhóm';
            console.log('xoa tanh vien');
            sendMessageNotificationDeleteMember(action, mem);
            setSelectedConversation(data);
            setSuccessKickMember(true);
        } catch (error) {
            setErrorKickMember(true);
            console.log(error);
        }
    }
    const searchMember = async (e) => {
        const keyword = e.target.value;
        try {
            const { data } = await axios.get("/api/users?q=" + keyword, config);
            setListResult(data);
        } catch (error) {
            console.log(error)
        }
    }
    const removerFromGroup = (userFromGroup) => {
        const newGroup = listMember.filter(u => u._id !== userFromGroup._id);
        setListMember(newGroup);
    }
    const handleClickItemInList = (item) => {
        const existedMember = listMember.find(i => i._id === item._id);
        const existedMemberinConversation = selectedConversation.member.find(i => i._id === item._id);
        if (existedMember || existedMemberinConversation) {
            setError(true);
            return;
        } else {
            setListMember([...listMember, item]);
            setListResult([]);
            inputSearch.current.value = '';
        }
    }

    const handleAddMember = async () => {
        if (listMember.length > 0) {
            const jsonData = {
                conversationId: selectedConversation._id,
                member: JSON.stringify(listMember.map((u) => u._id))
            }
            try {
                const { data } = await axios.put("/api/chats/add-group", jsonData, config);
                const action = 'đã được thêm vào nhóm';
                sendMessageNotification(action);
                setSelectedConversation(data);
                setListResult([]);
                setListMember([]);
                setSuccessAddMember(true);
            } catch (error) {
                console.log(error);
                setErrorAddMember(true);
            }
        }else{
            setErrorAddMember(true);
        }
    }

    const sendMessageNotification = async (action) => {
        const listMemberName = listMember.map((u) => u.first_name);
        try {
            const { data } = await axios.post("/api/messages/notification", {
                content: `${listMemberName.toString()} ${action}`,
                conversation_id: selectedConversation._id,
                type: 'notification'
            }, config);
            socket.emit('send notification', data);
            setMessages([...messages, data]);
        } catch (error) {
            console.log(error);
        }
    }

    const sendMessageNotificationDeleteMember = async (action, member) => {
        try {
            const { data } = await axios.post("/api/messages/notification", {
                content: `${member.first_name} ${action}`,
                conversation_id: selectedConversation._id,
                type: 'notification'
            }, config);
            socket.emit('send notification delete member', { data, member });
            setMessages([...messages, data]);
        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setError(false);
        setSuccessAddMember(false);
        setErrorAddMember(false);
        setSuccessKickMember(false);
        setErrorKickMember(false);
        setSuccessChangeImage(false);
        setErrorChangeImage(false);
        setErrorChangeName(false);
        setSuccessChangeName(false);
    };
    const openAlert = () => {
        setOpen(true);
    }
    const OutGroup = async () => {
        const jsonData = {
            userId: user._id,
            conversationId: selectedConversation._id
        }
        try {
            const { data } = await axios.put("/api/chats/remove-group", jsonData, config);
            const action = 'đã rời khỏi nhóm';
            sendMessageNotificationOutGroup(action, user);
            setSelectedConversation(null);
            getList();
        } catch (error) {
            console.log(error);
        }
    }

    const sendMessageNotificationOutGroup = async (action, member) => {
        try {
            const { data } = await axios.post("/api/messages/notification", {
                content: `${member.first_name} ${action}`,
                conversation_id: selectedConversation._id,
                type: 'notification'
            }, config);
            socket.emit('send notification out group', { data, member });
        } catch (error) {
            console.log(error);
        }
    }

    const getList = async () => {
        conversationDispatch({ type: "GET_CHATS_START" });
        setLoading(true);
        try {
            const { data } = await axios.get("/api/chats", config);
            conversationDispatch({ type: "GET_CHATS_SUCCESS", payload: data });
            setLoading(false);
        } catch (error) {
            conversationDispatch({ type: "GET_CHATS_FAILURE" });
            console.log(error);
        }
    }

    useEffect(() => {
        if (selectedImage) {
            const render = new FileReader();
            render.onloadend = () => {
                setPreview(render.result);
            }
            render.readAsDataURL(selectedImage);
        } else {
            setPreview(null);
        }
    }, [selectedImage]);

    return (
        <Modal show={showDetailConversation} onHide={onHide}>
            <div className="modal-header">
                <h5>Thông tin cuộc trò chuyện</h5>
                <button type="button" className="btn-close" onClick={onHide}></button>
            </div>
            <div className="modal-body body-modal-info">
                <div className="container-fluid">
                    <div className='row justify-content-center'>
                        <div className='col-lg-10 d-flex flex-column align-items-center'>
                            <Avatar sx={{ width: 64, height: 64 }} alt="avata" src={preview ? preview : getImageForTypeChat(selectedConversation)} />
                            {/* <img width="64" height="64" className='rounded-circle' alt="100x100" src={preview ? preview : getImageForTypeChat(selectedConversation)} /> */}
                            {selectedConversation.isGroupChat && <input type="file" accept='image/*' ref={imageInput} style={{ display: 'none' }} onChange={handleImageChange} />}
                            {selectedConversation.isGroupChat && <div className='d-flex mt-2'>
                                <button className='btn btn-primary me-2' onClick={chooseImage}>Chọn ảnh nhóm</button>
                                {selectedImage && <button className='btn btn-primary' onClick={submitImageGroup}>Đổi ảnh nhóm</button>}
                            </div>}
                            {selectedConversation.isGroupChat && <p className='mb-0'>Nhóm được tạo bởi <b>{selectedConversation.creator.first_name}</b></p>}
                        </div>
                    </div>
                    {selectedConversation.isGroupChat && <>
                        <div className='row'>
                            <div className="mb-1 px-0">
                                <label className="form-label">Tên cuộc trò chuyện</label>
                                <input type="text" className="form-control" value={groupChatName}
                                    onChange={(e) => setGroupChatName(e.target.value)} />
                                <div className="input-group-append my-2">
                                    <button className='btn btn-primary' onClick={handleChangeName}>Thay Đổi</button>
                                </div>
                            </div>
                            <hr></hr>
                        </div>
                        <div className='row'>
                            {/* Thành viên-------------------------------------------------------------------- */}
                            <h5>Thành viên</h5>
                            <ul className='list-group px-0'>
                                {(selectedConversation.member).map((item, index) => (
                                    <li className="list-group-item" key={index}>
                                        <div className='row'>
                                            <div className='col-lg-12 d-flex align-items-center'>
                                                <div className='col-lg-2'>
                                                    <Avatar sx={{ width: 32, height: 32 }} alt="avata" src={item.image_url} />
                                                </div>
                                                <div className='col-lg-7'>
                                                    <p>{item.last_name} {item.first_name}</p>
                                                    <p className='mb-0'>{item.email}</p>
                                                </div>
                                                <div className='col-lg-3'>
                                                    {(selectedConversation.isGroupChat && selectedConversation.creator._id === user._id && item._id != selectedConversation.creator._id)
                                                        && <button className='btn btn-danger' onClick={() => handleDeleteMember(item)}>Xóa <RemoveCircleOutlineIcon /></button>}
                                                </div>
                                            </div>
                                        </div>
                                        {/* <img width="32" height="32" className='rounded-circle' alt="100x100" src={item.image_url} /> */}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/*Thêm Thành viên-------------------------------------------------------------------- */}
                        <div className='row mt-1'>
                            <h5>Thêm thành viên</h5>
                            <div className="px-0">
                                <input type="text" className="form-control" ref={inputSearch} onChange={searchMember} placeholder='Nhập tên để thêm vào nhóm' />
                            </div>
                            <div className='mb-1 d-flex flex-wrap'>
                                {listMember.length > 0 && listMember.map((user, index) => (
                                    // <div key={user._id} className='col-lg-2 bg-danger d-flex text-white p-2 border rounded'>
                                    //     <p className='mb-0'>{user.first_name}</p>
                                    //     <span className='bg-danger ms-2' onClick={() => removerFromGroup(user)}>x</span>
                                    // </div>
                                    <div key={user._id} className='mr-1 my-2'>
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
                            <button className='btn btn-primary' onClick={handleAddMember}>Thêm thành viên</button>
                        </div><Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={error} autoHideDuration={2000} onClose={handleClose}>
                            <Alert severity="error" sx={{ width: '100%' }}>
                                Thành viên đã tồn tại
                            </Alert>
                        </Snackbar>
                        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={successAddMember} autoHideDuration={2000} onClose={handleClose}>
                            <Alert severity="success" sx={{ width: '100%' }}>
                                Thêm thành viên thành công !!!
                            </Alert>
                        </Snackbar>
                        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={errorAddMember} autoHideDuration={2000} onClose={handleClose}>
                            <Alert severity="error" sx={{ width: '100%' }}>
                                Thêm thành viên không thành công !!!
                            </Alert>
                        </Snackbar>
                        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={successKickMember} autoHideDuration={2000} onClose={handleClose}>
                            <Alert severity="success" sx={{ width: '100%' }}>
                                Xóa thành viên thành công
                            </Alert>
                        </Snackbar>
                        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={errorKickMember} autoHideDuration={2000} onClose={handleClose}>
                            <Alert severity="error" sx={{ width: '100%' }}>
                                Xóa thành viên không thành công
                            </Alert>
                        </Snackbar>
                        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={successChangeImage} autoHideDuration={2000} onClose={handleClose}>
                            <Alert severity="success" sx={{ width: '100%' }}>
                                Đổi ảnh nhóm thành công
                            </Alert>
                        </Snackbar>
                        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={errorChangeImage} autoHideDuration={2000} onClose={handleClose}>
                            <Alert severity="error" sx={{ width: '100%' }}>
                                Đổi ảnh nhóm không thành công
                            </Alert>
                        </Snackbar>
                        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={successChangeName} autoHideDuration={2000} onClose={handleClose}>
                            <Alert severity="success" sx={{ width: '100%' }}>
                                Đổi tên nhóm thành công
                            </Alert>
                        </Snackbar>
                        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={errorChangeName} autoHideDuration={2000} onClose={handleClose}>
                            <Alert severity="success" sx={{ width: '100%' }}>
                                Đổi tên nhóm thất bại
                            </Alert>
                        </Snackbar>
                    </>}

                    <div className='row'>
                        <h5 className='mb-0'>Ảnh đã chia sẻ</h5>
                        <ListImage listImage={listImage} />
                    </div>
                    <div className='row'>
                        <h5 className='mb-0'>File</h5>
                        <ListFile listFile={listFile} />
                    </div>
                    <div className='row'>
                        {selectedConversation.isGroupChat && <button className='btn btn-danger' data-bs-dismiss="modal" onClick={openAlert}>Rời khỏi nhóm <LogoutIcon /></button>}
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Bạn có muốn rời nhóm này?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Không</Button>
                                <Button onClick={OutGroup} autoFocus>
                                    Có
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ModalDetailConversation