# Myomectomy Aftercare Backend API

A comprehensive Node.js/Express backend API for digitizing aftercare brochures for myomectomy patients, featuring user authentication, symptom tracking, progress monitoring, and email notifications.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone and navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.config.ts  # MongoDB connection
│   │   └── swagger.config.ts   # Swagger documentation
│   ├── controllers/     # Route controllers
│   │   ├── auth.controller.ts      # Authentication & authorization
│   │   ├── brochure.controller.ts  # Brochure content management
│   │   ├── symptom-entry.controller.ts # Symptom tracking
│   │   └── user.controller.ts      # User management
│   ├── routes/          # Express routes
│   │   ├── auth.routes.ts
│   │   ├── brochure.routes.ts
│   │   ├── symptom-entry.routes.ts
│   │   └── user.routes.ts
│   ├── services/        # Business logic
│   │   ├── auth.service.ts         # Authentication logic
│   │   ├── brochure.service.ts     # Brochure operations
│   │   ├── brochure-progress.service.ts # Progress tracking
│   │   ├── email.service.ts        # Email notifications
│   │   ├── symptom-entry.service.ts # Symptom management
│   │   ├── user.service.ts         # User operations
│   │   └── validation.service.ts   # Input validation
│   ├── models/          # Mongoose models
│   │   ├── user.model.ts           # User schema
│   │   ├── symptom-entry.model.ts  # Symptom tracking schema
│   │   └── brochure-progress.model.ts # Progress schema
│   ├── middleware/      # Custom middleware
│   │   └── auth.middleware.ts      # JWT authentication
│   ├── data/            # Static data
│   │   └── brochure.data.ts        # Brochure content
│   └── app.ts           # Main entry point
├── dist/                # Compiled JavaScript
├── .husky/              # Git hooks
├── .env                 # Environment variables
└── package.json         # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled JavaScript
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - TypeScript type checking

## 🌐 API Endpoints

### Base URL

```
http://localhost:3007/api/v1
```

### Authentication Endpoints

#### User Registration

```
POST /auth/register
```

#### User Login

```
POST /auth/login
```

#### Password Reset

```
POST /auth/forgot-password
POST /auth/reset-password
```

#### Email Verification

```
POST /auth/verify-email
POST /auth/resend-verification
```

### User Management Endpoints

#### Get User Profile

```
GET /users/profile
```

#### Update User Profile

```
PUT /users/profile
```

#### Change Password

```
PUT /users/change-password
```

#### Update Surgery Date

```
PUT /users/surgery-date
```

### Brochure Endpoints

#### Get Full Brochure Content

```
GET /brochures/myomectomy
```

#### Get Brochure Sections List

```
GET /brochures/sections
```

#### Get Specific Section

```
GET /brochures/sections/:sectionId
```

#### Track Brochure Progress

```
POST /brochures/progress
GET /brochures/progress/:userId
```

### Symptom Tracking Endpoints

#### Create Symptom Entry

```
POST /tracker/symptoms
```

#### Get User Symptoms

```
GET /tracker/symptoms
```

#### Update Symptom Entry

```
PUT /tracker/symptoms/:id
```

#### Delete Symptom Entry

```
DELETE /tracker/symptoms/:id
```

#### Export Symptoms Data

```
GET /tracker/symptoms/export
```

### Health Check

```
GET /health
```

### API Documentation

```
GET /api-docs
```

Interactive Swagger documentation for all API endpoints.

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin request handling
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs with configurable rounds
- **Input Validation**: Joi schema validation
- **Rate Limiting**: Request throttling
- **Environment Variables**: Secure configuration
- **Email Verification**: Account verification system

## 🛠️ Tech Stack & Development Tools

### Core Technologies

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Joi schema validation
- **Email**: Nodemailer
- **Documentation**: Swagger/OpenAPI

### Development Tools & Code Quality

#### TypeScript Configuration

- **TypeScript**: v5.3.3 for type safety
- **ts-node**: For development execution
- **tsconfig-paths**: Path mapping support
- **tsconfig.json**: Strict type checking enabled

#### ESLint Configuration

- **ESLint**: v8.56.0 for code linting
- **@typescript-eslint**: TypeScript-specific rules
- **Custom Rules**:
  - 2-space indentation
  - Unix line endings
  - Single quotes
  - Semicolons required
  - No unused variables
  - Warn on explicit any types

