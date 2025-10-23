// Hospital Navigation Service
// Generates realistic hospital navigation data with directions and room numbers

const departments = [
  { name: 'OP Nurse', floor: 'Ground Floor', section: 'A' },
  { name: 'Emergency', floor: 'Ground Floor', section: 'B' },
  { name: 'Cardiology', floor: '1st Floor', section: 'C' },
  { name: 'Orthopedics', floor: '1st Floor', section: 'D' },
  { name: 'Pediatrics', floor: '2nd Floor', section: 'E' },
  { name: 'Neurology', floor: '2nd Floor', section: 'F' },
  { name: 'General Surgery', floor: '3rd Floor', section: 'G' },
  { name: 'Radiology', floor: 'Basement', section: 'H' },
];

const directions = [
  'Turn right from the main entrance',
  'Go straight ahead',
  'Turn left at the reception',
  'Take the elevator to your floor',
  'Use the stairs on the left side',
  'Follow the blue corridor',
  'Follow the green corridor',
  'Follow the red corridor',
  'Pass through the main lobby',
  'Go through the automatic doors',
];

const waitTimeRanges = {
  'OP Nurse': { min: 15, max: 45 },
  'Emergency': { min: 5, max: 30 },
  'Cardiology': { min: 20, max: 60 },
  'Orthopedics': { min: 25, max: 50 },
  'Pediatrics': { min: 10, max: 40 },
  'Neurology': { min: 30, max: 75 },
  'General Surgery': { min: 40, max: 90 },
  'Radiology': { min: 15, max: 45 },
};

/**
 * Generate random hospital navigation data
 * @param {string} department - Department name (default: OP Nurse)
 * @returns {object} Navigation data with room number, floor, directions, and wait time
 */
function generateHospitalNavigation(department = 'OP Nurse') {
  const dept = departments.find(d => d.name === department) || departments[0];
  
  // Generate random room number based on floor and section
  const floorNumber = dept.floor === 'Ground Floor' ? 0 : 
                      dept.floor === 'Basement' ? -1 :
                      parseInt(dept.floor.split(' ')[0]);
  
  const roomNumber = `${dept.section}${floorNumber}${Math.floor(Math.random() * 99) + 1}`;
  
  // Generate random directions (2-4 directions)
  const directionCount = Math.floor(Math.random() * 3) + 2;
  const selectedDirections = [];
  const directionsCopy = [...directions];
  
  for (let i = 0; i < directionCount; i++) {
    const randomIndex = Math.floor(Math.random() * directionsCopy.length);
    selectedDirections.push(directionsCopy[randomIndex]);
    directionsCopy.splice(randomIndex, 1);
  }
  
  // Generate estimated wait time
  const waitTimeRange = waitTimeRanges[department] || { min: 15, max: 45 };
  const estimatedWaitTime = Math.floor(
    Math.random() * (waitTimeRange.max - waitTimeRange.min + 1) + waitTimeRange.min
  );
  
  return {
    roomNumber,
    floor: dept.floor,
    department,
    section: dept.section,
    directions: selectedDirections.join(' → '),
    estimatedWaitTime,
    status: 'scheduled',
    lastUpdated: new Date(),
  };
}

/**
 * Get real-time navigation updates (simulated)
 * @param {string} patientId - Patient ID
 * @returns {object} Updated navigation data
 */
function getRealtimeNavigationUpdate(patientId) {
  // Simulate real-time updates by slightly varying wait time
  const variation = Math.floor(Math.random() * 10) - 5; // -5 to +5 minutes
  
  return {
    timestamp: new Date(),
    variation,
    message: variation > 0 ? 
      `Wait time increased by ${variation} minutes` : 
      `Wait time decreased by ${Math.abs(variation)} minutes`,
  };
}

/**
 * Generate QR code data for patient
 * @param {string} patientId - Patient ID
 * @param {string} patientName - Patient name
 * @returns {string} QR code data (JSON stringified)
 */
function generateQRCodeData(patientId, patientName) {
  const qrData = {
    patientId,
    patientName,
    timestamp: new Date().toISOString(),
    type: 'patient-identification',
  };
  
  return JSON.stringify(qrData);
}

/**
 * Get all available departments
 * @returns {array} List of departments
 */
function getAvailableDepartments() {
  return departments.map(d => ({
    name: d.name,
    floor: d.floor,
    section: d.section,
  }));
}

/**
 * Update navigation status
 * @param {string} status - New status
 * @returns {object} Updated status object
 */
function updateNavigationStatus(status) {
  const validStatuses = ['not-scheduled', 'scheduled', 'in-progress', 'completed'];
  
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }
  
  return {
    status,
    updatedAt: new Date(),
  };
}

module.exports = {
  generateHospitalNavigation,
  getRealtimeNavigationUpdate,
  generateQRCodeData,
  getAvailableDepartments,
  updateNavigationStatus,
};

