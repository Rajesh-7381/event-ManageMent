import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';

const Header = () => {
    const navigate = useNavigate();

    const logout = () => {
        window.localStorage.clear();
        window.sessionStorage.clear()
        navigate("/");
    };

    return (
        <div className="header">
            <div className="logo">
                <h2 style={{color:"white"}}>Event Management</h2>
            </div>
            <div className="header-right">
                <button className="logout-button" onClick={logout}>Logout</button>
            </div>
        </div>
    );
};

export default Header;
