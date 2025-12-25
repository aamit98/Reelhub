import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Linking, TextInput, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { ResizeMode, Video, useVideoPlayer } from "expo-av";
import { getVideos, addBookmark, removeBookmark, checkBookmark, getComments, createComment, likeVideo, checkVideoLike, deleteVideo, getBaseUrl } from "../../lib/api";
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
  const [videoLoading, setVideoLoading] = useState(false);
  const videoRef = useRef(null);
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

  // Helper to fix old hardcoded IP URLs to use current base URL
  const fixVideoUrl = (url) => {
    if (!url) return url;
    
    // If URL has hardcoded IP (old format), replace with current base URL
    const hardcodedIpMatch = url.match(/http:\/\/\d+\.\d+\.\d+\.\d+:\d+\/(uploads\/.+)/);
    if (hardcodedIpMatch) {
      const baseUrl = getBaseUrl();
      const fixedUrl = `${baseUrl}/${hardcodedIpMatch[1]}`;
      console.log(`[URL Fix] Original: ${url}`);
      console.log(`[URL Fix] Fixed: ${fixedUrl}`);
      return fixedUrl;
    }
    
    return url;
  };

  // Fix video and thumbnail URLs if they have hardcoded IPs
  const originalVideoUrl = video?.video || null;
  const videoUrl = originalVideoUrl ? fixVideoUrl(originalVideoUrl) : null;
  const thumbnailUrl = video?.thumbnail ? fixVideoUrl(video.thumbnail) : null;

  // Debug: Log URL transformation (MUST be before early returns)
  useEffect(() => {
    if (originalVideoUrl) {
      console.log(`[Video URL Debug] Original: ${originalVideoUrl}`);
      console.log(`[Video URL Debug] Transformed: ${videoUrl}`);
    }
  }, [originalVideoUrl, videoUrl]);

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

  // Prepare video source with proper headers for HTTP streaming
  const getVideoSource = () => {
    if (!videoUrl) return null;
    
    console.log(`[Video Source] Using URL: ${videoUrl}`);
    
    // For HTTP videos, we need to ensure proper headers for range requests
    return {
      uri: videoUrl,
      // Headers for better compatibility with HTTP video streaming
      headers: {
        'Accept': 'video/mp4, video/*, */*',
      },
    };
  };

  // Check if video URL is a direct video file
  // Accept any HTTP URL that ends with video extension or is from our uploads folder
  const isDirectVideo = videoUrl && (
    videoUrl.match(/\.(mp4|mov|avi|webm|m4v)$/i) || 
    (videoUrl.startsWith('http') && 
     !videoUrl.includes('vimeo.com') && 
     !videoUrl.includes('youtube.com') && 
     !videoUrl.includes('file://') && 
     !videoUrl.includes('content://') &&
     (videoUrl.includes('/uploads/') || videoUrl.match(/\.(mp4|mov|avi|webm|m4v)/i)))
  );
  const isVimeoUrl = videoUrl?.includes('vimeo.com');
  const isLocalFile = videoUrl?.startsWith('file://') || videoUrl?.startsWith('content://');

  const handleVideoPress = () => {
    if (isVimeoUrl) {
      // Extract Vimeo video ID and open in browser or app
      const vimeoId = videoUrl?.match(/vimeo\.com\/video\/(\d+)/)?.[1] || video.video?.match(/vimeo\.com\/video\/(\d+)/)?.[1];
      if (vimeoId) {
        Linking.openURL(`https://vimeo.com/${vimeoId}`);
      } else {
        Linking.openURL(videoUrl || video.video);
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
          {showVideoPlayer && isDirectVideo && !isLocalFile && videoUrl ? (
            <View className="relative" style={{ minHeight: 240, backgroundColor: '#000', width: '100%' }}>
              {videoLoading && (
                <View className="absolute inset-0 items-center justify-center" style={{ zIndex: 10, backgroundColor: 'rgba(0,0,0,0.7)' }}>
                  <ActivityIndicator size="large" color="#FF9C01" />
                  <Text className="text-white text-sm mt-2">Loading video...</Text>
                </View>
              )}
              {!videoLoading && !videoError && (
                <TouchableOpacity
                  className="absolute bottom-2 left-2 bg-secondary rounded-full px-4 py-2"
                  style={{ zIndex: 20 }}
                  onPress={() => {
                    if (videoRef.current) {
                      videoRef.current.playAsync().catch(console.error);
                    }
                  }}
                >
                  <Text className="text-black font-psemibold text-xs">▶ Play</Text>
                </TouchableOpacity>
              )}
              <Video
                ref={videoRef}
                key={`${video.$id}-${videoUrl}`}
                source={getVideoSource()}
                style={{ width: '100%', height: 240, backgroundColor: '#000' }}
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls={true}
                shouldPlay={true}
                isLooping={false}
                isMuted={false}
                volume={1.0}
                progressUpdateIntervalMillis={250}
                onReadyForDisplay={() => {
                  console.log("Video ready for display - forcing play");
                  if (videoRef.current) {
                    videoRef.current.playAsync()
                      .then(() => console.log("Video started playing from onReadyForDisplay"))
                      .catch((err) => console.error("Error in onReadyForDisplay play:", err));
                  }
                }}
                onLoadStart={() => {
                  console.log("Video loading started:", videoUrl);
                  setVideoLoading(true);
                  setVideoError(false);
                }}
                onLoad={(status) => {
                  console.log("Video loaded successfully:", status);
                  console.log("Video URL in status:", status.uri);
                  setVideoLoading(false);
                  setVideoError(false);
                  
                  // Explicitly play the video when it's loaded and ready
                  if (status.isLoaded && videoRef.current) {
                    console.log("Attempting to play video...");
                    // Try multiple times with delays to ensure it plays
                    const playVideo = async () => {
                      try {
                        await videoRef.current.playAsync();
                        console.log("Video play command sent successfully");
                      } catch (error) {
                        console.error("Error playing video:", error);
                        // Retry after a short delay
                        setTimeout(() => {
                          videoRef.current?.playAsync().catch(console.error);
                        }, 500);
                      }
                    };
                    playVideo();
                  }
                }}
                onError={(error) => {
                  console.error("Video playback error:", error);
                  console.error("Video URL:", videoUrl);
                  setVideoLoading(false);
                  setVideoError(true);
                  Alert.alert(
                    "Video Error",
                    "Failed to play video. Please check:\n\n1. Your internet connection\n2. The video URL is accessible\n\nIf the problem persists, try refreshing the page."
                  );
                }}
                onPlaybackStatusUpdate={(status) => {
                  // Update loading state based on buffering
                  if (status.isLoaded) {
                    setVideoLoading(status.isBuffering);
                  }
                  
                  if (status.error) {
                    console.error("Playback status error:", status.error);
                    setVideoError(true);
                  }
                  
                  // Aggressively try to play if video should play but isn't
                  if (status.isLoaded && status.shouldPlay && !status.isPlaying) {
                    // Wait for at least some buffer (200ms) or if buffering completes
                    if (!status.isBuffering || status.playableDurationMillis > 200) {
                      console.log(`Attempting to play - buffering: ${status.isBuffering}, playable: ${status.playableDurationMillis}ms`);
                      if (videoRef.current) {
                        videoRef.current.playAsync()
                          .then(() => console.log("Video started playing from status update"))
                          .catch(console.error);
                      }
                    }
                  }
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
                key={thumbnailUrl || video.thumbnail}
                source={{ uri: thumbnailUrl || video.thumbnail || "https://via.placeholder.com/400" }}
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

