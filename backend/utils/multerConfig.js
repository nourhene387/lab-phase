const multer = require('multer');
const path = require('path');

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Define where to save the uploaded files
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);  // Get file extension
        cb(null, Date.now() + ext);  // Save file with timestamp and original extension
    }
});

// Configure multer for single file upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // Limit file size to 5MB
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;  // Allow only image files
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);  // Accept the file
        } else {
            return cb(new Error('Error: Only image files (jpeg, jpg, png, gif) are allowed!'), false);
        }
    }
});

module.exports = upload;
