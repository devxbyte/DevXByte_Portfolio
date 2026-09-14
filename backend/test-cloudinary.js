require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

cloudinary.uploader.upload('https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg', { resource_type: 'auto' })
  .then(res => console.log('Success:', res.secure_url))
  .catch(err => console.error('Error:', err));
