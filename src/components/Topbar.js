import React, { useState, useRef, useEffect, useContext } from 'react'
import useAuth from '../context/AuthContext';
import "../components/Chat.css";
import { BaseURL } from '../constants/path_constant';
import axios from 'axios';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { NotificationContext } from '../context/NotificationContext';
import { Badge, Divider, Menu } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Notification from './Notification';
import HomeIcon from '@mui/icons-material/Home';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockResetIcon from '@mui/icons-material/LockReset';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SaveIcon from '@mui/icons-material/Save';
const Topbar = ({ socket, setValue, value }) => {
  const { user, dispatch } = useAuth();
  const imageURL = BaseURL.PUBLIC_FOLDER_IMAGE;
  const imageInput = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState();
  const [invisible, setInvisible] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { notification, notificationDispatch } = useContext(NotificationContext);
  const [lastName, setLastName] = useState(user.last_name);
  const [firstName, setFirstName] = useState(user.first_name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [validFirstName, setValidFirstName] = useState(true);
  const [validLastName, setValidLastName] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [validConfirmPassword, setValidConfirmPassword] = useState(true);
  const [messageEmail, setMessageEmail] = useState('');
  const [validOldPassword, setValidOldPassword] = useState(true);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isErrorUpdate, setIsErrorUpdate] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  let navigate = useNavigate();

  const handleChange = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
  };

  axios.defaults.baseURL = "http://localhost:5000";

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
  }, [selectedImage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedImage) {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          "Authorization": `Bearer ${user.accessToken}`
        },
      };
      const formData = new FormData();
      formData.append("image", selectedImage);
      try {
        const rs = await axios.post("/api/users/updateAvatar", formData, config);
        dispatch({ type: 'UPDATE_IMG', payload: rs.data.image_url });
        setUpdateSuccess(true);
        const profile = {
          ...JSON.parse(localStorage.getItem('user')),
          image_url: rs.data.image_url
        };
        localStorage.setItem('user', JSON.stringify(profile));
      // localStorage.setItem("user", JSON.stringify(rs.data));
    } catch (error) {
      setUpdateSuccess(false);
      console.log(error);
    }
  } else {
    const json = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      new_password: newPassword,
      old_password: password
    }
      const config = {
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${user.accessToken}`
      },
    };
  if (validFirstName && validLastName && validEmail && validOldPassword && validPassword) {
    try {
      const rs = await axios.post("/api/users/updateInfomation", json, config);
      dispatch({ type: 'UPDATE_IN4', payload: rs.data });
      setIsErrorUpdate(false);
      setOpenChangePassword(false);
      setUpdateSuccess(true);
      const profile = {
        ...JSON.parse(localStorage.getItem('user')),
        first_name: rs.data.first_name,
        last_name: rs.data.last_name,
        email:rs.data.email
      };
      localStorage.setItem('user', JSON.stringify(profile));
    } catch (error) {
      setIsErrorUpdate(true);
      setMessageError(error.response.data.message);
      setUpdateSuccess(false);
      console.log(error.response.data.message);
    }
  } else {
    setIsError(true);
    setUpdateSuccess(false);
    return;
  }
}
  }

const handleClick = () => {
  imageInput.current.click();
}
const handleCloseToast = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }

  setIsError(false);
  setIsErrorUpdate(false);
  setUpdateSuccess(false)
};
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file && file.type.substr(0, 5) === 'image') {
    setSelectedImage(file);
  } else {
    setSelectedImage(null);
  }
}
const handleSeenNotification = (event) => {
  setAnchorEl(event.currentTarget);
}
const handleClose = () => {
  setAnchorEl(null);
};

const onChangeFirstName = (e) => {
  setFirstName(e.target.value);
}
const checkValidFirstName = () => {
  if (firstName == '') {
    setValidFirstName(false);
  } else {
    setValidFirstName(true);
  }
}

//last name
const onChangeLastName = (e) => {
  setLastName(e.target.value);
}
const checkValidLastName = () => {
  if (lastName == '') {
    setValidLastName(false);
  } else {
    setValidLastName(true);
  }
}

//email

const onChangeEmail = (e) => {
  setEmail(e.target.value);
}
const checkValidEmail = () => {
  const regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (email == '' || !regexEmail.test(email)) {
    setValidEmail(false);
    setMessageEmail('Vui lòng nhập đúng định dạng email');
  } else {
    setValidEmail(true);
  }
}

const onChangePassword = (e) => {
  setPassword(e.target.value);
}

const checkValidOldPassword = () => {
  if (password == '') {
    setValidOldPassword(false);
  } else {
    setValidOldPassword(true);
  }
}

const onChangeNewPassword = (e) => {
  setNewPassword(e.target.value);
}
const checkValidPassword = () => {
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  if (newPassword == '' || !regexPassword.test(newPassword)) {
    setValidPassword(false);
  } else {
    setValidPassword(true);
  }
}

const onChangeConfirmPassword = (e) => {
  setConfirmpassword(e.target.value);
}
const checkValidConfirmPassword = () => {
  if (confirmpassword != newPassword || confirmpassword == '') {
    setValidConfirmPassword(false);
  } else {
    setValidConfirmPassword(true);
  }
}

const openPassword = () => {
  setOpenChangePassword(!openChangePassword);
}

const logout = () => {
  dispatch({ type: 'LOGOUT' });
  localStorage.removeItem("user");
  navigate('/');
}

return (
  <div className='col-md-12 py-1'>
    <div className='row align-items-center'>
      <div className='col-md-2'>
        <h4 className='ms-3'>zCHAT</h4>
      </div>
      <div className='col-md-8'>
        <div className='row'>
          <div className='d-flex justify-content-center'>
            <Tabs value={value} onChange={handleChange} aria-label="icon tabs example">
              <Tab icon={<HomeIcon />} aria-label="home" />
              <Tab icon={<MailOutlineIcon />} aria-label="message" />
            </Tabs>
          </div>
        </div>
      </div>
      <div className='col-md-2'>
        <div className='row justify-content-between'>
          <div className='col-md-7 text-end'>
            <span role="button">
              <Badge color="error" variant="dot" invisible={invisible}>
                <NotificationsNoneOutlinedIcon sx={{ fontSize: 32 }} onClick={handleSeenNotification} />
              </Badge></span>
            <Menu
              id="notification"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Notification socket={socket} setValue={setValue} value={value} />
            </Menu>
          </div>
          <div className='col-md-5'>
            <Snackbar open={updateSuccess} autoHideDuration={6000} onClose={handleCloseToast}>
              <Alert onClose={handleCloseToast} severity="success" sx={{ width: '100%' }}>
                Cập nhật thông tin thành công
              </Alert>
            </Snackbar>
            <Snackbar open={isError} autoHideDuration={6000} onClose={handleCloseToast}>
              <Alert onClose={handleCloseToast} severity="error" sx={{ width: '100%' }}>
                Vui lòng điền đầy đủ thông tin cần thay đổi
              </Alert>
            </Snackbar>
            <Snackbar open={isErrorUpdate} autoHideDuration={6000} onClose={handleCloseToast}>
              <Alert onClose={handleCloseToast} severity="error" sx={{ width: '100%' }}>
                {messageError}
              </Alert>
            </Snackbar>
            <div className='row'>
              <div className='col-md-5'>
              </div>
              <div className='col-md-1'>
                <Avatar id="imageDropdown" data-bs-toggle="dropdown" sx={{ width: 32, height: 32 }} src={user.image_url} />
                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#exampleModal"><AccountCircleIcon /> Thông tin cá nhân</a>
                  <a className="dropdown-item" href="/" onClick={logout}><LogoutIcon /> Đăng xuất</a>
                </div>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body d-flex flex-column align-items-center">
                        <img src={preview ? preview : user.image_url}
                          width="64" height="64"
                          className='mb-2 rounded-circle' alt="100x100" />
                        <input type="file" accept='image/*' ref={imageInput} style={{ display: 'none' }} onChange={handleImageChange} />
                        <button className='btn btn-primary' onClick={handleClick}>Đổi ảnh đại diện <CameraAltIcon/></button>
                        <div className='container'>
                          <div className='row'>
                            <div className='col-md-12'>
                              <hr />
                              <h4>Thông tin cá nhân</h4>

                              <div className="mb-3">
                                <label className="form-label">Họ</label>
                                <input type="text" className="form-control" value={lastName}
                                  onChange={onChangeLastName}
                                  onBlur={checkValidLastName} />
                                <span hidden={validLastName} className="my-2 text-danger text-start">Họ không được để trống</span>
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Tên</label>
                                <input type="text" className="form-control" value={firstName}
                                  onChange={onChangeFirstName}
                                  onBlur={checkValidFirstName} />
                                <span hidden={validFirstName} className="my-2 text-danger text-start">Tên không được để trống</span>
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="text" className="form-control" value={email}
                                  onChange={onChangeEmail}
                                  onBlur={checkValidEmail} />
                                <span hidden={validEmail} className="my-2 text-danger text-start">{messageEmail}</span>
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Giới tính</label>
                                <input type="text" className="form-control" value={user.gender ? 'Nữ' : 'Nam'} disabled={true} />
                              </div>
                              <Divider />
                              <button className='btn btn-warning my-2' onClick={openPassword}>Đổi mật khẩu <LockResetIcon /></button>
                              {openChangePassword && <><div className="mb-3">
                                <label className="form-label">Mật khẩu hiện tại</label>
                                <input type="password" className="form-control" placeholder='Nhập mật khẩu hiện tại'
                                  onChange={onChangePassword} onBlur={checkValidOldPassword} />
                                <span hidden={validOldPassword} className="my-2 text-danger text-start">Mật khẩu hiện tại không được để trống</span>
                              </div>
                                <div className="mb-1">
                                  <label className="form-label">Mật khẩu mới</label>
                                  <input type="password" className="form-control" placeholder='Nhập mật khẩu mới'
                                    onChange={onChangeNewPassword} onBlur={checkValidPassword} />
                                  <span hidden={validPassword} className="my-2 text-danger text-start">Mật khẩu ít nhất 8 kí tự, gồm số chữ và kí tự viết hoa</span>
                                </div>
                                <div className="mb-3">
                                  <input type="password" className="form-control" placeholder='Nhập lại mật khẩu mới'
                                    onChange={onChangeConfirmPassword} onBlur={checkValidConfirmPassword} />
                                  <span hidden={validConfirmPassword} className="my-2 text-danger text-start">Không trùng với mật khẩu</span>
                                </div> </>}
                              <Divider />
                              <button type="submit" className="btn btn-primary mt-2" data-bs-dismiss="modal" onClick={handleSubmit}>Lưu thay đổi <SaveIcon /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
}

export default Topbar