import React, { useEffect, useRef, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import { Alert, Box, IconButton, Input, Snackbar, TextField, Tooltip } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import MovieIcon from '@mui/icons-material/Movie';
import axios from 'axios';
import useAuth from '../context/AuthContext';
const Status = ({ updateList, setPosts }) => {
    const { user } = useAuth();
    const imageRef = useRef();
    const videoRef = useRef();
    const statusRef = useRef();
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isError, setIsError] = useState(false);
    const [open, setOpen] = useState(false);
    axios.defaults.baseURL = "http://localhost:5000";
    const config = {
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        },
    };
    const handleImageChange = (e) => {
        const image = e.target.files[0];
        if (image && image.type.substr(0, 5) === 'image') {
            setSelectedImage(image);
            setSelectedVideo(null);
        } else {
            setSelectedImage(null);
        }
    }

    const handleVideoChange = (e) => {
        const video = e.target.files[0];
        if (video && video.type.substr(0, 5) === 'video') {
            setSelectedVideo(video);
            setSelectedImage(null);
        } else {
            setSelectedVideo(null);
        }
    }


    const handleSubmit = async () => {
        if (statusRef.current.value == '') {
            return;
        }

        if (!selectedImage && !selectedVideo) {
            //post text
            const json = {
                desc: statusRef.current.value
            }
            const { data } = await axios.post("/api/posts", json, config);
            //get all post
            //updateList();
            setDefaultInput();
            setPosts((preState) => [data, ...preState]);
        } else {
            //post with media
            try {
                if (selectedImage) {
                    const formData = new FormData();
                    formData.append("image", selectedImage);
                    formData.append("desc", statusRef.current.value);
                    const { data } = await axios.post("/api/posts/image", formData, config);
                    //get all post
                    setDefaultInput();
                    setIsError(false);
                    setPosts((preState) => [data, ...preState]);
                } else {
                    const formData = new FormData();
                    formData.append("video", selectedVideo);
                    formData.append("desc", statusRef.current.value);
                    const { data } = await axios.post("/api/posts/video", formData, config);
                    //get all post
                    setDefaultInput();
                    setIsError(false);
                    setPosts((preState) => [data, ...preState]);
                }
            } catch (error) {
                setIsError(true);
            }

        }
    }

    const setDefaultInput = () => {
        setSelectedImage(null);
        setSelectedVideo(null);
        setPreview(null);
        setIsError(false);
        statusRef.current.value = '';
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setIsError(false);
    };
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
        return () => {
            URL.revokeObjectURL(selectedImage);
            setPreview(null);
        }
    }, [selectedImage]);

    useEffect(() => {
        let url;
        if (selectedVideo) {
            url = URL.createObjectURL(selectedVideo);
            setPreview(url);
        } else {
            setPreview(null);
        }
        return () => {
            URL.revokeObjectURL(selectedVideo);
            setPreview(null);
        }

    }, [selectedVideo]);

    return (
        <div className='row mb-2'>
            <div className='col-md-12 border rounded'>
                <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={isError} autoHideDuration={1000} onClose={handleClose}>
                    <Alert severity="error" sx={{ width: '100%' }}>
                        "Kích thước file không hợp lệ"
                    </Alert>
                </Snackbar>
                <div className='row p-2 align-items-center'>
                    <div className='col-md-1'>
                        <Avatar alt="Remy Sharp" src={user.image_url} />
                    </div>
                    <div className='col-md-11'>
                        <TextField
                            placeholder='Bạn đang nghĩ gì?' fullWidth multiline
                            maxRows={3} variant='standard' size='small' inputRef={statusRef}
                        />
                    </div>
                </div>
                <div className='row p-2'>
                    {selectedImage && <div className='col-md-12 d-flex justify-content-center'>
                        <Box
                            component="img"
                            sx={{
                                maxheight: 300,
                                maxWidth: '50%',
                            }}
                            alt="Image preview"
                            src={preview}
                        />
                    </div>
                    }
                    {selectedVideo && <div className='col-md-12 d-flex justify-content-center'>
                        <video
                            className="img-fluid" controls
                        >
                            <source src={preview} type={selectedVideo.type} />
                        </video>
                    </div>}


                </div>
                <div className='row justify-content-end p-2'>
                    <div className='col-md-9'>
                        <label htmlFor='input-image'>
                            <input type="file" accept='image/*' id='input-image'
                                ref={imageRef}
                                style={{ display: 'none' }} onChange={handleImageChange} />
                            <ImageIcon color="primary" sx={{ fontSize: 24, mr: 2 }} />
                        </label>
                        {/* chua check file type */}
                        <label htmlFor='input-video'>
                            <input type="file" id='input-video'
                                ref={videoRef}
                                style={{ display: 'none' }} onChange={handleVideoChange} />
                            <MovieIcon color="primary" sx={{ fontSize: 24 }} />
                        </label>
                    </div>
                    <div className='col-md-2'>
                        <button className='btn btn-primary' onClick={handleSubmit}>Đăng</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Status