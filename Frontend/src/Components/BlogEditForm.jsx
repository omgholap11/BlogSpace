import { useState, useEffect } from 'react';
import { Send, Image, X } from 'lucide-react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../api';

export default function BlogEditForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { blog } = location.state || {};
  
  // Check if blog exists, redirect if not
  useEffect(() => {
    if (!blog) {
      navigate('/userprofile'); // Redirect to profile page if no blog data
      return;
    }
  }, [blog, navigate]);

  const [title, setTitle] = useState(blog?.title || '');
  const [body, setBody] = useState(blog?.body || '');
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(blog?.coverImageURL || '');
  const [error, setError] = useState({ title: false, body: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setCoverImage(null);
    setPreviewUrl('');
  };

  const validateForm = () => {
    const newError = {
      title: !title.trim(),
      body: !body.trim()
    };
    setError(newError);
    return !newError.title && !newError.body;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', body);
        
        // Only append coverImage if a new one was selected
        if (coverImage) {
          formData.append('coverImage', coverImage);
        }
        
        const response = await axios.put(
          buildApiUrl(`/blog/updateblog/${blog._id}`),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true
          }
        );
        
        if (response.status === 200) {
        //   alert('Blog updated successfully!');
          navigate('/userprofile'); // Redirect back to profile after successful update
        }
      } catch (error) {
        console.log("Error while updating blog", error);
        alert('Failed to update blog. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // If blog data isn't available yet, show loading
  if (!blog) {
    return <div className="flex justify-center items-center h-screen bg-black text-white">Loading...</div>;
  }

  return (
    <div className="max-w-screen-3xl mx-auto p-6 bg-black text-gray-100 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">Edit Blog Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Cover Image</label>
          <div className="mt-1 flex items-center">
            {previewUrl ? (
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-900">
                <img 
                  src={previewUrl} 
                  alt="Cover preview"
                  className="w-full h-full object-cover" 
                />
                <button 
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-black bg-opacity-70 rounded-full hover:bg-opacity-100 transition-all"
                  aria-label="Remove image"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            ) : (
              <label className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg hover:border-gray-500 cursor-pointer bg-gray-900 bg-opacity-50 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Image className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-400">Click to upload cover image</p>
                </div>
                <input 
                  id="cover-image" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageSelect}
                />
              </label>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {coverImage ? "New image selected" : previewUrl ? "Using existing image" : "No image selected"}
          </p>
        </div>

        {/* Title Field */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-3 bg-gray-900 border ${error.title ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
            placeholder="Enter your blog title"
          />
          {error.title && (
            <p className="text-red-500 text-xs mt-1">Title is required</p>
          )}
        </div>

        {/* Body Field */}
        <div className="space-y-2">
          <label htmlFor="body" className="block text-sm font-medium text-gray-300">
            Body <span className="text-red-500">*</span>
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            className={`w-full px-4 py-3 bg-gray-900 border ${error.body ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
            placeholder="Write your blog content here..."
          />
          {error.body && (
            <p className="text-red-500 text-xs mt-1">Blog content is required</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center px-6 py-3 ${isSubmitting ? 'bg-purple-900 cursor-not-allowed' : 'bg-purple-800 hover:bg-purple-700'} rounded-md text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
          >
            <Send size={18} className="mr-2" />
            {isSubmitting ? 'Updating...' : 'Update Post'}
          </button>
        </div>
      </form>
    </div>
  );
}