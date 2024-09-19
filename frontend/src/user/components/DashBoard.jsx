import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import axios from 'axios';
import { Link, Navigate } from "react-router-dom";

const Dashboard = () => {
  const [activeEvents, setActiveEvents] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [token, setToken] = useState(null);
  const [role, setrole] = useState(null);


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
      console.log(upcomingEvents)
      setUpcomingEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch upcoming events:", error);
    }
  };

  return (
    <div className="book-event-wrapper">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="book-event-container">
          <h2>Welcome to the Event Management Dashboard!</h2>
          
          {/* Stats section */}
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

          {/* Upcoming events section */}
          <div className="upcoming-events">
            <h3>Upcoming Events</h3>
            <table>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Location</th>
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
                    <td><Link to={'/bookevent'}>Book</Link></td>
                    
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
