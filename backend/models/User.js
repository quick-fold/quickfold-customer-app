const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'First name is required'
      },
      len: {
        args: [1, 50],
        msg: 'First name cannot be more than 50 characters'
      }
    }
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Last name is required'
      },
      len: {
        args: [1, 50],
        msg: 'Last name cannot be more than 50 characters'
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Please enter a valid email'
      },
      notEmpty: {
        msg: 'Email is required'
      }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: {
        args: [6, 255],
        msg: 'Password must be at least 6 characters'
      },
      notEmpty: {
        msg: 'Password is required'
      }
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Phone number is required'
      },
      is: {
        args: /^\+?[\d\s\-\(\)]+$/,
        msg: 'Please enter a valid phone number'
      }
    }
  },
  addressStreet: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  addressCity: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  addressState: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  addressZipCode: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  addressCountry: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'US'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  role: {
    type: DataTypes.ENUM('customer', 'admin', 'driver'),
    allowNull: false,
    defaultValue: 'customer'
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = User;
