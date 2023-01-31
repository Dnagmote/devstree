const multer = require ("multer");


let uploadImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "./public");
    },
    filename: (req, file, callback) => {
      req.originalName = Date.now() + "-" + file.originalname;
      callback(null, req.originalName);
    },
  }),
}).any();

module.exports = {uploadImage};