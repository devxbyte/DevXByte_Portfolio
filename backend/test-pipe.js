const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const fs = require('fs');

cloudinary.config({
  cloud_name: 'test',
  api_key: 'test',
  api_secret: 'test'
});

try {
  const buffer = fs.readFileSync('e:/d.k portfolio/frontend/public/Devendra_Saini.png');
  const req = { file: { buffer: buffer, originalname: 'test.png' } };

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'portfolio', resource_type: 'auto' },
    (error, result) => {
      console.log('Callback:', error, result);
    }
  );
  Readable.from(req.file.buffer).pipe(stream);
  console.log('Stream piped successfully');
} catch (err) {
  console.error('Exception caught:', err);
  console.log(JSON.stringify({ message: 'Error initiating upload', error: err.message }));
}
