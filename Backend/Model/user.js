import {createHmac , randomBytes} from "crypto"
import mongoose from "mongoose"
import {createTokenForUser , validateToken} from "../Services/authentication.js"
const userSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true
    },
    salt : {
        type : String,
    },
    profileImageURL : {
        type : String,
        default : "defaultAvatar.jpg"
    },
    role : {
        type : "String",
        enum : ["USER","ADMIN"],
        default : "USER"
    }
},{timestamps :true});

//whenever we starts creating new user first of all this function will be run and will hash the user password
userSchema.pre("save",function(next){
    const user = this;  //pointing to current user
    if(!user.isModified("password"))
    {
        return next();
    }

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256",salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
})

userSchema.static("matchedUserAndGenerateToken",async function (email , password){
    const user = await this.findOne({email}).lean();      //it convert mongoose object to simple js object
    console.log(user);
    if(!user) 
    {
        return {token : null , msg : "Email Id Incorrect"}
    }

    const salt = user.salt;
    const hashedPassword = user.password;
    const UserProvidedHashedPassword = createHmac("sha256",salt).update(password).digest("hex");
    
    if(UserProvidedHashedPassword != hashedPassword)
    {
        return {token : null , msg : "Password Incorrect"};
    }

    const token = createTokenForUser(user);
    return {token : token , msg : "Sign In Succeeded"}; 
})

const User = mongoose.model("user",userSchema);

export default User;