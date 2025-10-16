#!/usr/bin/env node

/**
 * Environment Setup Script
 * Helps set up environment files for different deployment environments
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const setupEnvironment = async () => {
  console.log('🔧 QuickFold Environment Setup\n');
  console.log('This script will help you set up environment files for different deployment environments.\n');

  try {
    // Ask for environment type
    const envType = await question('Select environment (development/staging/production): ');
    
    if (!['development', 'staging', 'production'].includes(envType.toLowerCase())) {
      console.log('❌ Invalid environment type. Please choose development, staging, or production.');
      process.exit(1);
    }

    console.log(`\n📋 Setting up ${envType} environment...\n`);

    // Copy the appropriate environment file
    const sourceFile = `env.${envType}`;
    const targetFile = '.env';

    if (!fs.existsSync(sourceFile)) {
      console.log(`❌ Environment file ${sourceFile} not found.`);
      process.exit(1);
    }

    // Copy environment file
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`✅ Copied ${sourceFile} to .env`);

    // Ask for customizations based on environment
    if (envType.toLowerCase() === 'development') {
      console.log('\n🔧 Development Environment Setup:');
      
      const dbPassword = await question('MySQL password (press Enter for empty): ');
      if (dbPassword) {
        updateEnvFile('.env', 'DB_PASSWORD', dbPassword);
      }

      const jwtSecret = await question('JWT Secret (press Enter for default): ');
      if (jwtSecret) {
        updateEnvFile('.env', 'JWT_SECRET', jwtSecret);
      }
    }

    if (envType.toLowerCase() === 'staging' || envType.toLowerCase() === 'production') {
      console.log('\n🔧 AWS RDS Configuration:');
      
      const dbHost = await question('RDS Endpoint (e.g., quickfold-db.xxxxxxxxx.us-east-1.rds.amazonaws.com): ');
      if (dbHost) {
        updateEnvFile('.env', 'DB_HOST', dbHost);
      }

      const dbPassword = await question('RDS Master Password: ');
      if (dbPassword) {
        updateEnvFile('.env', 'DB_PASSWORD', dbPassword);
      }

      const jwtSecret = await question('JWT Secret (use a strong secret for production): ');
      if (jwtSecret) {
        updateEnvFile('.env', 'JWT_SECRET', jwtSecret);
      }

      if (envType.toLowerCase() === 'production') {
        const corsOrigin = await question('CORS Origin (your production domain): ');
        if (corsOrigin) {
          updateEnvFile('.env', 'CORS_ORIGIN', corsOrigin);
        }
      }
    }

    console.log('\n✅ Environment setup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Review the .env file and update any remaining values');
    console.log('2. Test database connection: npm run test:db');
    console.log('3. Run database migration: npm run db:migrate');
    console.log('4. Start the application: npm start');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

const updateEnvFile = (filePath, key, value) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const regex = new RegExp(`^${key}=.*$`, 'm');
    const newLine = `${key}=${value}`;
    
    if (regex.test(content)) {
      content = content.replace(regex, newLine);
    } else {
      content += `\n${newLine}`;
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${key} in .env file`);
  } catch (error) {
    console.error(`❌ Failed to update ${key}:`, error.message);
  }
};

// Run setup
setupEnvironment().catch(console.error);

