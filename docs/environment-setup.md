# Environment Configuration Guide

This guide explains how to configure the QuickFold application for different environments.

## Environment Files Overview

The application includes several environment configuration files:

- `env.template` - Template with all available configuration options
- `env.development` - Development environment configuration
- `env.staging` - Staging environment configuration  
- `env.production` - Production environment configuration

## Quick Setup

### Automated Setup (Recommended)

Use the interactive setup script:

```bash
cd backend
node scripts/setup-env.js
```

This script will:
- Ask you to select an environment
- Copy the appropriate environment file to `.env`
- Prompt for environment-specific values
- Guide you through the setup process

### Manual Setup

1. **Copy the appropriate environment file:**
   ```bash
   # For development
   cp env.development .env
   
   # For staging
   cp env.staging .env
   
   # For production
   cp env.production .env
   ```

2. **Edit the `.env` file with your specific values**

## Environment Configurations

### Development Environment

**File:** `env.development`

**Key Features:**
- Local MySQL database
- SSL disabled
- Relaxed rate limiting
- Debug logging enabled
- CORS allows localhost

**Configuration:**
```env
NODE_ENV=development
DB_HOST=localhost
DB_SSL=false
LOG_LEVEL=debug
RATE_LIMIT_MAX=1000
```

### Staging Environment

**File:** `env.staging`

**Key Features:**
- AWS RDS MySQL database
- SSL enabled
- Moderate rate limiting
- Debug logging
- Staging domain CORS

**Configuration:**
```env
NODE_ENV=staging
DB_HOST=quickfold-staging-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
DB_SSL=true
LOG_LEVEL=debug
RATE_LIMIT_MAX=500
```

### Production Environment

**File:** `env.production`

**Key Features:**
- AWS RDS MySQL database
- SSL enabled
- Strict rate limiting
- Info logging
- Production domain CORS
- Security hardening

**Configuration:**
```env
NODE_ENV=production
DB_HOST=quickfold-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
DB_SSL=true
LOG_LEVEL=info
RATE_LIMIT_MAX=100
HELMET_ENABLED=true
```

## Configuration Variables

### Server Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | Yes |
| `PORT` | Server port | `3000` | Yes |

### Database Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | Database host | `localhost` | Yes |
| `DB_PORT` | Database port | `3306` | Yes |
| `DB_NAME` | Database name | `quickfold` | Yes |
| `DB_USER` | Database username | `root` | Yes |
| `DB_PASSWORD` | Database password | `` | Yes |
| `DB_SSL` | Enable SSL connection | `false` | No |
| `DB_SSL_REJECT_UNAUTHORIZED` | Reject unauthorized SSL | `false` | No |

### Connection Pool Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_POOL_MAX` | Maximum connections | `5` | No |
| `DB_POOL_MIN` | Minimum connections | `0` | No |
| `DB_POOL_ACQUIRE` | Connection acquire timeout | `30000` | No |
| `DB_POOL_IDLE` | Connection idle timeout | `10000` | No |

### Authentication Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_EXPIRE` | JWT expiration time | `7d` | No |

### API Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `API_VERSION` | API version | `v1` | No |
| `LOG_LEVEL` | Logging level | `debug` | No |
| `CORS_ORIGIN` | Allowed CORS origins | `*` | No |

### Rate Limiting Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` | No |
| `RATE_LIMIT_MAX` | Max requests per window | `100` | No |

### Security Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `HELMET_ENABLED` | Enable Helmet security | `true` | No |
| `TRUST_PROXY` | Trust proxy headers | `false` | No |

### Monitoring Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `ENABLE_METRICS` | Enable metrics collection | `false` | No |
| `METRICS_PORT` | Metrics server port | `9090` | No |

## Environment-Specific Setup

### Local Development Setup

1. **Install MySQL locally:**
   ```bash
   # macOS
   brew install mysql
   brew services start mysql
   
   # Ubuntu
   sudo apt install mysql-server
   sudo systemctl start mysql
   ```

2. **Create database:**
   ```sql
   CREATE DATABASE quickfold_dev;
   ```

3. **Configure environment:**
   ```bash
   cp env.development .env
   # Edit .env with your local MySQL credentials
   ```

4. **Test connection:**
   ```bash
   npm run test:db
   ```

### AWS RDS Setup

1. **Create RDS instance** (see AWS RDS setup guide)

2. **Configure environment:**
   ```bash
   cp env.production .env
   # Edit .env with your RDS credentials
   ```

3. **Test connection:**
   ```bash
   npm run test:db
   ```

## Security Best Practices

### Development
- Use weak secrets (they're not secure anyway)
- Allow localhost CORS
- Enable debug logging
- Relax rate limiting

### Staging
- Use different secrets from production
- Enable SSL
- Moderate rate limiting
- Enable test routes

### Production
- Use strong, unique secrets
- Enable SSL with certificate validation
- Strict rate limiting
- Disable debug features
- Enable security headers
- Monitor and log everything

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check database credentials
   - Verify database is running
   - Check network connectivity
   - Verify SSL configuration

2. **CORS Errors**
   - Check CORS_ORIGIN configuration
   - Ensure frontend URL is included
   - Check for trailing slashes

3. **Rate Limiting Issues**
   - Adjust RATE_LIMIT_MAX for your needs
   - Check RATE_LIMIT_WINDOW_MS
   - Consider IP-based limiting

4. **SSL Certificate Issues**
   - Download RDS CA certificate
   - Set DB_SSL_REJECT_UNAUTHORIZED=false for development
   - Use proper SSL configuration for production

### Debug Commands

```bash
# Test database connection
npm run test:db

# Run database migration
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Start application in development mode
npm run dev

# Start application in production mode
npm start
```

## Environment Validation

The application includes environment validation to ensure all required variables are set:

```javascript
// Required environment variables
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'DB_HOST',
  'DB_NAME',
  'DB_USER',
  'JWT_SECRET'
];

// Validate on startup
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});
```

## Deployment Checklist

### Pre-deployment
- [ ] Environment file configured
- [ ] Database credentials set
- [ ] JWT secret configured
- [ ] CORS origins set
- [ ] SSL configuration correct
- [ ] Rate limiting appropriate
- [ ] Security headers enabled

### Post-deployment
- [ ] Database connection tested
- [ ] API endpoints responding
- [ ] Authentication working
- [ ] CORS configuration verified
- [ ] Rate limiting tested
- [ ] Monitoring configured
- [ ] Logs being collected

This comprehensive environment setup ensures your QuickFold application runs smoothly across all deployment environments.

