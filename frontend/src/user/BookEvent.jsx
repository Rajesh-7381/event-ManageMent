import axios from "axios";
import React, { useEffect, useState } from "react";
import './BookEvent.css';  
import Header from "../user/components/Header";
import Sidebar from "../user/components/Sidebar";
import Footer from "../user/components/Footer";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const BookEvent = () => {
  const [singleEvent, setSingleEvent] = useState(null); 
  // console.log(singleEvent)
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    choosenevent: "",
    ticketType: "",
    eventDate: "",
    quantity: "",
    ticket_price: "",
    final_price: "",
    user_id: localStorage.getItem("id"),
  });
console.log(formData)
  const { id } = useParams(); 

  useEffect(() => {
    document.title = "Book Event";
    fetchEventDetails();
  }, [id]);


  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/event/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSingleEvent(response.data);
      console.log(response.data)
      setFormData({
        ...formData,
        choosenevent: response.data.title, 
        eventDate: response.data.eventDate,
      });
    } catch (error) {
      console.error("Failed to fetch event details:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to load event details.",
        icon: "error",
      });
    }
  };


  const handleTicketTypeChange = (e) => {
    const type = e.target.value;
    setErrors((prevErrors) => ({ ...prevErrors, ticketType: "" }));

    if (singleEvent) {
      let ticketPrice;
      let ticketTypeName;

      if (type === 'general') {
        ticketPrice = parseFloat(singleEvent.general_ticket_price);
        ticketTypeName = 'General';
      } else if (type === 'vip') {
        ticketPrice = parseFloat(singleEvent.vip_ticket_price);
        ticketTypeName = 'VIP';
      }

      if (ticketPrice === 0) {
        Swal.fire({
          title: "Ticket Not Available",
          text: `The ${ticketTypeName} ticket is currently not available.`,
          icon: "warning"
        });
      
        setFormData((prevData) => ({
          ...prevData,
          ticketType: "",
          ticket_price: "",
        }));
        return; 
      }

      setFormData((prevData) => ({
        ...prevData,
        ticketType: ticketTypeName,
        ticket_price: ticketPrice,
        final_price: prevData.quantity ? prevData.quantity * ticketPrice : "",
      }));
    }
  };


  const handleQuantityChange = async (e) => {
    const quantity = parseInt(e.target.value, 10);
    setErrors((prevErrors) => ({ ...prevErrors, quantity: "" }));
  
    if (isNaN(quantity) || quantity <= 0) {
      setFormData((prevData) => ({
        ...prevData,
        quantity: "",
        final_price: "",
      }));
      return;
    }
  
    if (singleEvent) {
      try {
        const response = await axios.get(`http://localhost:8081/api/checkQuantity?event_ticket_id=${singleEvent.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const remainingQuantity = response.data.quantity_left;
  
        if (quantity > remainingQuantity) {
          Swal.fire({
            title: "Tickets Availability",
            text: `Only ${remainingQuantity} tickets left.`,
            icon: "warning"
          });
          setFormData((prevData) => ({
            ...prevData,
            quantity: "",
            final_price: "",
          }));
          return;
        }
      } catch (error) {
        console.error("Failed to check ticket quantity:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to check ticket quantity.",
          icon: "error",
        });
        return;
      }
    }
  
    const calculatedPrice = formData.ticket_price ? quantity * formData.ticket_price : 0;
    setFormData((prevData) => ({
      ...prevData,
      quantity,
      final_price: calculatedPrice,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      try {
        const eventData = {
          ...formData,
          choosenevent: singleEvent.id, 
        };
        const response = await axios.post("http://localhost:8081/api/BookEvent", eventData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
  
        if (response.status === 200) { 
          Swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success"
          });
          navigate("/status");
        }
      } catch (error) {
        console.error("Failed to book the event:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to book the event.",
          icon: "error"
        });
      }
    }
  };


  const validateForm = (data) => {
    const errors = {};
    if (!data.choosenevent) {
      errors.choosenevent = "Event required!";
    }

    if (!data.ticketType.trim()) {
      errors.ticketType = "Ticket type required!";
    }

    if (!data.quantity || data.quantity <= 0) {
      errors.quantity = "Valid quantity required!";
    }

    if (!data.ticket_price) {
      errors.ticket_price = "Ticket price required!";
    }

    return errors;
  };
console.log(formData)
  return (
    <div className="book-event-wrapper">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="book-event-container">
          <h2 className="form-title">Book Your Event</h2>
          <form onSubmit={handleSubmit} className="book-event-form">

            <div className="form-group">
              <label htmlFor="choosenevent" style={{ display: "flex" }}>Event</label>
              <input 
                type="text" 
                value={formData.choosenevent} 
                readOnly 
              />
              {errors.choosenevent && <span style={{ color: "red" }}>{errors.choosenevent}</span>}
            </div>


            <div className="form-group">
              <label style={{ display: "flex" }}>Ticket Type</label>
              <select name="ticketType" id="ticketType" onChange={handleTicketTypeChange} >
                <option value="">--Choose--</option>
                <option value="general">General</option>
                <option value="vip">VIP</option>
              </select>
              {errors.ticketType && <span style={{ color: "red" }}>{errors.ticketType}</span>}
            </div>

  
            <div className="form-group">
              <label htmlFor="eventDate" style={{ display: "flex" }}>Date</label>
              <input 
                type="text" 
                name="eventDate" 
                id="eventDate" 
                value={formData.eventDate} 
                readOnly 
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity" style={{ display: "flex" }}>Quantity</label>
              <input
                type="number" 
                name="quantity"
                id="quantity"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleQuantityChange}
                min="1"
              />
              {errors.quantity && <span style={{ color: "red" }}>{errors.quantity}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="ticket_price" style={{ display: "flex" }}>Ticket Price</label>
              <input 
                type="text" 
                name="ticket_price" 
                id="ticket_price" 
                value={formData.ticket_price ? `${formData.ticket_price.toFixed(2)}` : ""} 
                readOnly 
              />
              {errors.ticket_price && <span style={{ color: "red" }}>{errors.ticket_price}</span>}
            </div>

       
            <div className="form-group final-price-group">
              <label htmlFor="final_price" style={{ display: "flex" }}>Final Price</label>
              <input 
                type="text" 
                name="final_price" 
                id="final_price" 
                value={formData.final_price ? `${formData.final_price.toFixed(2)}` : "0.00"} 
                readOnly 
              />
            </div>

       
            <button type="submit" className="submit-btn">Book Now</button>
          </form>
        </div>
      </div>
      <br />
      <Footer />
    </div>
  );
};

export default BookEvent;
