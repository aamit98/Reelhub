# Video Playback Logic - Complete Guide

This document explains exactly how video playback works in this app.

## File Location
**Main video player:** `app/video/[id].jsx`

---

## How It Works (Step by Step)

### 1. State Variables

```javascript
const [showVideoPlayer, setShowVideoPlayer] = useState(false);  // Controls if video player is visible
const [videoError, setVideoError] = useState(false);            // Tracks if video has error
const [video, setVideo] = useState(null);                       // Video data object
```

### 2. Video Type Detection

The app checks what type of video URL it is:

```javascript
// Check if it's a direct video file (MP4, MOV, etc.)
const isDirectVideo = video?.video && (
  video.video.match(/\.(mp4|mov|avi|webm|m4v)$/i) || 
  (video.video.startsWith('http') && 
   !video.video.includes('vimeo.com') && 
   !video.video.includes('youtube.com') && 
   !video.video.includes('file://') && 
   !video.video.includes('content://') &&
   (video.video.includes('/uploads/') || video.video.match(/\.(mp4|mov|avi|webm|m4v)/i)))
);

const isVimeoUrl = video?.video?.includes('vimeo.com');
const isLocalFile = video?.video?.startsWith('file://') || video?.video?.startsWith('content://');
```

**Types:**
- `isDirectVideo`: HTTP/HTTPS URL to video file (can play inline)
- `isVimeoUrl`: Vimeo link (opens in browser/app)
- `isLocalFile`: Local file path (won't work, shows error)

### 3. When User Clicks Play Button

```javascript
const handleVideoPress = () => {
  if (isVimeoUrl) {
    // Open Vimeo in browser
    Linking.openURL(video.video);
  } else if (isDirectVideo && !isLocalFile) {
    // THIS IS THE KEY LINE - Shows the video player
    setShowVideoPlayer(true);
    setVideoError(false);
  } else if (isLocalFile) {
    Alert.alert("Video Error", "This video file is not accessible...");
  }
};
```

**What happens:**
- User taps play button → `handleVideoPress()` runs
- If it's a direct video → Sets `showVideoPlayer = true`
- This triggers the Video component to render

### 4. Video Player Rendering Logic

The render logic decides what to show:

```javascript
{showVideoPlayer && isDirectVideo && !isLocalFile && video?.video ? (
  // SHOW VIDEO PLAYER (expo-av Video component)
  <Video
    source={{ uri: video.video }}
    className="w-full h-60"
    resizeMode={ResizeMode.CONTAIN}
    useNativeControls
    shouldPlay={true}
    onError={(error) => {
      setVideoError(true);
      Alert.alert("Video Error", "Failed to play video...");
    }}
  />
) : (
  // SHOW THUMBNAIL WITH PLAY BUTTON
  <TouchableOpacity onPress={handleVideoPress}>
    <Image source={{ uri: video.thumbnail }} />
    <PlayButton />
  </TouchableOpacity>
)}
```

**Conditions to show video player:**
1. ✅ `showVideoPlayer === true` (user clicked play)
2. ✅ `isDirectVideo === true` (it's a playable video URL)
3. ✅ `!isLocalFile` (not a local file)
4. ✅ `video?.video` exists (has video URL)

If ANY of these are false → Shows thumbnail instead.

---

## Common Issues & Debugging

### Issue 1: Video Doesn't Show
**Check:**
```javascript
console.log('showVideoPlayer:', showVideoPlayer);
console.log('isDirectVideo:', isDirectVideo);
console.log('video.video:', video?.video);
console.log('isLocalFile:', isLocalFile);
```

**Fix:**
- Make sure `handleVideoPress()` sets `showVideoPlayer = true`
- Verify video URL is a valid HTTP/HTTPS link
- Check video URL format matches `isDirectVideo` regex

### Issue 2: Video Shows Then Disappears
**Cause:** Video error occurs → `onError` handler runs → Player might hide

**Check:**
```javascript
onError={(error) => {
  console.error("Video error:", error);  // Check what error is
  setVideoError(true);
  // DON'T set showVideoPlayer(false) here - keep it visible
}}
```

### Issue 3: Video URL Format
**Valid formats:**
- ✅ `http://10.100.102.222:3000/uploads/video.mp4`
- ✅ `https://example.com/video.mp4`
- ✅ Any URL ending in `.mp4`, `.mov`, `.avi`, `.webm`, `.m4v`

**Invalid formats:**
- ❌ `file:///path/to/video.mp4` (local file)
- ❌ `content://...` (Android content URI)
- ❌ Vimeo/YouTube URLs (need special handling)

---

## Complete Flow Diagram

```
User loads video page
    ↓
Video data fetched → video object set
    ↓
Thumbnail shown with play button
    ↓
User clicks play button
    ↓
handleVideoPress() runs
    ↓
Checks video type:
    ├─ Vimeo → Opens browser
    ├─ Direct video → setShowVideoPlayer(true)
    └─ Local file → Shows error
    ↓
showVideoPlayer = true → Video component renders
    ↓
expo-av Video component tries to play
    ├─ Success → Video plays
    └─ Error → onError handler → Shows error message
```

---

## Key Files

1. **Video Player Component:** `app/video/[id].jsx`
   - Lines 244-274: Video type detection
   - Lines 258-274: handleVideoPress function
   - Lines 288-350: Video rendering logic

2. **Video API:** `lib/api.js`
   - Video data fetching
   - Video URLs returned from backend

3. **Backend:** `backend/routes/videos.js`
   - Serves video URLs
   - Video file uploads

---

## Testing Checklist

To debug video playback:

1. **Check video URL format:**
   ```javascript
   console.log('Video URL:', video.video);
   // Should be: http://10.100.102.222:3000/uploads/video.mp4
   ```

2. **Check state values:**
   ```javascript
   console.log('showVideoPlayer:', showVideoPlayer);
   console.log('isDirectVideo:', isDirectVideo);
   console.log('videoError:', videoError);
   ```

3. **Test video URL directly:**
   - Open video URL in browser
   - Should download or play video
   - If not → Backend/serve issue

4. **Check video component props:**
   ```javascript
   <Video
     source={{ uri: video.video }}  // Must be valid URL
     shouldPlay={true}               // Auto-play when shown
     useNativeControls              // Shows play/pause/seek controls
   />
   ```

---

## Quick Fixes

**Video doesn't show:**
```javascript
// Add this to handleVideoPress:
console.log('Attempting to play:', video.video);
setShowVideoPlayer(true);
setVideoError(false);
```

**Video shows then disappears:**
```javascript
// In Video component, DON'T hide on error:
onError={(error) => {
  console.error(error);
  setVideoError(true);
  // Don't call setShowVideoPlayer(false) here
}}
```

**Video URL not detected as direct video:**
```javascript
// Check the regex in isDirectVideo
// Or force it:
const isDirectVideo = video?.video?.startsWith('http');
```

---

## expo-av Video Component

The `<Video>` component from `expo-av` is what actually plays videos.

**Key Props:**
- `source={{ uri: 'http://...' }}` - Video URL
- `shouldPlay={true}` - Auto-play when loaded
- `useNativeControls` - Shows native play/pause controls
- `resizeMode={ResizeMode.CONTAIN}` - How video fits in container
- `onError={(error) => ...}` - Error handler
- `onLoad={() => ...}` - Success handler

**Important:** Video URLs MUST be accessible from the device/emulator where the app is running!


