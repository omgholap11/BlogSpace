import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    likedBy:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    blogId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "blog"
    }
},{timestamps : true})

const like = mongoose.model("like",likeSchema);

export default like;