const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        // To accept the file pass `true`
        cb(null, true)
    }
    else {
        // To reject this file pass `false`
        cb(null, false)
    }
}

const upload = multer({
    // storage: fileStorageEngine,
    fileFilter: fileFilter
})
const uploadImage = upload.single("profilePic")

module.exports = {
    uploadImage
}