# Ready Server - MongoDB & Express.js Boilerplate

A robust and feature-rich server boilerplate built with Express.js, TypeScript, and MongoDB, incorporating best practices and essential features for rapid development.

## 🚀 Features

### Authentication & Authorization
- 🔐 User authentication (Login/Signup)
- 🔄 Refresh token mechanism
- 🎫 JWT-based authentication
- 👮‍♂️ Role-based access control

### User Management
- 👤 User profile management
- 👥 Admin user management
- 📝 Profile updates
- 🔍 User search and filtering

### Security & Performance
- 🛡️ ESLint configuration
- 📝 Winston logger implementation
- ❌ Global error handling
- 🔄 Uncaught error handling
- ✅ Zod validation
- 🚧 Rate limiting
- 🔒 Helmet security
- 📦 Compression

### Development Features
- 🐳 Docker support
- 🔄 GitHub Actions CI/CD
- 🎯 TypeScript support
- 🎨 Prettier code formatting

### Advance features
- explore swagger docs by `/api-docs` .
- use ready cli by `npm install -g .` and  `tran`

## 🛠️ Technologies

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Validation**: Zod
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting
- **Development**: ESLint, Prettier
- **Deployment**: Docker, PM2

## 💡 Use Cases

- Startup MVPs
- Enterprise applications
- RESTful API services
- Microservices
- Authentication services
- User management systems


## 🚀 Getting Started

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd ready-serversMongoose
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Update .env with your configurations
   ```

3. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Development Mode**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Production Build**
   ```bash
   npm run build
   npm start
   # or
   yarn build
   yarn start
   ```

## 🔧 Environment Variables

```env

# Environment Configuration
NODE_ENV=development
PORT=3000
SERVER_NAME=my-server
ALLOWED_ORIGINS=http://localhost:3000
DB_URL=mongodb://localhost:27017/mydatabase
TEST_DATABASE_URL=mongodb://localhost:27017/testdatabase
HTTPS=false

# JWT Configuration
JWT_SECRET=my_jwt_secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=my_jwt_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d

# Server Configuration
SERVER_URL=http://localhost:3000

# SMTP Configuration
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SERVICE=Mailgun
SMTP_MAIL=example@mail.com
SMTP_PASSWORD=my_smtp_password
SERVICE_NAME=my_service

# Stripe Configuration
STRIPE_SECRET_KEY=stripe_secret_key

# Super Admin Credentials
SUPERADMIN_EMAIL=admin@example.com
SUPERADMIN_PASSWORD=admin_password

# S3 Configuration
S3_ACCESS_KEY_ID=my_access_key_id
S3_SECRET_ACCESS_KEY=my_secret_access_key
S3_BUCKET=my_bucket_name
S3_REGION=my_region


```

## 📁 Project Structure

```
src/
├── app/
│   ├── modules/
│   │   ├── auth/
│   │   └── users/
│   ├── middlewares/
│   └── utils/
├── config/
├── interfaces/
└── server.ts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.



## 📝 License

This project is not current licensed under the ISC License.

---

Made with ❤️ by [sarwar-asik]
