import { Share, Alert } from "react-native";

export const shareVideo = async (video) => {
  try {
    // For video sharing, we'll share the video URL and thumbnail
    const shareMessage = `Check out this video: ${video.title}\n${video.video || video.thumbnail}`;
    
    const result = await Share.share({
      message: shareMessage,
      title: video.title,
      url: video.video || video.thumbnail, // iOS uses url, Android uses message
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // Shared with activity type of result.activityType
      } else {
        // Shared
      }
    } else if (result.action === Share.dismissedAction) {
      // Dismissed
    }
  } catch (error) {
    Alert.alert("Error", "Failed to share video");
    console.error("Share error:", error);
  }
};

export const shareApp = async () => {
  try {
    await Share.share({
      message: "Check out this amazing video app!",
      title: "Share App",
    });
  } catch (error) {
    console.error("Share error:", error);
  }
};

