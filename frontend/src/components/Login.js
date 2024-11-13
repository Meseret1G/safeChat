import { Backdrop, Button, CircularProgress, TextField } from '@mui/material';
import React, { useState } from 'react';
import './Style.css';
import logo from "../icons/safe.png"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState("");
  const [signinStatus, setSigninStatus] = useState("");
  
  const navigate = useNavigate();
  
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const loginHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        "http://localhost:8080/user/login",
        { name: data.name, password: data.password },
        config
      );
      console.log("login: ", response);

      setLoginStatus({ msg: "Login successful", key: Math.random() });
      localStorage.setItem("userData", JSON.stringify(response.data));
      navigate("/app/welcome");
    } catch (error) {
      setLoginStatus({
        msg: "Invalid username or password",
        key: Math.random(),
      });
    }
    setLoading(false);
  };

  const signinHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        "http://localhost:8080/user/register",
        data,
        config
      );
      console.log("sign: ", response);
      setSigninStatus({ msg: "Signup successful", key: Math.random() });
      localStorage.setItem("userData", JSON.stringify(response.data));
      navigate("/app/welcome");
    } catch (error) {
      if (error.response && error.response.status === 405) {
        setSigninStatus({
          msg: "User with this email already exists",
          key: Math.random(),
        });
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#afff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      
      <div className="login-container">
        <div className="image-container">
            <img src={logo} alt = "LOGO" className='welcome-logo'/>
        </div>
        <div className="login-box">
          <p>Login</p>
          <TextField
            onChange={changeHandler}
            id='standard-basic'
            name="name"
            label="Username"
            variant="outlined"
            color="secondary"
            value={data.name}
          />
          <TextField
          onChange={changeHandler}
          id="outlined-password-input"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            variant="outlined"
            color="secondary"
            value={data.password}
          />
          <Button 
          variant="outlined" 
          color="secondary"
          onClick={loginHandler}
          isLoading>
            LOGIN
          </Button>
          
          <small>
            Not signed up yet?{" "}
            <span 
            className='hyper'
            onClick={(()=>{
              setLoading(false);
            })}>
              <Button onClick={() => navigate('/sign')}>Sign up</Button>
            </span>
          </small>
          {loginStatus ? (
           <Toaster key={loginStatus.key} message={loginStatus.msg} />
          ) : null}

        </div>

        {!showLogin && (
          <div className='login-box'>
            <p>Sign up</p>
            <TextField
            onChange={changeHandler}
            id='standard-basic'
            name="name"
            label="Username"
            variant="outlined"
            color="secondary"
            helperText=""

            />

            <TextField
            onChange={changeHandler}
            id='standard-basic'
            name="name"
            label="Email"
            variant="outlined"
            color="secondary"
            helperText=""

            />

            <TextField
            onChange={changeHandler}
            id='outlined-password-input'
            name="password"
            label="Password"
            autoComplete='current-password'
            color="secondary"
            />

          <Button 
          variant="outlined" 
          color="secondary"
          onClick={signupHandler}
          isLoading>
            Sign Up
          </Button>

          <small>
            Already have an account? 
            <span 
            className='hyper'
            onClick={()=>{
              setLogin(true);
            }}>Log in</span>
          </small>

          {signinStatus ? (
           <Toaster key={signinStatus.key} message={signinStatus.msg} />
          ) : null}

          </div>
        )}
      </div>
    </>
  );
}

export default Login;