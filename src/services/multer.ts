import multer from "multer";
import path from "path";
import fs from "fs"

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage }).single("image");

export const Productmultiplefile = multer({
  storage: storage,
}).fields([
  { name: 'sizeimages', maxCount: 1 },
  { name: 'colorimage', maxCount: 1 },
  { name: 'clarityimage', maxCount: 1 },
  { name: 'cutimage', maxCount: 1 },
  { name: 'productimage', maxCount: 4 }])
