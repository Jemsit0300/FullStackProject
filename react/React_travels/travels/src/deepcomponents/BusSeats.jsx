import axios from "axios";  
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BusSeats = ({ token, userId }) => {
  const [bus, setBus] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentToken, setCurrentToken] = useState(token);

  const { busId } = useParams();
  const navigate = useNavigate(); 

  // Token'ı localStorage'dan kontrol et
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken && savedToken !== currentToken) {
      console.log("Token updated from localStorage");
      setCurrentToken(savedToken);
    }
  }, [currentToken]);

  console.log("Current token:", currentToken);
  console.log("User ID:", userId);
  console.log("Bus ID:", busId);

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/buses/${busId}/`);
        setBus(response.data);
        setSeats(response.data.seats || []);
      } catch (error) {
        console.log("Error fetching bus details:", error);
      }
    };
    fetchBusDetails();
  }, [busId]);

  const getAuthToken = () => {
    // Önce props'tan, sonra localStorage'dan token al
    return token || localStorage.getItem("token") || currentToken;
  };

  const handleBook = async (seatId) => {
    console.log("Booking attempt - Seat ID:", seatId);
    
    const authToken = getAuthToken();
    console.log("Auth token:", authToken);
    
    if (!authToken) {
      alert("Please login to book a seat");
      navigate('/login');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(
        "http://localhost:8000/api/booking/",
        { seat: seatId },
        {
          headers: {
            Authorization: `Token ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("Booking response:", response.data);
      alert("Seat booked successfully!");

      // Koltuk durumunu güncelle
      setSeats((prevSeats) =>
        prevSeats.map((seat) =>
          seat.id === seatId ? { ...seat, is_booked: true } : seat
        )
      );

    } catch (error) {
      console.error("Booking error:", error);
      
      if (error.response?.status === 401) {
        alert("Your session has expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setCurrentToken(null);
        navigate('/login');
      } else {
        alert(
          error.response?.data?.error ||
          error.response?.data?.detail ||
          "Booking failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Koltukları grupla
  const groupSeats = (seats) => {
    const grouped = [];
    for (let i = 0; i < seats.length; i += 4) {
      grouped.push(seats.slice(i, i + 4));
    }
    return grouped;
  };

  const groupedSeats = groupSeats(seats);
  const isUserLoggedIn = getAuthToken();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {bus && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h1 className="text-3xl font-bold text-gray-800">{bus.bus_name}</h1>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {bus.bus_number}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Origin</p>
                        <p className="font-semibold text-gray-800">{bus.origin}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Departure</p>
                        <p className="font-semibold text-gray-800">{bus.start_time}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Destination</p>
                        <p className="font-semibold text-gray-800">{bus.destination}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Arrival</p>
                        <p className="font-semibold text-gray-800">{bus.reach_time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bus Layout */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Your Seat</h2>
            <p className="text-gray-600">Choose your preferred seat from the layout below</p>
            
            {isUserLoggedIn ? (
              <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded-lg">
                <p className="text-green-800 text-sm">
                  ✅ You are logged in and can book seats
                </p>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  ⚠️ You need to be logged in to book a seat
                </p>
              </div>
            )}
          </div>

          {/* Driver Section */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800 text-white py-3 px-6 rounded-lg text-center">
              <svg className="w-6 h-6 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              Driver
            </div>
          </div>

          {/* Seats Grid */}
          <div className="max-w-2xl mx-auto">
            {groupedSeats.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-8 mb-6">
                {row.slice(0, 2).map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => handleBook(seat.id)}
                    disabled={seat.is_booked || loading || !isUserLoggedIn}
                    className={`
                      w-16 h-16 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-110
                      ${seat.is_booked 
                        ? 'bg-red-500 text-white cursor-not-allowed opacity-80' 
                        : !isUserLoggedIn
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                      }
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {loading ? '...' : seat.seat_number}
                  </button>
                ))}
                
                {/* Aisle */}
                <div className="w-16"></div>
                
                {row.slice(2, 4).map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => handleBook(seat.id)}
                    disabled={seat.is_booked || loading || !isUserLoggedIn}
                    className={`
                      w-16 h-16 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-110
                      ${seat.is_booked 
                        ? 'bg-red-500 text-white cursor-not-allowed opacity-80' 
                        : !isUserLoggedIn
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                      }
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {loading ? '...' : seat.seat_number}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-8 mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span className="text-sm text-gray-600">Login Required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusSeats;