import { useContext, useState } from "react";
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { loginCall } from '../ApiCall';
import { useAuth } from "../context/hooks";
import CircularProgress from '@mui/material/CircularProgress';
import * as API from '../constants/ManageURL'
import { Alert, Snackbar, TextField } from "@mui/material";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, isLoading, isError, dispatch } = useAuth();
  const [disable, setDisable] = useState(false);
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [errorLogin, setErrorLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);

  let navigate = useNavigate();
  axios.defaults.baseURL = "http://localhost:5000";
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  const handleClick = async (e) => {
    e.preventDefault();
    if (email == '' || password == '') {
      setOpen(true);
      return;
    } else {
      login();
    }
    //await loginCall({ email, password }, dispatch);
    //navigate('/handle-redirect');
  }
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const login = async () => {
    setOpen(false);
    const json = {
      email, password
    }
    dispatch({ type: 'LOGIN_START' });
    try {
      const { data } = await axios.post("/api/auth/login", json, config);
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      localStorage.setItem("user", JSON.stringify(data));
      navigate('/handle-redirect');
    }
    catch (error) {
      dispatch({ type: 'LOGIN_FAIL', payload: true });
      setErrorLogin(false);
      setErrorMessage(error.response.data.message);
      setOpen(true);
    }
  }

  const checkValidEmail = () => {
    if (email == '') {
      setValidEmail(false);
    } else {
      setValidEmail(true);
    }
    setErrorLogin(true);
    setErrorMessage('');
  }

  const checkValidPassword = () => {
    if (password == '') {
      setValidPassword(false);
    } else {
      setValidPassword(true);
    }
    setErrorLogin(true);
    setErrorMessage('');
  }

  return (
    <section className="striped vh-100">
      <div className="container">
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={2000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            Đăng nhập không thành công
          </Alert>
        </Snackbar>
        <div className="row justify-content-center">
          <div className="col-md-6 mt-5">
            <div className="bg-form">
              <div className="px-5 pt-4">
                <h3 className="mb-2 title-login">Đăng nhập</h3>
                <p className='title-login'>Đăng nhập bằng tài khoản email và mật khẩu</p>
              </div>
              <div className="px-5 pt-1">
                <span hidden={errorLogin} className="text-danger mb-2">{errorMessage}</span>
                <form className="" onSubmit={handleClick}>
                  <TextField
                    id="outlined-email-input"
                    label="Email"
                    type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} fullWidth
                    onBlur={checkValidEmail}
                  />
                  <div className="mt-2 mb-2">
                    <span hidden={validEmail} className="text-danger">* Vui lòng điền email</span>
                  </div>
                  <TextField
                    id="outlined-password-input"
                    label="Password"
                    type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)} fullWidth
                    onBlur={checkValidPassword}

                  />
                  <div className="mt-2 mb-2">
                    <span hidden={validPassword} className="text-danger">* Vui lòng điền mật khẩu</span>
                  </div>

                  <button
                    type="submit" className="w-100 btn-login text-white"
                    disabled={disable}>{isLoading ? <CircularProgress /> : 'Đăng nhập'}</button>
                  {/* <input type="email" placeholder='Email' className="form-control form-control-lg" /> */}
                </form>
                <hr></hr>
                <div className="mt-2 mb-3 text-center">
                  <p><b>Bạn chưa có tài khoản? </b><Link to="/register" style={{ textDecoration: 'none', color: "#92B4EC" }}>Đăng ký</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}



export default Login;
