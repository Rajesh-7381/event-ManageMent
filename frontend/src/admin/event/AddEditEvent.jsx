import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddEditEvent.css'; 
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Swal from "sweetalert2";

const AddEditEvent = () => {
    const [event, setEvent] = useState({
        title: '', 
        description: '', 
        eventDate: '', 
        eventTime: '', 
        location: '', 
        privacy: '', 
        general_ticket_price: 0.00, 
        vip_ticket_price: 0.00, 
        quantity: '', 
        organizer_id: localStorage.getItem('id')
    });
    const [eventImage, setEventImage] = useState(null); 
    const { id } = useParams(); 
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "AddEdit Event";
        if (id) {
            handleEdit(id);  
        }
    }, [id]);

    const handleEdit = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/edit/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // console.log(response.data)
            setEvent(response.data[0]);
        } catch (error) {
            console.error('Failed to fetch event details:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = ['general_ticket_price', 'vip_ticket_price'].includes(name)  ? parseFloat(value) || 0.00    : value;

        setEvent((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));

        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const handleImageChange = (e) => {
        setEventImage(e.target.files[0]); 
        setErrors((prevErrors) => ({ ...prevErrors, eventImage: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = formValidate(event); 
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const token = localStorage.getItem('token');
                const formData = new FormData();
                Object.keys(event).forEach((key) => {
                    formData.append(key, event[key]);
                });

                if (eventImage) {
                    formData.append('eventImage', eventImage);
                }

                if (id) {
                    
                    await axios.patch(`http://localhost:8081/update/${id}`, formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    Swal.fire({
                        text: "Event Updated Successfully!",
                        icon: "success",
                    });
                } else {
                    // If creating a new event
                    await axios.post('http://localhost:8081/addeditEvent', formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    Swal.fire({
                        title: "Good job!",
                        text: "Event Created Successfully!",
                        icon: "success",
                    });
                }
                navigate("/dashboard");
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to process the event.",
                    icon: "error",
                });
            }
        }
    };

    const formValidate = (event) => {
        const errors = {};
        if (!event.title.trim()) {
            errors.title = "Title required!";
        }
        if (!event.description.trim()) {
            errors.description = "Description required!";
        }
        if (!event.eventDate.trim()) {
            errors.eventDate = "Date required!";
        }
        if (!event.eventTime.trim()) {
            errors.eventTime = "Time required!";
        }
        if (!event.location.trim()) {
            errors.location = "Location required!";
        }
        if (!event.privacy.trim()) {
            errors.privacy = "Privacy required!";
        }
        if (!event.vip_ticket_price) {
            errors.vip_ticket_price = "VIP Ticket Price required!";
        }
        if (!event.quantity) {
            errors.quantity = "Ticket Quantity required!";
        }
        return errors;
    };
    // console.log(event)
    const eventimageurl = `http://localhost:8081/eventImage/${event.event_image ? event.event_image.split("\\").pop() : ''}`;
    // console.log(eventimageurl)

    return (
        <div className="dashboard-layout">
        

            <Header />
            <div className="main-container">
                <Sidebar />
                <div className="content-container">
                    <div className="dashboard-container">
                        <div className="event-container">
                            <div className="event-card">
                                <h4 className="event-title">{id ? 'Edit Event' : 'Create Event'}</h4>
                                <form className="event-form" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="title" style={{display:"flex"}}><b>Title:</b></label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={event.title}
                                            onChange={handleChange}
                                            placeholder="Enter event title"
                                        />
                                        {errors.title && (<span className="error-text">{errors.title}</span>)}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description" style={{display:"flex"}}><b>Description:</b></label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={event.description}
                                            onChange={handleChange}
                                            placeholder="Enter event description"
                                        />
                                        {errors.description && (<span className="error-text">{errors.description}</span>)}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="eventDate" style={{display:"flex"}}><b>Date:</b></label>
                                        <input
                                            type="date"
                                            id="eventDate"
                                            name="eventDate"
                                            value={event.eventDate}
                                            onChange={handleChange}
                                        />
                                        {errors.eventDate && (<span className="error-text">{errors.eventDate}</span>)}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="eventTime" style={{display:"flex"}}><b>Time:</b></label>
                                        <input
                                            type="time"
                                            id="eventTime"
                                            name="eventTime"
                                            value={event.eventTime}
                                            onChange={handleChange}
                                        />
                                        {errors.eventTime && (<span className="error-text">{errors.eventTime}</span>)}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="location" style={{display:"flex"}}><b>Location:</b></label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={event.location}
                                            onChange={handleChange}
                                            placeholder="Enter event location"
                                        />
                                        {errors.location && (<span className="error-text">{errors.location}</span>)}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="eventImage" style={{display:"flex"}}><b>Event Image:</b></label>
                                        <input
                                            type="file"
                                            id="eventImage"
                                            name="eventImage"
                                            onChange={handleImageChange}
                                        />
                                        <img src={eventimageurl} height={50} width={50}  alt="" />
                                        {errors.eventImage && (<span className="error-text">{errors.eventImage}</span>)}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="privacy" style={{display:"flex"}}><b>Privacy:</b></label>
                                        <select
                                            name="privacy"
                                            id="privacy"
                                            value={event.privacy}
                                            onChange={handleChange}
                                        >
                                            <option value="">--Choose--</option>
                                            <option value="public">Public</option>
                                            <option value="private">Private</option>
                                        </select>
                                        {errors.privacy && (<span className="error-text">{errors.privacy}</span>)}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="general_ticket_price" style={{display:"flex"}}><b>General Ticket Price:</b></label>
                                        <input
                                            type="text"
                                            id="general_ticket_price"
                                            name="general_ticket_price"
                                            value={event.general_ticket_price || 0.00}
                                            onChange={handleChange}
                                            placeholder="Enter general ticket price"
                                        />
                                        {errors.general_ticket_price && (<span className="error-text">{errors.general_ticket_price}</span>)}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="vip_ticket_price" style={{display:"flex"}}><b>VIP Ticket Price:</b></label>
                                        <input
                                            type="text"
                                            id="vip_ticket_price"
                                            name="vip_ticket_price"
                                            value={event.vip_ticket_price || 0.00}
                                            onChange={handleChange}
                                            placeholder="Enter VIP ticket price"
                                        />
                                        {errors.vip_ticket_price && (<span className="error-text">{errors.vip_ticket_price}</span>)}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="quantity" style={{display:"flex"}}><b>Ticket Quantity:</b></label>
                                        <input
                                            type="text"
                                            id="quantity"
                                            name="quantity"
                                            value={event.quantity}
                                            onChange={handleChange}
                                            placeholder="Enter ticket quantity"
                                        />
                                        {errors.quantity && (<span className="error-text">{errors.quantity}</span>)}
                                    </div>
                                    <button type="submit" className="submit-btn">
                                        {id ? 'Update Event' : 'Create Event'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br /><br />
            <Footer />
        </div>
    );
};

export default AddEditEvent;
