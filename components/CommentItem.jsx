import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { useState } from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import { deleteComment, likeComment } from "../lib/api";
import { icons } from "../constants";
import { triggerHaptic } from "../lib/haptics";

const CommentItem = ({ comment, onDelete, onLike }) => {
  const { user } = useGlobalContext();
  const [isLiked, setIsLiked] = useState(comment.likes?.some(like => like.$id === user?.$id) || false);
  const [likeCount, setLikeCount] = useState(comment.likes?.length || 0);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Just now";
    
    const now = new Date();
    const commentDate = new Date(timestamp);
    const seconds = Math.floor((now - commentDate) / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return commentDate.toLocaleDateString();
  };

  const handleLike = async () => {
    triggerHaptic("light");
    if (!user) {
      Alert.alert("Sign in required", "Please sign in to like comments");
      return;
    }

    try {
      const updatedComment = await likeComment(comment.$id);
      const newLiked = updatedComment.likes?.some(like => like.$id === user?.$id) || false;
      setIsLiked(newLiked);
      setLikeCount(updatedComment.likes?.length || 0);
      if (onLike) onLike(updatedComment);
      triggerHaptic(newLiked ? "success" : "medium");
    } catch (error) {
      console.error("Error liking comment:", error);
      Alert.alert("Error", "Failed to like comment");
      triggerHaptic("error");
    }
  };

  const handleDelete = () => {
    triggerHaptic("medium");
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel", onPress: () => triggerHaptic("light") },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteComment(comment.$id);
              if (onDelete) onDelete(comment.$id);
              triggerHaptic("success");
            } catch (error) {
              console.error("Error deleting comment:", error);
              Alert.alert("Error", "Failed to delete comment");
              triggerHaptic("error");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const isOwner = user?.$id === comment.user?.$id;

  return (
    <View className="flex-row mb-4">
      <Image
        key={comment.user?.avatar}
        source={{ uri: comment.user?.avatar || "https://via.placeholder.com/40" }}
        className="w-10 h-10 rounded-full"
        resizeMode="cover"
        onError={() => console.log("Comment avatar error")}
      />
      <View className="flex-1 ml-3">
        <View className="flex-row items-center mb-1">
          <Text className="text-white font-psemibold text-sm">
            {comment.user?.username || "Anonymous"}
          </Text>
          <Text className="text-gray-100 font-pregular text-xs ml-2">
            {formatTimeAgo(comment.$createdAt)}
          </Text>
        </View>
        <Text className="text-gray-100 font-pregular text-sm mb-2">
          {comment.text}
        </Text>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleLike}
            className="flex-row items-center mr-4"
            disabled={isDeleting}
          >
            <Text className="text-base mr-1">
              {isLiked ? "❤️" : "🤍"}
            </Text>
            <Text className={`text-xs ${isLiked ? "text-secondary" : "text-gray-100"}`}>
              {likeCount}
            </Text>
          </TouchableOpacity>
          {isOwner && (
            <TouchableOpacity
              onPress={handleDelete}
              disabled={isDeleting}
              className="opacity-50"
            >
              <Text className="text-red-500 text-xs">Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default CommentItem;

