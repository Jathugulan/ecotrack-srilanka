import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { authenticate } from '../../middleware/auth.js';
import { sendSuccess, sendError } from '../../utils/response.js';

const router = Router();

router.use(authenticate);

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return sendError(res, 'No image file uploaded', 400);
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return sendSuccess(res, 'Image uploaded successfully', {
    filename: req.file.filename,
    url: fileUrl,
    size: req.file.size,
    mimetype: req.file.mimetype,
  }, 201);
});

export default router;
