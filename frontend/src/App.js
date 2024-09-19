import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './admin/Dashboard';
import Dashboard2 from './user/components/DashBoard';
import AddEditEvent from './admin/event/AddEditEvent';
import BookEvent from './user/BookEvent';
import Order from './admin/event/Order';
import Profile from './admin/Profile/Profile';
import OrderCheck from './user/OrderCheck';
import Feedback from './user/Feedback';
import AdminFeedback from './admin/AdminFeedback';
import UserProfile from './user/components/UserProfile';
import ProtectedRoute from './ProtectedRoute ';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute roleRequired="1"><Dashboard /></ProtectedRoute> } />
          <Route path="/addedit/:id?" element={<ProtectedRoute roleRequired="1"><AddEditEvent /></ProtectedRoute>}/>
          <Route path="/adminfeedback"  element={<ProtectedRoute roleRequired="1"><AdminFeedback /></ProtectedRoute>  }/>
          <Route path="/dashboard2"  element={<ProtectedRoute roleRequired="0"><Dashboard2 /></ProtectedRoute>  }/>
          <Route path="/bookevent"  element={<ProtectedRoute roleRequired="0"><BookEvent /></ProtectedRoute>  }/>
          <Route path="/status"  element={<ProtectedRoute roleRequired="0"> <OrderCheck /></ProtectedRoute>  }/>
          <Route path="/feedback"  element={<ProtectedRoute roleRequired="0"><Feedback /></ProtectedRoute>  }/>
          <Route path="/userprofile"  element={<ProtectedRoute roleRequired="0"><UserProfile /></ProtectedRoute>  }/>
          <Route path="/orderCheck"  element={<ProtectedRoute><Order /></ProtectedRoute>  }/>
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
