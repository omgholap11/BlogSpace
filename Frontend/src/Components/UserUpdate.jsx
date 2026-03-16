import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Image, Save, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { buildApiUrl } from "../api";

export default function UserUpdate() {
    const navigate = useNavigate();
    const location = useLocation();
    // Use state directly instead of useRef for component data
    const [userName, setUserName] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageURL, setProfileImageURL] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Load user details from location state when component mounts
    useEffect(() => {
        if (location.state && location.state.userDetails) {
            setUserName(location.state.userDetails.name || "");
            setProfileImageURL(location.state.userDetails.profileImageURL || "");
        }
    }, [location.state]);

    const removeImage = () => {
        setProfileImage(null);
        setProfileImageURL("");
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        console.log("file name ", file);
        if (file) {
            setProfileImage(file);
            setProfileImageURL(URL.createObjectURL(file));
        }
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setIsSubmitting(true);
        
        const formData = new FormData();
        formData.append("name", userName);
        
        // Only append image if a new one is selected
        if (profileImage) {
            formData.append("profileImage", profileImage);
        }
        
        console.log("Form data prepared");
        
        try {
            const response = await axios.put(
                buildApiUrl("/user/updateprofile"),
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data' // Important for file uploads
                    }
                }
            );
            
            console.log("Response from backend:", response.status);
            console.log(response.data);
            
            if (response.status === 200) {
                console.log("Navigation triggered to /userprofile");
                navigate("/userprofile", { replace: true });
            }
        } catch (error) {
            console.log("Error while updating user details!", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
  
    return (
        <div className="bg-black min-h-screen flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">Update Profile</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                        {/* Profile Image Upload - Left Side */}
                        <div className="flex flex-col items-center justify-center w-full md:w-1/2">
                            {profileImageURL ? (
                                <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-purple-500">
                                    <img 
                                        src={profileImageURL} 
                                        alt="Profile preview"
                                        className="w-full h-full object-cover" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 p-1 bg-black bg-opacity-70 rounded-full hover:bg-opacity-100 transition-all"
                                    >
                                        <X size={16} className="text-white" />
                                    </button>
                                </div>
                            ) : (
                                <label className="w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed border-purple-500 rounded-full hover:border-purple-400 cursor-pointer bg-gray-800 transition-all">
                                    <div className="flex flex-col items-center justify-center">
                                        <Camera className="w-12 h-12 text-purple-400 mb-2" />
                                        <p className="text-sm text-gray-400 text-center">Click to upload profile image</p>
                                    </div>
                                    <input 
                                        id="profile-image" 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handleImageSelect}
                                    />
                                </label>
                            )}
                        </div>
                        
                        {/* User Details - Right Side */}
                        <div className="flex flex-col justify-center w-full md:w-1/2">
                            <label className="block text-purple-400 text-xl font-medium mb-2">
                                Name
                            </label>
                            <input 
                                type="text" 
                                value={userName} 
                                onChange={(e) => setUserName(e.target.value)} 
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                    
                    {/* Update Button */}
                    <div className="flex justify-center">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium flex items-center justify-center transition-colors w-full md:w-auto disabled:bg-purple-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save size={18} className="mr-2" />
                                    Update Details
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}