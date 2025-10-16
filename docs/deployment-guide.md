# QuickFold Deployment Guide

This guide covers deploying the QuickFold application with AWS RDS MySQL database.

## Prerequisites

- AWS Account with RDS access
- Node.js application server (EC2, ECS, or similar)
- Domain name (optional)
- SSL certificate (for production)

## Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │   Node.js API   │    │   AWS RDS       │
│   Mobile App    │◄──►│   Server        │◄──►│   MySQL         │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────────────┘
```

## Step 1: AWS RDS Setup

Follow the [AWS RDS Setup Guide](./aws-rds-setup.md) to create your MySQL database.

## Step 2: Server Deployment

### Option A: EC2 Instance

1. **Launch EC2 Instance**
   ```bash
   # Ubuntu 20.04 LTS
   # Instance type: t3.micro (Free tier) or t3.small
   # Security group: Allow HTTP (80), HTTPS (443), SSH (22)
   ```

2. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   sudo npm install -g pm2
   
   # Install MySQL client (optional)
   sudo apt install mysql-client -y
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd quickfold-cutomer-app/backend
   
   # Install dependencies
   npm install --production
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your RDS configuration
   ```

### Option B: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   
   EXPOSE 3000
   
   CMD ["npm", "start"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - DB_HOST=${DB_HOST}
         - DB_PORT=${DB_PORT}
         - DB_NAME=${DB_NAME}
         - DB_USER=${DB_USER}
         - DB_PASSWORD=${DB_PASSWORD}
         - JWT_SECRET=${JWT_SECRET}
       restart: unless-stopped
   ```

3. **Deploy with Docker**
   ```bash
   docker-compose up -d
   ```

## Step 3: Environment Configuration

### Production Environment Variables

Create `.env` file in backend directory:

```env
# Server Configuration
NODE_ENV=production
PORT=3000

# AWS RDS Configuration
DB_HOST=quickfold-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=quickfold
DB_USER=admin
DB_PASSWORD=your_secure_password

# SSL Configuration
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false

# Connection Pool
DB_POOL_MAX=10
DB_POOL_MIN=2
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRE=7d

# API Configuration
API_VERSION=v1
```

## Step 4: Database Migration

1. **Connect to RDS and create database**
   ```sql
   CREATE DATABASE quickfold;
   ```

2. **Start the application** (tables will be created automatically)
   ```bash
   npm start
   ```

3. **Verify tables created**
   ```sql
   USE quickfold;
   SHOW TABLES;
   ```

## Step 5: Process Management

### Using PM2

1. **Create PM2 ecosystem file**
   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [{
       name: 'quickfold-api',
       script: 'server.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       },
       error_file: './logs/err.log',
       out_file: './logs/out.log',
       log_file: './logs/combined.log',
       time: true
     }]
   };
   ```

2. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

## Step 6: Reverse Proxy (Nginx)

1. **Install Nginx**
   ```bash
   sudo apt install nginx -y
   ```

2. **Configure Nginx**
   ```nginx
   # /etc/nginx/sites-available/quickfold
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/quickfold /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Step 7: SSL Certificate (Let's Encrypt)

1. **Install Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

2. **Obtain SSL certificate**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## Step 8: Monitoring and Logging

### Application Monitoring

1. **Install monitoring tools**
   ```bash
   # Install htop for system monitoring
   sudo apt install htop -y
   
   # Install logrotate for log management
   sudo apt install logrotate -y
   ```

2. **Set up log rotation**
   ```bash
   # /etc/logrotate.d/quickfold
   /var/log/quickfold/*.log {
       daily
       missingok
       rotate 52
       compress
       delaycompress
       notifempty
       create 644 www-data www-data
   }
   ```

### CloudWatch Integration

1. **Install CloudWatch agent**
   ```bash
   wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
   sudo dpkg -i amazon-cloudwatch-agent.deb
   ```

2. **Configure CloudWatch**
   ```json
   {
     "logs": {
       "logs_collected": {
         "files": {
           "collect_list": [
             {
               "file_path": "/var/log/quickfold/combined.log",
               "log_group_name": "/aws/ec2/quickfold",
               "log_stream_name": "{instance_id}"
             }
           ]
         }
       }
     }
   }
   ```

## Step 9: Security Hardening

1. **Firewall Configuration**
   ```bash
   sudo ufw allow ssh
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

2. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict access to specific IPs
   - Regular security updates

3. **Application Security**
   - Use environment variables for secrets
   - Enable rate limiting
   - Use HTTPS only
   - Regular dependency updates

## Step 10: Backup Strategy

### Database Backups

1. **Automated RDS Backups**
   - Enable automated backups in RDS
   - Set retention period (7-30 days)
   - Test restore procedures

2. **Manual Backups**
   ```bash
   # Create backup script
   mysqldump -h your-rds-endpoint -u admin -p quickfold > backup_$(date +%Y%m%d).sql
   ```

### Application Backups

1. **Code Backup**
   - Use Git for version control
   - Regular commits and pushes
   - Tag releases

2. **Configuration Backup**
   - Backup environment files
   - Document configuration changes
   - Version control for configs

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check security group rules
   - Verify RDS endpoint
   - Check SSL configuration

2. **Application Crashes**
   - Check PM2 logs: `pm2 logs`
   - Check system resources: `htop`
   - Check database connectivity

3. **Performance Issues**
   - Monitor CPU and memory usage
   - Check database performance
   - Optimize queries

## Maintenance

### Regular Tasks

1. **Weekly**
   - Check application logs
   - Monitor database performance
   - Review security updates

2. **Monthly**
   - Update dependencies
   - Review backup procedures
   - Security audit

3. **Quarterly**
   - Performance optimization
   - Security penetration testing
   - Disaster recovery testing

## Cost Optimization

1. **RDS Optimization**
   - Use appropriate instance size
   - Monitor usage patterns
   - Consider Reserved Instances

2. **EC2 Optimization**
   - Right-size instances
   - Use Spot Instances for non-critical workloads
   - Monitor and optimize storage

This deployment guide provides a comprehensive approach to deploying QuickFold with AWS RDS MySQL database.

