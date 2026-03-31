import mongoose from 'mongoose';
import dotenv from 'dotenv';
import doctorModel from './models/doctorModel.js';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const doctorMapping = {
  'richard.james@prescripto.com': 'doc1.png',
  'emily.larson@prescripto.com': 'doc2.png',
  'sarah.patel@prescripto.com': 'doc3.png',
  'christopher.lee@prescripto.com': 'doc4.png',
  'jennifer.garcia@prescripto.com': 'doc5.png',
  'andrew.williams@prescripto.com': 'doc6.png',
  'christopher.davis@prescripto.com': 'doc7.png',
  'timothy.white@prescripto.com': 'doc8.png',
  'ava.mitchell@prescripto.com': 'doc9.png',
  'jeffrey.king@prescripto.com': 'doc10.png',
  'zoe.kelly@prescripto.com': 'doc11.png',
  'patrick.harris@prescripto.com': 'doc12.png',
  'chloe.evans@prescripto.com': 'doc13.png',
  'ryan.martinez@prescripto.com': 'doc14.png',
  'amelia.johnson@prescripto.com': 'doc15.png'
};

const uploadAndFix = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`);
    console.log('Connected to MongoDB');

    const doctors = await doctorModel.find({});
    
    for (const doc of doctors) {
      if (doctorMapping[doc.email]) {
        const imagePath = path.join(__dirname, '..', 'clientside', 'src', 'assets', doctorMapping[doc.email]);
        
        console.log(`Uploading image for ${doc.name}...`);
        const uploadResponse = await cloudinary.uploader.upload(imagePath, {
          resource_type: 'image',
          folder: 'prescripto/doctors'
        });

        const newImageUrl = uploadResponse.secure_url;
        await doctorModel.findByIdAndUpdate(doc._id, { image: newImageUrl });
        
        console.log(`✅ Fixed image for ${doc.name}: ${newImageUrl}`);
      }
    }

    console.log('Finished uploading and database update!');
    await mongoose.disconnect();
    process.exit(0);
  } catch(error) {
    console.error('Error during image upload:', error);
    process.exit(1);
  }
};

uploadAndFix();
