import React, { useRef } from 'react'
import { Button, Modal } from 'react-bootstrap'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';

const ModalImage = ({ show, onHide, image }) => {

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Image
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='container-fluid d-flex justify-content-center'>
                    <img className='mw-100' style={{maxHeight:460}} src={image} alt={image} />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <a href={image} target="_blank" className='btn shadow-none btn-secondary'> Tải xuống <DownloadOutlinedIcon /> </a>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalImage