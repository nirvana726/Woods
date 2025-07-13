import React, { useState, useEffect } from "react";

const categories = ["Cultural", "Events", "Nature", "Adventure"];

export default function ActivityForm({ initialData = null, onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [groupSize, setGroupSize] = useState("");
  const [icon, setIcon] = useState("");
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setLongDescription(initialData.longDescription || "");
      setCategory(initialData.category || categories[0]);
      setGroupSize(initialData.groupSize || "");
      setIcon(initialData.icon || "");
      setFeatured(!!initialData.featured);
      setImagePreview(initialData.image || null); // assume image URL string
      setImageFile(null);
    } else {
      // Reset
      setTitle("");
      setDescription("");
      setLongDescription("");
      setCategory(categories[0]);
      setGroupSize("");
      setIcon("");
      setFeatured(false);
      setImageFile(null);
      setImagePreview(null);
      setError("");
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(initialData?.image || null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!title || !description || !longDescription || !groupSize || !icon) {
      setError("Please fill all required fields.");
      return;
    }
    if (!initialData && !imageFile) {
      setError("Image is required for new activity.");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("longDescription", longDescription);
    formData.append("category", category);
    formData.append("groupSize", groupSize);
    formData.append("icon", icon);
    formData.append("featured", featured);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    onSubmit(formData, initialData?._id);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 space-y-6 animate-fade-in"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2 border-b pb-2">{initialData ? "Edit Activity" : "Add New Activity"}</h2>
      {error && <p className="text-red-600 font-semibold mb-2">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-1" htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition"
            required
            placeholder="Activity title"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="category">Category *</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition"
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor="description">Description *</label>
        <textarea
          id="description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition resize-none"
          required
          placeholder="Short description of the activity"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor="longDescription">Long Description *</label>
        <textarea
          id="longDescription"
          rows={4}
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition resize-none"
          required
          placeholder="Detailed information about the activity"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-1" htmlFor="groupSize">Group Size *</label>
          <input
            id="groupSize"
            type="number"
            min="1"
            value={groupSize}
            onChange={(e) => setGroupSize(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm transition"
            required
            placeholder="e.g. 10"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="icon">Icon *</label>
          <input
            id="icon"
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition"
            placeholder="Enter icon name or URL"
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="block font-semibold mb-1">Featured</label>
        <input
          type="checkbox"
          checked={featured}
          onChange={() => setFeatured(!featured)}
          className="h-5 w-5 accent-green-500 rounded focus:ring-2 focus:ring-green-400"
        />
        <span className="text-gray-500 text-sm">Showcase this activity on the homepage</span>
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor="imageFile">Image {initialData ? "(select to replace)" : "*"}</label>
        <input
          id="imageFile"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border rounded-xl px-2 py-2 w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
          required={!initialData}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-3 h-32 w-32 object-cover rounded-2xl border border-gray-200 shadow-sm transition-transform hover:scale-105"
          />
        )}
      </div>

      <div className="flex space-x-4 pt-4 border-t mt-6">
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-green-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          {initialData ? "Update Activity" : "Add Activity"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
