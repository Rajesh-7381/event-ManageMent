import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roleRequired }) => {
  // console.log(children) //Dashboard2,AdminFeedback,AddEditEvent,Dashboard these are defined in app.js and that data as a act as chilidren
  // console.log(roleRequired) //role 1 or 0 are defined in app.js and that data as a act as chilidren
  const token = localStorage.getItem('token');
  const role = sessionStorage.getItem('role');

  if (!token) {
    return <Navigate to="/" />;
  }

  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
