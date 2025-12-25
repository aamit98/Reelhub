# Fix for Node.js v24 + Metro Config Error on Windows

## The Problem
You're seeing this error:
```
Error [ERR_UNSUPPORTED_ESM_URL_SCHEME]: Error loading Metro config
Received protocol 'c:'
```

This is a known issue with **Node.js v24** and Metro/Expo on Windows.

## Solutions

### Option 1: Use Node.js v20 LTS (Recommended)
Node.js v24 has stricter ESM handling that breaks Metro config loading on Windows.

1. Install Node.js v20 LTS: https://nodejs.org/
2. Or use nvm (Node Version Manager):
   ```powershell
   nvm install 20
   nvm use 20
   ```
3. Then run: `npx expo start --clear`

### Option 2: Temporary Workaround
If you must use Node.js v24, try downgrading to Node.js v20 LTS. The Metro bundler doesn't fully support Node v24 yet on Windows.

### Option 3: Use WSL (Windows Subsystem for Linux)
Run your project in WSL2 where Node.js v24 works better:
```bash
cd /mnt/c/dev/react_native_crash_course_app
npx expo start --clear
```

## Why This Happens
Node.js v24 introduced stricter ESM (ECMAScript Modules) handling. When Metro tries to resolve the config file path on Windows, it misinterprets the Windows path `C:\...` as a URL protocol `c:`, causing the error.

## Current Status
- ✅ NativeWind v4.2.1 is installed correctly
- ✅ Metro config is correct
- ❌ Node.js v24 compatibility issue with Metro on Windows

**Recommendation**: Switch to Node.js v20 LTS for React Native/Expo development.


