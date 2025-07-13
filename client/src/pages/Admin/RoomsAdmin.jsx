import React, { useEffect, useState } from "react";
import {
  fetchRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../../api/adminApi";
import RoomForm from "../../components/admin/RoomForm";
import { FaEdit, FaTrashAlt, FaPlus, FaSpinner, FaBed } from 'react-icons/fa'; // Import icons
import { toast } from 'react-toastify'; // Import toast for notifications

export default function RoomsAdmin() {
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false); // State to control form visibility

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const data = await fetchRooms();
      setRooms(data);
    } catch (error) {
      console.error("Failed to load rooms:", error);
      toast.error("Failed to load rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData, id) => {
    setLoading(true); // Show loading during form submission
    try {
      if (id) {
        await updateRoom(id, formData);
        toast.success("Room updated successfully!");
      } else {
        await createRoom(formData);
        toast.success("Room created successfully!");
      }
      setIsFormVisible(false); // Hide form after submission
      setEditingRoom(null); // Clear editing state
      loadRooms(); // Reload data
    } catch (error) {
      console.error("Failed to save room:", error);
      toast.error(error.response?.data?.message || 'Failed to save room.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
      setLoading(true); // Show loading during deletion
      try {
        await deleteRoom(id);
        toast.success("Room deleted successfully!");
        loadRooms(); // Reload data
      } catch (error) {
        console.error("Error deleting room:", error);
        toast.error(error.response?.data?.message || 'Failed to delete room.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditClick = (room) => {
    setEditingRoom(room);
    setIsFormVisible(true); // Show form when editing
  };

  const handleAddClick = () => {
    setEditingRoom(null); // Clear any previous editing state
    setIsFormVisible(true); // Show form for new room
  };

  const handleCancelForm = () => {
    setEditingRoom(null);
    setIsFormVisible(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 flex items-center">
            <FaBed className="mr-4 text-teal-600" /> Admin <span className="text-teal-600 ml-2">- Rooms Management</span>
          </h1>
          <button
            onClick={handleAddClick}
            className="flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 text-lg font-medium"
          >
            <FaPlus className="mr-3" /> Add New Room
          </button>
        </div>

        {/* Room Form Section */}
        {isFormVisible && (
          <div className="mb-10 p-7 bg-gray-50 rounded-xl shadow-inner border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-3 border-gray-200">
              {editingRoom ? "Edit Room" : "Create New Room"}
            </h2>
            <RoomForm
              key={editingRoom ? editingRoom._id : "new"} // Key helps re-render form for new/edit
              initialData={editingRoom}
              onSubmit={handleCreateOrUpdate}
              onCancel={handleCancelForm}
            />
          </div>
        )}

        {/* Rooms List Section */}
        <h2 className="text-2xl font-bold text-gray-700 mb-6 mt-8">All Rooms</h2>
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-gray-50 rounded-lg shadow-sm">
            <FaSpinner className="animate-spin text-6xl text-gray-400 mb-4" />
            <p className="text-gray-600 text-xl font-medium">Loading rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
            <FaBed className="mx-auto text-6xl text-gray-400 mb-6" />
            <p className="text-gray-500 text-xl font-medium">No rooms found. Click "Add New Room" to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Max Guests
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Room Size
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Featured
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {room.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      ${room.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {room.maxGuest}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {room.roomSize} sqft
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${room.featured ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {room.featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                      <button
                        onClick={() => handleEditClick(room)}
                        className="text-blue-600 hover:text-blue-900 flex items-center px-3 py-1 border border-blue-300 rounded-md shadow-sm text-xs transition duration-150 hover:bg-blue-50"
                        title="Edit Room"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(room._id)}
                        className="text-red-600 hover:text-red-900 flex items-center px-3 py-1 border border-red-300 rounded-md shadow-sm text-xs transition duration-150 hover:bg-red-50"
                        title="Delete Room"
                      >
                        <FaTrashAlt className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}