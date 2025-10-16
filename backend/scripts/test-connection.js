#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests connection to AWS RDS MySQL database
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');

const testConnection = async () => {
  console.log('🔍 Testing database connection...\n');

  // SSL configuration for AWS RDS
  const sslConfig = process.env.DB_SSL === 'true' ? {
    ssl: {
      require: true,
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
    }
  } : {};

  const sequelize = new Sequelize(
    process.env.DB_NAME || 'quickfold',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: console.log,
      dialectOptions: {
        ...sslConfig,
        connectTimeout: 60000,
        acquireTimeout: 60000,
        timeout: 60000,
      }
    }
  );

  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test query
    const [results] = await sequelize.query('SELECT 1 as test');
    console.log('✅ Database query successful!');
    console.log('📊 Query result:', results);
    
    // Check if tables exist
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('📋 Existing tables:', tables.length > 0 ? tables.map(t => Object.values(t)[0]) : 'No tables found');
    
    console.log('\n🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    
    if (error.original) {
      console.error('Original error:', error.original.message);
    }
    
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your environment variables in .env file');
    console.log('2. Verify RDS endpoint and credentials');
    console.log('3. Check security group rules');
    console.log('4. Ensure database exists');
    console.log('5. Check SSL configuration');
    
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

// Run the test
testConnection().catch(console.error);

