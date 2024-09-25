import React from 'react';
import './style.css';

const Footer = () => {
    const today=new Date();
    return (
        <footer className="footer">
            <p>Event Management Dashboard &copy; {today.getFullYear()}</p>
        </footer>
    );
};

export default Footer;
