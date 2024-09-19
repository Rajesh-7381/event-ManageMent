import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css'; 
import Swal from "sweetalert2";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(()=>{
    document.title="Register"
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(name, email, password, profileImage);
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('profile', profileImage);
  
        const emailexistCheck = await axios.post(`http://localhost:8081/api/emailCheck/${email}`);
        if (emailexistCheck.data.emailExists) {
          Swal.fire({
            icon: "error",
            title: "this email already registered",
            text: "please try with another email !",
            
          });
          return; 
        }

        const response = await axios.post('http://localhost:8081/api/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.status === 200) {
          alert('Registration successful!');
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      } catch (error) {
        alert('Error registering, please try again.');
      }
    }
  };

  const validateForm = (name, email, password,profileImage) => {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Name is required";
    } else if (name.length < 4) {
      errors.name = "Name must be at least 4 characters";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!profileImage) {
      errors.profile = "Profile image is required";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value,files } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    
    if (name === 'name') {
      setName(value);
    } else if (name === 'email') {
      setEmail(value);
    }else if (name === 'password') {
      setPassword(value);
    }else if (name === 'profile') {
      setProfileImage(files[0]);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name" style={{display:"flex"}}><b>Name:</b></label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            {errors.name && (<span  style={{color:"red"}}>{errors.name}</span>)}
          </div>
          <div className="input-group">
            <label htmlFor="email" style={{display:"flex"}}><b>Email:</b></label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && (<span  style={{color:"red"}}>{errors.email}</span>)}
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
          <div className="input-group">
            <label htmlFor="profile" style={{display:"flex"}}><b>Profile:</b></label>
            <input
              type="file"
              id="profile"
              name="profile"
             
              onChange={handleChange}
             
            />
            {errors.profile && (<span style={{color:"red"}}>{errors.profile}</span>)}
          </div>
          <button type="submit" className="submit-btn">Create Account</button>
        </form>
        <p className="text-muted">
          Already have an account? <Link to={"/"} className="link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
