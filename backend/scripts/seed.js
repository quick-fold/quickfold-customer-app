#!/usr/bin/env node

/**
 * Database Seeding Script
 * Populates database with initial data
 */

require('dotenv').config();
const { sequelize } = require('../config/database');
const User = require('../models/User');

const seed = async () => {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Test connection first
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Check if users already exist
    const existingUsers = await User.count();
    if (existingUsers > 0) {
      console.log(`⚠️  Database already contains ${existingUsers} users. Skipping seed.`);
      return;
    }

    // Create sample users
    console.log('👤 Creating sample users...');
    
    const sampleUsers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '+1234567890',
        addressStreet: '123 Main St',
        addressCity: 'New York',
        addressState: 'NY',
        addressZipCode: '10001',
        addressCountry: 'US',
        role: 'customer'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: 'password123',
        phone: '+1234567891',
        addressStreet: '456 Oak Ave',
        addressCity: 'Los Angeles',
        addressState: 'CA',
        addressZipCode: '90210',
        addressCountry: 'US',
        role: 'customer'
      },
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@quickfold.com',
        password: 'admin123',
        phone: '+1234567892',
        addressStreet: '789 Admin Blvd',
        addressCity: 'Miami',
        addressState: 'FL',
        addressZipCode: '33101',
        addressCountry: 'US',
        role: 'admin'
      }
    ];

    for (const userData of sampleUsers) {
      try {
        const user = await User.create(userData);
        console.log(`✅ Created user: ${user.firstName} ${user.lastName} (${user.email})`);
      } catch (error) {
        console.log(`⚠️  User ${userData.email} already exists or error occurred:`, error.message);
      }
    }

    // Verify seeding
    const userCount = await User.count();
    console.log(`\n📊 Total users in database: ${userCount}`);

    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:');
    console.error('Error:', error.message);
    
    if (error.original) {
      console.error('Original error:', error.original.message);
    }
    
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

// Run seeding
seed().catch(console.error);

