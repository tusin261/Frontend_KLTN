import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography, ListItemButton, IconButton } from '@mui/material'
import axios from 'axios';
import React, { useContext, useEffect,useState } from 'react'
import { NotificationContext } from '../context/NotificationContext';
import * as API from '../constants/ManageURL'
import useAuth from '../context/AuthContext';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const Notification = ({ socket,setValue,value,setNewNotifi }) => {
    const { user } = useAuth();
    axios.defaults.baseURL = "http://localhost:5000";
    const config = {
        headers: {
            "Content-type": "multipart/form-data",
            "Authorization": `Bearer ${user.accessToken}`
        },
    };

    const { notification, notificationDispatch } = useContext(NotificationContext);
    const getListNoti = async () => {
        notificationDispatch({ type: 'GET_NOTIFICATION' });
        try {
            const { data } = await axios.get(API.GET_NOTI, config);
            const listNotUserId = data.filter((e)=>e.sender_id._id != user._id);
            console.log(data);
            notificationDispatch({ type: 'GET_NOTIFICATION_SUCCESS', payload: listNotUserId });
        } catch (error) {
            notificationDispatch({ type: 'GET_NOTIFICATION_FAIL' });
            console.log(error);
        }
    }

    const getType = (notification) => {
        const type = notification.type;
        if (type == 'add_group' || type == 'kick_mem' || type == 'out_group' ||
            type == 'change_img' || type == 'add_mem') {
            return 'Nhóm';
        }else if(type == 'like'){
            return 'Tin';
        }
         else {
            return 'Bạn bè'
        }
    }

    const getContent = (notification) => {
        const content = notification.content;
        for (let i = 0; i < notification.receiver.length; i++) {
            if (user._id == notification.receiver[i]._id) {
                if(notification.type == 'add_friend' || 
                    notification.type == 'accept_friend' || notification.type == 'add_group' || 
                    notification.type == 'like'){
                    return `${notification.sender_id.first_name} ${content}`;
                }else{
                    return `Bạn ${content}`;
                }
            }
        }
        return '';
    }

    const handleClickNotification = (noti)=>{
        if(noti.type == 'add_friend'){
            if(value == 1){
                setValue(0);
            }
        }else{
            return;
        }
    }

    useEffect(() => {
        getListNoti();
    }, []);

    useEffect(() => {
        socket?.on('notification new group', data => {
            getListNoti();
            setNewNotifi(false);
        })
        socket?.on('new request friend', data => {
            console.log(data);
            getListNoti();
            setNewNotifi(false);
        });
        socket?.on('new request accept friend', data => {
            console.log(data);
            getListNoti();
            setNewNotifi(false);
        });
        
        socket?.on('new noti like', data=>{
            console.log(data);
            getListNoti();
            setNewNotifi(false);
        })

    }, []);

    return (
        <>
            <List sx={{
                width: 300,
                maxWidth: 360,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 300,
                '& ul': { padding: 0 },
            }} >
                {notification.notifications.map((e, i) => (
                    <ListItem key={i} >
                        <ListItemButton onClick={()=>handleClickNotification(e)}>
                            <ListItemAvatar>
                                <Avatar alt="avata" src={e.sender_id.image_url} />
                            </ListItemAvatar>
                            <ListItemText primary={<><b>{getType(e)}</b></>} secondary={getContent(e)} />
                        </ListItemButton>
                    </ListItem>
                ))}

            </List>
        </>
    )
}

export default Notification