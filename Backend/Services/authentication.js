import JWT from "jsonwebtoken";
import 'dotenv/config'

const secret = process.env.JWT_SECRET;

export function  createTokenForUser(user){
    const payload = {
        _id : user._id,
        email : user.email,
        name : user.fullName,
        profileImageURL : user.profileImageURL,
        role : user.role,
    }

    const token = JWT.sign(payload , secret);
    return token ;
}

export function validateToken(token){
    const payload = JWT.verify(token , secret);
    return payload;
}



