import { View, Text, Animated } from "react-native";
import { useEffect, useRef } from "react";

const Toast = ({ message, type = "success", visible, onHide, duration = 3000 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onHide) onHide();
    });
  };

  if (!visible) return null;

  const bgColor = type === "error" ? "#EF4444" : type === "warning" ? "#F59E0B" : "#10B981";

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        position: "absolute",
        top: 50,
        left: 20,
        right: 20,
        zIndex: 9999,
      }}
      className="bg-black-100 rounded-2xl px-4 py-3 flex-row items-center"
    >
      <View className={`w-1 h-full rounded-full mr-3`} style={{ backgroundColor: bgColor }} />
      <Text className="text-white font-pregular flex-1">{message}</Text>
    </Animated.View>
  );
};

export default Toast;




