import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaSpinner, FaCheckCircle, FaFileDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { usePDF } from 'react-to-pdf';
import bookingHero from '../assets/hero/booking-hero.jpg';
import axios from 'axios';

const roomOptions = [
  { id: "family", name: "Family Room", price: "NPR 3000/night" },
  { id: "king", name: "King Size Room", price: "NPR 2500/night" },
  { id: "triple", name: "Triple Sharing Room", price: "NPR 2800/night" },
];

// Real API function
const createBooking = async (bookingData) => {
  try {
    const response = await axios.post('/api/bookings', bookingData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create booking");
  }
};

export default function Booking() {
  const [form, setForm] = useState({
    roomId: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    country: "",
    specialRequests: "",
    checkInDate: "",
    checkOutDate: "",
    guests: 1,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const navigate = useNavigate();
  const { toPDF, targetRef } = usePDF({ filename: 'booking-confirmation.pdf' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().setHours(0, 0, 0, 0);
    const checkInDate = form.checkInDate ? new Date(form.checkInDate).setHours(0, 0, 0, 0) : null;
    const checkOutDate = form.checkOutDate ? new Date(form.checkOutDate).setHours(0, 0, 0, 0) : null;

    if (!form.firstname.trim()) newErrors.firstname = "First name is required";
    if (!form.lastname.trim()) newErrors.lastname = "Last name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.phone.trim()) newErrors.phone = "Phone number is required";

    if (!form.checkInDate) {
      newErrors.checkInDate = "Check-in date is required";
    } else if (checkInDate < today) {
      newErrors.checkInDate = "Check-in date cannot be in the past";
    }

    if (!form.checkOutDate) {
      newErrors.checkOutDate = "Check-out date is required";
    } else if (checkOutDate <= checkInDate) {
      newErrors.checkOutDate = "Check-out date must be after check-in date";
    }

    if (!form.guests || form.guests < 1) {
      newErrors.guests = "At least 1 guest is required";
    } else if (form.guests > 10) {
      newErrors.guests = "Maximum 10 guests allowed";
    }

    if (!form.roomId) newErrors.roomId = "Please select a room type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDownloadAndRedirect = () => {
    toPDF()
      .then(() => {
        setTimeout(() => navigate("/"), 1000);
      })
      .catch(() => {
        toast.error("PDF generation failed. Redirecting...");
        navigate("/");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const bookingData = {
        ...form,
        checkInDate: new Date(form.checkInDate).toISOString(),
        checkOutDate: new Date(form.checkOutDate).toISOString(),
        guests: Number(form.guests),
      };

      const response = await createBooking(bookingData);

      if (response.success) {
        toast.success("Booking submitted successfully!");
        setBookingSuccess(true);
      } else {
        throw new Error(response.message || "Booking submission failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.message || "Failed to submit booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (rest of the component remains the same, including the JSX)

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <FaCheckCircle className="text-green-600 text-5xl" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your booking, {form.firstname}! We've received your reservation details and will contact you shortly to confirm your stay.
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-8 text-left">
              <h2 className="font-semibold text-lg mb-2">Booking Summary</h2>
              <p><span className="font-medium">Name:</span> {form.firstname} {form.lastname}</p>
              <p><span className="font-medium">Dates:</span> {form.checkInDate} to {form.checkOutDate}</p>
              <p><span className="font-medium">Room Type:</span> {roomOptions.find(r => r.id === form.roomId)?.name || 'Not specified'}</p>
              <p><span className="font-medium">Guests:</span> {form.guests}</p>
            </div>
            <p className="text-gray-500 mb-6">
              You'll be redirected to the home page in a few seconds. If not, click the button below.
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg)]">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center mb-12">
        <img
          src={bookingHero}
          alt="Booking Hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40 custom-blur" />
        <div className="relative z-10 flex flex-col items-center text-center text-white px-4">
          <span className="inline-block mb-4 px-2 border border-white text-white rounded-full font-sm text-sm bg-transparent backdrop-blur-sm tracking-wider shadow-md">
            Book Your Stay
          </span>
          <h1 className="text-4xl md:text-7xl !text-white !font-extrabold mb-4 drop-shadow-lg">
            Make a Reservation
          </h1>
          <p className="text-lg md:text-2xl max-w-2xl mx-auto drop-shadow">
            Send us your booking inquiry and we'll get back to you with availability and pricing
          </p>
        </div>
      </section>

      <section className="py-8 md:py-16 bg-[var(--bg)]">
        <div className="container mx-auto px-8 grid md:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="md:col-span-2 bg-white/90 border border-black/10 rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-2">Booking Inquiry Form</h2>
            <p className="text-gray-600 mb-8">Fill out the form below and our reservations team will contact you.</p>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Personal Information Section */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-2xl font-bold mb-4">Personal Information</h3>
              </div>
              
              {/* First Name */}
              <div className="flex flex-col col-span-1">
                <label className="text-sm font-medium mb-1">First Name *</label>
                <input
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  type="text"
                  className={`bg-[#fdfaf6] border ${errors.firstname ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition`}
                  placeholder="Your first name"
                />
                {errors.firstname && <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>}
              </div>
              
              {/* Last Name */}
              <div className="flex flex-col col-span-1">
                <label className="text-sm font-medium mb-1">Last Name *</label>
                <input
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  type="text"
                  className={`bg-[#fdfaf6] border ${errors.lastname ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition`}
                  placeholder="Your last name"
                />
                {errors.lastname && <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>}
              </div>
              
              {/* Email */}
              <div className="flex flex-col col-span-1">
                <label className="text-sm font-medium mb-1">Email *</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  className={`bg-[#fdfaf6] border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              
              {/* Phone */}
              <div className="flex flex-col col-span-1">
                <label className="text-sm font-medium mb-1">Phone *</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  type="tel"
                  className={`bg-[#fdfaf6] border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition`}
                  placeholder="+977 98XX-XXXXXX"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
              
              {/* Country */}
              <div className="flex flex-col col-span-1 md:col-span-2">
                <label className="text-sm font-medium mb-1">Country</label>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  type="text"
                  className="bg-[#fdfaf6] border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  placeholder="Your country"
                />
              </div>
              
              {/* Booking Details Section */}
              <div className="col-span-1 md:col-span-2 mt-2">
                <h3 className="text-2xl font-bold mb-4">Booking Details</h3>
              </div>
              
              {/* Check-in */}
              <div className="flex flex-col col-span-1">
                <label className="text-sm font-medium mb-1">Check-in Date *</label>
                <input
                  name="checkInDate"
                  value={form.checkInDate}
                  onChange={handleChange}
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className={`bg-[#fdfaf6] border ${errors.checkInDate ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition`}
                />
                {errors.checkInDate && <p className="mt-1 text-sm text-red-600">{errors.checkInDate}</p>}
              </div>
              
              {/* Check-out */}
              <div className="flex flex-col col-span-1">
                <label className="text-sm font-medium mb-1">Check-out Date *</label>
                <input
                  name="checkOutDate"
                  value={form.checkOutDate}
                  onChange={handleChange}
                  type="date"
                  min={form.checkInDate || new Date().toISOString().split('T')[0]}
                  className={`bg-[#fdfaf6] border ${errors.checkOutDate ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition`}
                />
                {errors.checkOutDate && <p className="mt-1 text-sm text-red-600">{errors.checkOutDate}</p>}
              </div>
              
              {/* Guests */}
              <div className="flex flex-col col-span-1">
                <label className="text-sm font-medium mb-1">Number of Guests *</label>
                <input
                  name="guests"
                  value={form.guests}
                  onChange={handleChange}
                  type="number"
                  min="1"
                  className={`bg-[#fdfaf6] border ${errors.guests ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition`}
                />
                {errors.guests && <p className="mt-1 text-sm text-red-600">{errors.guests}</p>}
              </div>
              
              {/* Room Type */}
              <div className="flex flex-col col-span-1">
                <label className="text-sm font-medium mb-1">Room Type *</label>
                <select
                  name="roomId"
                  value={form.roomId}
                  onChange={handleChange}
                  className={`bg-[#fdfaf6] border ${errors.roomId ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition`}
                >
                  <option value="">Select Room Type</option>
                  {roomOptions.map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </select>
                {errors.roomId && <p className="mt-1 text-sm text-red-600">{errors.roomId}</p>}
              </div>
              
              {/* Message */}
              <div className="flex flex-col col-span-1 md:col-span-2">
                <label className="text-sm font-medium mb-1">Special Requests</label>
                <textarea
                  name="specialRequests"
                  value={form.specialRequests}
                  onChange={handleChange}
                  rows="4"
                  className="bg-[#fdfaf6] border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  placeholder="Let us know any special requests or questions."
                ></textarea>
              </div>
              
              {/* Submit Button */}
              <div className="col-span-1 md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow transition flex items-center justify-center ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Submit Booking Inquiry"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Accommodations Preview */}
            <div className="bg-white border border-black/10 rounded-xl shadow p-6">
              <h3 className="text-2xl font-bold mb-4">Our Accommodations</h3>
              <div className="space-y-4">
                {roomOptions.map(room => (
                  <div key={room.id} className="flex items-center gap-4 bg-white rounded-lg p-2 shadow border border-gray-200">
                    <img 
                      src={`/src/assets/Gallery/IMG-20250626-WA000${room.id === 'family' ? '2' : room.id === 'king' ? '3' : '4'}.jpg`} 
                      alt={room.name} 
                      className="w-16 h-16 object-cover rounded-lg" 
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-base">{room.name}</div>
                      <div className="text-xs text-gray-600 flex items-center gap-1">
                        <FaStar className="text-yellow-500" /> Featured Room
                      </div>
                      <div className="text-sm text-gray-700">From {room.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white border border-black/10 rounded-xl shadow p-6">
              <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaPhoneAlt className="text-green-600" />
                  <span>+977-9851122519</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-green-600" />
                  <span>thewoodscharikot@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-green-600" />
                  <span>Charikot, Dolakha District, Nepal</span>
                </div>
              </div>
            </div>

            {/* Urgent Assistance */}
            <div className="bg-white border border-black/10 rounded-xl shadow p-6">
              <h4 className="text-lg font-semibold mb-3">Need Immediate Assistance?</h4>
              <p className="text-gray-600 mb-4">Call us directly for urgent inquiries or immediate booking assistance.</p>
              <a 
                href="tel:+9779851122519" 
                className="inline-block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
              >
                Call Now: +977-9851122519
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}