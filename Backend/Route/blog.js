import express from "express";
const router = express.Router();
import {handleGetBlog, handlePostBlog , handleDeleteBlog , handleUpdateBlog , handlePostComment , handleGetAllComments , handlePostLike , handleGetAllLikes , handlePostDislike} from "../Controller/bloghandler.js"
import {ImageParse} from "../Middleware/ImageParsing.js"

const upload = ImageParse();
router.post("/postblog",upload.single("coverImage"),handlePostBlog);

router.get("/getblogs",handleGetBlog);

router.delete("/deleteblog/:blogid",handleDeleteBlog);

router.put("/updateblog/:blogid", upload.single("coverImage") ,handleUpdateBlog);

router.post("/postcomment/:blogid",handlePostComment)

router.get("/getcomments/:blogid",handleGetAllComments)

router.post("/postlike/:blogid",handlePostLike)

router.post("/postdislike/:blogid",handlePostDislike)

router.get("/getlikes/:blogid",handleGetAllLikes)

export default router;