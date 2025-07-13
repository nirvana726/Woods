import { useState, useEffect } from 'react';
import { 
  FaCheck, 
  FaTimes, 
  FaCalendarAlt, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaTrash,
  FaSearch,
  FaSpinner
} from 'react-icons/fa';
import { fetchBookings, updateBookingStatus, deleteBooking } from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800' },
];

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchBookings();
        setBookings(response.bookings || []);
      } catch (err) {
        console.error("Failed to load bookings:", err);
        setError(err.message);
        toast.error(err.message);
        
        // Redirect to login if unauthorized
        if (err.message.includes("Session expired") || err.message.includes("No authentication")) {
          localStorage.removeItem("token");
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [navigate]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, newStatus);
      setBookings(bookings.map(booking => 
        booking._id === id ? { ...booking, status: newStatus } : booking
      ));
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update booking status:", err);
      toast.error(err.message || "Failed to update booking status");
      
      if (err.message.includes("Session expired") || err.message.includes("No authentication")) {
        localStorage.removeItem("token");
        navigate('/login');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    
    try {
      await deleteBooking(id);
      setBookings(bookings.filter(booking => booking._id !== id));
      toast.success("Booking deleted successfully");
    } catch (err) {
      console.error("Failed to delete booking:", err);
      toast.error(err.message || "Failed to delete booking");
      
      if (err.message.includes("Session expired") || err.message.includes("No authentication")) {
        localStorage.removeItem("token");
        navigate('/login');
      }
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      `${booking.firstname} ${booking.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.roomId && booking.roomId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Booking Management</h1>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.length > 0 ? (
              filteredBookings.map(booking => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{booking.firstname} {booking.lastname}</div>
                    <div className="text-sm text-gray-500">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="capitalize">{booking.roomId} room</div>
                    {booking.specialRequests && (
                      <div className="text-sm text-gray-500 truncate max-w-xs" title={booking.specialRequests}>
                        {booking.specialRequests}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>{new Date(booking.checkInDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24))} nights
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" />
                      <a href={`mailto:${booking.email}`} className="text-blue-600 hover:underline">
                        {booking.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-400" />
                      <a href={`tel:${booking.phone}`} className="text-blue-600 hover:underline">
                        {booking.phone}
                      </a>
                    </div>
                    {booking.country && (
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span className="text-sm text-gray-500">{booking.country}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusOptions.find(s => s.value === booking.status)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2 justify-end">
                      {booking.status !== 'confirmed' && (
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                          className="p-2 text-green-600 hover:text-green-800"
                          title="Confirm"
                        >
                          <FaCheck />
                        </button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                          className="p-2 text-red-600 hover:text-red-800"
                          title="Cancel"
                        >
                          <FaTimes />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="p-2 text-gray-600 hover:text-red-600"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}