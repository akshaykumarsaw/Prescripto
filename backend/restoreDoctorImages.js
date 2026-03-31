import mongoose from 'mongoose';
import dotenv from 'dotenv';
import doctorModel from './models/doctorModel.js';

dotenv.config();

const originalImages = {
  'richard.james@prescripto.com': 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc1_profile.png',
  'emily.larson@prescripto.com': 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc2_profile.png',
  'sarah.patel@prescripto.com': 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc3_profile.png',
  'christopher.lee@prescripto.com': 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc4_profile.png',
  'jennifer.garcia@prescripto.com': 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc5_profile.png',
  'andrew.williams@prescripto.com': 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc6_profile.png',
  'christopher.davis@prescripto.com': 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc7_profile.png',
  'timothy.white@prescripto.com': 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc8_profile.png',
  'ava.mitchell@prescripto.com': 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc9_profile.png',
  'jeffrey.king@prescripto.com': 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc10_profile.png',
  'zoe.kelly@prescripto.com': 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc11_profile.png',
  'patrick.harris@prescripto.com': 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc12_profile.png',
  'chloe.evans@prescripto.com': 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc13_profile.png',
  'ryan.martinez@prescripto.com': 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc14_profile.png',
  'amelia.johnson@prescripto.com': 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc15_profile.png'
};

const restoreImages = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`);
        console.log('Connected to MongoDB');

        const doctors = await doctorModel.find({});
        console.log(`Found ${doctors.length} doctors`);

        for (const doc of doctors) {
            if (originalImages[doc.email]) {
                await doctorModel.findByIdAndUpdate(doc._id, { image: originalImages[doc.email] });
                console.log(`✅ Restored real image for ${doc.name}`);
            } else {
                console.log(`⚠️ No original image mapped for ${doc.name} (${doc.email}).`);
            }
        }

        console.log('\n✅ All targeted doctor images restored successfully!');
        await mongoose.disconnect();
        console.log('Done.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

restoreImages();
