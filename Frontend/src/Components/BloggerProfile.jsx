import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Settings, LogOut, User, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../api';

export default function BloggerProfile() {
  const getBlogger = async () => {
    try {
      const response = await axios.get(buildApiUrl("/user/profile"),
        {
          withCredentials: true,
        }
      )
      console.log(response);
      console.log(response.data.blogs);
      console.log(response.data.user);
      setUser(response.data.user);
      setBlogs(response.data.blogs);
    }
    catch (error) {
      console.log("Error while getting user details.");
    }
  }

  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  useEffect(() => {
    getBlogger();
  }, []);

  const navigate = useNavigate();
  const navigateCreateBlog = () => {
    navigate("/postblog");
  }

  const navigateEditBlog = (blog) => {
    navigate("/editblog",{state : {blog}});
  }

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setDeletePopup(true);
  };

  const confirmDelete = async () => {
    // Here you would add the actual delete API call
    console.log("Deleting blog:", blogToDelete._id);
    try{
      const response = await axios.delete(buildApiUrl(`/blog/deleteblog/${blogToDelete._id}`),
        {
          withCredentials : true,
        }
      )
      console.log(response.status);
      console.log(response.data);
    }
    catch(error)
    {
      console.log("Error while deleting blog");
    }
    setDeletePopup(false);
    setBlogToDelete(null);
  };

  const cancelDelete = () => {
    setDeletePopup(false);
    setBlogToDelete(null);
  };

  if (user == null) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <main className="container mx-auto px-4 mt-10 pb-8"> 
        {/* Dashboard header with create button */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Your Blogs</h2>
          <button 
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md flex items-center transition-colors"
            onClick={navigateCreateBlog}
          >
            <Plus size={18} className="mr-2" />
            <span>Create New Blog</span>
          </button>
        </div>

        {/* Blog posts grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => (
            <BlogPost 
              key={blog._id} 
              blog={blog} 
              onDeleteClick={() => handleDeleteClick(blog)} 
              onEditClick={()=>{navigateEditBlog(blog)}}
            />
          ))}
        </div>
      </main>

      {/* Delete Confirmation Popup */}
      {deletePopup && blogToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"></div>
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full relative z-10 border border-purple-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Confirm Deletion</h3>
              <button 
                onClick={cancelDelete}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-2 text-gray-300">Are you sure you want to delete this blog?</p>
            <p className="mb-6 text-lg font-semibold text-purple-400">"{blogToDelete.title}"</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BlogPost({ blog, onDeleteClick ,onEditClick}) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-purple-900/30 shadow-md hover:shadow-purple-800/20 hover:shadow-lg transition-all">
      <div className="relative">
        <img 
          src={blog.coverImageURL} 
          alt={blog.title} 
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{blog.title}</h3>
        
        <div className="flex justify-between text-sm text-gray-400 mb-4">
          <span>{blog.createdAt}</span>
        </div>
        
        <div className="flex justify-between">
          <button className="flex items-center text-purple-400 hover:text-purple-300"
          onClick={onEditClick}>
            <Edit size={16} className="mr-1" />
            <span>Edit</span>
          </button>
          <button 
            onClick={onDeleteClick}
            className="flex items-center text-red-400 hover:text-red-300"
          >
            <Trash2 size={16} className="mr-1" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}