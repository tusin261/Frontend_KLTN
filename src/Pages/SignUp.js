import { useRef, useState } from "react";
import { Link } from 'react-router-dom'
import { Container, Button, Row, Col, Form } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { Alert, CircularProgress, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Snackbar, TextField } from "@mui/material";
import * as API from '../constants/ManageURL'

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [password, setPassword] = useState('');
  const [validFirstName, setValidFirstName] = useState(true);
  const [validLastName, setValidLastName] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [validConfirmPassword, setValidConfirmPassword] = useState(true);
  const [messageEmail, setMessageEmail] = useState('');
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gender,setGender] = useState('nam');
  let navigate = useNavigate();
  //axios.defaults.baseURL = "http://localhost:5000";
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  const handleClick = async (e) => {
    e.preventDefault();
    setIsError(false);
    setMessageEmail('');
    try {
      const { data } = await axios.post(
        API.SIGNUP,
        { email, password, first_name: firstName, last_name: lastName,gender },
        config
      );
      setOpen(true);
    } catch (error) {
      setIsError(true);
      setMessageEmail(error.response.data.message);
    }

  }

  const handleChangeGender = (e)=>{
    setGender(e.target.value);
  }
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setIsError(false);
  };

  //first name
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

  //password
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  }
  const checkValidPassword = () => {
    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    if (password == '' || !regexPassword.test(password)) {
      setValidPassword(false);
    } else {
      setValidPassword(true);
    }
  }

  //confirm password
  const onChangeConfirmPassword = (e) => {
    setConfirmpassword(e.target.value);
  }
  const checkValidConfirmPassword = () => {
    if (confirmpassword != password) {
      setValidConfirmPassword(false);
    } else {
      setValidConfirmPassword(true);
    }
  }


  return (
    <section className="striped vh-100">
      <div className="container">
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={1000} onClose={handleClose}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Tạo tài khoản thành công, kiểm tra email để xác thực tài khoản!
          </Alert>
        </Snackbar>
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={isError} autoHideDuration={1000} onClose={handleClose}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {messageEmail}
          </Alert>
        </Snackbar>
        <div className="row justify-content-center">
          <div className="col-md-6 mt-3">
            <div className="bg-form-signup">
              <div className="px-5 pt-2">
                <h3 className="mb-2 title-login">Đăng ký</h3>
                <p className='title-login mb-1'>Điền thông tin cá nhân để đăng ký</p>
                <p className="mb-1"><b>Đã có tài khoản? </b><Link to="/" style={{ textDecoration: 'none', color: "#92B4EC" }}>Đăng nhập</Link></p>
              </div>
              <div className="px-5 pt-1">
                {/* <span hidden={errorLogin} className="text-danger mb-2">{errorMessage}</span> */}
                <form className="" onSubmit={handleClick}>
                  <TextField
                    id="outlined-ln-input"
                    label="Họ *"
                    type="text" value={lastName}
                    onChange={onChangeLastName}
                    onBlur={checkValidLastName} fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    size="small"
                  />
                  <div className="mb-1">
                    <span hidden={validLastName} className="text-danger">* Họ không được để trống</span>
                  </div>

                  <TextField
                    id="outlined-fn-input"
                    label="Tên *"
                    type="text" value={firstName}
                    onChange={onChangeFirstName}
                    onBlur={checkValidFirstName} fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    size="small" sx={{ mt: 1 }}
                  />
                  <div className="mb-1">
                    <span hidden={validFirstName} className="text-danger">* Tên không được để trống</span>
                  </div>
                  <TextField
                    id="outlined-email-input"
                    label="Email *"
                    type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} fullWidth
                    onBlur={checkValidEmail} InputLabelProps={{
                      shrink: true,
                    }}
                    size="small" sx={{ mt: 1 }}
                  />
                  <div className="mb-1">
                    <span hidden={validEmail} className="text-danger">* Vui lòng điền email đúng định dạng</span>
                  </div>
                  <TextField
                    id="outlined-password-input"
                    label="Mật khẩu *"
                    type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)} fullWidth
                    onBlur={checkValidPassword} InputLabelProps={{
                      shrink: true,
                    }}
                    size="small" sx={{ mt: 1 }}

                  />
                  <div className="mb-1">
                    <span hidden={validPassword} className="text-danger">* Mật khẩu ít nhất 8 kí tự, gồm số chữ và kí tự viết hoa</span>
                  </div>
                  <TextField
                    id="outlined-cp-input"
                    label="Nhập lại mật khẩu *"
                    type="password" value={confirmpassword}
                    onChange={onChangeConfirmPassword}
                    onBlur={checkValidConfirmPassword} fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    size="small" sx={{ mt: 1 }}

                  />
                  <div className="mb-1">
                    <span hidden={validConfirmPassword} className="text-danger">Không trùng với mật khẩu</span>
                  </div>
                  <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">Giới tính</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group" value={gender}
                      onChange={handleChangeGender}
                    >
                      <FormControlLabel value="nam" control={<Radio />} label="Nam" />
                      <FormControlLabel value="nu" control={<Radio />} label="Nữ" />
                      
                    </RadioGroup>
                  </FormControl>
                  <button
                    type="submit" className="w-100 btn-signUp text-white mb-2"
                  >{isLoading ? <CircularProgress /> : 'Đăng ký'}</button>
                </form>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    // <div className="container py-5 h-100">
    //   <div className="row d-flex justify-content-center align-items-center h-100">
    //     <div className="col-12 col-md-8 col-lg-6 col-xl-5">
    //       <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
    //         <div className="card-body p-5 text-center">
    //           <div className="mb-md-5 mt-md-4 pb-5">
    //             <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={2000} onClose={handleClose}>
    //               <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
    //                 Tạo tài khoản thành công, kiểm tra email để xác thực tài khoản!
    //               </Alert>
    //             </Snackbar>
    //             <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={isError} autoHideDuration={2000} onClose={handleClose}>
    //               <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
    //                 Tạo tài khoản không thành công, vui lòng thử lại!
    //               </Alert>
    //             </Snackbar>
    //             <h2 className="fw-bold mb-2 text-uppercase">ĐĂNG KÝ</h2>
    //             <p className="text-white-50 mb-5">Điền thông tin tài khoản!</p>
    //             <form onSubmit={handleClick}>
    //               <div className="form-outline form-white">
    //                 <input
    //                   type="text"
    //                   placeholder='Họ'
    //                   className="form-control form-control-lg"
    //                   value={lastName} onChange={onChangeLastName} onBlur={checkValidLastName} />
    //                 <span hidden={validLastName} className="my-4 text-danger text-start">Họ không được để trống</span>
    //               </div>
    //               <div className="form-outline form-white mt-3">
    //                 <input
    //                   type="text"
    //                   placeholder='Tên'
    //                   className="form-control form-control-lg"
    //                   value={firstName} onChange={onChangeFirstName} onBlur={checkValidFirstName} />
    //                 <span hidden={validFirstName} className="my-4 text-danger text-start">Tên không được để trống</span>
    //               </div>
    //               <div className="form-outline form-white mt-3">
    //                 <input
    //                   type="email"
    //                   placeholder='Email'
    //                   className="form-control form-control-lg"
    //                   value={email} onChange={onChangeEmail} onBlur={checkValidEmail} />
    //                 <span hidden={validEmail} className="my-4 text-danger text-start">{messageEmail}</span>
    //               </div>
    //               <div className="form-outline form-white mt-3">
    //                 <input
    //                   type="password"
    //                   placeholder='Password'
    //                   className="form-control form-control-lg"
    //                   value={password} onChange={onChangePassword} onBlur={checkValidPassword} />
    //                 <span hidden={validPassword} className="my-4 text-danger text-start">Mật khẩu ít nhất 8 kí tự, gồm số chữ và kí tự viết hoa</span>
    //               </div>
    //               <div className="form-outline form-white mt-3">
    //                 <input
    //                   type="password"
    //                   placeholder='Nhập lại password'
    //                   className="form-control form-control-lg"
    //                   value={confirmpassword} onChange={onChangeConfirmPassword} onBlur={checkValidConfirmPassword} />
    //                   <span hidden={validConfirmPassword} className="my-4 text-danger text-start">Không trùng với mật khẩu</span>
    //               </div>
    //               <input className="btn btn-outline-light btn-lg px-5 mt-3" type='submit' value='Đăng ký' />
    //             </form>
    //           </div>
    //           <div>
    //             <p className="mb-0">Đã có tài khoản? <Link to="/" className="text-white-50 fw-bold">Đăng nhập</Link></p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );

}

export default SignUp;