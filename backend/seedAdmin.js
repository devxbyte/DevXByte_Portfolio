const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    // Check if exists
    let admin = await Admin.findOne({ email: 'devusaini159@gmail.com' });
    if (admin) {
      console.log('Admin already exists, updating password...');
      admin.password = 'admin123';
      await admin.save();
    } else {
      admin = new Admin({
        name: 'Devendra Saini',
        email: 'devusaini159@gmail.com',
        password: 'admin123'
      });
      await admin.save();
      console.log('Admin created successfully.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedAdmin();
