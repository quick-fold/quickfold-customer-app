module.exports = {
  // Production Environment Configuration
  NODE_ENV: 'production',
  PORT: process.env.PORT || 3000,

  // AWS RDS MySQL Configuration
  DB_HOST: process.env.DB_HOST || 'quickfold-db.xxxxxxxxx.us-east-1.rds.amazonaws.com',
  DB_PORT: process.env.DB_PORT || 3306,
  DB_NAME: process.env.DB_NAME || 'quickfold',
  DB_USER: process.env.DB_USER || 'admin',
  DB_PASSWORD: process.env.DB_PASSWORD || 'your_secure_production_password',

  // SSL Configuration for AWS RDS
  DB_SSL: process.env.DB_SSL === 'true' || true,
  DB_SSL_REJECT_UNAUTHORIZED: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true' || false,

  // Connection Pool Configuration
  DB_POOL_MAX: parseInt(process.env.DB_POOL_MAX) || 10,
  DB_POOL_MIN: parseInt(process.env.DB_POOL_MIN) || 2,
  DB_POOL_ACQUIRE: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
  DB_POOL_IDLE: parseInt(process.env.DB_POOL_IDLE) || 10000,

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secure-production-jwt-secret-key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // API Configuration
  API_VERSION: process.env.API_VERSION || 'v1'
};

