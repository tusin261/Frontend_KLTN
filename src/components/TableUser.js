import React, { useEffect, useRef, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Alert, Snackbar, Switch } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import useAuth from '../context/AuthContext';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ModalEditUser from './ModalEditUser';
const TableUser = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [total, setTotal] = useState(0);
    const [userByMonth, setUserByMonth] = useState(0);
    const [open, setOpen] = useState(false);
    const [userItem, setUserItem] = useState(null);
    const [successDelete,setSuccessDelete] = useState(false);
    const [errorDelete,setErrorDelete] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();

    axios.defaults.baseURL = "http://localhost:5000";
    const config = {
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        },
    };

    useEffect(() => {
        getListUser();
        getUserByMonth();
    }, [])


    const getListUser = async () => {
        try {
            const { data } = await axios.get(`/api/admin`, config);
            setUsers(data);
            setTotal(data.length);
        } catch (error) {
            console.log(error);
        }
    }
    const getUserByMonth = async () => {
        try {
            const { data } = await axios.get(`/api/admin/getUsersByWeek`, config);
            setUserByMonth(data.length);
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (u) => {
        updateStatusUser(u);
    };

    const updateStatusUser = async (u) => {
        const json = {
            isLock: true,
            isDelete: false,
            isChange: false,
            userId: u._id,
            verified: u.isVerified
        }
        try {
            const { data } = await axios.post(`/api/admin/updateUser`, json, config);
            const userUpdated = users.map(i => i._id == data._id ? { ...i, isVerified: data.isVerified } : i);
            setUsers(userUpdated);
        } catch (error) {
            console.log(error.response.data.message);

        }
    }



    const deleteUser = async (u) => {
        const json = {
            isLock: false,
            isDelete: true,
            isChange: false,
            userId: u._id,
        }
        try {
            const { data } = await axios.post(`/api/admin/updateUser`, json, config);
            const userUpdated = users.filter((i) => i._id != u._id);
            setUsers(userUpdated);
            setOpen(false);
            setSuccessDelete(true);
        } catch (error) {
            console.log(error);
            setErrorDelete(true);
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setSuccessDelete(false);
        setErrorDelete(false);
    };
    const search = async () => {
        const json = {
            first_name: nameRef.current.value,
            email: emailRef.current.value
        }
        try {
            const { data } = await axios.post(`/api/admin`, json, config);
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    }
    const handleCloseModal = () => {
        setShow(false);
        setUserItem(null);
    }

    const openDialog = () => {
        setOpen(true);
    }
    const openModalEdit = (u) => {
        setUserItem(u);
    }
    useEffect(() => {
        if (!show) {
            setShow(true);
        }
    }, [userItem]);


    return (
        <div className='p-2'>
            <h4>Xin Chào !!!</h4>
            <div className='col-md-12 my-3'>
                <div className='row'>
                    <div className='col-md-4 border-end d-flex justify-content-center flex-column'>
                        <h4 className='text-center text-primary'>Tổng số người dùng</h4>
                        <h5 className='text-center text-primary'>{total}</h5>
                    </div>
                    <div className='col-md-4 border-end border-start d-flex flex-column justify-content-center'>
                        <h4 className='text-center text-success'>Người dùng mới</h4>
                        <h5 className='text-center text-success'>{userByMonth}</h5>
                    </div>
                </div>
            </div>
            <h4>Danh Sách Người Dùng</h4>
            <div className='col-md-12 my-3'>
                <div className='row align-items-center'>
                    <div className='col-md-9'>
                        <div className='row'>
                            <div className='col-md-4'>
                                <input type='text' ref={nameRef} className='form-control' placeholder='Nhập tên cần tìm ...' />
                            </div>
                            <div className='col-md-4'>
                                <input type='text' ref={emailRef} className='form-control' placeholder='Nhập email cần tìm ...' />
                            </div>
                            <div className='col-md-3'>
                                <button className='btn btn-primary' onClick={search}>Tìm <span className='ms-2'><SearchIcon /></span></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-12 my-3'>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="table">
                        <TableHead sx={{ backgroundColor: "orange" }}>
                            <TableRow >
                                <TableCell sx={{ color: "white", fontSize: 18 }}>Họ</TableCell>
                                <TableCell sx={{ color: "white ", fontSize: 18 }} align="left">Tên</TableCell>
                                <TableCell sx={{ color: "white ", fontSize: 18 }} align="left">Giới Tính</TableCell>
                                <TableCell sx={{ color: "white ", fontSize: 18 }} align="left">Email</TableCell>
                                <TableCell sx={{ color: "white ", fontSize: 18 }} align="left">Trạng Thái</TableCell>
                                <TableCell sx={{ color: "white ", fontSize: 18 }} align="center">Xóa</TableCell>
                                <TableCell sx={{ color: "white ", fontSize: 18 }} align="center">Chỉnh Sửa</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((row) => (
                                <TableRow
                                    key={row._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.last_name}
                                    </TableCell>
                                    <TableCell align="left">{row.first_name}</TableCell>
                                    <TableCell align="left">{row.gender ? 'Nữ' : 'Nam'}</TableCell>
                                    <TableCell align="left">{row.email}</TableCell>
                                    <TableCell align="left"><Switch
                                        checked={row.isVerified}
                                        onChange={() => handleChange(row)}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    /></TableCell>
                                    <TableCell align="center">
                                        <IconButton color="error" onClick={openDialog} >
                                            <ClearIcon />
                                        </IconButton>
                                        {/* dialog-------- */}
                                        <Dialog
                                            open={open}
                                            onClose={handleClose}
                                            aria-describedby="alert-dialog-slide-description"
                                        >
                                            <DialogTitle>{"Xóa người dùng này?"}</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-slide-description">
                                                    Dữ liệu của người dùng này sẽ không thể khôi phục nếu bạn nhấn
                                                    đồng ý.
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleClose}>Hủy</Button>
                                                <Button onClick={() => deleteUser(row)}>Đồng Ý</Button>
                                            </DialogActions>
                                        </Dialog>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" onClick={() => openModalEdit(row)}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {userItem && <ModalEditUser show={show}
                                onHide={handleCloseModal}
                                userItem={userItem} users={users}
                                setUsers={setUsers}
                                setShow={setShow} />}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Snackbar open={successDelete} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Xóa người dùng thành công
                </Alert>
            </Snackbar>
            <Snackbar open={errorDelete} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Xóa người dùng không thành công
                </Alert>
            </Snackbar>
        </div>
    )
}

export default TableUser