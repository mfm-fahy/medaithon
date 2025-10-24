const WebSocket = require('ws');

class BiomedicalWebSocketManager {
  constructor() {
    this.clients = new Map(); // Map of userId -> Set of WebSocket connections
    this.biomedicalClients = new Set(); // All biomedical app clients
  }

  /**
   * Register a biomedical app client
   */
  registerBiomedicalClient(ws, userId) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId).add(ws);
    this.biomedicalClients.add(ws);

    console.log(`✅ Biomedical client registered: ${userId}`);
    console.log(`📊 Total biomedical clients: ${this.biomedicalClients.size}`);

    ws.userId = userId;
    ws.isBiomedical = true;

    // Send connection confirmation only if WebSocket is ready
    try {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'connection-established',
          message: 'Connected to biomedical real-time updates',
          timestamp: new Date(),
          userId,
        }));
      } else {
        console.warn(`⚠️ WebSocket not ready for biomedical client ${userId}. State: ${ws.readyState}`);
      }
    } catch (error) {
      console.error(`❌ Error sending confirmation to biomedical client ${userId}:`, error.message);
    }
  }

  /**
   * Unregister a biomedical client
   */
  unregisterBiomedicalClient(ws) {
    if (ws.userId) {
      const userClients = this.clients.get(ws.userId);
      if (userClients) {
        userClients.delete(ws);
        if (userClients.size === 0) {
          this.clients.delete(ws.userId);
        }
      }
    }
    this.biomedicalClients.delete(ws);
    console.log(`❌ Biomedical client disconnected`);
    console.log(`📊 Total biomedical clients: ${this.biomedicalClients.size}`);
  }

  /**
   * Broadcast equipment update to all biomedical clients
   */
  broadcastEquipmentUpdate(equipment, action = 'updated') {
    const message = JSON.stringify({
      type: 'equipment-update',
      action, // 'added', 'updated', 'deleted', 'maintenance-logged'
      data: equipment,
      timestamp: new Date(),
    });

    this.biomedicalClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    console.log(`📡 Equipment ${action} broadcasted to ${this.biomedicalClients.size} clients`);
  }

  /**
   * Broadcast waste record update to all biomedical clients
   */
  broadcastWasteUpdate(wasteRecord, action = 'updated') {
    const message = JSON.stringify({
      type: 'waste-update',
      action, // 'added', 'updated', 'deleted', 'collected', 'dispatched'
      data: wasteRecord,
      timestamp: new Date(),
    });

    this.biomedicalClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    console.log(`📡 Waste record ${action} broadcasted to ${this.biomedicalClients.size} clients`);
  }

  /**
   * Broadcast collection task update to all biomedical clients
   */
  broadcastCollectionTaskUpdate(task, action = 'updated') {
    const message = JSON.stringify({
      type: 'collection-task-update',
      action, // 'added', 'updated', 'completed', 'in-progress'
      data: task,
      timestamp: new Date(),
    });

    this.biomedicalClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    console.log(`📡 Collection task ${action} broadcasted to ${this.biomedicalClients.size} clients`);
  }

  /**
   * Broadcast dispatch schedule update to all biomedical clients
   */
  broadcastDispatchUpdate(dispatch, action = 'updated') {
    const message = JSON.stringify({
      type: 'dispatch-update',
      action, // 'added', 'updated', 'scheduled', 'in-transit', 'delivered'
      data: dispatch,
      timestamp: new Date(),
    });

    this.biomedicalClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    console.log(`📡 Dispatch ${action} broadcasted to ${this.biomedicalClients.size} clients`);
  }

  /**
   * Broadcast dashboard statistics update
   */
  broadcastStatsUpdate(stats, type = 'equipment') {
    const message = JSON.stringify({
      type: `${type}-stats-update`,
      data: stats,
      timestamp: new Date(),
    });

    this.biomedicalClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    console.log(`📊 ${type} stats update broadcasted to ${this.biomedicalClients.size} clients`);
  }

  /**
   * Send notification to specific user
   */
  notifyUser(userId, notification) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      const message = JSON.stringify({
        type: 'notification',
        data: notification,
        timestamp: new Date(),
      });

      userClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  }

  /**
   * Get total connected clients
   */
  getConnectedClientsCount() {
    return this.biomedicalClients.size;
  }

  /**
   * Get clients for specific user
   */
  getUserClientsCount(userId) {
    const userClients = this.clients.get(userId);
    return userClients ? userClients.size : 0;
  }
}

module.exports = new BiomedicalWebSocketManager();

