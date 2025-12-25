import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Linking, TextInput, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { ResizeMode, Video } from "expo-av";
import { getVideos, addBookmark, removeBookmark, checkBookmark, getComments, createComment, likeVideo, checkVideoLike, deleteVideo } from "../../lib/api";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons, images } from "../../constants";
import { VideoCardInline, CommentItem } from "../../components";
import { triggerHaptic } from "../../lib/haptics";
import { shareVideo } from "../../lib/share";

const VideoDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useGlobalContext();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  useEffect(() => {
    if (user && video?.$id) {
      checkBookmarkStatus();
      checkLikeStatus();
    }
    if (video) {
      setLikeCount(video.likes?.length || 0);
      setViewCount(video.views || 0);
    }
  }, [user, video?.$id, video]);

  useEffect(() => {
    if (video?.$id) {
      fetchComments();
    }
  }, [video?.$id]);

  // Refresh when page comes into focus
  useFocusEffect(
    useCallback(() => {
      if (video?.$id) {
        fetchVideo(true); // Silent refresh
        fetchComments();
      }
    }, [video?.$id, user])
  );

  const checkBookmarkStatus = async () => {
    try {
      const bookmarked = await checkBookmark(video.$id);
      setIsBookmarked(bookmarked);
    } catch (error) {
      // Silent error handling
    }
  };

  const checkLikeStatus = async () => {
    try {
      const liked = await checkVideoLike(video.$id);
      setIsLiked(liked);
    } catch (error) {
      // Silent error handling
    }
  };

  const handleLike = async () => {
    if (isLiking) return; // Prevent double-click
    
    triggerHaptic("light");
    if (!user) {
      Alert.alert("Sign in required", "Please sign in to like videos");
      return;
    }

    setIsLiking(true);
    try {
      const updatedVideo = await likeVideo(video.$id);
      const newLiked = updatedVideo.likes?.some(like => like.$id === user?.$id) || false;
      setIsLiked(newLiked);
      setLikeCount(updatedVideo.likes?.length || 0);
      setVideo(updatedVideo);
      triggerHaptic(newLiked ? "success" : "medium");
    } catch (error) {
      const errorMsg = error.message || "Failed to like video";
      Alert.alert("Error", errorMsg);
      triggerHaptic("error");
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = async () => {
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
        Alert.alert("Bookmarked", "Added to bookmarks");
        triggerHaptic("success");
      }
      // Refresh video to get updated bookmark status
      await checkBookmarkStatus();
    } catch (error) {
      Alert.alert("Error", "Failed to update bookmark");
      triggerHaptic("error");
    }
  };

  const fetchVideo = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const videos = await getVideos();
      const foundVideo = videos.find((v) => v.$id === id);
      if (foundVideo) {
        setVideo(foundVideo);
        // Get related videos (excluding current)
        const related = videos.filter((v) => v.$id !== id).slice(0, 3);
        setRelatedVideos(related);
        // Refresh bookmark and like status
        if (user) {
          await checkBookmarkStatus();
          await checkLikeStatus();
        }
      } else {
        if (!silent) Alert.alert("Error", "Video not found");
      }
    } catch (error) {
      if (!silent) Alert.alert("Error", "Failed to load video");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!video?.$id) return;
    setLoadingComments(true);
    try {
      const commentsData = await getComments(video.$id);
      setComments(commentsData || []);
    } catch (error) {
      // Silent error handling
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) {
      if (!user) {
        Alert.alert("Sign in required", "Please sign in to comment");
      }
      return;
    }

    triggerHaptic("light");
    setSubmittingComment(true);
    try {
      const comment = await createComment(video.$id, newComment.trim());
      setComments([comment, ...comments]);
      setNewComment("");
      triggerHaptic("success");
    } catch (error) {
      Alert.alert("Error", "Failed to post comment");
      triggerHaptic("error");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCommentDelete = (commentId) => {
    setComments(comments.filter(c => c.$id !== commentId));
  };

  const handleDeleteVideo = () => {
    Alert.alert(
      "Delete Video",
      "Are you sure you want to delete this video? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteVideo(video.$id);
              Alert.alert("Success", "Video deleted successfully");
              router.back();
            } catch (error) {
              Alert.alert("Error", error.message || "Failed to delete video");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-primary h-full justify-center items-center">
        <ActivityIndicator size="large" color="#FF9C01" />
      </SafeAreaView>
    );
  }

  if (!video) {
    return (
      <SafeAreaView className="bg-primary h-full justify-center items-center">
        <Text className="text-white">Video not found</Text>
      </SafeAreaView>
    );
  }

  // Check if video URL is a direct video file
  // Accept any HTTP URL that ends with video extension or is from our uploads folder
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

  const handleVideoPress = () => {
    if (isVimeoUrl) {
      // Extract Vimeo video ID and open in browser or app
      const vimeoId = video.video.match(/vimeo\.com\/video\/(\d+)/)?.[1];
      if (vimeoId) {
        Linking.openURL(`https://vimeo.com/${vimeoId}`);
      } else {
        Linking.openURL(video.video);
      }
    } else if (isDirectVideo && !isLocalFile) {
      // Show and play the video inline
      setShowVideoPlayer(true);
      setVideoError(false);
    } else if (isLocalFile) {
      Alert.alert("Video Error", "This video file is not accessible. Please upload it to a cloud service.");
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => fetchVideo(true)}
            tintColor="#FF9C01"
            colors={["#FF9C01"]}
          />
        }
      >
        <View className="w-full bg-black-100">
          {showVideoPlayer && isDirectVideo && !isLocalFile && video?.video ? (
            <View className="relative">
              {/* Debug: Show video URL (remove in production) */}
              {__DEV__ && (
                <View className="absolute top-10 left-2 right-2 z-20 bg-black/80 p-2 rounded">
                  <Text className="text-white text-xs" numberOfLines={2}>
                    URL: {video.video}
                  </Text>
                </View>
              )}
              <Video
                key={video.$id}
                source={{ uri: video.video }}
                className="w-full h-60"
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls
                shouldPlay={true}
                isLooping={false}
                onError={(error) => {
                  console.error("Video playback error:", error);
                  console.error("Video URL:", video.video);
                  setVideoError(true);
                  Alert.alert(
                    "Video Error", 
                    `Failed to play video.\n\nURL: ${video.video}\n\nTry opening this URL in your browser to test if it's accessible.`
                  );
                }}
                onLoad={() => {
                  console.log("Video loaded successfully:", video.video);
                  setVideoError(false);
                }}
              />
              <TouchableOpacity
                className="absolute top-2 right-2 bg-black/70 rounded-full p-2 z-10"
                onPress={() => {
                  setShowVideoPlayer(false);
                  setVideoError(false);
                }}
              >
                <Text className="text-white text-xs font-bold">✕</Text>
              </TouchableOpacity>
              {videoError && (
                <View className="absolute inset-0 items-center justify-center bg-black/50">
                  <Text className="text-white text-sm">Video error - Tap ✕ to close</Text>
                </View>
              )}
            </View>
          ) : video ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleVideoPress}
              className="relative"
            >
              <Image
                key={video.thumbnail}
                source={{ uri: video.thumbnail || "https://via.placeholder.com/400" }}
                className="w-full h-60"
                resizeMode="cover"
                onError={() => setVideoError(true)}
              />
              <View className="absolute inset-0 items-center justify-center bg-black/30">
                <Image
                  source={icons.play}
                  className="w-16 h-16"
                  resizeMode="contain"
                />
                {isVimeoUrl && (
                  <Text className="text-white mt-2 text-sm">Tap to watch on Vimeo</Text>
                )}
                {isDirectVideo && !isLocalFile && (
                  <Text className="text-white mt-2 text-sm">Tap to play video</Text>
                )}
                {isLocalFile && (
                  <Text className="text-white mt-2 text-sm text-center px-4">
                    Video file is not accessible.{'\n'}Please upload to a cloud service.
                  </Text>
                )}
                {!isDirectVideo && !isVimeoUrl && !isLocalFile && (
                  <Text className="text-white mt-2 text-sm">Video format not supported</Text>
                )}
              </View>
            </TouchableOpacity>
          ) : null}
        </View>

        <View className="px-4 mt-6">
          <View className="flex-row items-start justify-between mb-2">
            <Text className="text-white font-psemibold text-2xl flex-1 leading-7">{video.title}</Text>
            <View className="flex-row items-center gap-4">
              <TouchableOpacity
                onPress={handleLike}
                className="flex-row items-center bg-black-100/50 px-3 py-2 rounded-full"
                disabled={isLiking}
                activeOpacity={0.7}
              >
                <Text className="text-2xl" style={{ color: isLiked ? "#FF9C01" : "#CDCDE0" }}>
                  {isLiked ? "❤️" : "🤍"}
                </Text>
                {likeCount > 0 && (
                  <Text className="text-white text-sm ml-2 font-psemibold">{likeCount}</Text>
                )}
              </TouchableOpacity>
              {user && (
                <TouchableOpacity
                  onPress={handleBookmark}
                  className="bg-black-100/50 p-2.5 rounded-full"
                  activeOpacity={0.7}
                >
                  <Image
                    source={icons.bookmark}
                    className="w-6 h-6"
                    resizeMode="contain"
                    tintColor={isBookmarked ? "#FF9C01" : "#CDCDE0"}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic("light");
                  shareVideo(video);
                }}
                className="bg-black-100/50 p-2.5 rounded-full"
                activeOpacity={0.7}
              >
                <Image
                  source={icons.upload}
                  className="w-6 h-6"
                  resizeMode="contain"
                  tintColor="#CDCDE0"
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <View className="flex-row items-center justify-between mt-4">
            <View className="flex-row items-center flex-1">
              <View className="relative">
                <Image
                  key={video.creator?.avatar}
                  source={{ uri: video.creator?.avatar || "https://via.placeholder.com/40" }}
                  className="w-12 h-12 rounded-full border-2 border-secondary/30"
                  resizeMode="cover"
                  onError={() => {}}
                />
                <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-primary" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-white font-psemibold text-base">
                  {video.creator?.username || "Unknown Creator"}
                </Text>
                {viewCount > 0 && (
                  <Text className="text-gray-400 text-xs mt-0.5">{viewCount} views</Text>
                )}
              </View>
            </View>
            {user && user.$id === video.creator?.$id && (
              <TouchableOpacity
                onPress={handleDeleteVideo}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500/20 rounded-full"
                activeOpacity={0.7}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#EF4444" />
                ) : (
                  <Text className="text-red-400 text-sm font-psemibold">Delete</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          <View className="mt-4 p-4 bg-black-100/50 rounded-2xl border border-black-200">
            <Text className="text-gray-200 font-pregular text-sm leading-5">{video.prompt}</Text>
          </View>
        </View>

        {/* Comments Section */}
        <View className="px-4 mt-6">
          <Text className="text-white font-psemibold text-xl mb-4">
            Comments ({comments.length})
          </Text>

          {/* Comment Input */}
          {user ? (
            <View className="mb-4 flex-row items-end gap-3">
              <View className="flex-1">
                <TextInput
                  className="bg-black-100 rounded-2xl px-4 py-3 text-white font-pregular"
                  placeholder="Add a comment..."
                  placeholderTextColor="#7b7b8b"
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                  style={{ minHeight: 50, maxHeight: 100 }}
                />
              </View>
              <TouchableOpacity
                onPress={handleSubmitComment}
                disabled={submittingComment || !newComment.trim()}
                className="w-12 h-12 bg-secondary rounded-full items-center justify-center"
                style={{ opacity: (submittingComment || !newComment.trim()) ? 0.5 : 1 }}
              >
                {submittingComment ? (
                  <ActivityIndicator size="small" color="#161622" />
                ) : (
                  <Image
                    source={icons.upload}
                    className="w-6 h-6"
                    resizeMode="contain"
                    tintColor="#161622"
                  />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mb-4 p-4 bg-black-100 rounded-2xl">
              <Text className="text-gray-100 text-center">
                Sign in to add a comment
              </Text>
            </View>
          )}

          {/* Comments List */}
          {loadingComments ? (
            <View className="py-8">
              <ActivityIndicator size="small" color="#FF9C01" />
            </View>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem
                key={comment.$id}
                comment={comment}
                onDelete={handleCommentDelete}
                onLike={fetchComments}
              />
            ))
          ) : (
            <View className="py-8 items-center">
              <Text className="text-gray-400 text-base font-pregular">
                No comments yet
              </Text>
              <Text className="text-gray-500 text-sm font-pregular mt-1">
                Be the first to comment!
              </Text>
            </View>
          )}
        </View>

        {relatedVideos.length > 0 && (
          <View className="px-4 mt-6">
            <Text className="text-white font-psemibold text-xl mb-4">
              Related Videos
            </Text>
            {relatedVideos.map((item) => (
              <VideoCardInline key={item.$id} video={item} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default VideoDetails;

