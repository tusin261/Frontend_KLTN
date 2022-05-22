import React, { useState, useEffect, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import CircularProgress from '@mui/material/CircularProgress';
import useAuth from '../context/AuthContext';
import Peer from 'simple-peer'

const ModalVideoChat = ({ showVideoCall, onHide, socket,isCaller,receiverCall,
    signalOfCaller,caller,selectedConversation }) => {
    const { user } = useAuth();
    const currentStreamRef = useRef();
    const remoteStreamRef = useRef();
    const [stream,setStream] = useState();
    const [txt,setTxt] = useState('');
    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({video:true}).then(stream=>{
            setStream(stream);
            if(currentStreamRef.current){
                currentStreamRef.current.srcObject = stream;
            }
        },err=> console.log(err));
        if(isCaller){
            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream: stream,
              });
            
            peer.on('signal',data=>{
                socket.emit("callUser", { userToCall: receiverCall, signalData: data, from: user })
            })
            
            peer.on("stream",stream=>{
                if(remoteStreamRef.current){
                    remoteStreamRef.current.srcObject = stream;
                }
                setTxt('abc')
            })
            socket.on('callAccepted', remoteSignal=>{
                peer.signal(remoteSignal);
            })
        }
        else{
            const peer = new Peer({
                initiator: false,
                trickle: false,
                stream: stream,
            });
            peer.on('signal',data=>{
                socket.emit("acceptCall", {signal:data,to:caller})
            });
            
            peer.on('stream',stream=>{
                if(remoteStreamRef.current){
                    remoteStreamRef.current.srcObject = stream;
                }
                                setTxt('eee')
            })
            peer.signal(signalOfCaller);
        }
    },[])



    return (
        <Modal show={showVideoCall} onHide={onHide} size='lg' centered>
            <Modal.Body>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <video width='300' height='300' ref={currentStreamRef} muted autoPlay playsInline></video>
                                </div>
                                <div className='col-md-6'>
                                    <video width='300' height='300' autoPlay playsInline></video>
                                    {txt}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalVideoChat