import React, { useState, useEffect } from "react";

const AMENITIES_OPTIONS = [
  "Free WiFi",
  "Mountain View",
  "Forest View",
  "Private Balcony",
  "Room Service",
  "TV",
  "Fireplace",
  "Safe",
  "Work Desk",
];

export default function RoomForm({ initialData = null, onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [maxGuest, setMaxGuest] = useState("");
  const [roomSize, setRoomSize] = useState("");
  const [featured, setFeatured] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setPrice(initialData.price || "");
      setMaxGuest(initialData.maxGuest || "");
      setRoomSize(initialData.roomSize || "");
      setFeatured(!!initialData.featured);
      setAmenities(initialData.amenities || []);
      setImagePreviews(initialData.images || []);
      setImages([]); // New images to upload if any
    } else {
      // reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setMaxGuest("");
      setRoomSize("");
      setFeatured(false);
      setAmenities([]);
      setImages([]);
      setImagePreviews([]);
    }
  }, [initialData]);

  const handleAmenityToggle = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    // Show previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!title || !description || !price || !maxGuest || !roomSize) {
      setError("Please fill all required fields.");
      return;
    }
    if (!initialData && images.length < 1) {
      setError("Please upload at least 1 image.");
      return;
    }
    if (amenities.length === 0) {
      setError("Select at least one amenity.");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("maxGuest", maxGuest);
    formData.append("roomSize", roomSize);
    formData.append("featured", featured);
    formData.append("amenities", JSON.stringify(amenities));
    images.forEach((img) => formData.append("images", img));
    onSubmit(formData, initialData?._id);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 space-y-6 animate-fade-in"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2 border-b pb-2">{initialData ? "Edit Room" : "Add New Room"}</h2>
      {error && <p className="text-red-600 font-semibold mb-2">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-1">Title *</label>
          <input
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            type="text"
            placeholder="Room title"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Room Size *</label>
          <input
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition"
            type="text"
            placeholder="e.g. 500 sq ft"
            value={roomSize}
            onChange={(e) => setRoomSize(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">Description *</label>
        <textarea
          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          placeholder="Describe the room, view, and features"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-1">Price (NPR) *</label>
          <input
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm transition"
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="e.g. 3000"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Max Guests *</label>
          <input
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm transition"
            type="number"
            min="1"
            value={maxGuest}
            onChange={(e) => setMaxGuest(e.target.value)}
            required
            placeholder="e.g. 4"
          />
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">Amenities *</label>
        <div className="flex flex-wrap gap-3 mt-1">
          {AMENITIES_OPTIONS.map((amenity) => (
            <label
              key={amenity}
              className={`inline-flex items-center px-3 py-2 rounded-xl border cursor-pointer transition-all duration-200 shadow-sm text-sm font-medium
                ${amenities.includes(amenity)
                  ? "bg-blue-100 border-blue-400 text-blue-900"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"}
              `}
            >
              <input
                type="checkbox"
                checked={amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="accent-blue-500 mr-2"
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="block font-semibold mb-1">Featured</label>
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-5 w-5 accent-green-500 rounded focus:ring-2 focus:ring-green-400"
        />
        <span className="text-gray-500 text-sm">Showcase this room on the homepage</span>
      </div>

      <div>
        <label className="block font-semibold mb-1">Images {initialData ? "(Upload to replace)" : "* (min 1)"}</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="border rounded-xl px-2 py-2 w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
        />
        <div className="mt-3 flex gap-3 overflow-x-auto">
          {imagePreviews.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Preview ${i + 1}`}
              className="h-24 w-24 object-cover rounded-2xl border border-gray-200 shadow-sm transition-transform hover:scale-105"
            />
          ))}
        </div>
      </div>

      <div className="flex space-x-4 pt-4 border-t mt-6">
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-green-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          {initialData ? "Update Room" : "Create Room"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
