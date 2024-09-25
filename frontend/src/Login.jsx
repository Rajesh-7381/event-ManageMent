
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import  './login.css'
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors,setErrors]=useState({})
  const navigate = useNavigate();

  useEffect(()=>{
    document.title="Login"
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(email, password);
    setErrors(newErrors);
  // alert(checked)
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post('http://localhost:8081/api/login', { email, password },{headers:{ Authorization: `Bearer ${localStorage.getItem("token")}` }});
        // console.log(response.data);
        localStorage.setItem('token', response.data.token);
          localStorage.setItem('id', response.data.id);
          sessionStorage.setItem('email',response.data.email)
          if(response.status === 401){
            
          }
        if ( response.data.status === 1) {

          switch(response.data.role){
            case 1:
              sessionStorage.setItem('role',response.data.role)
              setTimeout(() => {
                navigate("/dashboard")
              }, 500);
              break
            case 0:
              sessionStorage.setItem('role',response.data.role)
              setTimeout(() => {
                navigate("/dashboard2")
              }, 500);
              break
            default:
              navigate("/");  
          }
          
        } else {
          alert('Invalid credentials. Please try again.');
        }
      } catch (error) {
        console.error('Login error:', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: '<a href="#">Why do I have this issue?</a>'
        });
      }
    }
  };
  

  const validateForm=(email,password)=>{
    const errors={}
    if(!email.trim()){
      errors.email="email address required!"
    }else if(!/\S+@\S+\.\S+/.test(email)){
      errors.email="invlid email address!"
    }

    if(!password.trim()){
      errors.password="Password required!"
    }
    return errors;
  }

  const handleChange = (e) => {
    const { name, value,checked,type } = e.target;
    console.log(e.target)
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };
  // const handlegoogle=async()=>{
  //   const response=await axios.get("http://localhost:8081/auth/google/callback");
  //   console.log(response.data)
  // }

    const SocialHandler=async(social)=>{
      window.location.href=`http://localhost:8081/auth/${social}`
    }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email" style={{display:"flex"}}><b>Email:</b></label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              
            />
            {errors.email && (<span style={{color:"red"}}>{errors.email}</span>)}
          </div>
          <div className="input-group">
            <label htmlFor="password" style={{display:"flex"}}><b>Password:</b></label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              
            />
            {errors.password && (<span style={{color:"red"}}>{errors.password}</span>)}
          </div>
          <button type="submit" className="submit-btn">Log In</button>
        </form>
        <p className="text-muted">Don't have an account? <Link to="/register" className="link">Register here</Link></p>
        <div className="divider">OR</div>
        <div className="social-login">
            <Link onClick={()=>SocialHandler("google")}  className="social-btn google-btn">
              <img src="https://play-lh.googleusercontent.com/1-hPxafOxdYpYZEOKzNIkSP43HXCNftVJVttoo4ucl7rsMASXW3Xr6GlXURCubE1tA=w3840-h2160-rw" alt="Google" />
              Sign in with Google
            </Link>
            OR
            
            <Link onClick={()=>{SocialHandler('facebook')}} className="social-btn google-btn">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Facebook_icon_2013.svg/120px-Facebook_icon_2013.svg.png?20161223201621" alt="Google" />
              Sign in with FaceBook
            </Link>
          
        </div>
      </div>
    </div>
  );
};

export default Login;