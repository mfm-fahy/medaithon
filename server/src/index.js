const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();
const { connectDB } = require('./config/database');
const wsManager = require('./services/websocket');

// Import routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const prescriptionRoutes = require('./routes/prescriptions');
const vitalsRoutes = require('./routes/vitals');
const medicineRoutes = require('./routes/medicines');
const labTestRoutes = require('./routes/lab-tests');
const visitsRoutes = require('./routes/visits');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/vitals', vitalsRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/lab-tests', labTestRoutes);
app.use('/api/visits', visitsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('🔌 New WebSocket connection');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'register') {
        // Register patient for real-time updates
        const patientId = data.patientId;
        wsManager.registerClient(patientId, ws);

        ws.patientId = patientId;
        ws.send(JSON.stringify({
          type: 'registered',
          message: `Successfully registered for patient ${patientId}`,
          timestamp: new Date(),
        }));
      } else if (data.type === 'ping') {
        // Keep-alive ping
        ws.send(JSON.stringify({
          type: 'pong',
          timestamp: new Date(),
        }));
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    if (ws.patientId) {
      wsManager.unregisterClient(ws.patientId, ws);
    }
    console.log('🔌 WebSocket connection closed');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🔌 WebSocket server is ready for connections`);
});

