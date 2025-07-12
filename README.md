# ReWear - Community Clothing Exchange Platform

ReWear is a modern web-based platform that enables users to exchange unused clothing through direct swaps or a point-based redemption system. The goal is to promote sustainable fashion and reduce textile waste by encouraging users to reuse wearable garments instead of discarding them.

## 🌟 Features

### User Authentication
- Email/password signup and login
- JWT-based authentication
- Protected routes and user sessions

### Landing Page
- Platform introduction with compelling messaging
- Calls-to-action: "Start Swapping", "Browse Items", "List an Item"
- Featured items carousel with automatic rotation
- Modern, responsive design with animations

### User Dashboard
- Profile details and points balance display
- Uploaded items overview with status tracking
- Ongoing and completed swaps list
- Quick actions for common tasks

### Item Detail Page
- Image gallery with thumbnail navigation
- Full item description and specifications
- Uploader information
- Options: "Swap Request" or "Redeem via Points"
- Item availability status indicators

### Add New Item Page
- Multi-image upload (up to 5 images)
- Comprehensive form with title, description, category, type, size, condition, and tags
- Real-time image preview and validation
- Submission to listing queue

### Admin Role
- Moderate and approve/reject item listings
- Remove inappropriate or spam items
- Lightweight admin panel for oversight
- Statistics and moderation guidelines

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **JWT** for authentication
- **bcryptjs** for password hashing
- **multer** for file uploads
- **express-validator** for input validation
- **CORS** for cross-origin requests

### Frontend
- **React 18** with functional components and hooks
- **React Router** for navigation
- **Axios** for API communication
- **Framer Motion** for animations
- **React Icons** for consistent iconography
- **React Hot Toast** for notifications

### Styling
- Custom CSS with utility classes
- Responsive design with mobile-first approach
- Modern color scheme and typography
- Smooth transitions and hover effects

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rewear
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd server && npm install
   
   # Install frontend dependencies
   cd ../client && npm install
   ```

3. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

### Environment Setup

Create a `.env` file in the server directory:
```env
PORT=5000
JWT_SECRET=your-secret-key-here
```

## 📁 Project Structure

```
rewear/
├── server/                 # Backend API
│   ├── index.js           # Main server file
│   ├── package.json       # Backend dependencies
│   └── uploads/           # Image upload directory
├── client/                # Frontend React app
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json       # Frontend dependencies
├── package.json           # Root package.json
└── README.md             # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile

### Items
- `GET /api/items` - Get all approved items
- `GET /api/items/:id` - Get specific item
- `POST /api/items` - Create new item (with images)
- `GET /api/user/items` - Get user's items

### Swaps
- `POST /api/swaps` - Request swap
- `GET /api/user/swaps` - Get user's swaps

### Admin
- `GET /api/admin/pending-items` - Get pending items
- `PUT /api/admin/items/:id/status` - Approve/reject item
- `DELETE /api/admin/items/:id` - Remove item
- `POST /api/admin/create` - Create admin user

## 🎨 Design Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Accessibility**: Proper semantic HTML and keyboard navigation
- **Loading States**: Spinners and skeleton screens for better UX
- **Error Handling**: Comprehensive error messages and fallbacks
- **Image Optimization**: Automatic image compression and validation

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Stateless authentication with token expiration
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Image type and size validation
- **CORS Protection**: Configured for secure cross-origin requests
- **Admin Authorization**: Role-based access control

## 🌱 Sustainability Focus

ReWear promotes sustainable fashion by:
- Encouraging clothing reuse instead of disposal
- Building a community around sustainable practices
- Providing a platform for conscious consumption
- Reducing textile waste through community exchange

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@rewear.com or create an issue in the repository.

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Install dependencies: `npm install`
3. Start the server: `npm start`

### Frontend Deployment
1. Build the project: `npm run build`
2. Serve the build folder with a static server

### Database (Future Enhancement)
Currently using in-memory storage. For production, consider:
- PostgreSQL for relational data
- MongoDB for document storage
- Redis for caching and sessions

---

**ReWear** - Making sustainable fashion accessible to everyone! 🌿👕 # odoo
