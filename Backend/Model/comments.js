import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content:{
        type : String,
        required : true
    },
    createdBy:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    blogId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "blog"
    }
},{timestamps : true})

const comment = mongoose.model("comment",commentSchema);

export default comment;