// import {Facebook, Twitter, Instagram, GitHub }  from 'lucide-react'
export default function Footer(){
    return (
      <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">BlogSpace</h3>
            <p className="text-gray-400 text-sm">Your go-to platform for insightful articles, tutorials, and stories that inspire and inform.</p>
          </div>
          
          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-purple-700">Home</a></li>
              <li><a href="#" className="hover:text-purple-700">Features</a></li>
              <li><a href="#" className="hover:text-purple-700">Pricing</a></li>
              <li><a href="#" className="hover:text-purple-700">Categories</a></li>
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-purple-700">Help Center</a></li>
              <li><a href="#" className="hover:text-purple-700">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-purple-700">Terms of Service</a></li>
              <li><a href="#" className="hover:text-purple-700">Contact Us</a></li>
            </ul>
          </div>
          
          {/* Column 4 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
            <p className="text-gray-400 text-sm mb-4">Stay updated with our latest articles and news.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-l-md w-full focus:outline-none text-gray-800 bg-gray-100"  
              />
              <button className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-r-md transition duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Social Media and Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} BlogSpace. All rights reserved.
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              {/* <Facebook size={20} /> */}
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              {/* <Twitter size={20} /> */}
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              {/* <Instagram size={20} /> */}
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              {/* <GitHub size={20} /> */}
            </a>
          </div>
        </div>
      </div>
    </footer>
    )
}