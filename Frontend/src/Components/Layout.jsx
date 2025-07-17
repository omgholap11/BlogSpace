import { Outlet ,useLocation} from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import React from 'react'


function Layout(){
    return (
        <>
       <Navbar/>
        <Outlet/>
        <Footer/>
        </>
    )
}

export default Layout;