#### Prettier Configuration

- **Prettier**: v3.1.1 for code formatting
- **Configuration**:
  - Semicolons enabled
  - Single quotes
  - 80 character print width
  - 2-space tabs
  - Trailing commas (ES5)
  - Bracket spacing enabled
  - Arrow function parentheses avoided

#### Git Hooks with Husky

- **Husky**: v8.0.3 for Git hooks
- **lint-staged**: v15.2.0 for staged files
- **Pre-commit Hooks**:
  - Prettier formatting
  - ESLint fixing
  - Type checking

### Notable Packages Used

#### Core Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **joi**: Schema validation
- **nodemailer**: Email sending
- **swagger-jsdoc/swagger-ui-express**: API documentation
- **cors**: Cross-origin resource sharing
- **helmet**: Security headers
- **morgan**: HTTP request logging
- **body-parser**: Request body parsing
- **dotenv**: Environment variables
- **moment**: Date manipulation
- **nanoid**: Unique ID generation
- **uuid**: UUID generation
- **validator**: Additional validation
- **module-alias**: Path aliasing
- **mongoose-paginate-v2**: Pagination support

#### Development Dependencies

- **@types/\***: TypeScript type definitions
- **nodemon**: Development server with hot reload
- **ts-node**: TypeScript execution
- **typescript**: TypeScript compiler
- **eslint**: Code linting
- **prettier**: Code formatting
- **husky**: Git hooks
- **lint-staged**: Staged file processing

## 📊 Data Models

### User Model

```typescript
interface User {
  _id: ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  surgeryDate: Date;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Symptom Entry Model

```typescript
interface SymptomEntry {
  _id: ObjectId;
  userId: ObjectId;
  symptomType: string;
  severity: number;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Brochure Progress Model

```typescript
interface BrochureProgress {
  _id: ObjectId;
  userId: ObjectId;
  sectionId: string;
  completed: boolean;
  notes?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```env
# Server Configuration
PORT=3007
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/myomectomy_db

# Security
JWT_SECRET=your-super-secret-jwt-key-here
BCRYPT_ROUNDS=12

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# API Configuration
API_VERSION=v1
API_PREFIX=/api

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@myomectomy-app.com

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Setup

- Set `NODE_ENV=production`
- Configure production MongoDB URI
- Set secure JWT secret
- Configure CORS for production domain
- Set up email service credentials

## 🔍 Development Workflow

### Code Quality Assurance

1. **TypeScript**: Strict type checking with `tsc --noEmit`
2. **ESLint**: Code linting with custom TypeScript rules
3. **Prettier**: Automatic code formatting
4. **Husky**: Pre-commit hooks ensure code quality
5. **lint-staged**: Only process staged files

### Git Workflow

```bash
# Pre-commit hooks automatically run:
# - prettier --write
# - eslint --fix
# - TypeScript type checking
```

### Development Commands

```bash
# Start development server
npm run dev

# Check code quality
npm run lint
npm run type-check

# Format code
npm run format

# Fix linting issues
npm run lint:fix
```

## 📝 Features Implemented

### ✅ Authentication System

- User registration with email verification
- Secure login with JWT tokens
- Password reset functionality
- Email verification system
- Protected route middleware

### ✅ User Management

- User profile management
- Password change functionality
- Surgery date tracking
- Email preferences

### ✅ Brochure System

- Complete aftercare brochure content
- Section-based content delivery
- Progress tracking per user
- Interactive checklist functionality

### ✅ Symptom Tracking

- Comprehensive symptom logging
- Severity rating system
- Date-based tracking
- Export functionality (Excel)
- CRUD operations for symptoms

### ✅ Email Notifications

- Welcome emails
- Password reset emails
- Email verification
- Customizable email templates

### ✅ API Documentation

- Complete Swagger/OpenAPI documentation
- Interactive API explorer
- Request/response examples
- Authentication documentation

### ✅ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Security headers with Helmet
- Input validation with Joi
- Rate limiting protection

### ✅ Database Integration

- MongoDB with Mongoose ODM
- Connection pooling
- Error handling and reconnection
- Pagination support
- Data validation at schema level

## 🤝 Contributing

1. Follow the existing code style (ESLint + Prettier)
2. Add tests for new features
3. Update documentation
4. Use conventional commits
5. Ensure all pre-commit hooks pass

## 📄 License

ISC License
