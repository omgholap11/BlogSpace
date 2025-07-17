import User from "../Model/user.js"
import blog from "../Model/blog.js";
import {createHmac } from "crypto"
import { createTokenForUser, validateToken } from "../Services/authentication.js";


export const handleUserSignUp = async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log({ fullName, email, password });
  if (!fullName || !email || !password) {
    return res.status(400).json({ msg: "Invalid fields Entered!!!" });
  }

  const users = await User.find({});
  console.log(users);
  await User.create({      //if same names as that of schema are there it can assign them directly.........
    fullName,
    email,
    password,
  })
  
  console.log("sign up success");
  return res.status(200).json({msg : "signup successful!!"});
};


export const handleUserSignIn = async (req,res)=>{
  const {email , password} = req.body;
  if (!email || !password) {
    return res.status(404).json({ msg: "Invalid fields Entered!!!" });
  }

  const user = await User.matchedUserAndGenerateToken(email , password);

  // console.log("user:  ",user);

  if(user.token == null)
  {
    return res.status(400).json({msg : user.msg});
  }

  // console.log("Token of user: ",user.token);
  const token = user.token ;
  return res.status(200).cookie('token' , token , { httpOnly: true , secure : false , sameSite : 'Lax' , maxAge: 2 * 60 * 60 * 1000,} ).json({msg : "Sign In succedded"});
}

export function handleGetAuthenticationStatus(req,res){
    const token = req.cookies.token;
    console.log("Token at authentication status: ",token);
    if(!token)
    {
        return res.status(200).json({user : null , msg : "User is not Authenticated!"});
    }
    const user = validateToken(token);
    console.log("User : ",user);
    return res.status(200).json({user});
}

export function handleUserLogOut(req,res){
  const token = req.cookies.token;
  if(!token)
  {
    return res.status(200).json({msg : "User was already logged out"});
  }

  res.clearCookie("token",{
    httpOnly : true,
    secure : false,
    sameSite : "Lax"
  })

  return res.status(200).json({msg : "User logged out successfully!"});
}


export async function handleGetUserProfile(req,res)
{
  console.log("Request Recieved at get user details: ")
    const user = req.user;
    const userId = user._id;
    const blogs = await blog.find({createdBy : userId});
    // console.log(blogs);
    // console.log(user);
    return res.status(200).json({user , blogs});
}

export async function handleUpdateUserProfile(req,res){
  const userid = req.user._id;
  const newuser = req.body;
  console.log("Request to update user details recieved>> ",newuser);
  let updated;
  if(req.file)
  {
      updated = await User.findByIdAndUpdate(userid,{
      fullName : newuser.name,
      profileImageURL : req.file.filename,
    },{new : true});
  }
  else
  {
    updated = await User.findByIdAndUpdate(userid,{
      fullName : newuser.name
  },{new : true});
  }
  if(!updated)
  {
    return res.status(404).json({msg : "user Not found!"});
  }

  //recreating token here as details are updated............
  console.log("Updated user details: ",updated)
  const token = createTokenForUser(updated);
  console.log("Updated Token",token);
  return res.status(200).cookie('token' , token , { httpOnly: true , secure : false , sameSite : 'Lax' , maxAge: 2 * 60 * 60 * 1000,} ).json({msg : "UserDetails Updated successfully!!"});
}



// export default {handleUserSignUp};