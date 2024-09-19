import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './components/dashboard.css'
import { Link } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components//Footer';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedData, setSelectedData] = useState({});
    const [sortDirection, setSortDirection] = useState({ key: '', direction: 'asc' });

    useEffect(() => {
        document.title = "Dashboard";
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        const response = await axios.get("http://localhost:8081/api/allEventData", {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setData(response.data.data);
    };

    const viewData = (event) => {
        setSelectedData(event);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const searchData = (e) => {
        const searchValue = e.target.value.trim().toLowerCase();
        if (searchValue === '') {
            fetchAllData();
        } else {
            const filteredData = data.filter(event =>
                event.title.toLowerCase().includes(searchValue) ||
                event.location.toLowerCase().includes(searchValue)
            );
            setData(filteredData);
        }
    };

    const handleSort = (key) => {
        const direction = sortDirection.key === key && sortDirection.direction === 'asc' ? 'desc' : 'asc';
        setSortDirection({ key, direction });
        const sortedData = [...data].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setData(sortedData);
    };
    const handlechange = async (e) => {
        const value = e.target.value;
        if (value === 'upcoming5') {
            const response = await axios.get("http://localhost:8081/api/upcomingEvent",{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            // console.log(response.data)
            setData(response.data);
        } else if (value === 'last5') {
            const response = await axios.get("http://localhost:8081/api/lastFiveEvent",{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setData(response.data);
        }
    };

    const Delete=async(id)=>{
        try {
            // alert(id)
            const response=await axios.delete(`http://localhost:8081/api/deleteEvent/${id}`,{headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}})
            // console.log(response.data)
            // setData(response.data);
            fetchAllData()
        } catch (error) {
            
        }
    }

    return (
        <div className="dashboard-layout">
            <Header />
            <div className="main-container">
                <Sidebar />
                <div className="content-container">
                    <div className="dashboard-container">
                        <div className="header">
                            <input type="text" placeholder="Search by title or location..." onKeyUp={searchData} />
                            <button style={{background:"green"}}><Link to="/addedit" style={{ textDecoration: 'none', color: 'white' }}>Add New Event</Link></button>
                        </div>
                        <div>
                            <select onChange={handlechange}>
                                <option value="">-----Choose-----</option>
                                <option value="upcoming5">Upcoming 5 Events</option>
                                <option value="last5">Last 5 Events</option>
                            </select>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('id')}>Sl No</th>
                                    <th onClick={() => handleSort('title')}>Title</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Location</th>
                                    <th>General Ticket Price</th>
                                    <th>Vip Ticket Price</th>
                                    <th>Quantity</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((event, index) => (
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{event.title}</td>
                                        <td>{event.description}</td>
                                        <td>{event.eventDate}</td>
                                        <td>{event.eventTime}</td>
                                        <td>{event.location}</td>
                                        <td>{event.general_ticket_price}</td>
                                        <td>{event.vip_ticket_price}</td>
                                        <td>{event.quantity}</td>
                                        <td>
                                            <button className="edit" style={{background:"green"}}><Link to={`/addedit/${event.id}`} style={{ textDecoration: 'none', color: 'white' }}>Edit</Link></button>
                                            <button onClick={() => viewData(event)} style={{background:"black", color:"white"}}>View</button>
                                            <button onClick={() => Delete(event.id)} style={{background:"red", color:"white"}}>Del</button>
                                            
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {modalVisible && (
                        <div className="myModal">
                            <div className="modal-content">
                                <span className="close" onClick={closeModal}>&times;</span>
                                <p><strong>Title:</strong> {selectedData.title}</p>
                                <p><strong>Description:</strong> {selectedData.description}</p>
                                <p><strong>Location:</strong> {selectedData.location}</p>
                                <p><strong>Date:</strong> {selectedData.eventDate}</p>
                                <p><strong>Time:</strong> {selectedData.eventTime}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
