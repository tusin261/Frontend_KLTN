import React, { useState } from 'react'
import "../components/Chat.css";
import { Button, Modal } from 'react-bootstrap';
import ModalImage from './ModalImage';
import { Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import useAuth from '../context/AuthContext'
import { formatDate,formatDateTime,getTime,formatDateTimeMessage } from '../services/Format/FormatDateAndTime'

const Message = ({ message, own, isLastMessage }) => {
    const [show, setShow] = useState(false);
    const [clickedImage, setClickedImage] = useState(null);
    const { user } = useAuth();

    const showModalImage = (value) => {
        setClickedImage(value);
        setShow(true);
    }

    function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    function getFileName(file) {
        const fullFile = file.split('.net/')[1];
        const fileName = fullFile.split('-filename-')[0];
        const fileType = fullFile.split('.')[1];
        const fileSize = fullFile.split('-size-')[1];
        const size = fileSize.split('.')[0];

        const infoFile = {
            filename: fileName,
            filetype: fileType,
            filesize: bytesToSize(size)
        }
        return infoFile;
    }
    return (
        <>
            {message.type == 'notification' ? <div className='d-flex justify-content-center'>
                <div className='w-50 hr-sect'>
                    {/* <p className='text-center'></p> */}
                    {message.content}
                </div>
            </div> :
                <div className={own ? "d-flex justify-content-end" : 'd-flex'}>
                    <div className={own ? 'col-lg-6 d-flex flex-row-reverse align-items-start' : 'col-lg-6 d-flex align-items-end'}>
                        {!own && <div className={own ? 'pt-2' : undefined}>
                            <Avatar sx={{ width: 32, height: 32 }} alt="avata" src={message.sender_id.image_url} />
                        </div>}
                        {own ?
                            <Tooltip title={formatDateTimeMessage(message.createdAt)} placement="left">
                                <div className='ms-2 p-2'>
                                    {/* <h6 className='mb-0 p-1 text-end small'>{formatDate(message.createdAt)}</h6> */}
                                    {message.type == 'text' && <p className='mb-0 bg-primary p-1 rounded text-white text-center'>{message.content}</p>}
                                    {message.type == 'image' && <img width="150" height="150" src={message.content}
                                        className='mb-0 p-1 img-thumbnail'

                                        onClick={() => showModalImage(message.content)} />}
                                    {message.type == 'file' && <div className='border rounded box-file d-flex flex-column'>
                                        <h5 className='text-break'>{getFileName(message.content).filename}.{getFileName(message.content).filetype}</h5>
                                        <p>{getFileName(message.content).filesize}</p>
                                        <hr />
                                        <a href={message.content} target="_blank" className='btn btn-primary-outline shadow-none '><b>Download</b></a>
                                    </div>}
                                    {message.type == 'video' && <video width="250" height="150" controls>
                                        <source src={message.content} type="video/mp4" />
                                    </video>}
                                    {(isLastMessage && message.readBy.length > 0) && <h6 className='mb-0 p-1 text-end small'>
                                        <AvatarGroup max={4}>
                                            {message.readBy.map((e, i) => (
                                                <Avatar key={i}
                                                    alt="Remy Sharp"
                                                    src="/static/images/avatar/1.jpg"
                                                    sx={{ width: 16, height: 16 }}
                                                />
                                            ))}
                                        </AvatarGroup>
                                    </h6>}
                                    {/* {lastMessage && <h6 className='mb-0 p-1 text-end small'>Da xem</h6>} */}
                                </div></Tooltip> :
                            <Tooltip title={formatDateTimeMessage(message.createdAt)} placement="right">
                                <div className='ms-2'>
                                    <h6 className='mb-0 p-1 text-start small'>{message.sender_id.first_name}</h6>
                                    {message.type == 'text' && <p className='mb-0 bg-light p-1 rounded text-dark text-center'>{message.content}</p>}
                                    {message.type == 'image' && <img width="150" height="150"
                                        src={message.content}
                                        className='mb-0 p-1 img-thumbnail'

                                        onClick={() => showModalImage(message.content)} />}
                                    {message.type == 'file' && <div className='border rounded box-file d-flex flex-column'>
                                        <h5 className='text-break'>{getFileName(message.content).filename}.{getFileName(message.content).filetype}</h5>
                                        <p>{getFileName(message.content).filesize}</p>
                                        <hr />
                                        <a href={message.content} target="_blank" className='btn btn-primary-outline shadow-none'><b>Download</b></a>
                                    </div>}
                                    {message.type == 'video' && <video width="250" height="150" controls>
                                        <source src={message.content} type="video/mp4" />
                                    </video>}
                                    {/* <h6 className='mb-0 p-1 text-start small'>Da xem</h6> */}
                                    {/* {lastMessage && <h6 className='mb-0 p-1 text-start small'>Da xem</h6>} */}
                                </div></Tooltip>}
                        {show && <ModalImage show={show} onHide={() => setShow(false)} image={clickedImage} />}
                    </div>
                </div>}
        </>
    )
}

export default Message