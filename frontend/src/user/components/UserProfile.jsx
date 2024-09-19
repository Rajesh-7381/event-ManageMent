import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Footer from './Footer';
import Sidebar from './Sidebar';
import Header from './Header';

const UserProfile = () => {
    const [data, setData] = useState({});
  const email = sessionStorage.getItem("email");

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/details/${email}`);
      console.log(response.data)
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch user details', error);
    }
  };
  const profileImageUrl = `http://localhost:8081/profile/${data.profileimage ? data.profileimage.split("\\").pop() : ''}`;

  return (
    <div>
    
    <div className="book-event-wrapper">
    <Header />
    <div className="main-content">
      <Sidebar />
      <div className="book-event-container">
        <h2 className="form-title">Your Name: {data.name} </h2>
        <h2 className="form-title">Your Email: {data.email} </h2>
        <img src={profileImageUrl} height={270} width={270} style={{marginLeft:'-80%',marginTop:"-160px"}} alt="Profile" />

      </div>
    </div>
    <br />
    <Footer />
  </div>

    </div>
  )
}

export default UserProfile
