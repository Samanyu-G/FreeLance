const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// MongoDB connection with error handling
mongoose.connect('mongodb://127.0.0.1:27017/freelance-hub', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Models
const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String, 
        required: true 
    },
    userType: { 
        type: String, 
        required: true,
        enum: ['client', 'freelancer']
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});

const GigSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    skills: { 
        type: String, 
        required: true 
    },
    image: String,
    freelancerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    freelancerName: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});

const User = mongoose.model('User', UserSchema);
const Gig = mongoose.model('Gig', GigSchema);

// Routes
app.post('/register', async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        
        const { name, email, password, userType } = req.body;

        // Validate input
        if (!name || !email || !password || !userType) {
            return res.status(400).json({ 
                message: 'All fields are required',
                received: { name, email, userType }
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User with this email already exists' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            userType
        });

        await user.save();
        console.log('User registered successfully:', { name, email, userType });
        
        res.status(201).json({ 
            message: 'User created successfully',
            user: {
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ 
            message: 'Registration failed',
            error: error.message 
        });
    }
});

app.post('/login', async (req, res) => {
    try {
        console.log('Login request received:', req.body);
        
        const { email, password, userType } = req.body;

        // Validate input
        if (!email || !password || !userType) {
            return res.status(400).json({ 
                message: 'Email, password and user type are required' 
            });
        }

        // Find user
        const user = await User.findOne({ email, userType });
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid credentials' 
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Invalid credentials' 
            });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('User logged in successfully:', { email, userType });
        
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ 
            message: 'Login failed',
            error: error.message 
        });
    }
});

// Auth middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId });
        
        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

// Other routes
app.get('/verify', auth, (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            userType: req.user.userType
        }
    });
});

// Update the gig posting route with better error handling
app.post('/gigs', auth, upload.single('image'), async (req, res) => {
    try {
        console.log('Creating gig with data:', {
            body: req.body,
            file: req.file,
            user: {
                id: req.user._id,
                name: req.user.name,
                type: req.user.userType
            }
        });

        if (req.user.userType !== 'freelancer') {
            return res.status(403).json({ message: 'Only freelancers can create gigs' });
        }

        const gigData = {
            title: req.body.title,
            description: req.body.description,
            price: Number(req.body.price),
            skills: req.body.skills,
            freelancerId: req.user._id,
            freelancerName: req.user.name
        };

        if (req.file) {
            gigData.image = `/uploads/${req.file.filename}`;
        }

        const gig = new Gig(gigData);
        await gig.save();
        
        console.log('Gig created successfully:', gig);
        res.status(201).json(gig);
    } catch (error) {
        console.error('Error creating gig:', error);
        res.status(400).json({ 
            message: 'Failed to create gig',
            error: error.message,
            details: error
        });
    }
});

app.get('/gigs', auth, async (req, res) => {
    try {
        const gigs = await Gig.find().sort({ date: -1 });
        res.json(gigs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/stats', auth, async (req, res) => {
    try {
        const activeGigs = await Gig.countDocuments();
        const totalFreelancers = await User.countDocuments({ userType: 'freelancer' });
        
        res.json({
            activeGigs,
            totalFreelancers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/gigs/my-gigs', auth, async (req, res) => {
    try {
        const gigs = await Gig.find({ freelancerId: req.user._id }).sort({ date: -1 });
        res.json(gigs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add route for deleting a gig
app.delete('/gigs/:id', auth, async (req, res) => {
    try {
        const gig = await Gig.findOne({ _id: req.params.id, freelancerId: req.user._id });
        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }
        await gig.remove();
        res.json({ message: 'Gig deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});