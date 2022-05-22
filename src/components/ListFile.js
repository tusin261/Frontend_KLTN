import React from 'react'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';


const ListFile = ({ listFile }) => {

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
        <div className='mt-1 border rounded bg-light'>
            {listFile.map((e, index) => (
                <div key={index} className='col-md-12'>
                    {/* <div className='d-flex justify-content-between flex-column'>
                        <p className='mb-0'><b>{getFileName(e.content).filename}.{getFileName(e.content).filetype}</b></p>
                        <p className='mb-0'>{getFileName(e.content).filesize}</p>
                    </div>
                    <a href={e.content} target="_blank" className='btn'><DownloadOutlinedIcon /></a> */}
                    <div className='row align-items-center'>
                        <div className='col-md-8'>
                            <p className='mb-0'><b>{getFileName(e.content).filename}.{getFileName(e.content).filetype}</b></p>
                        </div>
                        <div className='col-md-2'>
                            <p className='mb-0'>{getFileName(e.content).filesize}</p>
                        </div>
                        <div className='col-md-2'>
                            <a href={e.content} target="_blank" className='btn'><DownloadOutlinedIcon /></a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ListFile