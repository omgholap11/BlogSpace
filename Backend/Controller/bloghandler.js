import blog from "../Model/blog.js";
import comment from "../Model/comments.js";
import like from "../Model/like.js";
import User from "../Model/user.js"

export async function handlePostBlog(req,res){
    console.log("Request recieved!!");
    // console.log(req.body);
    // console.log(req.file);
    // console.log(req.user);
    const title = req.body.title;
    const body = req.body.body;             //here body is actually content of blog 
    const filename = req.file.filename;
    const userid = req.user._id;
    const newBlog = await blog.create({
        title : title,
        body : body,
        coverImageURL : filename,
        createdBy : userid
    })
    // console.log(newBlog);
    const blogs = await blog.find({});
    // console.log(blogs);
    return res.status(200).json({msg : "succeded"});
}

export async function handleGetBlog(req,res){
    //as we just want name of blogger so just populated fullname 
    const blogs = await blog.find({}).populate("createdBy","fullName");
    
    // console.log(blogs);
    return res.status(200).json(blogs);
} 


//blogs will have these though we dont store full name but using populate we acquire full name
// {
//     _id: "6620...",
//     title: "My First Blog",
//     body: "Some content...",
//     createdBy: {
//       _id: "661f...",
//       fullName: "Om Gholap" // 👈 This is populated!
// }


export async function handleDeleteBlog(req,res){
    const blogId = req.params.blogid;
    // console.log("Request to delete blog recieved for blog Id: ",blogId);
    const deleted = await blog.findByIdAndDelete(blogId);
    if(!deleted)
    {
        console.log("Blog not found!!");
        return res.status(404).json({msg : "Blog Not found!"})
    }
    // console.log("Deleted Blog: ",deleted);
    return res.status(200).json({msg : "Post deleted succcessfully!!"});
}

export async function handleUpdateBlog(req,res){
    const blogId = req.params.blogid;
    const blogDetails = req.body;
    let updated;
    if(!req.file)
    {
         updated = await blog.findByIdAndUpdate(blogId,{
            title : blogDetails.title,
            body : blogDetails.body
        });
    }
    else
    {
         updated = await blog.findByIdAndUpdate(blogId,{
            title : blogDetails.title,
            body : blogDetails.body,
            coverImageURL : req.file.filename,
        });
    }
    if(!updated)
    {
        console.log("Blog not found for updation!");
        return res.status(404).json({msg : "Blog not found in database for updation!"});
    }
    return res.status(200).json({msg : "Blog deleted Successfully!!"});
}

export async function handlePostComment(req,res)
{
    const userId = req.user._id;
    console.log("User id of user requested to comment: ",userId);
    const blogId = req.params.blogid;
    const content = req.body.content;
    // console.log({userId,  blogId , content});
    const newComment = await comment.create({
        createdBy : userId,
        blogId : blogId,
        content : content,
    })
    return res.status(200).json({msg : "Comment posted successfully!!" , _id : userId}); 
}

export async function handleGetAllComments(req,res){
    const blogId = req.params.blogid;
    const comments = await comment.find({blogId : blogId}).populate("createdBy");
    // console.log(comments);
    return res.status(200).json({comments});
}

export async function handlePostLike(req,res){
    console.log(req.user);
    const userId = req.user._id;
    console.log("User is of user requested to like: ",userId);
    const blogId = req.params.blogid;
    const check = await like.find({likedBy : userId , blogId : blogId})
    console.log(check);
    if(check.length > 0)
    {
        return res.status(201).json({msg : "Already Liked!"});
    }
    const newLike = await like.create({
        likedBy : userId,
        blogId : blogId,
    })
    if(!newLike)
    {
        console.log("Error at backend while adding like");
        return res.status(500).json({msg : "Error while liking!!"});
    }
    return res.status(200).json({msg : "Blog liked!!"});
}

export async function handlePostDislike(req,res){
    const userId = req.user._id;
    const blogId = req.params.blogid; 
    const removeLike = await like.deleteOne({
        likedBy : userId,
        blogId : blogId,
    })
    if(!removeLike)
    {
         console.log("Error at backend while removing like");
         return res.status(400).json({msg : "Error!!"});
    }
    return res.status(200).json({msg : "Error while disliking!!"});
}

export async function handleGetAllLikes(req,res){
    const blogId = req.params.blogid;
    const userId = req.user._id;
    const Likes = await like.find({blogId : blogId})
    const userLiked = await like.find({blogId:blogId , likedBy : userId});
    console.log(userLiked);
    let hasLiked = false;
    if(userLiked.length > 0)
    {
        hasLiked = true;
    }
    const totalLikes = Likes.length;
    console.log("Total likes: ",totalLikes);
    console.log(hasLiked);
    return res.status(200).json({totalLikes , hasLiked})
}