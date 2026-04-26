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
            { name: 'Dr. Richard James', email: 'richard.james@prescripto.com', password: hashedPassword, speciality: 'General physician', degree: 'MBBS', experience: '4 Years', about: 'Dr. James has a strong commitment to delivering comprehensive medical care.', fees: 250, available: true, address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: `https://ui-avatars.com/api/?name=${encodeURIComponent('Dr. Richard James')}&background=random` },
            { name: 'Dr. Emily Larson', email: 'emily.larson@prescripto.com', password: hashedPassword, speciality: 'Gynecologist', degree: 'MBBS', experience: '3 Years', about: 'Dr. Larson specializes in women\'s health.', fees: 350, available: true, address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: `https://ui-avatars.com/api/?name=${encodeURIComponent('Dr. Emily Larson')}&background=random` },
            { name: 'Dr. Sarah Patel', email: 'sarah.patel@prescripto.com', password: hashedPassword, speciality: 'Dermatologist', degree: 'MBBS', experience: '1 Year', about: 'Dr. Patel is dedicated to skin health.', fees: 300, available: true, address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: `https://ui-avatars.com/api/?name=${encodeURIComponent('Dr. Sarah Patel')}&background=random` },
            { name: 'Dr. Christopher Lee', email: 'christopher.lee@prescripto.com', password: hashedPassword, speciality: 'Pediatricians', degree: 'MBBS', experience: '2 Years', about: 'Dr. Lee is passionate about child health.', fees: 250, available: true, address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: `https://ui-avatars.com/api/?name=${encodeURIComponent('Dr. Christopher Lee')}&background=random` },
            { name: 'Dr. Jennifer Garcia', email: 'jennifer.garcia@prescripto.com', password: hashedPassword, speciality: 'Neurologist', degree: 'MBBS', experience: '4 Years', about: 'Dr. Garcia specializes in neurological disorders.', fees: 300, available: true, address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: `https://ui-avatars.com/api/?name=${encodeURIComponent('Dr. Jennifer Garcia')}&background=random` },
            { name: 'Dr. Andrew Williams', email: 'andrew.williams@prescripto.com', password: hashedPassword, speciality: 'Neurologist', degree: 'MBBS', experience: '4 Years', about: 'Dr. Williams brings years of neurology expertise.', fees: 350, available: true, address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: `https://ui-avatars.com/api/?name=${encodeURIComponent('Dr. Andrew Williams')}&background=random` },
            { name: 'Dr. Christopher Davis', email: 'christopher.davis@prescripto.com', password: hashedPassword, speciality: 'General physician', degree: 'MBBS', experience: '4 Years', about: 'Dr. Davis has a strong commitment to delivering medical care.', fees: 250, available: true, address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: `https://ui-avatars.com/api/?name=${encodeURIComponent('Dr. Christopher Davis')}&background=random` },
            { name: 'Dr. Timothy White', email: 'timothy.white@prescripto.com', password: hashedPassword, speciality: 'Gynecologist', degree: 'MBBS', experience: '3 Years', about: 'Dr. White brings specialized expertise in gynecology.', fees: 350, available: true, address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: `https://ui-avatars.com/api/?name=${encodeURIComponent('Dr. Timothy White')}&background=random` },
            { name: 'Dr. Ava Mitchell', email: 'ava.mitchell@prescripto.com', password: hashedPassword, speciality: 'Dermatologist', degree: 'MBBS', experience: '1 Year', about: 'Dr. Mitchell is passionate about skin health.', fees: 300, available: true, address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: `https://ui-avatars.com/api/?name=${encodeURIComponent('Dr. Ava Mitchell')}&background=random` },
            { name: 'Dr. Jeffrey King', email: 'jeffrey.king@prescripto.com', password: hashedPassword, speciality: 'Pediatricians', degree: 'MBBS', experience: '2 Years', about: 'Dr. King dedicates himself to child health.', fees: 250, available: true, address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: `https://ui-avatars.com/api/?name=${encodeURIComponent('Dr. Jeffrey King')}&background=random` },
            { name: 'Dr. Zoe Kelly', email: 'zoe.kelly@prescripto.com', password: hashedPassword, speciality: 'Gastroenterologist', degree: 'MBBS', experience: '4 Years', about: 'Dr. Kelly specializes in complex gastroenterological cases.', fees: 300, available: true, address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: `https://ui-avatars.com/api/?name=${encodeURIComponent('Dr. Zoe Kelly')}&background=random` },
            { name: 'Dr. Patrick Harris', email: 'patrick.harris@prescripto.com', password: hashedPassword, speciality: 'Neurologist', degree: 'MBBS', experience: '4 Years', about: 'Dr. Harris is a leading neurologist.', fees: 350, available: true, address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: `https://ui-avatars.com/api/?name=${encodeURIComponent('Dr. Patrick Harris')}&background=random` },
            { name: 'Dr. Chloe Evans', email: 'chloe.evans@prescripto.com', password: hashedPassword, speciality: 'General physician', degree: 'MBBS', experience: '4 Years', about: 'Dr. Evans provides excellent general medical care.', fees: 250, available: true, address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: `https://ui-avatars.com/api/?name=${encodeURIComponent('Dr. Chloe Evans')}&background=random` },
            { name: 'Dr. Ryan Martinez', email: 'ryan.martinez@prescripto.com', password: hashedPassword, speciality: 'Gynecologist', degree: 'MBBS', experience: '3 Years', about: 'Dr. Martinez specializes in reproductive health.', fees: 350, available: true, address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: `https://ui-avatars.com/api/?name=${encodeURIComponent('Dr. Ryan Martinez')}&background=random` },
            { name: 'Dr. Amelia Johnson', email: 'amelia.johnson@prescripto.com', password: hashedPassword, speciality: 'General physician', degree: 'MBBS', experience: '4 Years', about: 'Dr. Johnson is committed to comprehensive care.', fees: 300, available: true, address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' }, slots_booked: {}, date: now, image: `https://ui-avatars.com/api/?name=${encodeURIComponent('Dr. Amelia Johnson')}&background=random` },
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
