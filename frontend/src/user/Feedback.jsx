import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Swal from 'sweetalert2';

const Feedback = () => {
  const [formdata, setformdata] = useState({ event_name: '', feedback: '', user_id: localStorage.getItem('id') });
  const [errors, setErrors] = useState({});

  useEffect(()=>{
    document.title="FeedBack"
  },[])

  const handleSubmit = async (e, reset) => {
    e.preventDefault();
    const newErrors = validate(formdata);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post("http://localhost:8081/api/feedback", formdata);
        Swal.fire({
          title: `${response.data.message}`,
        });
        e.target.reset(); 
      } catch (error) {
        console.error(error);
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformdata((prevdata) => ({
      ...prevdata,
      [name]: value
    }));
  }

  const validate = (formdata) => {
    const errors = {};
    if (!formdata.event_name.trim()) {
      errors.event_name = "Event name is required!";
    }
    if (!formdata.feedback.trim()) {
      errors.feedback = "Feedback is required!";
    }
    return errors;
  }

  return (
    <div>
      <div className="book-event-wrapper">
        <Header />
        <div className="main-content">
          <Sidebar />
          <div className="book-event-container">
            <h2 className="form-title">Valuable Feedback</h2>
            <form onSubmit={handleSubmit} className="book-event-form">

              <div className="form-group">
                <label htmlFor='event_name' style={{ display: "flex" }}>Event name</label>
                <input type="text" name="event_name" id="event_name" onChange={handleChange} />
                {errors.event_name && (<span style={{ color: 'red' }}>{errors.event_name}</span>)}
              </div>

              <div className="form-group">
                <label htmlFor="feedback" style={{ display: "flex" }}>Feedback</label>
                <textarea name="feedback" id="feedback" onChange={handleChange}></textarea>
                {errors.feedback && (<span style={{ color: 'red' }}>{errors.feedback}</span>)}
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

export default Feedback;
