import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, Clock, Heart, HeartOff, MessageCircle, Send } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Blog() {
  const location = useLocation();
  const navigate = useNavigate();
  const { blog , user} = location.state || {};
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(true);
  // const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [state,setState] = useState(false);

  console.log("BLOG at single blog page: ", blog);

  useEffect(() => {
    // Fetch comments if not already included in blog data
    const fetchComments = async () => {
        try {
          const response = await axios.get(`http://localhost:5001/blog/getcomments/${blog._id}`, {
            withCredentials: true,
          });
          setComments(response.data.comments);
          setShowComments(true);
          console.log("get comments: ",response.data)
        } catch (error) {
          console.log("Error fetching comments:", error);
        }
    };
    // checkAuth();
    console.log("Current user is: ", user);
    if(user)
    {
      fetchComments();
    }
  }, [blog?._id, blog?.likes]);

  useEffect(()=>{
    const fetchLikes = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/blog/getlikes/${blog._id}`, {
          withCredentials: true,
        });
        const totalLikes = response.data.totalLikes;
        const hasLiked = response.data.hasLiked;
        setLikeCount(totalLikes);
        setLiked(hasLiked);
        console.log(hasLiked)
      } catch (error) {
        console.log("Error fetching comments:", error);
      }
  };    
      fetchLikes();
  },[])

  const handleLike = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate("/signin", { state: { redirectTo: location.pathname, blog } });
      return;
    }

    let likeStatus = `postlike`;
    if(liked == true)
    {
       likeStatus = `postdislike`;
    }
    console.log(likeStatus);
    try {
      const response = await axios.post(`http://localhost:5001/blog/${likeStatus}/${blog._id}`,
        {},
        { withCredentials: true }
      );
      console.log(response.data);
      setLiked(!liked);
      if(liked == true)
      {
          setLikeCount((likeCount)=>{likeCount + 1});
      }
      else
      {
        setLikeCount((likeCount)=>{likeCount - 1});
      }
    } catch (error) {
      console.log("Error liking blog:", error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    if (!user) {
      // Redirect to login if not authenticated
      navigate("/signin", { state: { redirectTo: location.pathname, blog } });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `http://localhost:5001/blog/postcomment/${blog._id}`,
        { content: newComment
         },
        { withCredentials: true }
      );
      console.log(response.data);
      // Add new comment to the list
      console.log(response.data);
      console.log("New Comment User: ",user);
      const newCommentObj = {
        _id: response.data._id || Date.now(),
        content: newComment,
        createdAt: new Date().toISOString(),
        createdBy: {
          _id: user._id,
          fullName: user.name,
          profileImageURL: user.profileImageURL
        }
      };
      
      setComments([...comments, newCommentObj]);
      setNewComment('');
      setShowComments(true);
    } catch (error) {
      console.log("Error posting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const blogDate = blog?.createdAt ? formatDate(blog.createdAt) : "11 January 2025";

  return (
    <div className="bg-black min-h-screen p-4 text-white">
      {/* Header with back button */}
      <header className="fixed  bg-black bg-opacity-80 backdrop-blur-sm z-10 px-10 py-4">
        <div className="container mx-auto">
          <a 
            href="http://localhost:5173" 
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to all blogs</span>
          </a>
        </div>
      </header>

      <article className="container mx-auto px-4 pb-16 pt-16 max-w-4xl">
        {/* Hero image */}
        <div className="rounded-lg overflow-hidden mb-8 shadow-xl shadow-purple-900/20">
          <img 
            src={blog?.coverImageURL} 
            alt={blog?.title} 
            className="w-full h-80 md:h-96 object-cover"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
          {blog?.title}
        </h1>

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-4 mb-8 text-white text-xl">
          <div className="flex items-center">
            <Calendar size={20} className="mr-2 text-purple-400" />
            <span>{blogDate}</span>
          </div>
          <div className="flex items-center">
            <User size={20} className="mr-2 text-purple-400" />
            <span>{blog?.createdBy?.fullName}</span>
          </div>
          
          {/* Like button */}
          <div className="flex items-center ml-auto">
            <button 
              onClick={handleLike}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            >
              {liked ? (
                <Heart size={20} className="text-purple-500 fill-purple-500" />
              ) : (
                <Heart size={20} className="text-purple-400" />
              )}
              <span>{likeCount}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-invert prose-purple max-w-none">
          <p className="mb-6 text-gray-300 leading-relaxed">
            {blog?.body}
          </p>
        </div>

        {/* Comments Section */}
        <div className="mt-12 pt-8 border-t border-purple-900/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-purple-400">
              Comments ({comments.length})
            </h3>
            {comments.length > 0 && (
              <button 
                onClick={() => setShowComments(!showComments)}
                className="text-purple-400 hover:text-purple-300"
              >
                {showComments ? 'Hide Comments' : 'View Comments'}
              </button>
            )}
          </div>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-900 flex-shrink-0 overflow-hidden">
                {user?.profileImageURL ? (
                  <img 
                    src={user.profileImageURL} 
                    alt={user.fullName || user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={16} />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none text-white resize-none"
                  rows={2}
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button 
                    type="submit"
                    disabled={isLoading || !newComment.trim()}
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-md transition-colors flex items-center disabled:bg-gray-700 disabled:text-gray-400"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Send size={16} className="mr-2" />
                    )}
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          {showComments && comments.length > 0 && (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-900 flex-shrink-0 overflow-hidden">
                    {comment.createdBy.profileImageURL ? (
                      <img 
                        src={comment.createdBy.profileImageURL} 
                        alt={comment.createdBy.fullName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={16} />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-purple-300">
                        {comment.createdBy.fullName || "Anonymous"}
                      </h4>
                      <span className="text-xs text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-300">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Share */}
        <div className="mt-16 pt-8 border-t border-purple-900/30">
          <h3 className="text-xl font-bold mb-4 text-purple-400">Share this post</h3>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-purple-800 hover:bg-purple-700 rounded-md transition-colors">
              Twitter
            </button>
            <button className="px-4 py-2 bg-purple-800 hover:bg-purple-700 rounded-md transition-colors">
              Facebook
            </button>
            <button className="px-4 py-2 bg-purple-800 hover:bg-purple-700 rounded-md transition-colors">
              LinkedIn
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}