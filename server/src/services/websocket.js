// WebSocket Service for Real-time Hospital Navigation Updates
const { getRealtimeNavigationUpdate } = require('./hospitalNavigation');

class WebSocketManager {
  constructor() {
    this.clients = new Map(); // Map of patientId -> Set of socket connections
    this.navigationUpdates = new Map(); // Map of patientId -> navigation data
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
}

// Create singleton instance
const wsManager = new WebSocketManager();

module.exports = wsManager;

