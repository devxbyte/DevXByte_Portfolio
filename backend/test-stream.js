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
    const timeRes = await fetch('http://worldtimeapi.org/api/timezone/Etc/UTC');
    const timeData = await timeRes.json();
    const realTimestamp = timeData.unixtime;

    console.log('Real timestamp:', realTimestamp);

    const stream = cloudinary.uploader.upload_stream(
      { timestamp: realTimestamp },
      (error, result) => {
        if (error) {
          console.error('Error Object:', JSON.stringify(error, null, 2));
        } else {
          console.log('Success:', result.secure_url);
        }
        process.exit(0);
      }
    );
    
    fs.createReadStream('e:/d.k portfolio/frontend/public/Devendra_Saini.png').pipe(stream);
  } catch (err) {
    console.error('Failed to test:', err.message);
  }
}

testUpload();
