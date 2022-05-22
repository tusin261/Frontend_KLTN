import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import useAuth from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext'
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import { loginCall } from '../ApiCall';
import * as API from '../constants/ManageURL'
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ModalUser from './ModalUser';

const Search = ({ setSelectedConversation, socket }) => {
    const { user, dispatch } = useAuth();
    const { conversationState, conversationDispatch } = useContext(ChatContext);
    const { chats } = conversationState;
    const [selectedUser, setSelectedUser] = useState(null);
    const [show, setShow] = useState(false);
    const [listResult, setListResult] = useState([]);
    const inputSearch = useRef();
    axios.defaults.baseURL = "http://localhost:5000";
    const config = {
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        },
    };
    // useEffect(() => {
    //     setShow(true);
    // }, [selectedUser])

    const showModalUser = (e, i) => {
        e.stopPropagation();
        setSelectedUser(i);
        setShow(true);
    }

    const handleChange = async (e) => {
        const keyword = e.target.value;
        try {
            const rs = await axios.get("/api/users?q=" + keyword, config);
            setListResult(rs.data);
        } catch (error) {
            console.log(error)
        }
    }

    const handleClick = async (item) => {
        const user2_id = item._id;
        try {
            console.log(chats);
            const rs = await axios.post("/api/chats", {
                userId: user2_id
            }, config);
            const newConversation = chats.find(e => e._id === rs.data._id);
            if (newConversation) {
                setSelectedConversation(newConversation);
            } else {
                conversationDispatch({ type: "ADD_CHATS", payload: rs.data });
                setSelectedConversation(rs.data)
            }
            setListResult([]);
            inputSearch.current.value = '';

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="mb-2 mt-2 position-relative">
            <input type="text" className="form-control" ref={inputSearch} onChange={handleChange} placeholder='Tìm kiếm ...' />
            <div className='w-100 position-absolute'>
                <ul className="list-group">
                    {listResult.length > 0 && listResult.map((item, index) => (
                        <li className="list-group-item" key={index} onClick={() => handleClick(item)}>
                            <div className='row align-items-center'>
                                <div className='col-md-3'>
                                    <img width="40" height="40" className='rounded-circle' alt="100x100" src={item.image_url} />
                                </div>
                                <div className='col-md-9'>
                                    <div className='row mb-1'>
                                        {item.last_name} {item.first_name}
                                    </div>
                                    <div className='row mb-1'>
                                        {item.email}
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-12 px-0 d-flex align-items-center'>
                                            <button className='btn btn-primary btn-sm' onClick={(event) => showModalUser(event, item)}>
                                                <PersonSearchIcon sx={{ fontSize: 16 }} /> Xem thông tin</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {selectedUser && <ModalUser show={show} onHide={() => setShow(false)}
                        friend={selectedUser} socket={socket} />}
                </ul>
            </div>
        </div>

    )
}

export default Search