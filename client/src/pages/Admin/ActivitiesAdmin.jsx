import React, { useEffect, useState } from "react";
import {
  fetchActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} from "../../api/adminApi";
import ActivityForm from "../../components/admin/ActivityForm";
import { FaEdit, FaTrashAlt, FaPlus, FaSpinner, FaHiking } from 'react-icons/fa'; // Import relevant icons
import { toast } from 'react-toastify'; // Import toast for notifications

export default function ActivitiesAdmin() {
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false); // State to control form visibility

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await fetchActivities();
      setActivities(data);
    } catch (error) {
      console.error("Failed to load activities:", error);
      toast.error("Failed to load activities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData, id) => {
    setLoading(true); // Show loading during form submission
    try {
      if (id) {
        await updateActivity(id, formData);
        toast.success("Activity updated successfully!");
      } else {
        await createActivity(formData);
        toast.success("Activity created successfully!");
      }
      setIsFormVisible(false); // Hide form after submission
      setEditingActivity(null); // Clear editing state
      loadActivities(); // Reload data
    } catch (error) {
      console.error("Failed to save activity:", error);
      toast.error(error.response?.data?.message || 'Failed to save activity.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this activity? This action cannot be undone.")) {
      setLoading(true); // Show loading during deletion
      try {
        await deleteActivity(id);
        toast.success("Activity deleted successfully!");
        loadActivities(); // Reload data
      } catch (error) {
        console.error("Error deleting activity:", error);
        toast.error(error.response?.data?.message || 'Failed to delete activity.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditClick = (activity) => {
    setEditingActivity(activity);
    setIsFormVisible(true); // Show form when editing
  };

  const handleAddClick = () => {
    setEditingActivity(null); // Clear any previous editing state
    setIsFormVisible(true); // Show form for new activity
  };

  const handleCancelForm = () => {
    setEditingActivity(null);
    setIsFormVisible(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 flex items-center">
            <FaHiking className="mr-4 text-teal-600" /> Admin <span className="text-teal-600 ml-2">- Activities Management</span>
          </h1>
          <button
            onClick={handleAddClick}
            className="flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 text-lg font-medium"
          >
            <FaPlus className="mr-3" /> Add New Activity
          </button>
        </div>

        {/* Activity Form Section */}
        {isFormVisible && (
          <div className="mb-10 p-7 bg-gray-50 rounded-xl shadow-inner border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-3 border-gray-200">
              {editingActivity ? "Edit Activity" : "Create New Activity"}
            </h2>
            <ActivityForm
              key={editingActivity ? editingActivity._id : "new"} // Key helps re-render form for new/edit
              initialData={editingActivity}
              onSubmit={handleCreateOrUpdate}
              onCancel={handleCancelForm}
            />
          </div>
        )}

        {/* Activities List Section */}
        <h2 className="text-2xl font-bold text-gray-700 mb-6 mt-8">All Activities</h2>
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-gray-50 rounded-lg shadow-sm">
            <FaSpinner className="animate-spin text-6xl text-gray-400 mb-4" />
            <p className="text-gray-600 text-xl font-medium">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
            <FaHiking className="mx-auto text-6xl text-gray-400 mb-6" />
            <p className="text-gray-500 text-xl font-medium">No activities found. Click "Add New Activity" to get started!</p>
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
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Group Size
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
                {activities.map((activity) => (
                  <tr key={activity._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {activity.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {activity.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {activity.groupSize}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${activity.featured ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {activity.featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                      <button
                        onClick={() => handleEditClick(activity)}
                        className="text-blue-600 hover:text-blue-900 flex items-center px-3 py-1 border border-blue-300 rounded-md shadow-sm text-xs transition duration-150 hover:bg-blue-50"
                        title="Edit Activity"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(activity._id)}
                        className="text-red-600 hover:text-red-900 flex items-center px-3 py-1 border border-red-300 rounded-md shadow-sm text-xs transition duration-150 hover:bg-red-50"
                        title="Delete Activity"
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