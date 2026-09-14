const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testLive() {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream('e:/d.k portfolio/frontend/public/Devendra_Saini.png'));

    const res = await axios.post('https://backend-pi-rosy-72.vercel.app/api/admin/upload', formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZDBmOGY4YjhlMGI5YjNjNGY5YTBkMiIsImlhdCI6MTc4OTM4OTU3MSwiZXhwIjoxNzg5NDc1OTcxfQ.1mh5hQzq9rbci9MtQQx1VCpl0HxEdOE0nQ2uSz7bjR4'
      }
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}

testLive();
