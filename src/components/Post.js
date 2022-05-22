import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, Box, CardHeader, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { pink } from '@mui/material/colors';
import axios from 'axios';
import useAuth from '../context/AuthContext';
import {formatDateTime,formatDateTimeMessage } from '../services/Format/FormatDateAndTime'
import * as API from '../constants/ManageURL'

const Post = ({ post, socket, setPosts, posts }) => {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [like, setLike] = useState(0);

    axios.defaults.baseURL = "http://localhost:5000";
    const config = {
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        },
    };

    useEffect(() => {
        setIsLiked(post.likes.some(e => e._id == user._id));
        //post.likes.push(user._id);

    }, [post.likes])

    // useEffect(() => {
    //     if (isLiked) {
    //         createNewNotificationLike(userId, postId);
    //     }
    // }, [isLiked]);

    const handleLike = async () => {
        const json = {};
        let userId;
        let postId
        try {
            const { data } = await axios.put("/api/posts/" + post._id + "/like", json, config);
            userId = data.userId;
            postId = data._id;
            if (!isLiked) {
                createNewNotificationLike(userId, postId);
                const newLike = [...post.likes, user]
                const oldPosts = [...posts];
                const objIndex = posts.findIndex((obj => obj._id == post._id));
                oldPosts[objIndex].likes = newLike;
                setPosts(oldPosts)
            }
            else {
                const newLike = post.likes.filter(e => e._id != user._id);
                const oldPosts = [...posts];
                const objIndex = posts.findIndex((obj => obj._id == post._id));
                oldPosts[objIndex].likes = newLike;
                setPosts(oldPosts)
            }
            console.log(data);
        } catch (error) {
            console.log(error);
        }
        setLike(isLiked ? post.likes.length - 1 : post.likes.length + 1);
        setIsLiked(!isLiked);
    }

    const createNewNotificationLike = async (userId, postId) => {
        try {
            const json = {
                receiver_id: userId,
                type: 'like',
                postId: postId
            }
            const { data } = await axios.post(API.CREATE_NOTI_LIKE, json, config);
            socket.emit('like', { receiverId: userId, data });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='row mb-2'>
            <Card sx={{ maxWidth: 1 }}>
                <div className='col-md-12'>
                    <div className='row p-2 align-items-center'>
                        <div className='col-md-1'>
                            <Avatar alt="Remy Sharp" src={post.userId.image_url} />
                        </div>
                        <div className='col-md-10 mx-2'>
                            <div className='col-md-12'>{post.userId.first_name}</div>
                            <div className='col-md-12'><small>Vào {formatDateTimeMessage(post.createdAt)}</small></div>
                        </div>
                    </div>
                </div>
                <CardContent sx={{ p: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        {post.desc}
                    </Typography>
                </CardContent>
                {(post.content && post.type == 'image') &&
                    <CardMedia
                        component="img"
                        sx={{ maxHeight: 614 }}
                        image={post.content}
                        alt="green iguana"
                    />}
                {(post.content && post.type == 'video') &&
                    <CardMedia
                        component="video"
                        sx={{ maxHeight: 614 }}
                        image={post.content} controls
                    />}
                <CardActions sx={{ px: 0 }}>
                    <FavoriteIcon onClick={handleLike} sx={{ mr: 2, color: isLiked ? '#FD5D5D' : '#808080' }} />
                    <Typography variant="body2" color="text.secondary">
                        {post.likes.length} lượt thích
                    </Typography>
                    {(like > 10) && <Typography component="div">
                        <b>{post.likes[0].first_name},{post.likes[1].first_name} </b>
                        và {like} người khác
                    </Typography>}
                </CardActions>
            </Card>
        </div>
    )
}

export default Post