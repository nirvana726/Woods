import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaUpload, FaImage, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function GalleryManagement() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/gallery`);
      setImages(response.data.images || response.data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast.error('Failed to load gallery images');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      toast.warn('Maximum 10 images at once');
      return;
    }
    
    setSelectedFiles(files);
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) {
      toast.warn('Please select at least one image');
      return;
    }

    setUploading(true);
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/gallery`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      toast.success(`${response.data.length} image(s) uploaded successfully`);
      fetchGalleryImages();
      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/gallery/${id}`);
      setImages(images.filter(img => img._id !== id));
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error(error.response?.data?.message || 'Failed to delete image');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Gallery Management</h1>
        
        {/* Upload Section */}
        <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="flex flex-col items-center justify-center">
            <FaImage className="text-4xl text-gray-400 mb-4" />
            <label className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
              <span>Select Images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">
              {selectedFiles.length > 0 
                ? `${selectedFiles.length} image(s) selected` 
                : 'JPG, PNG, WEBP (Max 10MB each)'}
            </p>
            
            {/* Preview Selected Images */}
            {previewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white text-sm font-medium">
                        {selectedFiles[index].name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {selectedFiles.length > 0 && (
              <button
                onClick={uploadImages}
                disabled={uploading}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50 flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload />
                    Upload Images
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Gallery Images */}
        <h2 className="text-xl font-semibold mb-4">Current Gallery Images ({images.length})</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-4xl text-gray-400" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <FaImage className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500">No images in gallery yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image._id} className="relative group">
                <img
                  src={image.url} // Use Cloudinary URL directly
                  alt={`Gallery Image ${image.filename}`}
                  className="w-full h-48 object-cover rounded-lg shadow"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => deleteImage(image._id)}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200"
                    title="Delete image"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}