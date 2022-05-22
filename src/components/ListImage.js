import React, { useState } from 'react'
import "../components/Chat.css";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';

const ListImage = ({ listImage }) => {
    const [imageToShow, setImageToShow] = useState("");
    const [lightboxDisplay, setLightBoxDisplay] = useState(false);

    const showImage = (image) => {
        setImageToShow(image);
        setLightBoxDisplay(true);
    }
    const hideLightBox = () => {
        setLightBoxDisplay(false);
    };

    const showNext = (e) => {
        e.stopPropagation();
        let currentIndex = listImage.map(e => e.content).indexOf(imageToShow);
        console.log(currentIndex)
        if (currentIndex >= listImage.length - 1) {
            setLightBoxDisplay(false);
        } else {
            let nextImage = listImage[currentIndex + 1];
            setImageToShow(nextImage.content);
        }
    };

    //show previous image in lightbox
    const showPrev = (e) => {
        e.stopPropagation();
        let currentIndex = listImage.map(e => e.content).indexOf(imageToShow);
        console.log(currentIndex)
        if (currentIndex <= 0) {
            setLightBoxDisplay(false);
        } else {
            let nextImage = listImage[currentIndex - 1];
            setImageToShow(nextImage.content);
        }
    };


    return (
        <div className='d-flex flex-wrap'>
            {listImage.map((e, index) => (
                <img key={index} src={e.content} width="64" height="64" className='rounded me-1'
                    onClick={() => showImage(e.content)} />
            ))}
            {lightboxDisplay && <div id="lightbox" onClick={hideLightBox}>
                <button className='btn' onClick={showPrev}> <ArrowBackIosNewIcon /> </button>
                <div className='d-flex flex-column'>
                    <img id="lightbox-img" src={imageToShow}></img>
                    <a href={imageToShow} target="_blank" type='button' className='btn shadow-none btn-secondary'> Tải xuống <DownloadOutlinedIcon /> </a>
                </div>
                <button className='btn' onClick={showNext}> <NavigateNextIcon /> </button>
            </div>}

        </div>
    )
}

export default ListImage