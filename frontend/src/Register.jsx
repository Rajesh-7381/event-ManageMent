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
    const imagesize=1024*1024*2;
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
    } else if (password.length > 6 || password.length < 3) {
      errors.password = "Password is minium 3 and maxium 6";
    }else if(!/^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z\d]{3,6}$/.test(password)){
    // }else if(/^[a-z,A-Z!@$%^&]){
      errors.password = "Password isuppercase lowecase and letters and numbers";
    }
     
    if (!profileImage) {
      errors.profile = "Profile image is required";
    }
     else if (profileImage.size > imagesize) {
      errors.profile = "Profile image exceeds 2MB";
    } else if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(profileImage.type)) {
      errors.profile = "Profile image should be jpg, jpeg, png, or webp";
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
      
      if (files && files.length > 0) {
        setProfileImage(files[0]);
      }
      
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
              type="text"
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
              accept='.jpeg,jpg,.png,.webp'
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
