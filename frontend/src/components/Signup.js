import { Button, TextField } from '@mui/material';
import React from 'react';
import './Style.css'
import { useNavigate } from 'react-router-dom';
const Signup = () => {
    const navigate=useNavigate();
  return (
    <div className='login-container'>
      <div className='image-container'>
      </div>
      <div className='login-box'>
        <p >Sign Up</p>
        
        <TextField id="outlined-basic" label="Username" variant="outlined" />
        <TextField id="outlined-basic" label="Email" variant="outlined" />
        <TextField id="outlined-password-input" type="password" label="Password:" autoComplete='current password' />
        <Button variant="outlined">SIGN UP</Button>
        <small>Not Sign up yet? <span><Button onClick={()=>{navigate('/')}}>Login</Button></span></small>
      </div>
    </div>
  );
}

export default Signup;