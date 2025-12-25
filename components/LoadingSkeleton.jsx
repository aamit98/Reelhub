import { View, Animated } from "react-native";
import { useEffect, useRef } from "react";

const LoadingSkeleton = ({ width, height, borderRadius = 8, style }) => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: "#1E1E2E",
          opacity: fadeAnim,
        },
        style,
      ]}
    />
  );
};

export const VideoCardSkeleton = () => (
  <View className="mb-4">
    <LoadingSkeleton width="100%" height={200} borderRadius={12} />
    <View className="mt-2 flex-row items-center">
      <LoadingSkeleton width={40} height={40} borderRadius={20} />
      <View className="ml-3 flex-1">
        <LoadingSkeleton width="80%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
        <LoadingSkeleton width="60%" height={12} borderRadius={4} />
      </View>
    </View>
  </View>
);

export const CommentSkeleton = () => (
  <View className="flex-row mb-4">
    <LoadingSkeleton width={40} height={40} borderRadius={20} />
    <View className="ml-3 flex-1">
      <LoadingSkeleton width="40%" height={12} borderRadius={4} style={{ marginBottom: 8 }} />
      <LoadingSkeleton width="100%" height={14} borderRadius={4} style={{ marginBottom: 4 }} />
      <LoadingSkeleton width="80%" height={14} borderRadius={4} />
    </View>
  </View>
);

export default LoadingSkeleton;




