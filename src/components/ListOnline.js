import React, { useEffect, useState } from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/Inbox';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import useAuth from '../context/AuthContext';
import axios from 'axios';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));
const StyledBadgeOff = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#F32424',
        color: '#F32424',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

const ListOnline = ({ online,setSelectedConversation }) => {
    const { user } = useAuth();
    const [friend, setFriend] = useState([]);
    axios.defaults.baseURL = "http://localhost:5000";
    const config = {
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        },
    };

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
            if (active) {
                setFriend(data.listFriend);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleClickFriend = async (friend)=>{
        const json = {
            userId:friend._id
        }
        try {
            const { data } = await axios.post('/api/chats',json, config);
            setSelectedConversation(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <List>
            {friend.map((e, i) => (
                <ListItem disablePadding key={i}>
                    <ListItemButton onClick={()=>handleClickFriend(e)}>
                        {online.find((o) => o.userId == e._id) ?
                            <StyledBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                            >
                                <Avatar alt="Avata Friend" src={e.image_url} sx={{ width: 28, height: 28 }} />
                            </StyledBadge> : <StyledBadgeOff
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                            >
                                <Avatar alt="Remy Sharp" src={e.image_url} sx={{ width: 28, height: 28 }} />
                            </StyledBadgeOff>}

                        <ListItemText primary={e.first_name} sx={{ ml: 2 }} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}

export default ListOnline