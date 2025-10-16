# QuickFold Customer App

A React Native mobile application for QuickFold laundry service with Node.js backend.

## Features

- **Welcome Screen**: Beautiful onboarding experience
- **Authentication**: Login and Sign Up functionality
- **User Management**: Profile management and account settings
- **Cross-Platform**: Works on both Android and iOS

## Tech Stack

### Frontend (React Native)
- React Native 0.72.6
- React Navigation 6
- AsyncStorage for data persistence
- Modern UI/UX design

### Backend (Node.js)
- Express.js server
- MySQL with Sequelize ORM
- JWT authentication
- RESTful API design
- Security middleware (Helmet, CORS, Rate Limiting)

## Project Structure

```
quickfold-cutomer-app/
├── src/                          # React Native source code
│   ├── screens/                  # Screen components
│   │   ├── WelcomeScreen.js      # Welcome/Onboarding screen
│   │   ├── LoginScreen.js        # Login screen
│   │   └── SignUpScreen.js      # Registration screen
│   ├── services/                 # API services
│   │   ├── api.js               # API client
│   │   └── authService.js       # Authentication service
│   └── App.js                   # Main app component
├── backend/                      # Node.js backend
│   ├── routes/              # API routes
│   │   ├── auth.js                 # Authentication routes
│   │   └── user.js               # User management routes
│   ├── models/                   # Database models
│   │   └── User.js               # User model (Sequelize)
│   ├── middleware/               # Custom middleware
│   │   └── auth.js               # JWT authentication middleware
│   ├── config/                   # Configuration files
│   │   └── database.js           # MySQL connection (Sequelize)
│   └── server.js                # Main server file
├── android/                      # Android-specific files
├── ios/                          # iOS-specific files
└── package.json                  # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- MySQL (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quickfold-cutomer-app
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up Environment Variables**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=3000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=quickfold
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The API will be available at `http://localhost:3000`

2. **Start the React Native App**
   
   For Android:
   ```bash
   npm run android
   ```
   
   For iOS:
   ```bash
   npm run ios
   ```

3. **Start Metro Bundler** (in a separate terminal)
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/change-password` - Change password

## Development

### Backend Development
- The backend uses Express.js with MySQL and Sequelize ORM
- JWT tokens for authentication
- Password hashing with bcrypt
- Rate limiting and security middleware

### Frontend Development
- React Native with modern hooks
- Navigation using React Navigation
- AsyncStorage for data persistence
- Clean, modern UI design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.