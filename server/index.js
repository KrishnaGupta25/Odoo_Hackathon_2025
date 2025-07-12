const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// In-memory storage (replace with database in production)
let users = [];
let items = [];
let swaps = [];

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
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
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
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      points: 100, // Starting points
      role: 'user',
      createdAt: new Date()
    };

    users.push(newUser);

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        points: newUser.points,
        role: newUser.role
      }
    });
  } catch (error) {
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
    const user = users.find(u => u.email === email);
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
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        points: user.points,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    points: user.points,
    role: user.role
  });
});

// Add new item
app.post('/api/items', authenticateToken, upload.array('images', 5), (req, res) => {
  try {
    const { title, description, category, type, size, condition, tags } = req.body;
    const images = req.files ? req.files.map(file => file.filename) : [];

    const newItem = {
      id: uuidv4(),
      userId: req.user.id,
      title,
      description,
      category,
      type,
      size,
      condition,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      images,
      status: 'pending', // pending, approved, rejected
      createdAt: new Date(),
      available: true
    };

    items.push(newItem);

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating item' });
  }
});

// Get all approved items
app.get('/api/items', (req, res) => {
  const approvedItems = items.filter(item => item.status === 'approved' && item.available);
  res.json(approvedItems);
});

// Get item by ID
app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.json(item);
});

// Get user's items
app.get('/api/user/items', authenticateToken, (req, res) => {
  const userItems = items.filter(item => item.userId === req.user.id);
  res.json(userItems);
});

// Request swap
app.post('/api/swaps', authenticateToken, (req, res) => {
  const { itemId, swapType } = req.body; // swapType: 'direct' or 'points'

  const item = items.find(i => i.id === itemId);
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  if (!item.available) {
    return res.status(400).json({ message: 'Item not available' });
  }

  const user = users.find(u => u.id === req.user.id);
  
  if (swapType === 'points') {
    const pointsCost = 50; // Points cost for redemption
    if (user.points < pointsCost) {
      return res.status(400).json({ message: 'Insufficient points' });
    }
    
    // Deduct points
    user.points -= pointsCost;
  }

  const newSwap = {
    id: uuidv4(),
    requesterId: req.user.id,
    itemId,
    swapType,
    status: 'pending', // pending, accepted, rejected, completed
    createdAt: new Date()
  };

  swaps.push(newSwap);

  res.status(201).json(newSwap);
});

// Get user's swaps
app.get('/api/user/swaps', authenticateToken, (req, res) => {
  const userSwaps = swaps.filter(swap => swap.requesterId === req.user.id);
  res.json(userSwaps);
});

// Admin routes

// Get pending items for approval
app.get('/api/admin/pending-items', authenticateToken, isAdmin, (req, res) => {
  const pendingItems = items.filter(item => item.status === 'pending');
  res.json(pendingItems);
});

// Approve/reject item
app.put('/api/admin/items/:id/status', authenticateToken, isAdmin, (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'
  
  const item = items.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  item.status = status;
  res.json(item);
});

// Remove item
app.delete('/api/admin/items/:id', authenticateToken, isAdmin, (req, res) => {
  const itemIndex = items.findIndex(i => i.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  // Remove associated images
  const item = items[itemIndex];
  item.images.forEach(image => {
    const imagePath = path.join(__dirname, 'uploads', image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  });

  items.splice(itemIndex, 1);
  res.json({ message: 'Item removed successfully' });
});

// Create admin user (for testing)
app.post('/api/admin/create', (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = users.find(user => user.email === 'admin@rewear.com');
    if (existingAdmin) {
      return res.json({ 
        message: 'Admin user already exists',
        credentials: {
          email: 'admin@rewear.com',
          password: 'admin123'
        }
      });
    }

    const adminUser = {
      id: uuidv4(),
      email: 'admin@rewear.com',
      password: bcrypt.hashSync('admin123', 10),
      name: 'Admin User',
      points: 1000,
      role: 'admin',
      createdAt: new Date()
    };

    users.push(adminUser);
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
const createDefaultAdmin = () => {
  const existingAdmin = users.find(user => user.email === 'admin@rewear.com');
  if (!existingAdmin) {
    const adminUser = {
      id: uuidv4(),
      email: 'admin@rewear.com',
      password: bcrypt.hashSync('admin123', 10),
      name: 'Admin User',
      points: 1000,
      role: 'admin',
      createdAt: new Date()
    };
    users.push(adminUser);
    console.log('✅ Default admin user created:');
    console.log('   Email: admin@rewear.com');
    console.log('   Password: admin123');
  } else {
    console.log('✅ Admin user already exists');
  }
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  createDefaultAdmin();
}); 