const fs = require('fs');
const path = require('path');

// Create insurance uploads directory if it doesn't exist
const insuranceDir = path.join(__dirname, '../../uploads/insurance');
if (!fs.existsSync(insuranceDir)) {
  fs.mkdirSync(insuranceDir, { recursive: true });
}

/**
 * Save insurance card image
 * @param {Buffer} fileBuffer - File buffer from upload
 * @param {string} fileName - Original file name
 * @param {string} billId - Bill ID for organizing files
 * @returns {Object} - { filePath, fileName }
 */
const saveInsuranceCard = (fileBuffer, fileName, billId) => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext);
    const uniqueFileName = `${baseName}-${billId}-${timestamp}${ext}`;
    
    // Create bill-specific directory
    const billDir = path.join(insuranceDir, billId);
    if (!fs.existsSync(billDir)) {
      fs.mkdirSync(billDir, { recursive: true });
    }
    
    // Save file
    const filePath = path.join(billDir, uniqueFileName);
    fs.writeFileSync(filePath, fileBuffer);
    
    console.log(`✅ Insurance card saved: ${filePath}`);
    
    return {
      filePath: `/uploads/insurance/${billId}/${uniqueFileName}`,
      fileName: uniqueFileName,
      originalName: fileName,
    };
  } catch (error) {
    console.error('❌ Error saving insurance card:', error);
    throw new Error('Failed to save insurance card');
  }
};

/**
 * Delete insurance card image
 * @param {string} filePath - File path to delete
 */
const deleteInsuranceCard = (filePath) => {
  try {
    const fullPath = path.join(__dirname, '../../', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`✅ Insurance card deleted: ${fullPath}`);
    }
  } catch (error) {
    console.error('❌ Error deleting insurance card:', error);
  }
};

/**
 * Validate insurance card file
 * @param {Object} file - File object from multer
 * @returns {Object} - { valid, error }
 */
const validateInsuranceCard = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 5MB limit' };
  }

  // Check file type
  const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (!allowedMimes.includes(file.mimetype)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and PDF are allowed' };
  }

  return { valid: true };
};

/**
 * Calculate insurance discount
 * @param {number} subtotal - Bill subtotal
 * @param {string} insuranceType - Type of insurance (private/government)
 * @returns {number} - Discount amount (25% of subtotal)
 */
const calculateInsuranceDiscount = (subtotal, insuranceType) => {
  if (!insuranceType || insuranceType === 'none') {
    return 0;
  }
  
  // 25% discount for both private and government insurance
  return (subtotal * 25) / 100;
};

module.exports = {
  saveInsuranceCard,
  deleteInsuranceCard,
  validateInsuranceCard,
  calculateInsuranceDiscount,
  insuranceDir,
};

