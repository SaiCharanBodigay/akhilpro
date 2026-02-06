# Signup & Signin with JWT Authentication

A modern web application with user authentication system featuring JWT tokens, MongoDB integration, and persistent login.

## Features

✅ **User Registration (Signup)**
- Email, username, and password validation
- Password strength indicator
- MongoDB database storage
- Bcryptjs password hashing

✅ **User Login (Signin)**
- Secure authentication
- JWT token generation (valid 7 days)
- Remember me functionality
- Persistent session across page refreshes

✅ **Dashboard**
- Protected route with JWT verification
- Display logged-in username and email
- Token information display
- Logout functionality

✅ **Security Features**
- Encrypted passwords (bcryptjs)
- JWT token-based authentication
- Protected API routes
- CORS enabled
- Input validation on frontend and backend

## Tech Stack

**Frontend:**
- HTML5
- CSS3 (with gradients and animations)
- JavaScript (Vanilla)

**Backend:**
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose ODM
- JWT (jsonwebtoken)
- Bcryptjs

## Project Structure

```
akhilpro/
├── signup.html        # Signup page
├── signin.html        # Signin page with auto-login
├── dashboard.html     # Protected dashboard
├── server.js          # Express backend
├── package.json       # Dependencies
├── .env               # Environment variables
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd akhilpro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Create/update `.env` file with:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=appname
     PORT=5000
     JWT_SECRET=your_secret_key_here
     NODE_ENV=development
     ```

4. **Ensure MongoDB is running**
   - Use MongoDB Atlas (cloud) or local MongoDB instance
   - Update `MONGODB_URI` accordingly

5. **Start the server**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`

## Usage

1. **Open Signup Page**
   - Navigate to `signup.html`
   - Enter email, username, and password
   - Submit to create account

2. **Open Signin Page**
   - Navigate to `signin.html`
   - Enter username and password
   - Get JWT token and redirected to dashboard

3. **Dashboard**
   - View your profile information
   - See your JWT token
   - Logout to clear session

## API Endpoints

### POST `/api/signup`
Register a new user
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password",
  "confirmPassword": "password"
}
```

### POST `/api/signin`
Login and get JWT token
```json
{
  "username": "username",
  "password": "password"
}
```
Response includes JWT token

### GET `/api/verify-token`
Verify if JWT token is valid
Headers: `Authorization: Bearer <token>`

### POST `/api/logout`
Logout user (clears session)

### GET `/api/health`
Health check endpoint

### GET `/api/users`
Get all users (for testing - remove in production)

## How JWT Authentication Works

1. User signs in with credentials
2. Backend verifies and generates JWT token
3. Token is stored in browser's localStorage
4. Token sent with each API request in headers
5. Backend verifies token validity
6. On page refresh, token is automatically verified
7. If valid, user stays logged in (auto-login)
8. If invalid/expired, user redirected to signin

This works like Amazon, Netflix, etc. - once you login, you stay logged in!

## Security Notes

⚠️ **For Production:**
- Change `JWT_SECRET` in `.env` to a strong random string
- Use HTTPS instead of HTTP
- Implement refresh tokens for better security
- Add rate limiting on login attempts
- Store sensitive data securely

## Testing

**Test Account:**
- Username: `testuser`
- Password: `123456`

(Created during initial setup)

## Troubleshooting

**"Route not found" error:**
- Ensure server is running on port 5000
- Check MongoDB connection in `.env`

**"Cannot connect to server":**
- Verify `npm start` is running
- Check MongoDB Atlas connection string

**Token not saving:**
- Check browser localStorage is enabled
- Verify no errors in browser console

## Future Enhancements

- Email verification
- Password reset functionality
- Google/GitHub OAuth
- Profile update page
- User profile pictures
- Refresh token implementation
- Rate limiting
- Two-factor authentication

## License

MIT

## Contact

For questions or issues, contact the developer.
