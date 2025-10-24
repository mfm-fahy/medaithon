const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();
const { connectDB } = require('./config/database');
const wsManager = require('./services/websocket');
const biomedicalWS = require('./services/biomedicalWebSocket');

// Import routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const prescriptionRoutes = require('./routes/prescriptions');
const vitalsRoutes = require('./routes/vitals');
const medicineRoutes = require('./routes/medicines');
const labTestRoutes = require('./routes/lab-tests');
const visitsRoutes = require('./routes/visits');
const injectionsRoutes = require('./routes/injections');
const chatbotRoutes = require('./routes/chatbot');
const billingRoutes = require('./routes/billing');
const salesRoutes = require('./routes/sales');
const queueRoutes = require('./routes/queue');
const biomedicalRoutes = require('./routes/biomedical');
const feedbackRoutes = require('./routes/feedback');

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
app.use('/api/injections', injectionsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/biomedical', biomedicalRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  console.log('🔌 New WebSocket connection');

  // Extract query parameters from URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const patientId = url.searchParams.get('patientId');
  const doctorId = url.searchParams.get('doctorId');
  const pharmacistId = url.searchParams.get('pharmacistId');
  const biomedicalUserId = url.searchParams.get('biomedicalUserId');

  // Register biomedical client if biomedicalUserId is provided
  if (biomedicalUserId) {
    console.log('🏥 Biomedical client connected:', biomedicalUserId);
    biomedicalWS.registerBiomedicalClient(ws, biomedicalUserId);
  }

  // Register doctor if doctorId is provided
  if (doctorId) {
    console.log('👨‍⚕️  Doctor connected:', doctorId);
    wsManager.registerDoctorClient(doctorId, ws);
    ws.doctorId = doctorId;
    ws.send(JSON.stringify({
      type: 'doctor-registered',
      message: `Successfully registered for doctor ${doctorId}`,
      timestamp: new Date(),
    }));
  }

  // Register pharmacist if pharmacistId is provided
  if (pharmacistId) {
    console.log('💊 Pharmacist connected:', pharmacistId);
    wsManager.registerPharmacistClient(pharmacistId, ws);
    ws.pharmacistId = pharmacistId;
    ws.send(JSON.stringify({
      type: 'pharmacist-registered',
      message: `Successfully registered for pharmacist ${pharmacistId}`,
      timestamp: new Date(),
    }));
  }

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
      } else if (data.type === 'register-biomedical') {
        // Register biomedical client
        const userId = data.userId;
        biomedicalWS.registerBiomedicalClient(ws, userId);
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
    if (ws.doctorId) {
      wsManager.unregisterDoctorClient(ws.doctorId, ws);
    }
    if (ws.pharmacistId) {
      wsManager.unregisterPharmacistClient(ws.pharmacistId, ws);
    }
    if (ws.isBiomedical) {
      biomedicalWS.unregisterBiomedicalClient(ws);
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

