# MongoDB Setup Guide for ReWear

## ✅ What's Been Done

1. **Mongoose Models Created:**
   - `server/models/User.js` - User schema with email, password, name, points, role
   - `server/models/Item.js` - Item schema with all item properties
   - `server/models/Swap.js` - Swap schema for exchange requests

2. **Database Connection:**
   - `server/config/db.js` - MongoDB connection configuration
   - Updated `server/index.js` to use MongoDB instead of in-memory arrays

3. **All Routes Updated:**
   - User registration/login now saves to MongoDB
   - Item creation/retrieval uses MongoDB
   - Swap requests use MongoDB
   - Admin routes use MongoDB
   - Authentication middleware updated for MongoDB ObjectIds

## 🚀 Next Steps

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
MONGODB_URI=mongodb://localhost:27017/rewear
```

### 3. Start MongoDB
**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Replace `MONGODB_URI` in `.env` with your Atlas connection string
- Format: `mongodb+srv://username:password@cluster.mongodb.net/rewear`

### 4. Start Your Server
```bash
cd server
npm run dev
```

## 🔧 Key Changes Made

### Before (In-Memory Arrays):
```javascript
let users = [];
let items = [];
let swaps = [];

// Find user
const user = users.find(u => u.email === email);
```

### After (MongoDB):
```javascript
// Find user
const user = await User.findOne({ email });
```

### Authentication:
- Now uses MongoDB ObjectIds (`_id`) instead of UUID strings
- JWT tokens contain MongoDB ObjectIds
- All database operations are async/await

### Data Persistence:
- All data now persists between server restarts
- Proper database relationships with references
- Better data validation and schema enforcement

## 🎯 Benefits

1. **Data Persistence** - Data survives server restarts
2. **Scalability** - Can handle more users and data
3. **Relationships** - Proper foreign key relationships
4. **Validation** - Schema-based data validation
5. **Performance** - Indexed queries for better performance
6. **Production Ready** - Suitable for deployment

## 🐛 Troubleshooting

### Connection Issues:
- Make sure MongoDB is running
- Check your connection string
- Verify network connectivity (for Atlas)

### Import Errors:
- Make sure all model files exist in `server/models/`
- Check file paths in imports

### Data Migration:
- Old in-memory data will be lost
- New users will need to register again
- Admin user will be created automatically on first run

## 📊 Database Collections

Your MongoDB will have these collections:
- `users` - User accounts and profiles
- `items` - Clothing items for exchange
- `swaps` - Exchange requests and transactions

All collections are automatically created when you first save data to them. 