require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

cloudinary.uploader.upload('test.txt', { resource_type: 'raw' })
  .then(res => console.log('Success:', res.secure_url))
  .catch(err => {
     console.error('Error Object:', JSON.stringify(err, null, 2));
     console.error('Error directly:', err);
     process.exit(1);
  });
