import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const email= searchParams.get('email')
    const id= searchParams.get('id')

    if (token) {
      localStorage.setItem('token', token);
      sessionStorage.setItem('email',email)
      localStorage.setItem('id',id)
      sessionStorage.setItem('role', role);
      
      if (role === '1') {
        navigate('/dashboard');
      } else if (role === '0') {
        navigate('/dashboard2'); 
      } else {
        navigate('/');
      }
    }
  }, [navigate, searchParams]);

  return <div><img src="https://wpamelia.com/wp-content/uploads/2018/11/ezgif-2-6d0b072c3d3f.gif" alt="Loading......." /></div>;
};

export default Success;
