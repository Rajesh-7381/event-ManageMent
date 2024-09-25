import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import './Profile.css'; 

const Profile = () => {
  const [data, setData] = useState({});
  const email = sessionStorage.getItem("email");

  useEffect(() => {
    document.title="Profile"
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
    


    <div className="dashboard-layout">
      <Header />
      <div className="main-container">
        <Sidebar />
        <div className="content-container">
          <div className="profile-card">
            
            <h2 className="form-title">Your Name: {data.name} </h2>
        <h2 className="form-title">Your Email: {data.email} </h2>
        <img src={profileImageUrl} height={270} width={270} style={{marginLeft:'-80%',marginTop:"-160px"}} alt="Profile" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
