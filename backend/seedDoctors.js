// Seed script to add hardcoded doctors to MongoDB
// Run with: node seedDoctors.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import doctorModel from './models/doctorModel.js';
import bcrypt from 'bcrypt';

dotenv.config();

const seedDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const existingCount = await doctorModel.countDocuments();
        if (existingCount > 0) {
            console.log(`Found ${existingCount} doctors already in DB. Skipping seed.`);
            console.log('To re-seed, delete existing doctors from MongoDB Atlas first.');
            await mongoose.disconnect();
            return;
        }

        const hashedPassword = await bcrypt.hash('Doctor@123456', 10);
        const now = Date.now();

        const doctors = [
            { name: 'Dr. Richard James', email: 'richard.james@prescripto.com', password: hashedPassword, speciality: 'General physician', degree: 'MBBS', experience: '4 Years', about: 'Dr. James has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.', fees: 250, available: true, address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc1_profile.png' },
            { name: 'Dr. Emily Larson', email: 'emily.larson@prescripto.com', password: hashedPassword, speciality: 'Gynecologist', degree: 'MBBS', experience: '3 Years', about: 'Dr. Larson specializes in women\'s health and reproductive medicine with a compassionate approach to patient care.', fees: 350, available: true, address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc2_profile.png' },
            { name: 'Dr. Sarah Patel', email: 'sarah.patel@prescripto.com', password: hashedPassword, speciality: 'Dermatologist', degree: 'MBBS', experience: '1 Year', about: 'Dr. Patel is dedicated to skin health and provides cutting-edge dermatological treatments.', fees: 300, available: true, address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc3_profile.png' },
            { name: 'Dr. Christopher Lee', email: 'christopher.lee@prescripto.com', password: hashedPassword, speciality: 'Pediatricians', degree: 'MBBS', experience: '2 Years', about: 'Dr. Lee is passionate about child health, ensuring every child gets the best possible medical care.', fees: 250, available: true, address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc4_profile.png' },
            { name: 'Dr. Jennifer Garcia', email: 'jennifer.garcia@prescripto.com', password: hashedPassword, speciality: 'Neurologist', degree: 'MBBS', experience: '4 Years', about: 'Dr. Garcia specializes in neurological disorders and brain health with extensive research experience.', fees: 300, available: true, address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc5_profile.png' },
            { name: 'Dr. Andrew Williams', email: 'andrew.williams@prescripto.com', password: hashedPassword, speciality: 'Neurologist', degree: 'MBBS', experience: '4 Years', about: 'Dr. Williams brings years of neurology expertise with a strong focus on patient recovery and wellbeing.', fees: 350, available: true, address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc6_profile.png' },
            { name: 'Dr. Christopher Davis', email: 'christopher.davis@prescripto.com', password: hashedPassword, speciality: 'General physician', degree: 'MBBS', experience: '4 Years', about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care and preventive medicine.', fees: 250, available: true, address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc7_profile.png' },
            { name: 'Dr. Timothy White', email: 'timothy.white@prescripto.com', password: hashedPassword, speciality: 'Gynecologist', degree: 'MBBS', experience: '3 Years', about: 'Dr. White brings specialized expertise in gynecology and women\'s health care.', fees: 350, available: true, address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc8_profile.png' },
            { name: 'Dr. Ava Mitchell', email: 'ava.mitchell@prescripto.com', password: hashedPassword, speciality: 'Dermatologist', degree: 'MBBS', experience: '1 Year', about: 'Dr. Mitchell is passionate about skin health and modern dermatological treatments.', fees: 300, available: true, address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc9_profile.png' },
            { name: 'Dr. Jeffrey King', email: 'jeffrey.king@prescripto.com', password: hashedPassword, speciality: 'Pediatricians', degree: 'MBBS', experience: '2 Years', about: 'Dr. King dedicates himself to child health and ensuring young patients receive the best care.', fees: 250, available: true, address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc10_profile.png' },
            { name: 'Dr. Zoe Kelly', email: 'zoe.kelly@prescripto.com', password: hashedPassword, speciality: 'Gastroenterologist', degree: 'MBBS', experience: '4 Years', about: 'Dr. Kelly specializes in complex gastroenterological cases with a patient-first approach.', fees: 300, available: true, address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc11_profile.png' },
            { name: 'Dr. Patrick Harris', email: 'patrick.harris@prescripto.com', password: hashedPassword, speciality: 'Neurologist', degree: 'MBBS', experience: '4 Years', about: 'Dr. Harris is a leading neurologist with expertise in brain and spine conditions.', fees: 350, available: true, address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc12_profile.png' },
            { name: 'Dr. Chloe Evans', email: 'chloe.evans@prescripto.com', password: hashedPassword, speciality: 'General physician', degree: 'MBBS', experience: '4 Years', about: 'Dr. Evans provides excellent general medical care with a focus on holistic patient wellbeing.', fees: 250, available: true, address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc13_profile.png' },
            { name: 'Dr. Ryan Martinez', email: 'ryan.martinez@prescripto.com', password: hashedPassword, speciality: 'Gynecologist', degree: 'MBBS', experience: '3 Years', about: 'Dr. Martinez specializes in reproductive health and women\'s wellness.', fees: 350, available: true, address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc14_profile.png' },
            { name: 'Dr. Amelia Johnson', email: 'amelia.johnson@prescripto.com', password: hashedPassword, speciality: 'General physician', degree: 'MBBS', experience: '4 Years', about: 'Dr. Johnson is committed to comprehensive care and preventive health strategies.', fees: 300, available: true, address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: 'https://res.cloudinary.com/dvoytcc6b/image/upload/v1743798377/doc15_profile.png' },
        ];

        await doctorModel.insertMany(doctors);
        console.log(`✅ Successfully seeded ${doctors.length} doctors to MongoDB!`);
        console.log('You can now book appointments with any doctor in the app.');

        await mongoose.disconnect();
        console.log('Done!');
    } catch (error) {
        console.error('Seed error:', error.message);
        process.exit(1);
    }
};

seedDoctors();
