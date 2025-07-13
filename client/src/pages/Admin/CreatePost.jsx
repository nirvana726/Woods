import React, { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import Navbar from "./Navbar";
import axios from "axios";
import { toast } from "react-toastify";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [hotelLocation, setHotelLocation] = useState("");
  const [description, setDescription] = useState("");
  const [facilities, setFacilities] = useState("");
  const [nearArea, setNearArea] = useState("");
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [images, setImages] = useState([]);
  const [guest, setGuest] = useState("1");
  const [isAvailable, setIsAvailable] = useState(false);
  const [price, setPrice] = useState("");

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/category/get-category`
      );
      setCategory(response.data.category);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      toast.warn("You can only upload a maximum of 3 images.");
      return;
    }
    
    // Validate image types
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error("Only JPG, PNG, and WEBP images are allowed");
      return;
    }
    
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert string inputs to arrays and trim whitespace
      const facilitiesArray = facilities.split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      const nearAreaArray = nearArea.split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      // Validate required fields
      const requiredFields = {
        title,
        hotelLocation,
        description,
        selectedCategory,
        guest,
        price
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (missingFields.length > 0) {
        return toast.error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      if (facilitiesArray.length === 0) {
        return toast.error("Please enter at least one facility");
      }

      if (nearAreaArray.length === 0) {
        return toast.error("Please enter at least one nearby area");
      }

      if (images.length !== 3) {
        return toast.error("Please upload exactly 3 images");
      }

      // Validate numbers
      const guestNumber = parseInt(guest);
      const priceNumber = parseFloat(price);

      if (isNaN(guestNumber) || guestNumber < 1 || guestNumber > 6) {
        return toast.error("Guest count must be between 1-6");
      }

      if (isNaN(priceNumber) || priceNumber < 100 || priceNumber > 5000) {
        return toast.error("Price must be between 100-5000");
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('hotelLocation', hotelLocation);
      formData.append('description', description);
      
      // Append each facility and nearby area individually
      facilitiesArray.forEach(facility => {
        formData.append('facilities', facility);
      });
      
      nearAreaArray.forEach(area => {
        formData.append('nearArea', area);
      });

      formData.append('category', selectedCategory);
      formData.append('guest', guestNumber);
      formData.append('isAvailable', isAvailable);
      formData.append('price', priceNumber);

      // Append each image
      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/post/create-post`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Add if authentication is required:
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      toast.success("Post created successfully!");
      
      // Reset form state
      setTitle("");
      setHotelLocation("");
      setDescription("");
      setFacilities("");
      setNearArea("");
      setSelectedCategory("");
      setImages([]);
      setGuest("1");
      setIsAvailable(false);
      setPrice("");

    } catch (error) {
      console.error("Error creating post:", error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         "Failed to create post. Please check your inputs.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex justify-between text-black">
      <div className="ml-[4rem]">
        <Navbar />
      </div>
      <div className="flex flex-col p-8 w-[81%]">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-[81%] p-3 border bg-white border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Hotel Location"
              value={hotelLocation}
              onChange={(e) => setHotelLocation(e.target.value)}
              className="w-[81%] bg-white p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-[81%] bg-white p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              rows="4"
              required
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Facilities (comma separated, e.g., WiFi, Swimming Pool, Parking)"
              value={facilities}
              onChange={(e) => setFacilities(e.target.value)}
              className="w-[81%] bg-white p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple facilities with commas</p>
          </div>

          <div>
            <input
              type="number"
              placeholder="Price (100-5000)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-[81%] bg-white p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              min="100"
              max="5000"
              required
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Nearby Areas (comma separated, e.g., Main Beach, City Center, Train Station)"
              value={nearArea}
              onChange={(e) => setNearArea(e.target.value)}
              className="w-[81%] bg-white p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple areas with commas</p>
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <select
              name="category"
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-[81%] bg-white text-black border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              required
            >
              <option value="">Select a category</option>
              {category?.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="guest" className="block text-gray-700 text-sm font-bold mb-2">
              Guests (1-6)
            </label>
            <select
              id="guest"
              value={guest}
              onChange={(e) => setGuest(e.target.value)}
              className="w-[81%] bg-white border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
              required
            >
              {[...Array(6)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="isAvailable" className="block text-gray-700 text-sm font-bold mb-2">
              Availability
            </label>
            <select
              id="isAvailable"
              value={isAvailable}
              onChange={(e) => setIsAvailable(e.target.value === "true")}
              className="w-[81%] bg-white border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>

          <div className="w-[81%] p-3 border border-gray-300 rounded mb-4">
            <label className="flex items-center cursor-pointer">
              <FaImage className="mr-2 text-gray-600" />
              <span>Upload Images (exactly 3 required)</span>
              <input
                type="file"
                accept="image/jpeg, image/png, image/webp"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <div className="flex space-x-4 mt-2">
              {images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {images.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {images.length}/3 images selected
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-[81%] bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-300"
          >
            Submit Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;