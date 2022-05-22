import React from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SendIcon from '@mui/icons-material/Send';
import GroupIcon from '@mui/icons-material/Group';
import FeedIcon from '@mui/icons-material/Feed';
const SidebarAdmin = () => {
    return (
        <div className='p-2'>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <ListItemButton>
                    <ListItemIcon color="primary">
                        <GroupIcon />
                    </ListItemIcon>
                    <ListItemText primary="Quản lý người dùng" />
                </ListItemButton>
            </List>
        </div>
    )
}

export default SidebarAdmin