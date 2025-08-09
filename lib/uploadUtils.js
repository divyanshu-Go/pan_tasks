// lib/uploadUtils.js

/**
 * Validate uploaded file
 * @param {Object} file - File object from formidable
 * @returns {Object} - Validation result
 */
export function validateFile(file) {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['application/pdf'];
  
  const errors = [];

  // Check file type
  if (!allowedTypes.includes(file.mimetype)) {
    errors.push('Only PDF files are allowed');
  }

  // Check file size
  if (file.size > maxSize) {
    errors.push('File size must be less than 10MB');
  }

  // Check if file exists
  if (!file || !file.size) {
    errors.push('No file provided');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate safe filename
 * @param {string} originalName - Original filename
 * @returns {string} - Safe filename
 */
export function generateSafeFilename(originalName) {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substr(2, 9);
  const extension = originalName.split('.').pop();
  const baseName = originalName.split('.').slice(0, -1).join('.');
  const safeName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
  
  return `${safeName}_${timestamp}_${randomId}.${extension}`;
}