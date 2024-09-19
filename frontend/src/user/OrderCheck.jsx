import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

const OrderCheck = () => {
    const [orders, setOrders] = useState([]);
    const email = sessionStorage.getItem('email');

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/userbookedOrderStatus/${email}`);
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching order status:", error);
        }
    };

    return (
        <div>
            <div className="book-event-wrapper">
                <Header />
                <div className="main-content">
                    <Sidebar />
                    <div className="book-event-container">
                        <h2 className="form-title">Your Booking Event Status</h2>
                        {orders.length === 0 ? (
                            <p>No orders found.</p>
                        ) : (
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Sl No</th>
                                        <th>Event Ticket ID</th>
                                        <th>Ticket Type</th>
                                        <th>Event Date</th>
                                        <th>Quantity</th>
                                        <th>Ticket Price</th>
                                        <th>Total Price</th>
                                        <th>Status</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order,index) => (
                                        <tr key={order.order_id}>
                                            <td>{index+1}</td>
                                            <td>{order.events}</td>
                                            <td>{order.ticketType}</td>
                                            <td>{new Date(order.eventDate).toLocaleDateString()}</td>
                                            <td>{order.quantity}</td>
                                            <td>{order.ticket_price}</td>
                                            <td>{order.total_price}</td>
                                            <td><span style={{background:order.order_status === 'pending' ? 'blue' : order.order_status === 'confirmed' ? 'green' : 'red', color:'white'}}>{order.order_status}</span></td>
                                            
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                <br />
                <Footer />
            </div>
        </div>
    );
};

export default OrderCheck;
