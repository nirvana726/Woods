import express from 'express';
import Gallery from '../models/Gallery.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Configure multer for temporary storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'tmp/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only .jpg, .jpeg, .png and .webp formats allowed'));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Get all gallery images with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const images = await Gallery.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Gallery.countDocuments();
    
    res.json({
      images,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload new images to Cloudinary
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadResults = await Promise.all(
      req.files.map(async (file) => {
        try {
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'gallery',
            quality: 'auto',
            fetch_format: 'auto'
          });

          // Create new gallery item
          const newImage = new Gallery({
            public_id: result.public_id,
            url: result.secure_url,
            filename: file.originalname,
            format: result.format,
            bytes: result.bytes,
            width: result.width,
            height: result.height
          });

          await newImage.save();
          await fs.unlink(file.path); // Delete temp file
          
          return newImage;
        } catch (uploadError) {
          await fs.unlink(file.path); // Clean up if upload fails
          throw uploadError;
        }
      })
    );

    res.status(201).json(uploadResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an image
router.delete('/:id', async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.public_id);
    
    // Delete from database
    await Gallery.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;