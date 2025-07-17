import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    body : {
        type : String,
        required : true
    },
    coverImageURL : {
        type : String,
        required : false
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
},{timestamps : true})

const blog = mongoose.model("blog",blogSchema);

export default blog;