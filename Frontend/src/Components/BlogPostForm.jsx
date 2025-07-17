import { useState } from 'react';
import { Send, Image, X } from 'lucide-react';
import axios from 'axios';
export default function BlogPostForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState({ title: false, body: false });
  
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
    console.log(coverImage)
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
      // Here you would send the data to your backend
      console.log({ title, body, coverImage  });
      console.log(coverImage.name);
      // alert('Blog post created successfully!');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('body', body);
      formData.append('coverImage', coverImage);
      try{
        const response = await axios.post("http://localhost:5001/blog/postblog",
            formData,
            {
                headers : {
                    "Content-Type" : "multipart/form-data",
                },
                withCredentials: true         //by doing so we are actually sending cookies along with the request to backend
            },
        );
        console.log(response.status);
        console.log(response.data);
        if(response.status == 200)
        {
          alert('Blog post created successfully!');
        }
      }catch(error)
      {
        console.log("Error while posting blog" , error);
      }
      // Reset form
      setTitle('');
      setBody('');
      setCoverImage(null);
      setPreviewUrl('');
    }
  };

  return (
    <div className="max-w-screen-3xl mx-auto p-6 bg-black text-gray-100 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">Create New Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Cover Image (Optional)</label>
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
            className="w-full flex items-center justify-center px-6 py-3 bg-purple-800 hover:bg-purple-700 rounded-md text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <Send size={18} className="mr-2" />
            Publish Post
          </button>
        </div>
      </form>
    </div>
  );
}