import axios from "axios";
import React, { useEffect, useState } from "react";
import './BookEvent.css';  
import Header from "../user/components/Header";
import Sidebar from "../user/components/Sidebar";
import Footer from "../user/components/Footer";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const BookEvent = () => {
  const [event, setEvent] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [errors,setErrors]=useState({})
  const navigate=useNavigate()
  const [formdata, setFormdata] = useState({  choosenevent: "",   ticketType: "",   eventDate: "",   quantity: "",  ticket_price: "",   final_price: "",   user_id: localStorage.getItem("id"),});

  useEffect(() => {
    document.title = "BookEvent";
    upCominEvent();
  }, []);

  const upCominEvent = async () => {
    const response = await axios.get("http://localhost:8081/api/upcomingEvent", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setEvent(response.data);
  };

  const selectEvent = (e) => {
    const eventId = e.target.value;
    const events = event.find((eventItem) => eventItem.id === parseInt(eventId));
    setSelectedEvent(events);
    setErrors((prevErrors) => ({ ...prevErrors, choosenevent: "" }));
    if (events) {
      setFormdata((prevdata) => ({
        ...prevdata,
        choosenevent: eventId, 
        eventDate: events.eventDate,
        ticket_price: events.ticket_price,
      }));
    }
  };

  const totalPrice = async (e) => {
    const quantity = parseInt(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, quantity: "" }));
    const ticket_price = formdata.ticket_price ? parseFloat(formdata.ticket_price) : 0;
    const calculatedPrice = quantity * ticket_price;

    if (selectedEvent) {
      try {
        const response = await axios.get(`http://localhost:8081/api/checkQuantity?event_ticket_id=${selectedEvent.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const remainingQuantity = response.data.quantity_left;

        if (quantity > remainingQuantity) {
          alert(`Only ${remainingQuantity} tickets left.`);
          return;
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to check ticket quantity";
        alert(errorMessage);
        return;
      }
    }

    setFormdata((prevdata) => ({
      ...prevdata,
      quantity,
      final_price: calculatedPrice,
    }));
  };

  const selectType = (e) => {
    const type = e.target.value;
    setErrors((prevErrors) => ({ ...prevErrors, ticketType: "" }));

    if (selectedEvent) {
        let ticketPrice;
        let ticketTypeName;

        if (type === 'general_ticket_price') {
            ticketPrice = parseFloat(selectedEvent.general_ticket_price);
            ticketTypeName = 'General';
        } else if (type === 'vip_ticket_price') {
            ticketPrice = parseFloat(selectedEvent.vip_ticket_price);
            ticketTypeName = 'VIP';
        }

        if (ticketPrice === 0) {
            Swal.fire({
                title: "Ticket Not Available",
                text: `The ${ticketTypeName} ticket is currently not available.`,
                icon: "warning"
            });
            return; 
        }

        setFormdata((prevdata) => ({
            ...prevdata,
            ticketType: ticketTypeName,
            ticket_price: ticketPrice,
        }));
    }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(formdata);
    setErrors(newErrors);
    if(Object.keys(newErrors).length === 0){
      try {
        const response=await axios.post("http://localhost:8081/api/BookEvent", formdata);
        if (response.status === 200) { 
          Swal.fire({
            title: "Good job!",
            text: response.data.message,
            icon: "success"
          });
         
        }
        navigate("/status")
        
      } catch (error) {
        alert("Failed to book the event");
      }
    }
  };

  const validateForm=(formdata)=>{
    const errors={}
    if(!formdata.choosenevent.trim()){
      errors.choosenevent="Event required!"
    }

    if(!formdata.ticketType.trim()){
      errors.ticketType="ticketType required!"
    }
    if(!formdata.quantity){
      errors.quantity="quantity required!"
    }
    if(!formdata.ticket_price){
      errors.ticket_price="ticket price required!"
    }
  return errors;
}

  return (
    <div className="book-event-wrapper">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="book-event-container">
          <h2 className="form-title">Book Your Event</h2>
          <form onSubmit={handleSubmit} className="book-event-form">
            <div className="form-group">
              <label htmlFor="choosenevent" style={{display:"flex"}}>Event</label>
              <select name="choosenevent" id="choosenevent" onChange={selectEvent}>
                <option>--Choose--</option>
                {event.map((eventItem) => (
                  <option key={eventItem.id} value={eventItem.id}>
                    {eventItem.title}
                  </option>
                ))}
              </select>
              {errors.choosenevent && (<span style={{color:"red"}}>{errors.choosenevent}</span>)}
            </div>
            <div className="form-group">
              <label style={{display:"flex"}}>Ticket Type</label>
              <select name="ticketType" id="ticketType" onChange={selectType}>
                <option>--Choose--</option>
                <option value="general_ticket_price">General</option>
                <option value="vip_ticket_price">VIP</option>
              </select>
              {errors.ticketType && (<span style={{color:"red"}}>{errors.ticketType}</span>)}

            </div>
            <div className="form-group">
              <label htmlFor="eventDate" style={{display:"flex"}}>Date</label>
              <input type="text" name="eventDate" id="eventDate" value={formdata.eventDate} readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="quantity" style={{display:"flex"}}>Quantity</label>
              <input
                type="number" 
                name="quantity"
                id="quantity"
                placeholder="Enter quantity"
                onChange={totalPrice}
              />
              {errors.quantity && (<span style={{color:"red"}}>{errors.quantity}</span>)}

            </div>
            <div className="form-group">
              <label htmlFor="ticket_price" style={{display:"flex"}}>Ticket Price</label>
              <input type="text" name="ticket_price" id="ticket_price" value={formdata.ticket_price} readOnly />
              {errors.ticket_price && (<span style={{color:"red"}}>{errors.ticket_price}</span>)}

            </div>
            <div className="form-group final-price-group">
              <label htmlFor="final_price" style={{display:"flex"}}>Final Price</label>
              <input type="text" name="final_price" id="final_price" value={formdata.final_price ? formdata.final_price : 0 } readOnly />
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
