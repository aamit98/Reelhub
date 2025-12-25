# Network Connection Fix

## Problem
"Network request failed" error when trying to connect to backend.

## Solution

### For iOS Simulator:
If using iOS Simulator, you can use `localhost`:
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'
  : 'https://your-production-api.com/api';
```

### For Physical Device:
You MUST use your computer's IP address, not `localhost`.

1. **Find your IP address:**
   - Windows: `ipconfig` → Look for "IPv4 Address"
   - Mac/Linux: `ifconfig` or `ip addr`

2. **Update `lib/api.js` line 3:**
   ```javascript
   const API_BASE_URL = __DEV__ 
     ? 'http://YOUR_IP_ADDRESS:3000/api'  // Replace YOUR_IP_ADDRESS
     : 'https://your-production-api.com/api';
   ```

3. **Your IP addresses found:**
   - `192.168.56.1` (Virtual adapter - might not work)
   - `10.100.102.222` (Main network - try this one)

4. **Make sure:**
   - Backend is running: `cd backend && npm run dev`
   - Backend shows: `🚀 Server running on http://localhost:3000`
   - Both devices are on the same WiFi network
   - Firewall allows connections on port 3000

### Quick Test:
1. Open browser on your computer: http://localhost:3000/api/health
2. Should see: `{"status":"OK","message":"Aora API is running"}`
3. If that works, backend is running correctly

### Still Not Working?
- Check Windows Firewall: Allow Node.js through firewall
- Try the other IP address
- Make sure backend is actually running
- Check backend terminal for errors





