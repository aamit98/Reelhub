# API Connection Fix Guide

## Problem
Your backend is running on `http://localhost:3000`, but your React Native app can't connect to it.

## Solution Based on How You're Running the App

### Option 1: Android Emulator (Recommended for Testing)
The app is already configured to use `http://10.0.2.2:3000/api` for Android emulator.
- ✅ This should work automatically
- Make sure you're using Android emulator (not a physical device)

### Option 2: iOS Simulator
The app is configured to use `http://localhost:3000/api` for iOS simulator.
- ✅ This should work automatically
- Make sure you're using iOS simulator (not a physical device)

### Option 3: Physical Device (Android or iOS)
If you're testing on a **physical device**, you need to use your computer's IP address:

1. **Find your computer's IP address:**
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" under your active network adapter (usually starts with 192.168.x.x or 10.x.x.x)

2. **Update app.config.js:**
   Open `app.json` and update the `extra.apiBaseUrl`:
   ```json
   {
     "expo": {
       ...
       "extra": {
         "apiBaseUrl": "http://YOUR_IP_ADDRESS:3000"
       }
     }
   }
   ```
   Example: `"apiBaseUrl": "http://192.168.1.100:3000"`

3. **Restart Expo:**
   ```bash
   npx expo start --clear
   ```

4. **Important:** Make sure your phone and computer are on the **same WiFi network**

### Quick Debug: Check What URL the App is Using

The app now logs the API URL on startup. Check your Expo/Metro console for:
```
[API] Using base URL: http://...
```

## Common Issues

### "No connection to server"
- ✅ Backend is running (you see it in terminal)
- ❌ App can't reach backend
- **Fix**: Use the correct URL based on your setup (see options above)

### Backend shows CORS errors
- The backend has CORS enabled, but if you see errors, make sure `cors()` middleware is working

### "Network request failed"
- Check that backend is actually running on port 3000
- Check firewall isn't blocking port 3000
- For physical devices: Ensure phone and computer are on same WiFi

## Testing the Connection

You can test if the backend is reachable:
- **From emulator/simulator**: Should work automatically
- **From physical device browser**: Try opening `http://YOUR_IP:3000/api/health` in your phone's browser
  - If this works, the app should work too
  - If this doesn't work, the issue is network/firewall related


