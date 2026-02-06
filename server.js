const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('✓ MongoDB connected successfully');
}).catch(err => {
    console.error('✗ MongoDB connection error:', err);
    process.exit(1);
});

// User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        minlength: 3,
        maxlength: 30
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    field: {
        type: String,
        default: 'Other',
        enum: ['GenAI', 'Agentic AI', 'Computer Vision', 'Natural Language Processing', 'Machine Learning', 'Coding Languages', 'Distributed Systems', 'Quantum Computing', 'Other']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id, email: this.email, username: this.username }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

const User = mongoose.model('User', userSchema);

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.query.token;

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token' 
        });
    }
};

// Routes

// Signup Route
app.post('/api/signup', async (req, res) => {
    try {
        const { email, username, password, field } = req.body;

        // Validation
        if (!email || !username || !password || !field) {
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required' 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                success: false,
                message: 'Password must be at least 6 characters' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Email already registered' 
                });
            } else {
                return res.status(400).json({ 
                    success: false,
                    message: 'Username already taken' 
                });
            }
        }

        // Create new user
        const newUser = new User({ 
            email: email.toLowerCase(), 
            username, 
            password,
            field
        });
        
        await newUser.save();

        res.status(201).json({ 
            success: true,
            message: 'Account created successfully! Redirecting to signin...',
            user: {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                field: newUser.field
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Signin Route
app.post('/api/signin', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Username and password are required' 
            });
        }

        // Find user by username
        const user = await User.findOne({ username }).select('+password');

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Check password
        const isPasswordMatch = await user.matchPassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'Signin successful!',
            token: user.getSignedJwtToken(),
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                field: user.field
            }
        });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// Verify Token Route
app.get('/api/verify-token', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ 
            success: true,
            message: 'Token is valid',
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                field: user.field
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
});

// Logout Route
app.post('/api/logout', (req, res) => {
    res.status(200).json({ 
        success: true,
        message: 'Logged out successfully' 
    });
});

// Get all users (for testing only - remove in production)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ 
            success: true,
            count: users.length,
            users 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        success: true,
        message: 'Server is running' 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        message: 'Route not found' 
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n╔════════════════════════════════════╗`);
    console.log(`║  Server running on port ${PORT}       ║`);
    console.log(`║  http://localhost:${PORT}            ║`);
    console.log(`╚════════════════════════════════════╝\n`);
});
