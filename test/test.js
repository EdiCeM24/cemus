// To implement refresh token logic in your login route, you must generate two distinct tokens upon successful authentication: a short-lived access token and a long-lived refresh token. The access token is returned in the JSON response body, while the refresh token is stored securely in the database and sent to the client via a secure cookie.Here is a step-by-step breakdown and a complete code implementation using Node.js, Express, and JWT.Key Logic ChecklistValidate credentials: Verify the email and password against the database.Generate two tokens: Issue a short-lived access token (e.g., 15 minutes) and a long-lived refresh token (e.g., 7 days).Persist the refresh token: Store the refresh token (or its cryptographic hash) in your database linked to the user's ID.Send tokens securely: Return the access token in the JSON body, and set the refresh token in an httpOnly cookie to shield it from Cross-Site Scripting (XSS) attacks.Step-by-Step Implementation1. Setup Database SchemaYou need a way to map refresh tokens to users in your database. This allows you to track active sessions and revoke tokens if needed.javascript// Example MongoDB/Mongoose Schema
const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
//Use code with caution.2. The Login Route CodeThis Express route handles the credential check, generates both tokens, saves the refresh token to the database, and sends them back to the client.javascriptconst express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const RefreshToken = require('./models/RefreshToken');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Verify User Credentials
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. Generate Access Token (Short-lived)
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    // 3. Generate Refresh Token (Long-lived)
    const rTokenString = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // 4. Save Refresh Token to Database
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now

    await RefreshToken.create({
      userId: user._id,
      token: rTokenString, 
      expiresAt: expiryDate
    });

    // 5. Send Refresh Token via Secure httpOnly Cookie
    res.cookie('refreshToken', rTokenString, {
      httpOnly: true,     // Prevents JavaScript access (XSS protection)
      secure: true,       // Ensures cookie is sent only over HTTPS
      sameSite: 'strict', // Prevents Cross-Site Request Forgery (CSRF)
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });

    // 6. Return Access Token in Response Body
    return res.status(200).json({
      message: 'Login successful',
      accessToken // Client stores this in application memory
    });

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
// Use code with caution.What Happens Next? (The /refresh Endpoint)The login route is only half the battle. When the client notices the accessToken has expired, it must hit a dedicated /refresh endpoint to exchange the cookie-bound refresh token for a brand new access token.javascriptrouter.post('/refresh', async (req, res) => {
  const rToken = req.cookies.refreshToken;
  if (!rToken) return res.status(401).json({ message: 'Refresh token missing' });

  // Verify token exists in database
  const storedToken = await RefreshToken.findOne({ token: rToken });
  if (!storedToken) return res.status(403).json({ message: 'Invalid refresh token' });

  // Verify JWT signature and expiration
  jwt.verify(rToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token expired or altered' });

    // Issue a new short-lived access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  });
});
// Use code with caution.Essential Security MeasuresToken Rotation: To prevent replay attacks, delete the old refresh token from the database and issue a brand new one along with the new access token every time the /refresh endpoint is called.Hashing: For maximum security, do not save the raw refresh token string directly in your database. Hash it using crypto.createHash('sha256') before saving and compare hashes during validation.If you would like to expand this system, let me know what database you are using or if you need help writing the frontend Axios interceptor to handle the token renewals automatically.









// POSTGRESQL DATABASE SETUP
// 1. Create a table for refresh tokens
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



To implement a secure refresh token logic during the login route using PostgreSQL and Sequelize ORM, you must generate a short-lived Access Token (e.g., 15 minutes) and a long-lived Refresh Token (e.g., 7 days) upon successful authentication. The refresh token is saved securely in the database to allow session revocation and tracking.Here is a complete, step-by-step implementation guide using Node.js, Express, jsonwebtoken, and Sequelize.1. Define the RefreshToken ModelFirst, create a RefreshToken model that shares a One-to-Many or One-to-One relationship with your User model. This stores active sessions in your PostgreSQL database.javascript// models/refreshToken.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Your Sequelize instance
const User = require('./user');

const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Setup relationships
User.hasMany(RefreshToken, { foreignKey: 'userId', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

module.exports = RefreshToken;
Use code with caution.2. Create Utility Functions for TokensAbstract the logic to generate access tokens and handle the creation/saving of refresh tokens in the database.javascript// utils/authUtils.js
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const RefreshToken = require('../models/refreshToken');

// Generate short-lived Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email }, 
    process.env.JWT_ACCESS_SECRET, 
    { expiresIn: '15m' } // Short lifespan
  );
};

// Generate and database-persist long-lived Refresh Token
const generateAndSaveRefreshToken = async (user) => {
  const token = uuidv4(); // Cryptographically secure random string or a secondary JWT
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7); // Expires in 7 days

  const refreshToken = await RefreshToken.create({
    token: token,
    userId: user.id,
    expiryDate: expiryDate,
  });

  return refreshToken.token;
};

module.exports = { generateAccessToken, generateAndSaveRefreshToken };
Use code with caution.3. Implement the Login Route ControllerWithin your login handler, verify the user's credentials using bcrypt. If valid, generate both tokens, store the refresh token in an HttpOnly cookie for optimal client security, and send the access token in the JSON body.javascript// controllers/authController.js
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateAndSaveRefreshToken } = require('../utils/authUtils');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Verify user existence
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateAndSaveRefreshToken(user);

    // 4. Securely send refresh token as an HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,       // Prevents XSS reading of the token
      secure: process.env.NODE_ENV === 'production', // true over HTTPS only
      sameSite: 'strict',   // Mitigates CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days matching DB expiry
    });

    // 5. Send access token to frontend memory
    return res.status(200).json({
      message: 'Login successful',
      accessToken,
    });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { login };
Use code with caution.4. Implement the Token Refresh RouteTo maintain seamless user sessions, create a secondary endpoint (e.g., /refresh). The frontend hits this route whenever the short-lived access token expires. It reads the cookie, matches it against PostgreSQL using Sequelize, verifies expiry, and issues a brand-new access token.javascript// controllers/authController.js (continued)
const RefreshToken = require('../models/refreshToken');

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies; // Requires cookie-parser middleware

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh Token required' });
    }

    // 1. Fetch token from PostgreSQL using Sequelize
    const dbToken = await RefreshToken.findOne({ 
      where: { token: refreshToken },
      include: [User] // Eager load user data
    });

    if (!dbToken) {
      return res.status(403).json({ message: 'Invalid Refresh Token' });
    }

    // 2. Validate expiration date
    if (new Date() > dbToken.expiryDate) {
      await dbToken.destroy(); // Cleanup expired token record from DB
      return res.status(403).json({ message: 'Refresh token expired. Please login again.' });
    }

    // 3. Issue a fresh Access Token
    const newAccessToken = generateAccessToken(dbToken.User);

    return res.status(200).json({
      accessToken: newAccessToken,
    });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Use code with caution.5. Best Practices & Optional Security ControlsToken Rotation: Inside the /refresh endpoint, delete the used refresh token from the database and issue a brand-new refresh token alongside the new access token. This limits the blast radius if an attacker compromises a refresh token.Database Cleanup: Set up a background cron job using tools like node-cron to periodically execute raw queries or RefreshToken.destroy({ where: { expiryDate: { [Op.lt]: new Date() } } }) to sweep away dead, expired session strings.Would you like help setting up the global Express middleware to catch expired access tokens, or would you like to see how to implement the logout route to clear tokens from PostgreSQL?
