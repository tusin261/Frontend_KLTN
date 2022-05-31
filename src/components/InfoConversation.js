import React, { useRef, useState, useEffect, useContext } from 'react'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useAuth from '../context/AuthContext';
import axios from 'axios';
import {NotificationContext} from '../context/NotificationContext'
import ModalDetailConversation from './ModalDetailConversation';
import ModalVideoChat from './ModalVideoChat';
import Avatar from '@mui/material/Avatar';
import PeopleIcon from '@mui/icons-material/People';
const InfoConversation = ({ selectedConversation, setSelectedConversation,socket,
    listImage,listFile,setMessages,messages,groupUpdated }) => {
    const { user } = useAuth();
    // !selectedConversation.isGroupChat ? getNameConversation(user, selectedConversation) : selectedConversation.chat_name    
    const [loading, setLoading] = useState(false);
    const [showDetailConversation, setShowDetailConversation] = useState(false);
    const showDetailModal = ()=>{
        setShowDetailConversation(true);
    }
    const getNameConversation = (user, conversation) => {
        return conversation.member[0]._id === user._id ? conversation.member[1].first_name : conversation.member[0].first_name;
    }
    const getImageConversation = (user,conversation)=>{
        return conversation.member[0]._id===user._id?conversation.member[1].image_url:conversation.member[0].image_url;
    }
    return (
        <div className='col-lg-12 border rounded'>
            <div className='w-100 d-flex justify-content-between align-items-center'>
                <div className='d-flex p-2'>
                <Avatar sx={{ width: 42, height: 42 }} alt="avata" src={selectedConversation.isGroupChat?selectedConversation.group_image:getImageConversation(user,selectedConversation)} />

                    {/* <img width="42" height="42" className='rounded-circle' alt="100x100" src={selectedConversation.isGroupChat?selectedConversation.group_image:getImageConversation(user,selectedConversation)} /> */}
                    <div className='ms-2'>
                        <h5 className='mb-0'>{!selectedConversation.isGroupChat ? getNameConversation(user, selectedConversation) : selectedConversation.chat_name}</h5>
                        {selectedConversation.isGroupChat &&<span>{groupUpdated?groupUpdated.member.length:selectedConversation.member.length} Thành viên</span>}
                    </div>
                </div>
                <div className='d-flex align-items-center'>
                    <span onClick={showDetailModal}  role="button"><MoreVertIcon style={{ fontSize: 38, color: "blue" }} /></span>
                    {showDetailConversation && <ModalDetailConversation 
                        showDetailConversation={showDetailConversation} 
                        onHide={() => setShowDetailConversation(false)} 
                        selectedConversation={selectedConversation} 
                        setSelectedConversation={setSelectedConversation} 
                        listImage={listImage} 
                        listFile={listFile} socket={socket} setMessages={setMessages}
                        messages={messages} groupUpdated={groupUpdated}/>}
                    
                </div>
            </div>
        </div>
    )
}

export default InfoConversation