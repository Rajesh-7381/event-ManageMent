import axios from 'axios';
import React, { useState } from 'react'
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

const Feedback = () => {
    const [formdata,setformdata]=useState({event_name:'',feedback:'',user_id:localStorage.getItem('id')});
    
    // alert(id)
    const handleSubmit=async(e,reset)=>{
        e.preventDefault();
        console.log(formdata)
        const response=await axios.post("http://localhost:8081/api/feedback",formdata)
        // alert(1)
    }
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setformdata((prevdata)=>({
            ...prevdata,
            [name]:value
        }))
    }
  return (
    <div>
    <div className="book-event-wrapper">
    <Header />
    <div className="main-content">
      <Sidebar />
      <div className="book-event-container">
        <h2 className="form-title">Valuable FeedBack</h2>
        <form onSubmit={handleSubmit} className="book-event-form">
          
          <div className="form-group">
          <label htmlFor='event_name' style={{display:"flex"}}>Event name</label>
          <input type="text" name="event_name" id="event_name"  onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label htmlFor="feedback" style={{display:"flex"}}>FeedBack</label>
            <textarea type="text" name="feedback" id="feedback"  onChange={handleChange}></textarea> 
          </div>
          
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
    <br />
    <Footer />
  </div>
    </div>
  )
}

export default Feedback
