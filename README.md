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
DB_URL=mongodb+srv://[username]:[password]@[cluster].mongodb.net/[database]
NODE_ENV=development
PORT=5000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=365d
JWT_REFRESH_EXPIRES_IN=365d

SUPERADMIN_EMAIL='admin@admin.com'
SUPERADMIN_PASSWORD='admin'


SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SERVICE=gmail
SMTP_MAIL=your_email
SMTP_PASSWORD=your_password

STRIPE_SECRET_KEY=your_stripe_secret_key

ALLOWED_ORIGINS=http://localhost:3000


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

This project is licensed under the ISC License.

---

Made with ❤️ by [sarwar-asik]
