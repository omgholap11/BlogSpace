import mongoose from "mongoose";

export function connectMongoDB(url){
    mongoose.connect(url).then(()=>{
        console.log("MongoDB connected successfully!!");
    })
    .catch((error)=>{
        console.log("Error while connecting database!!!",error);
    })
}

// export default {connnectMongoDB};