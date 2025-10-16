#!/usr/bin/env node

/**
 * Setup Verification Script
 * Verifies that all environment files and scripts are in place
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 QuickFold Setup Verification\n');

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.log('❌ package.json not found. Make sure you\'re in the backend directory.');
  console.log('💡 Run: cd backend');
  process.exit(1);
}

console.log('✅ Found package.json');

// Check for environment files
const envFiles = ['env.development', 'env.staging', 'env.production', 'env.template'];
console.log('\n📁 Checking environment files:');

envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Check for scripts
const scripts = ['scripts/setup-env.js', 'scripts/test-connection.js', 'scripts/migrate.js', 'scripts/seed.js'];
console.log('\n🔧 Checking setup scripts:');

scripts.forEach(script => {
  if (fs.existsSync(script)) {
    console.log(`✅ ${script} exists`);
  } else {
    console.log(`❌ ${script} missing`);
  }
});

// Check package.json scripts
console.log('\n📦 Checking package.json scripts:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['setup:env', 'setup:dev', 'setup:staging', 'setup:prod', 'test:db'];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ ${script} script found`);
    } else {
      console.log(`❌ ${script} script missing`);
    }
  });
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

console.log('\n🎯 Quick Setup Commands:');
console.log('npm run setup:dev      # Development environment');
console.log('npm run setup:staging   # Staging environment');
console.log('npm run setup:prod      # Production environment');
console.log('node scripts/setup-env.js  # Interactive setup');

console.log('\n📋 Manual Setup:');
console.log('cp env.development .env  # Copy development config');
console.log('cp env.production .env   # Copy production config');
console.log('cp env.staging .env       # Copy staging config');

console.log('\n✅ Verification complete!');

