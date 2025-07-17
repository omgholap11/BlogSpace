import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import blogroute from "./Route/blog.js"
import userroute from "./Route/user.js";
import { connectMongoDB } from "./Controller/connection.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { checkForAuthenticationCookie } from "./Middleware/authentication.js";

const app = express();
const PORT = 5001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectMongoDB("mongodb://127.0.0.1:27017/blgospace");

app.use(express.urlencoded({ extended: true })); //to parse form data
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(checkForAuthenticationCookie("token")); 

// image parsing
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     return cb(null, path.join(__dirname, "../Frontend/public"));
//   },
//   filename: function (req, file, cb) {
//     return cb(null, `${Date.now()}--${file.originalname}`);
//   },
// });
// const upload = multer({ storage });

app.use("/public",express.static(path.join(__dirname, "../Frontend/public")));


app.use("/user", userroute);
app.use("/blog",  blogroute);


app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
