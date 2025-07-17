import { useState , useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import axios from "axios"
import {useNavigate} from "react-router-dom"
  
export default function HomeMain() {
    const [blogs,setBlogs] = useState([]);
    const fetchBlogs = async ()=>{
        try{
            const response = await axios.get("http://localhost:5001/blog/getblogs",
                {
                    withCredentials : true,
                });
            console.log(response);
            setBlogs(response.data);
            // console.log(blogs[0].body);
        }
        catch(error)
        {
            console.log("Error while fetching blogs: ",error);
        }
      }


    useEffect(()=>{
        fetchBlogs();
    },[]) 
  return (
    <div className="bg-black sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-purple-400 text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center">Our Blog</h1>
        
        {/* Responsive grid - 1 column on mobile, 2 columns on medium screens, 3 columns on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogs.map(blog => (
            <BlogCard  key = {blog._id} blog={blog} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BlogCard({ blog }) {
  const [isHovered, setIsHovered] = useState(false);
  
const navigate = useNavigate();
  const handleReadBlog = async (blog)=>{
   
    try {
      const response = await axios.get("http://localhost:5001/user/auth", { withCredentials: true });
      
      if (response.status === 200 && response.data) {
        console.log("User data:", response.data);
        
        const {user} = response.data;
        console.log("Blog clicked: ",blog);
        console.log("Blog clicked By user : ",user)
      navigate("/readblog",{state : {blog , user}});
        }
       else 
        {
            navigate("/login");
        }
        
        
      } catch (error) {
      console.log("Not authenticated", error);
    }
    
  }
  
  return (
    <div 
      className="bg-black border border-purple-700 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/30 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img 
          src={blog.coverImageURL} 
          alt={blog.title} 
          className="w-full h-48 object-cover"
        />
        <div className={`absolute inset-0 bg-purple-900/40 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>
      
      <div className="p-6">
        <h2 className="text-white text-xl font-bold mb-3 line-clamp-2">{blog.title}</h2>
        <p className="text-gray-400 mb-5 line-clamp-3">{blog.body}</p>
        
        <button className="flex items-center justify-center w-full py-2 px-4 bg-purple-800 hover:bg-purple-700 text-white rounded-md font-medium transition-colors group"
            onClick = {()=>{handleReadBlog(blog)}} >
          <span>Read Blog</span>
          <ArrowRight 
            size={16} 
            className="ml-2 transition-transform group-hover:translate-x-1" 
          />
        </button>
      </div>
    </div>
  );
}