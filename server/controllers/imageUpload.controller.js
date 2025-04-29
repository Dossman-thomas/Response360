import { upload, encryptService } from '../services/index.js';
import { messages } from '../messages/index.js';
import { response } from '../utils/index.js';

// Wrap the upload logic to use in your routes
export const uploadLogoController = (req, res, next) => {
  // Single file with field name 'logo'
  upload.single('logo')(req, res, (err) => {
    if (err) {
      console.error('Error uploading file:', err);
      return response(res, {
        statusCode: 500,
        message: messages.general.INTERNAL_SERVER_ERROR,
        error: err.message,
      });
    }

    // File successfully uploaded
    if (!req.file) {
      return response(res, {
        statusCode: 400,
        message: messages.general.BAD_REQUEST,
        error: 'No file uploaded.',
      });
    }

    // Send back the file path (relative to frontend access)
    const filePath = `/shared/images/${req.file.filename}`;

    // encrypt path to send in response securely
    const encryptedPath = encryptService(filePath);

    response(res, {
      statusCode: 200,
      message: messages.general.SUCCESS,
      data: {
        path: encryptedPath,
      },
    });
    // res.status(200).json({
    //   message: 'File uploaded successfully',
    //   path: encryptedPath,
    // });
  });
};
