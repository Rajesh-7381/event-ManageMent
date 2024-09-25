import React, { useEffect, useState } from 'react';
import './style.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import axios from 'axios';
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [activeEvents, setActiveEvents] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); 

  useEffect(() => {
    fetchDashboardData();
    fetchUpcomingEvents();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const eventResponse = await axios.get('http://localhost:8081/api/ActiveEvents', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setActiveEvents(eventResponse.data.activeEvents);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/upcomingEvent', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUpcomingEvents(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch upcoming events:", error);
    }
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % upcomingEvents.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === 0 ? upcomingEvents.length - 1 : prevIndex - 1
    );
  };


  return (
    <div className="book-event-wrapper">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="book-event-container">
          <h2>Welcome to the Event Management Dashboard!</h2>

          <div className="stats">
            <div className="card">
              <h3>Active Events</h3>
              <p>{activeEvents}</p>
            </div>

            <div className="card">
              <h3>Upcoming Events</h3>
              <p>{upcomingEvents.length}</p>
            </div>
          </div>

          <div className="upcoming-events">
            <h3>Upcoming Events</h3>
            <table>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {upcomingEvents.map((event) => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{event.description}</td>
                    <td>{event.eventDate}</td>
                    <td>{event.location}</td>
                    <td>
                      <img
                        src={`http://localhost:8081/eventImage/${event.event_image.split("\\").pop()}`}
                        alt={event.title}
                        style={{ width: "100px", height: "100px" }}
                      />
                    </td>
                    <td>
                      <Link to={`/bookevent/${event.id}`}>Book</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
