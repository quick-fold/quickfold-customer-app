#!/usr/bin/env node

/**
 * Database Migration Script
 * Creates tables and initializes database schema
 */

require('dotenv').config();
const { sequelize } = require('../config/database');
const User = require('../models/User');

const migrate = async () => {
  console.log('🔄 Starting database migration...\n');

  try {
    // Test connection first
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Sync database (create tables)
    console.log('📊 Creating/updating database tables...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables synchronized');

    // Verify tables were created
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('📋 Created tables:', tables.map(t => Object.values(t)[0]));

    console.log('\n🎉 Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:');
    console.error('Error:', error.message);
    
    if (error.original) {
      console.error('Original error:', error.original.message);
    }
    
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

// Run migration
migrate().catch(console.error);

