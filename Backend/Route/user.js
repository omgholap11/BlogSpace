import {Router} from 'express'
import {handleUserSignUp , handleUserSignIn , handleGetAuthenticationStatus, handleUserLogOut , handleGetUserProfile , handleUpdateUserProfile} from "../Controller/userHandlers.js"
import { ImageParse } from '../Middleware/ImageParsing.js';
const router = Router();
const upload = ImageParse();

router.post("/signup",handleUserSignUp)

router.post("/signin",handleUserSignIn)

router.get("/auth",handleGetAuthenticationStatus)

router.get("/logout",handleUserLogOut)

router.get("/profile",handleGetUserProfile)

router.put("/updateprofile",upload.single("profileImage") ,handleUpdateUserProfile)

export default router;