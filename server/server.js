require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const killPort = require("kill-port");
const getPort = require("get-port").default;
const { Server } = require('socket.io');
const { connectDB } = require('./config/db');
const app = require('./app')
const {
  errorHandler,
  notFound,
  handleUncaughtExceptions,
  handleUnhandledRejections,
} = require('./middleware/errorMiddleware');

// Handle uncaught exceptions
handleUncaughtExceptions();

// Connect to MongoDB
// connectDB(); // Commented out to run without DB

// Security middleware
app.use(helmet()); // Set security headers
app.use(xss()); // Prevent XSS attacks

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Regular middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads', 'profiles')));

// Import routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const userRoutes = require('./routes/users');
const chatbotRoutes = require('./routes/chatbot');
const reviewRoutes = require('./routes/reviews');
const bookingRoutes = require('./routes/bookings');
const uploadRoutes = require('./routes/upload');
const notificationRoutes = require('./routes/notificationRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notesRoutes = require('./routes/notes');

// Import services
const notificationService = require('./services/notificationService');
const securityService = require('./services/securityService');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/notes', notesRoutes);

// Base route
app.get('/api/', (req, res) => {
  res.json({
    message: 'Welcome to House Rental API',
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);



const PORT = parseInt(process.env.PORT, 10) || 5000;

const checkPort = async (port, maxPort = 65535) => {
  if (port > maxPort) {
    throw new Error("No available ports found");
  }

  try {
    await killPort(port, "tcp");
    await killPort(port, "udp");
    return port;
  } catch (err) {
    return checkPort(port + 1, maxPort);
  }
};

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

const startServer = async () => {
  const safePort = await checkPort(PORT);
  const final_port = await getPort({ port: safePort });

  const server = app.listen(final_port, () => {
    console.log(`Server running on port ${final_port}`);
  });

  // Initialize Socket.IO
  const initializeSocket = require('./socket');
  const io = initializeSocket(server);

  // Initialize WebSocket services
  notificationService.initialize(server);

  // Initialize security service
  securityService.initialize();

  // Handle unhandled promise rejections
  handleUnhandledRejections(server);

};

startServer();

