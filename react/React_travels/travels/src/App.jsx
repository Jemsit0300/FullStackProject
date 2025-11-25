import React, { useState, useEffect } from "react";
import RegisterForm from "./components/RegisterForm";
import { Routes, Route } from 'react-router-dom';
import BusList from "./deepcomponents/BusList";
import BusSeats from "./deepcomponents/BusSeats";
import UserBookings from "./deepcomponents/UserBooking";
import Wrapper from "./deepcomponents/Wrapper";
import LoginForm from "./deepcomponents/LoginForm";

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  // Sayfa yüklendiğinde token'ı kontrol et
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserId = localStorage.getItem("userId");
    
    if (savedToken && savedUserId) {
      console.log("Auto-login with saved token:", savedToken);
      setToken(savedToken);
      setUserId(savedUserId);
    }
  }, []);

  const handleLogin = (token, userId) => {
    console.log("Login successful - Token:", token, "User ID:", userId);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    setToken(token);
    setUserId(userId);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setUserId(null);
  };

  return (
    <div>  
      <Wrapper handleLogout={handleLogout} token={token}>     
        <Routes>
          <Route path="/" element={<BusList />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/bus/:busId" element={<BusSeats token={token} userId={userId} />} />
          <Route path='/my-bookings' element={<UserBookings token={token} userId={userId} />} />
        </Routes>
      </Wrapper>
    </div>
  );
}

export default App;