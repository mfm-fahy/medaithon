// WebSocket Service for Real-time Hospital Navigation Updates
const { getRealtimeNavigationUpdate } = require('./hospitalNavigation');

class WebSocketManager {
  constructor() {
    this.clients = new Map(); // Map of patientId -> Set of socket connections
    this.navigationUpdates = new Map(); // Map of patientId -> navigation data
    this.doctorClients = new Map(); // Map of doctorId -> Set of socket connections
    this.doctorQueues = new Map(); // Map of doctorId -> patient queue
    this.pharmacistClients = new Map(); // Map of pharmacistId -> Set of socket connections
    this.medicineUpdates = new Map(); // Map of medicineId -> latest update
  }

  /**
   * Register a patient connection
   * @param {string} patientId - Patient ID
   * @param {object} socket - Socket connection
   */
  registerClient(patientId, socket) {
    if (!this.clients.has(patientId)) {
      this.clients.set(patientId, new Set());
    }
    this.clients.get(patientId).add(socket);
    console.log(`✅ Patient ${patientId} connected. Total connections: ${this.clients.get(patientId).size}`);
  }

  /**
   * Unregister a patient connection
   * @param {string} patientId - Patient ID
   * @param {object} socket - Socket connection
   */
  unregisterClient(patientId, socket) {
    if (this.clients.has(patientId)) {
      this.clients.get(patientId).delete(socket);
      if (this.clients.get(patientId).size === 0) {
        this.clients.delete(patientId);
        console.log(`❌ Patient ${patientId} disconnected`);
      }
    }
  }

  /**
   * Send real-time navigation update to patient
   * @param {string} patientId - Patient ID
   * @param {object} navigationData - Navigation data
   */
  sendNavigationUpdate(patientId, navigationData) {
    if (this.clients.has(patientId)) {
      const update = {
        type: 'navigation-update',
        data: navigationData,
        timestamp: new Date(),
      };

      this.clients.get(patientId).forEach(socket => {
        if (socket.readyState === 1) { // WebSocket.OPEN
          socket.send(JSON.stringify(update));
        }
      });
    }
  }

  /**
   * Broadcast wait time update to all connected patients
   * @param {string} patientId - Patient ID
   * @param {number} newWaitTime - New estimated wait time
   */
  broadcastWaitTimeUpdate(patientId, newWaitTime) {
    const update = {
      type: 'wait-time-update',
      patientId,
      estimatedWaitTime: newWaitTime,
      timestamp: new Date(),
    };

    if (this.clients.has(patientId)) {
      this.clients.get(patientId).forEach(socket => {
        if (socket.readyState === 1) {
          socket.send(JSON.stringify(update));
        }
      });
    }
  }

  /**
   * Send status update to patient
   * @param {string} patientId - Patient ID
   * @param {string} status - New status
   * @param {string} message - Status message
   */
  sendStatusUpdate(patientId, status, message) {
    const update = {
      type: 'status-update',
      status,
      message,
      timestamp: new Date(),
    };

    if (this.clients.has(patientId)) {
      this.clients.get(patientId).forEach(socket => {
        if (socket.readyState === 1) {
          socket.send(JSON.stringify(update));
        }
      });
    }
  }

  /**
   * Get all connected patients
   * @returns {array} List of connected patient IDs
   */
  getConnectedPatients() {
    return Array.from(this.clients.keys());
  }

  /**
   * Check if patient is connected
   * @param {string} patientId - Patient ID
   * @returns {boolean} True if patient is connected
   */
  isPatientConnected(patientId) {
    return this.clients.has(patientId) && this.clients.get(patientId).size > 0;
  }

  /**
   * Get connection count for patient
   * @param {string} patientId - Patient ID
   * @returns {number} Number of active connections
   */
  getConnectionCount(patientId) {
    return this.clients.has(patientId) ? this.clients.get(patientId).size : 0;
  }

  /**
   * Store navigation update
   * @param {string} patientId - Patient ID
   * @param {object} navigationData - Navigation data
   */
  storeNavigationUpdate(patientId, navigationData) {
    this.navigationUpdates.set(patientId, {
      ...navigationData,
      updatedAt: new Date(),
    });
  }

  /**
   * Get stored navigation update
   * @param {string} patientId - Patient ID
   * @returns {object} Navigation data
   */
  getStoredNavigationUpdate(patientId) {
    return this.navigationUpdates.get(patientId);
  }

