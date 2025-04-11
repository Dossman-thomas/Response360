import { upload } from "../services/index.js";

// Wrap the upload logic to use in your routes
export const uploadLogoController = (req, res, next) => {
    // Single file with field name 'logo'
    upload.single("logo")(req, res, (err) => {
      if (err) {
        console.error("Error uploading file:", err);
        return res.status(400).json({ error: err.message });
      }
  
      // File successfully uploaded
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }
  
      // Send back the file path (relative to frontend access)
      const filePath = `/shared/images/${req.file.filename}`;
  
      res.status(200).json({
        message: "File uploaded successfully",
        path: filePath,
      });
    });
  };