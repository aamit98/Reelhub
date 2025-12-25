import { View, Text, TouchableOpacity, Image, Dimensions, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { icons } from "../constants";
import { useGlobalContext } from "../context/GlobalProvider";
import { addBookmark, removeBookmark, checkBookmark } from "../lib/api";
import { triggerHaptic } from "../lib/haptics";

const VideoCard = ({ video, index }) => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { width, height } = Dimensions.get("window");

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
    e.stopPropagation();
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
      Alert.alert("Error", "Failed to update bookmark");
      triggerHaptic("error");
    }
  };

  return (
    <TouchableOpacity
      className="mb-6 mx-4"
      onPress={() => router.push(`/video/${video.$id}`)}
      activeOpacity={0.8}
    >
      <View className="w-full rounded-2xl overflow-hidden bg-black-100">
        {/* Thumbnail with overlay */}
        <View className="w-full h-64 relative">
          <Image
            source={{ uri: video.thumbnail }}
            className="w-full h-full"
            resizeMode="cover"
          />
          
          {/* Dark overlay for better text visibility */}
          <View className="absolute bottom-0 left-0 right-0 h-32 bg-black/40" />
          
          {/* Play button */}
          <View className="absolute inset-0 items-center justify-center">
            <TouchableOpacity
              className="w-16 h-16 rounded-full bg-black/60 items-center justify-center border-2 border-white/30"
              onPress={() => router.push(`/video/${video.$id}`)}
            >
              <Image
                source={icons.play}
                className="w-8 h-8"
                resizeMode="contain"
                tintColor="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {/* Bookmark button */}
          {user && (
            <TouchableOpacity
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 items-center justify-center"
              onPress={handleBookmark}
            >
              <Image
                source={icons.bookmark}
                className="w-5 h-5"
                resizeMode="contain"
                tintColor={isBookmarked ? "#FF9C01" : "#FFFFFF"}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Video info */}
        <View className="px-4 py-3">
          <Text className="text-white font-psemibold text-base" numberOfLines={2}>
            {video.title}
          </Text>
          <View className="flex-row items-center mt-2">
            <Image
              source={{ uri: video.creator?.avatar }}
              className="w-6 h-6 rounded-full"
              resizeMode="cover"
            />
            <View className="flex-row items-center flex-1">
              <Text className="text-gray-100 text-xs font-pregular ml-2">
                {video.creator?.username}
              </Text>
              {(video.likes?.length > 0 || video.views > 0) && (
                <View className="flex-row items-center gap-2 ml-2">
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
      </View>
    </TouchableOpacity>
  );
};

export default VideoCard;

