// Script to fix doctor images in MongoDB
// Run with: node fixDoctorImages.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import doctorModel from './models/doctorModel.js';

dotenv.config();

// Using ui-avatars.com - free, no signup needed, generates avatars from names
const getAvatarUrl = (name) => {
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=5f6FFF&color=fff&size=200&rounded=true&bold=true`;
};

const fixImages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const doctors = await doctorModel.find({});
        console.log(`Found ${doctors.length} doctors`);

        for (const doctor of doctors) {
            const avatarUrl = getAvatarUrl(doctor.name);
            await doctorModel.findByIdAndUpdate(doctor._id, { image: avatarUrl });
            console.log(`✅ Updated image for ${doctor.name}`);
        }

        console.log('\n✅ All doctor images updated successfully!');
        await mongoose.disconnect();
        console.log('Done!');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

fixImages();
