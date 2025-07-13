// src/components/admin/BookingManagement.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/admin/bookings');
        setBookings(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await axios.put(`/api/admin/bookings/${id}`, { status });
      setBookings(bookings.map(booking => 
        booking._id === id ? response.data : booking
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update booking');
    }
  };

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Booking Management</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Guest</th>
              <th className="py-3 px-4 text-left">Room</th>
              <th className="py-3 px-4 text-left">Dates</th>
              <th className="py-3 px-4 text-left">Contact</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {bookings.map(booking => (
              <tr key={booking._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="font-medium">{booking.firstname} {booking.lastname}</div>
                  <div className="text-sm text-gray-600">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="capitalize">{booking.roomId} room</div>
                  {booking.specialRequests && (
                    <div className="text-sm text-gray-600 truncate max-w-xs" title={booking.specialRequests}>
                      {booking.specialRequests}
                    </div>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-500" />
                    <span>{new Date(booking.checkInDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-500" />
                    <span>{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-500" />
                    <a href={`mailto:${booking.email}`} className="text-blue-600 hover:underline">
                      {booking.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-gray-500" />
                    <a href={`tel:${booking.phone}`} className="text-blue-600 hover:underline">
                      {booking.phone}
                    </a>
                  </div>
                  {booking.country && (
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-500" />
                      <span>{booking.country}</span>
                    </div>
                  )}
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(booking._id, 'confirmed')}
                      className="p-2 text-green-600 hover:text-green-800"
                      title="Confirm"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => updateStatus(booking._id, 'cancelled')}
                      className="p-2 text-red-600 hover:text-red-800"
                      title="Cancel"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}