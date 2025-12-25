import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import icons from "../constants/icons";
import { useGlobalContext } from "../context/GlobalProvider";
import { addBookmark, removeBookmark, checkBookmark } from "../lib/api";
import { useEffect } from "react";
import { Alert } from "react-native";
import { triggerHaptic } from "../lib/haptics";

const VideoCardInline = ({ video }) => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [play, setPlay] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Check if video URL is a direct video file
  // Accept any HTTP URL that ends with video extension or is from our uploads folder
  const isDirectVideo = video.video && (
    video.video.match(/\.(mp4|mov|avi|webm|m4v)$/i) || 
    (video.video.startsWith('http') && 
     !video.video.includes('vimeo.com') && 
     !video.video.includes('youtube.com') && 
     !video.video.includes('file://') && 
     !video.video.includes('content://') &&
     (video.video.includes('/uploads/') || video.video.match(/\.(mp4|mov|avi|webm|m4v)/i)))
  );

  useEffect(() => {
    if (user && video?.$id) {
      checkBookmarkStatus();
    }
  }, [user, video?.$id]);

  const checkBookmarkStatus = async () => {
    try {
      const bookmarked = await checkBookmark(video.$id);
      setIsBookmarked(bookmarked);
    } catch (error) {
      console.error("Error checking bookmark:", error);
    }
  };

  const handleBookmark = async (e) => {
    e?.stopPropagation();
    triggerHaptic("light");
    
    if (!user) {
      Alert.alert("Sign in required", "Please sign in to bookmark videos");
      return;
    }

    try {
      if (isBookmarked) {
        await removeBookmark(video.$id);
        setIsBookmarked(false);
        triggerHaptic("success");
      } else {
        await addBookmark(video.$id);
        setIsBookmarked(true);
        triggerHaptic("success");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      triggerHaptic("error");
    }
  };

  const handleVideoPress = () => {
    router.push(`/video/${video.$id}`);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleVideoPress}
      className="flex flex-col items-center px-4 mb-14"
    >
      <View className="flex flex-row gap-3 items-start w-full">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              key={video.creator?.avatar}
              source={{ uri: video.creator?.avatar || "https://via.placeholder.com/46" }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
              onError={() => {}}
            />
          </View>
          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {video.title}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text
                className="text-xs text-gray-100 font-pregular"
                numberOfLines={1}
              >
                {video.creator?.username || "Unknown"}
              </Text>
              {(video.likes?.length > 0 || video.views > 0) && (
                <View className="flex-row items-center gap-2">
                  {video.likes?.length > 0 && (
                    <Text className="text-xs text-gray-100">
                      ❤️ {video.likes.length}
                    </Text>
                  )}
                  {video.views > 0 && (
                    <Text className="text-xs text-gray-100">
                      👁️ {video.views}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
        <View className="pt-2 flex-row gap-2">
          {user && (
            <TouchableOpacity 
              onPress={(e) => {
                e.stopPropagation();
                handleBookmark(e);
              }}
            >
              <Image 
                source={icons.bookmark} 
                className="w-5 h-5" 
                resizeMode="contain"
                tintColor={isBookmarked ? "#FF9C01" : "#CDCDE0"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleVideoPress}
        className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
      >
        <Image
          key={video.thumbnail}
          source={{ uri: video.thumbnail || "https://via.placeholder.com/400" }}
          className="w-full h-full rounded-xl"
          resizeMode="cover"
          onError={() => setVideoError(true)}
        />
        <View className="absolute inset-0 bg-black/20 rounded-xl" />
        <Image
          source={icons.play}
          className="w-16 h-16 absolute"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default VideoCardInline;