  /**
   * Clear all data for patient
   * @param {string} patientId - Patient ID
   */
  clearPatientData(patientId) {
    this.clients.delete(patientId);
    this.navigationUpdates.delete(patientId);
  }

  /**
   * Register a doctor connection
   * @param {string} doctorId - Doctor ID
   * @param {object} socket - Socket connection
   */
  registerDoctorClient(doctorId, socket) {
    if (!this.doctorClients.has(doctorId)) {
      this.doctorClients.set(doctorId, new Set());
    }
    this.doctorClients.get(doctorId).add(socket);
    console.log(`✅ Doctor ${doctorId} connected. Total connections: ${this.doctorClients.get(doctorId).size}`);
  }

  /**
   * Unregister a doctor connection
   * @param {string} doctorId - Doctor ID
   * @param {object} socket - Socket connection
   */
  unregisterDoctorClient(doctorId, socket) {
    if (this.doctorClients.has(doctorId)) {
      this.doctorClients.get(doctorId).delete(socket);
      if (this.doctorClients.get(doctorId).size === 0) {
        this.doctorClients.delete(doctorId);
        console.log(`❌ Doctor ${doctorId} disconnected`);
      }
    }
  }

  /**
   * Broadcast to doctor's queue
   * @param {string} doctorId - Doctor ID
   * @param {object} message - Message to send
   */
  broadcastToDoctorQueue(doctorId, message) {
    if (this.doctorClients.has(doctorId)) {
      const update = {
        ...message,
        timestamp: new Date(),
      };

      this.doctorClients.get(doctorId).forEach(socket => {
        if (socket.readyState === 1) { // WebSocket.OPEN
          socket.send(JSON.stringify(update));
        }
      });
      console.log(`🔌 Broadcast to doctor ${doctorId}:`, message.type);
    }
  }

  /**
   * Store doctor queue
   * @param {string} doctorId - Doctor ID
   * @param {array} patients - Patient queue
   */
  storeDoctorQueue(doctorId, patients) {
    this.doctorQueues.set(doctorId, patients);
  }

  /**
   * Get doctor queue
   * @param {string} doctorId - Doctor ID
   * @returns {array} Patient queue
   */
  getDoctorQueue(doctorId) {
    return this.doctorQueues.get(doctorId) || [];
  }

  /**
   * Register a pharmacist connection
   * @param {string} pharmacistId - Pharmacist ID
   * @param {object} socket - Socket connection
   */
  registerPharmacistClient(pharmacistId, socket) {
    if (!this.pharmacistClients.has(pharmacistId)) {
      this.pharmacistClients.set(pharmacistId, new Set());
    }
    this.pharmacistClients.get(pharmacistId).add(socket);
    console.log(`✅ Pharmacist ${pharmacistId} connected. Total connections: ${this.pharmacistClients.get(pharmacistId).size}`);
  }

  /**
   * Unregister a pharmacist connection
   * @param {string} pharmacistId - Pharmacist ID
   * @param {object} socket - Socket connection
   */
  unregisterPharmacistClient(pharmacistId, socket) {
    if (this.pharmacistClients.has(pharmacistId)) {
      this.pharmacistClients.get(pharmacistId).delete(socket);
      if (this.pharmacistClients.get(pharmacistId).size === 0) {
        this.pharmacistClients.delete(pharmacistId);
      }
    }
  }

  /**
   * Broadcast medicine update to all connected pharmacists
   * @param {object} message - Message to broadcast
   */
  broadcastMedicineUpdate(message) {
    const update = {
      ...message,
      timestamp: new Date(),
    };

    // Store the update
    if (message.medicine && message.medicine._id) {
      this.medicineUpdates.set(message.medicine._id, update);
    }

    // Broadcast to all pharmacists
    this.pharmacistClients.forEach((connections) => {
      connections.forEach(socket => {
        if (socket.readyState === 1) { // WebSocket.OPEN
          socket.send(JSON.stringify(update));
        }
      });
    });

    console.log(`🔌 Medicine update broadcasted:`, message.type);
  }

  /**
   * Get stored medicine update
   * @param {string} medicineId - Medicine ID
   * @returns {object} Medicine update
   */
  getStoredMedicineUpdate(medicineId) {
    return this.medicineUpdates.get(medicineId);
  }
}

// Create singleton instance
const wsManager = new WebSocketManager();

module.exports = wsManager;

