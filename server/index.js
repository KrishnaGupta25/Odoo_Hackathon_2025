const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const connectDB = require('./config/db');

// Import models
const User = require('./models/User');
const Item = require('./models/Item');
const Swap = require('./models/Swap');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    
    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(403).json({ message: 'User not found' });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  });
};

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 })
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
];

// Routes

// User Registration
app.post('/api/auth/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      points: 100, // Starting points
      role: 'user'
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        points: newUser.points,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login
app.post('/api/auth/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        points: user.points,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    points: req.user.points,
    role: req.user.role
  });
});

// Add new item
app.post('/api/items', authenticateToken, upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, category, type, size, condition, tags } = req.body;
    const images = req.files ? req.files.map(file => file.filename) : [];

    const newItem = new Item({
      userId: req.user._id,
      title,
      description,
      category,
      type,
      size,
      condition,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      images,
      status: 'pending', // pending, approved, rejected
      available: true
    });

    await newItem.save();

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Error creating item' });
  }
});

// Get all approved items
app.get('/api/items', async (req, res) => {
  try {
    const approvedItems = await Item.find({ 
      status: 'approved', 
      available: true 
    }).populate('userId', 'name email');
    res.json(approvedItems);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

// Get item by ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('userId', 'name email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Error fetching item' });
  }
});

// Get user's items
app.get('/api/user/items', authenticateToken, async (req, res) => {
  try {
    const userItems = await Item.find({ userId: req.user._id });
    res.json(userItems);
  } catch (error) {
    console.error('Error fetching user items:', error);
    res.status(500).json({ message: 'Error fetching user items' });
  }
});

// Request swap
app.post('/api/swaps', authenticateToken, async (req, res) => {
  try {
    const { itemId, swapType } = req.body; // swapType: 'direct' or 'points'

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (!item.available) {
      return res.status(400).json({ message: 'Item not available' });
    }

    if (swapType === 'points') {
      const pointsCost = 50; // Points cost for redemption
      if (req.user.points < pointsCost) {
        return res.status(400).json({ message: 'Insufficient points' });
      }
      
      // Deduct points
      req.user.points -= pointsCost;
      await req.user.save();
    }

    const newSwap = new Swap({
      requesterId: req.user._id,
      itemId,
      swapType,
      status: 'pending' // pending, accepted, rejected, completed
    });

    await newSwap.save();

    res.status(201).json(newSwap);
  } catch (error) {
    console.error('Error creating swap:', error);
    res.status(500).json({ message: 'Error creating swap' });
  }
});

// Get user's swaps
app.get('/api/user/swaps', authenticateToken, async (req, res) => {
  try {
    const userSwaps = await Swap.find({ requesterId: req.user._id })
      .populate('itemId', 'title images')
      .populate('requesterId', 'name email');
    res.json(userSwaps);
  } catch (error) {
    console.error('Error fetching user swaps:', error);
    res.status(500).json({ message: 'Error fetching user swaps' });
  }
});

// Update swap status (complete/accept/reject)
app.put('/api/swaps/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body; // expected: 'completed', 'accepted', 'rejected'
    const swap = await Swap.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }
    if (swap.status === status) {
      return res.status(400).json({ message: 'Swap already has this status' });
    }
    // Only item owner or admin can complete/accept/reject
    const item = await Item.findById(swap.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    if (
      req.user.role !== 'admin' &&
      !item.userId.equals(req.user._id)
    ) {
      return res.status(403).json({ message: 'Only the item owner or admin can update swap status' });
    }
    // Only allow points transfer on completion
    if (status === 'completed' && swap.status !== 'completed') {
      const requester = await User.findById(swap.requesterId);
      const owner = await User.findById(item.userId);
      // Find admin user
      const adminUser = await User.findOne({ role: 'admin' });
      if (!requester || !owner || !adminUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (swap.swapType === 'points') {
        const swapValue = 50;
        const adminFee = Math.floor(swapValue * 0.1); // 5 points
        // Check requester has enough points
        if (requester.points < swapValue) {
          return res.status(400).json({ message: 'Requester has insufficient points' });
        }
        requester.points -= swapValue; // requester pays full amount
        owner.points += swapValue - adminFee; // owner receives 90%
        adminUser.points += adminFee * 2; // admin gets 10% from both
        await requester.save();
        await owner.save();
        await adminUser.save();
      } else if (swap.swapType === 'direct') {
        const swapFee = 10;
        const adminFee = Math.max(1, Math.floor(swapFee * 0.1)); // 1 point
        // Check both have enough points
        if (requester.points < swapFee || owner.points < swapFee) {
          return res.status(400).json({ message: 'Both users must have at least 10 points' });
        }
        requester.points -= swapFee; // requester pays full fee
        owner.points -= swapFee; // owner pays full fee
        adminUser.points += adminFee * 2; // admin gets 10% from both
        await requester.save();
        await owner.save();
        await adminUser.save();
      }
      // Mark item as unavailable
      item.available = false;
      await item.save();
    }
    swap.status = status;
    await swap.save();
    res.json(swap);
  } catch (error) {
    console.error('Error updating swap status:', error);
    res.status(500).json({ message: 'Error updating swap status' });
  }
});

// Admin routes

// Get pending items for approval
app.get('/api/admin/pending-items', authenticateToken, isAdmin, async (req, res) => {
  try {
    const pendingItems = await Item.find({ status: 'pending' })
      .populate('userId', 'name email');
    res.json(pendingItems);
  } catch (error) {
    console.error('Error fetching pending items:', error);
    res.status(500).json({ message: 'Error fetching pending items' });
  }
});

// Approve/reject item
app.put('/api/admin/items/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.status = status;
    await item.save();
    
    res.json(item);
  } catch (error) {
    console.error('Error updating item status:', error);
    res.status(500).json({ message: 'Error updating item status' });
  }
});

// Remove item
app.delete('/api/admin/items/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Remove associated images
    item.images.forEach(image => {
      const imagePath = path.join(__dirname, 'uploads', image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed successfully' });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({ message: 'Error removing item' });
  }
});

// Create admin user (for testing)
app.post('/api/admin/create', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@rewear.com' });
    if (existingAdmin) {
      return res.json({ 
        message: 'Admin user already exists',
        credentials: {
          email: 'admin@rewear.com',
          password: 'admin123'
        }
      });
    }

    const adminUser = new User({
      email: 'admin@rewear.com',
      password: bcrypt.hashSync('admin123', 10),
      name: 'Admin User',
      points: 1000,
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created:', adminUser.email);
    res.json({ 
      message: 'Admin user created successfully',
      credentials: {
        email: 'admin@rewear.com',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Error creating admin user' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large' });
    }
  }
  res.status(500).json({ message: 'Server error' });
});

// Create default admin user on server start
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@rewear.com' });
    if (!existingAdmin) {
      const adminUser = new User({
        email: 'admin@rewear.com',
        password: bcrypt.hashSync('admin123', 10),
        name: 'Admin User',
        points: 1000,
        role: 'admin'
      });
      await adminUser.save();
      console.log('✅ Default admin user created:');
      console.log('   Email: admin@rewear.com');
      console.log('   Password: admin123');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await createDefaultAdmin();
}); 