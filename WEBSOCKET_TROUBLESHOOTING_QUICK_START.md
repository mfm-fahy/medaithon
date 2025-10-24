# 🚀 WebSocket Troubleshooting - Quick Start Guide

## 🔴 Error: `WebSocket error: {}`

### What It Means
Your browser couldn't connect to the WebSocket server. The empty `{}` object means the browser doesn't have detailed error info.

---

## ⚡ Quick Fixes (Try These First)

### 1. **Is the Server Running?**
```bash
# In terminal, go to server directory
cd server
npm start

# You should see:
# ✅ Server is running on port 5000
# 🔌 WebSocket server is ready for connections
```

### 2. **Check Browser Console**
- Press `F12` to open DevTools
- Click "Console" tab
- Look for logs starting with 🔌, 📊, ❌
- These logs now show detailed error information

### 3. **Verify Port 5000 is Available**
```bash
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000

# If something is using port 5000, kill it:
# Windows: taskkill /PID <PID> /F
# Mac/Linux: kill -9 <PID>
```

### 4. **Check Firewall**
- Windows: Check Windows Defender Firewall
- Mac: System Preferences > Security & Privacy
- Linux: Check firewall rules
- **Allow port 5000** for local connections

### 5. **Restart Everything**
```bash
# Kill server (Ctrl+C in terminal)
# Close browser tab
# Restart server: npm start
# Refresh browser: F5
```

---

## 📊 Reading the New Error Logs

### Connection Details
```
📊 Connection details: {
  protocol: 'ws:',
  host: 'localhost',
  port: 5000,
  userId: 'biomedical_admin',
  timestamp: '2025-10-24T...'
}
```
✅ This shows what the client is trying to connect to

### Error Details
```
📊 Error details: {
  type: 'error',
  message: 'Error message if available',
  timestamp: '2025-10-24T...',
  readyState: 0,  // 0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED
  url: 'ws://localhost:5000?...'
}
```
✅ This shows what went wrong

### Close Details
```
📊 Close details: {
  code: 1006,  // See close codes below
  reason: 'Abnormal closure',
  wasClean: false,
  timestamp: '2025-10-24T...'
}
```
✅ This shows why the connection closed

---

## 🔍 Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 1000 | Normal | Expected, will reconnect |
| 1001 | Going away | Server shutting down |
| 1006 | Abnormal | Network error, check server |
| 1011 | Server error | Check server logs |
| 4000+ | Custom | Check application logs |

---

## 🛠️ Diagnostic Checklist

- [ ] Server running? (`npm start` in server folder)
- [ ] Port 5000 available? (no other process using it)
- [ ] Firewall allows port 5000?
- [ ] Browser console shows connection details?
- [ ] Network connectivity working? (ping google.com)
- [ ] Using correct protocol? (ws:// for HTTP, wss:// for HTTPS)
- [ ] Server logs show connection attempt?

---

## 📋 What to Check in Browser Console

### ✅ Success Looks Like
```
🔌 Connecting to WebSocket: ws://localhost:5000?biomedicalUserId=biomedical_admin
📊 Connection details: {...}
✅ WebSocket connected successfully
📊 Connection state: 1
```

### ❌ Error Looks Like
```
🔌 Connecting to WebSocket: ws://localhost:5000?biomedicalUserId=biomedical_admin
📊 Connection details: {...}
❌ WebSocket error occurred
📊 Error details: {type: 'error', readyState: 0, ...}
⚠️ WebSocket connection failed. Possible causes:
1. Server not running on port 5000
2. Firewall or proxy blocking connection
3. Network connectivity issue
4. CORS or protocol mismatch
```

---

## 🧪 Test WebSocket Directly

Paste this in browser console to test:

```javascript
const ws = new WebSocket('ws://localhost:5000');
ws.onopen = () => console.log('✅ Connected!');
ws.onerror = (e) => console.error('❌ Error:', e);
ws.onclose = (e) => console.log('❌ Closed:', e.code);
```

---

## 📞 Still Not Working?

### Step 1: Check Server Logs
```bash
# Look for errors in server terminal
# Should show: 🔌 New WebSocket connection
```

### Step 2: Check Network
```bash
# Test connectivity
ping localhost
ping 127.0.0.1

# Test port
telnet localhost 5000  # Should connect
```

### Step 3: Check Firewall
```bash
# Windows: netstat -ano | findstr :5000
# Mac: lsof -i :5000
# Linux: ss -tlnp | grep 5000
```

### Step 4: Check Browser
- Try different browser (Chrome, Firefox, Edge)
- Clear browser cache (Ctrl+Shift+Delete)
- Disable browser extensions
- Try incognito/private mode

### Step 5: Check Code
- Verify port 5000 in client code
- Verify port 5000 in server code
- Check for typos in WebSocket URL
- Verify protocol (ws:// vs wss://)

---

## 📚 Full Documentation

For detailed information, see:
- `WEBSOCKET_ERROR_DEBUGGING.md` - Comprehensive debugging guide
- `WEBSOCKET_ERROR_FIX_SUMMARY.md` - What was fixed and why

---

## 🎯 Key Points

1. **Server must be running** on port 5000
2. **Port 5000 must be available** (not blocked by firewall)
3. **Browser console shows detailed logs** now
4. **Check logs first** before troubleshooting
5. **Restart server and browser** if stuck

---

## ✨ New Features

✅ Detailed error logging with timestamps  
✅ Connection details logged  
✅ Close codes and reasons logged  
✅ Helpful troubleshooting suggestions  
✅ WebSocket state information  
✅ Exception details logged  

---

## 🚀 Next Steps

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for 🔌 and 📊 logs
4. Use the information to troubleshoot
5. Refer to this guide for solutions

