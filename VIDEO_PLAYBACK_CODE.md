# Complete Video Playback Code - Line by Line

This file contains ALL the video playback code from `app/video/[id].jsx` so you can understand exactly how it works.

---

## 1. IMPORTS (Lines 1-11)

```javascript
import { ResizeMode, Video } from "expo-av";  // Video component from expo-av
```

**What it does:**
- `Video` - The component that plays videos
- `ResizeMode` - How video fits in container (CONTAIN, COVER, etc.)

---

## 2. STATE VARIABLES (Lines 17-31)

```javascript
const [video, setVideo] = useState(null);              // Video data from API
const [videoError, setVideoError] = useState(false);   // Error state
const [showVideoPlayer, setShowVideoPlayer] = useState(false);  // Controls if player is visible
```

**Key state:**
- `showVideoPlayer` - **THIS IS THE MAIN CONTROL** - when `true`, video player shows
- `video` - Contains video data including `video.video` (the URL)
- `videoError` - Tracks if video failed to load

---

## 3. VIDEO TYPE DETECTION (Lines 244-256)

```javascript
// Check if video URL is a direct playable video file
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

**What it checks:**
- `isDirectVideo` - Can we play this inline? (HTTP URL to .mp4, .mov, etc.)
- `isVimeoUrl` - Is it a Vimeo link? (needs to open in browser)
- `isLocalFile` - Is it a local file? (won't work, needs to be uploaded)

---

## 4. PLAY BUTTON HANDLER (Lines 258-274)

```javascript
const handleVideoPress = () => {
  if (isVimeoUrl) {
    // Open Vimeo in browser
    Linking.openURL(video.video);
  } else if (isDirectVideo && !isLocalFile) {
    // THIS IS WHERE VIDEO PLAYER GETS SHOWN
    setShowVideoPlayer(true);   // ← KEY LINE: Makes player visible
    setVideoError(false);        // Reset error state
  } else if (isLocalFile) {
    Alert.alert("Video Error", "This video file is not accessible...");
  }
};
```

**What happens:**
1. User taps play button
2. `handleVideoPress()` runs
3. If it's a direct video → `setShowVideoPlayer(true)` 
4. This triggers React to re-render and show the `<Video>` component

---

## 5. RENDER LOGIC (Lines 288-355)

```javascript
{showVideoPlayer && isDirectVideo && !isLocalFile && video?.video ? (
  // SHOW VIDEO PLAYER
  <View className="relative">
    <Video
      key={video.$id}
      source={{ uri: video.video }}        // Video URL
      className="w-full h-60"
      resizeMode={ResizeMode.CONTAIN}      // Fit video in container
      useNativeControls                    // Show play/pause/seek controls
      shouldPlay={true}                    // Auto-play when loaded
      isLooping={false}                    // Don't loop
      onError={(error) => {
        console.error("Video playback error:", error);
        setVideoError(true);
        Alert.alert("Video Error", "Failed to play video...");
      }}
      onLoad={() => {
        setVideoError(false);              // Video loaded successfully
      }}
    />
    {/* Close button */}
    <TouchableOpacity
      onPress={() => {
        setShowVideoPlayer(false);         // Hide player
        setVideoError(false);
      }}
    >
      <Text>✕</Text>
    </TouchableOpacity>
    
    {/* Error overlay */}
    {videoError && (
      <View>
        <Text>Video error - Tap ✕ to close</Text>
      </View>
    )}
  </View>
) : (
  // SHOW THUMBNAIL WITH PLAY BUTTON
  <TouchableOpacity onPress={handleVideoPress}>
    <Image source={{ uri: video.thumbnail }} />
    <View>
      <Image source={icons.play} />
      <Text>Tap to play video</Text>
    </View>
  </TouchableOpacity>
)}
```

**Render conditions:**
Video player shows ONLY if ALL are true:
1. ✅ `showVideoPlayer === true` (user clicked play)
2. ✅ `isDirectVideo === true` (URL is playable)
3. ✅ `!isLocalFile` (not a local file)
4. ✅ `video?.video` exists (has video URL)

If ANY false → Shows thumbnail instead.

---

## 6. expo-av Video Component Props

```javascript
<Video
  source={{ uri: video.video }}      // REQUIRED: Video URL as object
  shouldPlay={true}                   // Auto-play when component mounts
  useNativeControls                  // Show native play/pause/seek UI
  resizeMode={ResizeMode.CONTAIN}    // How video fits (CONTAIN, COVER, STRETCH)
  isLooping={false}                   // Loop video (true/false)
  onError={(error) => {...}}         // Called when video fails
  onLoad={() => {...}}               // Called when video loads successfully
/>
```

**Important props:**
- `source={{ uri: 'http://...' }}` - MUST be an object with `uri` property
- `shouldPlay={true}` - Auto-plays when shown
- `useNativeControls` - Shows play/pause/seek controls

---

## 7. COMPLETE FLOW

```
1. Page loads
   ↓
2. fetchVideo() runs → Sets video data
   ↓
3. Thumbnail shown (showVideoPlayer = false)
   ↓
4. User taps play button
   ↓
5. handleVideoPress() runs
   ↓
6. setShowVideoPlayer(true) ← THIS TRIGGERS RE-RENDER
   ↓
7. React re-renders → Video component shows
   ↓
8. expo-av Video component loads video from URL
   ↓
9a. Success → Video plays (onLoad called)
9b. Error → onError called → Shows error message
```

---

## DEBUGGING CHECKLIST

Add these console.logs to debug:

```javascript
// In handleVideoPress:
console.log('=== VIDEO PLAY DEBUG ===');
console.log('Video URL:', video?.video);
console.log('isDirectVideo:', isDirectVideo);
console.log('isLocalFile:', isLocalFile);
console.log('showVideoPlayer (before):', showVideoPlayer);

setShowVideoPlayer(true);
console.log('showVideoPlayer (after):', true);
```

```javascript
// In render, before Video component:
console.log('=== RENDER CHECK ===');
console.log('showVideoPlayer:', showVideoPlayer);
console.log('isDirectVideo:', isDirectVideo);
console.log('!isLocalFile:', !isLocalFile);
console.log('video?.video:', video?.video);
console.log('Should show player?', showVideoPlayer && isDirectVideo && !isLocalFile && video?.video);
```

---

## COMMON ISSUES

### Issue: Video doesn't show
**Check:**
- Is `handleVideoPress` being called? (add console.log)
- Is `setShowVideoPlayer(true)` being called?
- Does `isDirectVideo` evaluate to true?
- Is `video.video` a valid HTTP/HTTPS URL?

### Issue: Video shows then disappears
**Check:**
- Is `onError` being called? (check console)
- Is video URL accessible? (try in browser)
- Is video format supported? (mp4, mov, avi, webm, m4v)

### Issue: Video URL not detected as direct video
**Check:**
- Does URL start with `http://` or `https://`?
- Does URL contain `/uploads/` or end with video extension?
- Try simplifying the check: `const isDirectVideo = video?.video?.startsWith('http');`

---

## KEY TAKEAWAY

**The video player is controlled by ONE state variable: `showVideoPlayer`**

- `showVideoPlayer = false` → Shows thumbnail
- `showVideoPlayer = true` → Shows video player

**To make video play:**
1. Set `showVideoPlayer = true` in `handleVideoPress()`
2. Make sure video URL is valid and accessible
3. Video component will auto-play if `shouldPlay={true}`


