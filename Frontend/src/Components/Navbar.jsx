import { useEffect, useState } from 'react';
import { Menu, User,LogOut , Settings , ChevronDown,ChevronUp, X } from 'lucide-react';
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import { buildApiUrl } from "../api";

export default function Navbar() {
  const location = useLocation();
  const icons = {
    ChevronDown,
    ChevronUp
  }
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpenMore, setIsDropdownOpenMore] = useState(false);
  const [isDropdownOpenProfile, setIsDropdownOpenProfile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  
 const showNavbar1 = (!(location.pathname == "/userprofile" || location.pathname == "/editblog" || location.pathname == "/postblog" || location.pathname == "/userupdate"))

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [moreArrowDown , setmoreArrowDown] = useState("ChevronDown");
  const [profileArrowDown , setprofileArrowDown] = useState("ChevronDown");
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();
  const IconComponentMore = icons[moreArrowDown];
  const IconComponentProfile = icons[profileArrowDown];

  const checkAuthentication = async () => {
    try {
      const response = await axios.get(buildApiUrl("/user/auth"), { withCredentials: true });
      if (response.status === 200 && response.data.user) {
        setUserDetails(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log("Error while fetching cookie details!", error);
    }
  };

  const handleUserLogOut = async ()=>{
    try{
      const response = await axios.get(buildApiUrl("/user/logout"),
        {
          withCredentials : true
        });
        console.log(response.data);
        setIsAuthenticated(false);
        setUserDetails({});
        navigate("/");
    }
    catch(error){
      console.log("Error while loging out user!!",error);
    }
  }

  useEffect(() => {
    checkAuthentication();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdownMore = () => {
    if(moreArrowDown == "ChevronDown")
    {
      setmoreArrowDown("ChevronUp")
    }
    else
    {
      setmoreArrowDown("ChevronDown")
    }
    setIsDropdownOpenMore(!isDropdownOpenMore);
  };
  const toggleDropdownProfile = () => {
    if(profileArrowDown == "ChevronDown")
      {
        setprofileArrowDown("ChevronUp")
      }
      else
      {
        setprofileArrowDown("ChevronDown")
      }
    setIsDropdownOpenProfile(!isDropdownOpenProfile);
  };

  const navigateSignin = () => {
    navigate("/signin");
  };

  const navigateProfile = ()=>{
    navigate("/userprofile");
  }

  const navigateUpdateProfile = ()=>{
    console.log("userdetails: ",userDetails);
        navigate("/userupdate",{state : {userDetails}});
  }

  

  return (
    <div className="flex flex-col h-20 bg-black text-white">
       {showNavbar1 ? (
     <header className="fixed z-50 top-4 left-1/2 transform -translate-x-1/2 w-3/5 bg-black border border-gray-500 rounded-2xl shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="font-bold text-3xl text-purple-700">BlogSpace</a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-6">
                <a href="/" className="hover:text-purple-700 font-medium">Home</a>
                <a href="#" className="hover:text-purple-700 font-medium">Features</a>
                <a href="#" className="hover:text-purple-700 font-medium">Pricing</a>

                {/* Dropdown */}
                <div className="relative">
                  <button onClick={toggleDropdownMore} className="flex items-center hover:text-purple-700 font-medium focus:outline-none">
                    More
                    <IconComponentMore className="ml-1 h-4 w-4" />
                  </button>

                  {isDropdownOpenMore && (
                    <div className="absolute right-0 mt-2 w-48 bg-black rounded-md shadow-lg py-1 z-10">
                      <a href="#" className="block px-4 py-2 text-sm hover:bg-purple-700">Categories</a>
                      <a href="#" className="block px-4 py-2 text-sm hover:bg-purple-700">Popular Posts</a>
                      <a href="#" className="block px-4 py-2 text-sm hover:bg-purple-700">About Us</a>
                      <a href="#" className="block px-4 py-2 text-sm hover:bg-purple-700">Contact</a>
                    </div>
                  )}
                </div>

                {!isAuthenticated ? (
                  <button onClick={navigateSignin} className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition duration-300">
                    Sign In
                  </button>
                ) : (
                  <div className="relative">
                    <button onClick={toggleDropdownProfile} className="flex items-center space-x-2 focus:outline-none">
                      <img src={`/${userDetails.profileImageURL}`} alt="Profile" className="h-8 w-8 rounded-full border-2 border-purple-700" />
                      <IconComponentProfile className="w-4 h-4" />
                    </button>

                    {isDropdownOpenProfile && (
                      <div className="absolute right-0 mt-2 w-40 bg-black rounded-md shadow-lg py-1 z-20">
                        <p className="block px-4 py-2 text-sm text-white">{userDetails.name}</p>
                        <button onClick = {navigateProfile} className="block px-4 py-2 text-sm hover:bg-purple-700">My Profile</button>
                        <button onClick={handleUserLogOut} className="w-full text-left px-4 py-2 text-sm hover:bg-purple-700">Logout</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md hover:text-purple-700 focus:outline-none">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#" className="block px-3 py-2 text-base font-medium hover:text-purple-700">Home</a>
              <a href="#" className="block px-3 py-2 text-base font-medium hover:text-purple-700">Features</a>
              <a href="#" className="block px-3 py-2 text-base font-medium hover:text-purple-700">Pricing</a>

              {/* Mobile Dropdown */}
              <button onClick={toggleDropdownMore} className="flex items-center w-full px-3 py-2 text-base font-medium hover:text-purple-700">
                More
                <IconComponentMore className="ml-1 h-4 w-4" />
              </button>

              {isDropdownOpenMore && (
                <div className="pl-4 space-y-1">
                  <a href="#" className="block px-3 py-2 text-base font-medium hover:text-purple-700">Categories</a>
                  <a href="#" className="block px-3 py-2 text-base font-medium hover:text-purple-700">Popular Posts</a>
                  <a href="#" className="block px-3 py-2 text-base font-medium hover:text-purple-700">About Us</a>
                  <a href="#" className="block px-3 py-2 text-base font-medium hover:text-purple-700">Contact</a>
                </div>
              )}

              {!isAuthenticated ? (
                <button onClick={navigateSignin} className="w-full mt-2 bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-900 transition duration-300">
                  Sign In
                </button>
              ) : (
                <div className="mt-2 w-full bg-black rounded-md shadow-lg">
                  <button onClick={toggleDropdownProfile} className="flex items-center px-4 py-2">
                    <img src={`/${userDetails.profileImageURL}`} className="h-8 w-8 rounded-full mr-2" />
                    <IconComponentProfile className="w-4 h-4" />
                    <span className="pl-5 text-whitev text-sm">{userDetails.name}</span>
                  </button>
                  {isDropdownOpenProfile && (
                      <div className="pl-4 space-y-1">
                      <button onClick = {navigateProfile} className="block px-3 py-2 text-base font-medium hover:text-purple-700">My Profile</button>
                      <button onClick={handleUserLogOut} className="block px-3 py-2 text-base font-medium hover:text-purple-700">Log Out</button>
                    </div>
                    )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>
       ) : (
        <header className="fixed z-50 top-4 left-1/2 transform -translate-x-1/2 w-3/5 bg-black border border-gray-500 rounded-2xl shadow-lg">
        <div className="px-4 py-3 flex justify-between items-center">
          <a href='/' className="font-bold text-3xl text-purple-700">
            Blogger Dashboard
          </a>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 focus:outline-none"
            >
              <div className="flex flex-col items-end">
                <span className="font-medium">{userDetails.name}</span>
                <span className="text-sm text-gray-400">{userDetails.role}</span>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500">
                <img src={userDetails.profileImageURL} alt={userDetails.name} className="w-full h-full object-cover" />
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-purple-800">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-purple-900/40 flex items-center"
                onClick={navigateUpdateProfile} >
                  <User size={16} className="mr-2 text-purple-400" />
                  <span>Update Profile</span>
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-purple-900/40 flex items-center">
                  <Settings size={16} className="mr-2 text-purple-400" />
                  <span>Account Settings</span>
                </button>
                <div className="border-t border-gray-700 my-1"></div>
                <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 flex items-center" onClick={handleUserLogOut}>
                  <LogOut size={16} className="mr-2" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>)}
    </div>
  );
}
