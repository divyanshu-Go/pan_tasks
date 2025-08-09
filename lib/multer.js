import multer from 'multer';

// Store in memory (not disk)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    cb(new Error('Only PDF files are allowed!'), false);
  } else {
    cb(null, true);
  }
};

export const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024, files: 3 }, // max 5MB, max 3 files
  fileFilter 
});
