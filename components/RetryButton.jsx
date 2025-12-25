import { View, Text, TouchableOpacity } from "react-native";
import CustomButton from "./CustomButton";

const RetryButton = ({ onRetry, message = "Failed to load. Tap to retry." }) => {
  return (
    <View className="flex-1 justify-center items-center px-4 py-8">
      <Text className="text-gray-100 font-pregular text-sm text-center mb-4">
        {message}
      </Text>
      <CustomButton
        title="Retry"
        handlePress={onRetry}
        containerStyles="w-full"
      />
    </View>
  );
};

export default RetryButton;



