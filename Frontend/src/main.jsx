import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
// import App from './App.jsx'
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import Layout from "./Components/Layout.jsx";
import Signin from "./Components/Signin.jsx";
import Signup from "./Components/Signup.jsx";
import Homemain from "./Components/Homemain.jsx";
import BgImage from "./Components/BgImage.jsx";
import BlogPostForm from "./Components/BlogPostForm.jsx";
import Blog from "./Components/Blog.jsx";
import BloggerProfile from "./Components/BloggerProfile.jsx";
import BlogEditForm from "./Components/BlogEditForm.jsx";
import UserUpdate from "./Components/UserUpdate.jsx";
import { checkAuthLoader } from "./Components/authLoader.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <Layout />
    ),
    children: [
      {
        path : "",
        element : <Homemain/>
      },
      {
        path: "signin",
        element: <Signin />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "postblog",
        element: <BlogPostForm/>
      },
      {
        path: "readblog",
        element: <Blog/>
      },
      {
        path: "userprofile",
        element: <BloggerProfile/>
      },
      {
        path: "editblog",
        element: <BlogEditForm/>
      },
      {
        path : "userupdate",
        element : <UserUpdate/>,
        
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
