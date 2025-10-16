# AWS RDS MySQL Setup Guide

This guide will help you set up a MySQL database on AWS RDS for the QuickFold application.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured (optional but recommended)
- Basic understanding of AWS services

## Step 1: Create RDS MySQL Instance

### Via AWS Console:

1. **Navigate to RDS Service**
   - Go to AWS Console → Services → RDS
   - Click "Create database"

2. **Database Configuration**
   ```
   Engine type: MySQL
   Version: MySQL 8.0.35 (or latest)
   Templates: Free tier (for development) or Production
   ```

3. **Instance Settings**
   ```
   DB instance identifier: quickfold-db
   Master username: admin
   Master password: [Generate secure password]
   ```

4. **Instance Configuration**
   ```
   DB instance class: db.t3.micro (Free tier)
   Storage type: General Purpose SSD (gp2)
   Allocated storage: 20 GB
   Storage autoscaling: Enabled (optional)
   ```

5. **Connectivity**
   ```
   VPC: Default VPC
   Subnet group: Default
   Public access: Yes (for development)
   VPC security groups: Create new
   Database port: 3306
   ```

6. **Additional Configuration**
   ```
   Initial database name: quickfold
   Backup retention: 7 days
   Monitoring: Enhanced monitoring (optional)
   ```

## Step 2: Configure Security Group

1. **Find your RDS instance security group**
2. **Edit inbound rules:**
   ```
   Type: MySQL/Aurora
   Protocol: TCP
   Port: 3306
   Source: Your IP address or 0.0.0.0/0 (for development)
   ```

## Step 3: Get Connection Details

After creation, note down:
- **Endpoint**: `quickfold-db.xxxxxxxxx.us-east-1.rds.amazonaws.com`
- **Port**: `3306`
- **Database name**: `quickfold`
- **Username**: `admin`
- **Password**: [Your master password]

## Step 4: Test Connection

### Using MySQL Client:
```bash
mysql -h quickfold-db.xxxxxxxxx.us-east-1.rds.amazonaws.com -P 3306 -u admin -p quickfold
```

### Using MySQL Workbench:
- Hostname: `quickfold-db.xxxxxxxxx.us-east-1.rds.amazonaws.com`
- Port: `3306`
- Username: `admin`
- Password: [Your master password]
- Default Schema: `quickfold`

## Step 5: Environment Configuration

Update your `.env` file in the backend directory:

```env
# AWS RDS Configuration
DB_HOST=quickfold-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=quickfold
DB_USER=admin
DB_PASSWORD=your_master_password

# SSL Configuration (recommended for production)
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false

# Other settings
PORT=3000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
```

## Step 6: Security Best Practices

### For Production:

1. **Use IAM Database Authentication**
   - Create IAM role for RDS
   - Enable IAM authentication in RDS
   - Use IAM tokens instead of passwords

2. **Network Security**
   - Use private subnets for RDS
   - Configure security groups properly
   - Use VPC endpoints

3. **Encryption**
   - Enable encryption at rest
   - Use SSL/TLS for connections
   - Rotate encryption keys regularly

4. **Backup Strategy**
   - Enable automated backups
   - Configure backup retention
   - Test restore procedures

## Step 7: Monitoring and Maintenance

### CloudWatch Metrics:
- CPU Utilization
- Database Connections
- Free Storage Space
- Read/Write IOPS

### Maintenance:
- Regular security updates
- Performance optimization
- Backup verification
- Cost monitoring

## Troubleshooting

### Common Issues:

1. **Connection Timeout**
   - Check security group rules
   - Verify VPC configuration
   - Check network ACLs

2. **Authentication Failed**
   - Verify username/password
   - Check IAM permissions (if using IAM auth)
   - Verify SSL configuration

3. **SSL Certificate Issues**
   - Download RDS CA certificate
   - Configure SSL properly in application
   - Use appropriate SSL mode

## Cost Optimization

### Development:
- Use `db.t3.micro` (Free tier eligible)
- Enable storage autoscaling
- Use single-AZ deployment

### Production:
- Use `db.t3.small` or larger
- Multi-AZ deployment for high availability
- Reserved instances for cost savings
- Regular monitoring of usage

## Next Steps

1. Configure your application with the RDS endpoint
2. Test database connectivity
3. Run database migrations
4. Set up monitoring and alerts
5. Implement backup strategies

