import React from "react";
import { FaUser, FaEnvelope, FaIdBadge, FaPhoneAlt, FaMapMarkerAlt, FaCalendarAlt, FaShieldAlt, FaCrown } from "react-icons/fa";
import { useAuth } from "../../context/UserContext";

const Details = () => {
  const [auth] = useAuth();

  const userInfo = {
    name: auth?.user?.name || "N/A",
    email: auth?.user?.email || "N/A",
    role: auth?.user?.role || "Administrator",
    phone: auth?.user?.phone || "+977-9851122519",
    address: auth?.user?.address || "Charikot, Dolakha District, Nepal",
    createdAt: auth?.user?.createdAt ? new Date(auth.user.createdAt).toLocaleDateString() : "N/A",
  };

  const stats = [
    { label: "Total Bookings", value: "156", change: "+12%", changeType: "positive" },
    { label: "Active Rooms", value: "6", change: "+2", changeType: "positive" },
    { label: "Pending Messages", value: "8", change: "-3", changeType: "negative" },
    { label: "Revenue (Monthly)", value: "Rs 90000", change: "+8.2%", changeType: "positive" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
          <FaCrown className="text-white text-2xl" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
          Welcome back, {userInfo.name}!
        </h2>
        <p className="text-gray-600">Here's what's happening with your resort today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`text-sm font-semibold ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Section */}
      {auth?.user ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
              <FaUser className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Admin Profile</h3>
              <p className="text-gray-600">Your account information and settings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50/50 rounded-2xl">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <FaUser className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{userInfo.name}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50/50 rounded-2xl">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <FaEnvelope className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="text-lg font-semibold text-gray-900">{userInfo.email}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50/50 rounded-2xl">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <FaPhoneAlt className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="text-lg font-semibold text-gray-900">{userInfo.phone}</p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50/50 rounded-2xl">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                  <FaShieldAlt className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p className="text-lg font-semibold text-gray-900">{userInfo.role}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50/50 rounded-2xl">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                  <FaMapMarkerAlt className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-lg font-semibold text-gray-900">{userInfo.address}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50/50 rounded-2xl">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center mr-4">
                  <FaCalendarAlt className="text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p className="text-lg font-semibold text-gray-900">{userInfo.createdAt}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">User data not available</h3>
          <p className="text-gray-600">Please ensure you are logged in to view your profile.</p>
        </div>
      )}
    </div>
  );
};

export default Details;