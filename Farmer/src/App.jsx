import React, { useEffect, useState } from 'react';
import { Navbar } from './Components/Navbar/Navbar';
import { Admin } from './Pages/Admin/Admin';
import { HomePage } from './Pages/Homepage/HomePage';
import { useNavigate } from 'react-router-dom';
import ChatOverlay from './Components/ChatOverlay/ChatOverlay';

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('x-access-token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      // Do not auto-navigate away; let the HomePage handle navigation via its buttons.
    }
  }, []);

  return (
    <div>
      {isAuthenticated ? (
        <>
          <Navbar />
          <Admin />
        </>
      ) : (
        <HomePage />
      )}
       {/* Always display the chat overlay */}
       <ChatOverlay />
    </div>
  );
};

export default App;
