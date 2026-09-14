require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testUpload() {
  try {
    const timestamp = Math.floor(new Date('2024-09-14T10:00:00Z').getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
      folder: 'portfolio'
    }, process.env.CLOUDINARY_API_SECRET);

    console.log("Timestamp:", timestamp);
    console.log("Signature:", signature);
    
    // We can't easily force the upload_stream to use our specific signature and timestamp via the SDK wrapper
    // The SDK automatically generates a new signature using Date.now().
    // So the SDK will ALWAYS use 2026 if run locally, UNLESS we mock Date.now!

    const originalNow = Date.now;
    Date.now = () => new Date('2024-09-14T10:00:00Z').getTime();

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'portfolio', resource_type: 'auto' },
      (error, result) => {
        if (error) {
          console.error('Error Object:', error);
        } else {
          console.log('Success:', result.secure_url);
        }
        Date.now = originalNow; // Restore
      }
    );
    
    fs.createReadStream('e:/d.k portfolio/frontend/public/Devendra_Saini.png').pipe(stream);
  } catch (err) {
    console.error('Failed to test:', err.message);
  }
}

testUpload();
