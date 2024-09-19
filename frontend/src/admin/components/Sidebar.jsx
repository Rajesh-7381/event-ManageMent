import React from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/dashboard">Home</Link></li>
                <li><Link to="/addedit">Create</Link></li>
                <li><Link to="/orderCheck">Order</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/adminfeedback">FeedBack</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
