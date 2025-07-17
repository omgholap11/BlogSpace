import multer from "multer";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, path.join(__dirname, "../../Frontend/public"));
      },
      filename: function (req, file, cb) {
        return cb(null, `${Date.now()}--${file.originalname}`);
      },
})
export function ImageParse(){
    const upload = multer({ storage });
    return upload;
}
