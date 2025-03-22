import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name from import.meta.url in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDirectory = path.resolve(__dirname, "../uploads");
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("file"); // 'file' is the field name

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /pdf|doc|docx/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Only PDF, DOC, and DOCX files are allowed!");
  }
}

// Middleware to handle file upload
export const uploadFile = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err); // Log the error
      return res
        .status(400)
        .json({ error: err.message || "File upload failed" });
    } else if (!req.file) {
      console.error("No file uploaded"); // Log if no file is uploaded
      return res.status(400).json({ error: "No file uploaded" });
    } else {
      console.log("File uploaded successfully:", req.file); // Log the uploaded file
      // Attach the relative file path to the request object
      req.filePath = req.file.filename; // Save only the filename (relative path)
      next(); // Pass control to the next middleware/route handler
    }
  });
};
