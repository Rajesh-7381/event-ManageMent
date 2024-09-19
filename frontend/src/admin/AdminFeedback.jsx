import React, { useEffect, useState } from 'react';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import axios from 'axios';

const AdminFeedback = () => {
    const [feedData, setfeedData] = useState([]);

    useEffect(() => {
        fetchFeedBack();
    }, []);

    const fetchFeedBack = async () => {
        try {
            const response = await axios.get("http://localhost:8081/api/fetchfeedback");
            console.log(response.data);
            setfeedData(response.data);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    };

    return (
        <div>
            <div className="dashboard-layout">
                <Header />
                <div className="main-container">
                    <Sidebar />
                    <div className="content-container">
                        <div className="dashboard-container">
                            
                                <h2>Admin Feedback</h2>
                                <table className="feedback-table">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Event</th>
                                            <th>Feedback</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {feedData.length > 0 ? (
                                            feedData.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.username}</td>
                                                    <td>{item.event}</td>
                                                    <td>{item.feedback}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3">No feedback available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default AdminFeedback;
