module.exports = {
  // Development Environment Configuration
  NODE_ENV: 'development',
  PORT: process.env.PORT || 3000,

  // Local MySQL Configuration
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 3306,
  DB_NAME: process.env.DB_NAME || 'quickfold',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',

  // SSL Configuration (disabled for local development)
  DB_SSL: process.env.DB_SSL === 'true' || false,
  DB_SSL_REJECT_UNAUTHORIZED: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true' || false,

  // Connection Pool Configuration
  DB_POOL_MAX: parseInt(process.env.DB_POOL_MAX) || 5,
  DB_POOL_MIN: parseInt(process.env.DB_POOL_MIN) || 0,
  DB_POOL_ACQUIRE: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
  DB_POOL_IDLE: parseInt(process.env.DB_POOL_IDLE) || 10000,

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'development-jwt-secret-key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // API Configuration
  API_VERSION: process.env.API_VERSION || 'v1'
};

