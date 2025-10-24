# 🔌 WebSocket Error Debugging Guide

## Error: `WebSocket error: {}`

### What This Error Means
The WebSocket connection encountered an error, but the error object is empty `{}`. This is a common issue that makes debugging difficult because the browser doesn't provide detailed error information for WebSocket errors.

---

## 🔍 Root Causes

### 1. **Server Not Running**
- The backend server on port 5000 is not running
- **Check**: Open browser console and look for connection timeout

### 2. **Port Mismatch**
- Client trying to connect to wrong port
- **Check**: Verify port 5000 in both client and server

### 3. **Firewall/Proxy Blocking**
- Network firewall blocking WebSocket connections
- Corporate proxy interfering with WebSocket protocol
- **Check**: Try connecting from different network

### 4. **Protocol Mismatch**
- HTTPS page trying to connect to `ws://` (should use `wss://`)
- HTTP page trying to connect to `wss://` (should use `ws://`)
- **Check**: Browser console shows protocol in connection URL

### 5. **CORS Issues**
- Cross-Origin Resource Sharing blocking connection
- **Check**: Server CORS configuration

### 6. **Network Connectivity**
- Client offline or no internet connection
- DNS resolution failing
- **Check**: Test basic connectivity first

---

## 🛠️ Debugging Steps

### Step 1: Check Server Status
```bash
# Verify server is running
curl http://localhost:5000/health

# Expected response:
# {"message":"Server is running"}
```

### Step 2: Check Browser Console
Open DevTools (F12) and look for:
- Connection URL being attempted
- Connection details (protocol, host, port)
- Close code and reason (if disconnected)
- Error details with timestamp

### Step 3: Verify Network Connection
```bash
# Test connectivity to server
ping localhost

# Test port availability
netstat -an | grep 5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows
```

### Step 4: Check Firewall
- Windows: Check Windows Defender Firewall
- Mac: Check System Preferences > Security & Privacy
- Linux: Check iptables or firewall-cmd

### Step 5: Test WebSocket Directly
```javascript
// In browser console
const ws = new WebSocket('ws://localhost:5000');
ws.onopen = () => console.log('Connected!');
ws.onerror = (e) => console.log('Error:', e);
ws.onclose = (e) => console.log('Closed:', e.code, e.reason);
```

---

## 📊 Enhanced Error Logging

The equipment and waste pages now include detailed error logging:

### Connection Details Logged
```javascript
{
  protocol: 'ws:' or 'wss:',
  host: 'localhost',
  port: 5000,
  userId: 'biomedical_admin',
  timestamp: '2025-10-24T...'
}
```

### Error Details Logged
```javascript
{
  type: 'error',
  message: 'Error message if available',
  timestamp: '2025-10-24T...',
  readyState: 0-3,  // 0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED
  url: 'ws://localhost:5000?...'
}
```

### Close Details Logged
```javascript
{
  code: 1000-4999,  // WebSocket close code
  reason: 'Close reason',
  wasClean: true/false,
  timestamp: '2025-10-24T...'
}
```

---

## 🔧 Common Solutions

### Solution 1: Start Backend Server
```bash
cd server
npm install
npm start
# Should see: ✅ Server is running on port 5000
```

### Solution 2: Check Port 5000 is Available
```bash
# Kill process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Solution 3: Verify CORS Configuration
Check `server/src/index.js`:
```javascript
app.use(cors());  // Should be present
```

### Solution 4: Check Network Configuration
- Ensure client and server are on same network
- If using Docker, ensure port mapping is correct
- If using VPN, ensure WebSocket traffic is allowed

### Solution 5: Use Correct Protocol
```javascript
// Automatic protocol selection (recommended)
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
const wsUrl = `${protocol}//localhost:5000`
```

---

## 📋 WebSocket Close Codes

| Code | Meaning | Action |
|------|---------|--------|
| 1000 | Normal closure | Expected, will reconnect |
| 1001 | Going away | Server shutting down |
| 1002 | Protocol error | Check message format |
| 1003 | Unsupported data | Check data type |
| 1006 | Abnormal closure | Network error |
| 1011 | Server error | Check server logs |
| 4000-4999 | Custom codes | Check application logic |

---

## 🚀 Testing WebSocket Connection

### Test Script
```javascript
// Paste in browser console
const testWS = () => {
  const ws = new WebSocket('ws://localhost:5000?biomedicalUserId=test');
  
  ws.onopen = () => {
    console.log('✅ Connected!');
    ws.send(JSON.stringify({type: 'ping'}));
  };
  
  ws.onmessage = (e) => {
    console.log('📨 Message:', JSON.parse(e.data));
  };
  
  ws.onerror = (e) => {
    console.error('❌ Error:', e);
  };
  
  ws.onclose = (e) => {
    console.log('❌ Closed:', e.code, e.reason);
  };
};

testWS();
```

---

## 📞 Getting Help

If the error persists:

1. **Check browser console** for detailed error messages
2. **Check server logs** for connection errors
3. **Verify network connectivity** between client and server
4. **Check firewall settings** for port 5000
5. **Review CORS configuration** in server
6. **Test with simple WebSocket client** to isolate issue

---

## ✅ Verification Checklist

- [ ] Backend server running on port 5000
- [ ] Port 5000 not blocked by firewall
- [ ] Client and server on same network
- [ ] Correct protocol (ws:// or wss://)
- [ ] CORS enabled on server
- [ ] No proxy interfering with WebSocket
- [ ] Browser supports WebSocket
- [ ] Network connectivity working

