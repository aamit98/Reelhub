import React from "react";
import { View, Text, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import CustomButton from "./CustomButton";
import { toUserMessage } from "../lib/errors";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReportBug = async () => {
    const { error, errorInfo } = this.state;
    const errorText = `Error: ${error?.message || "Unknown error"}\n\nStack: ${error?.stack || "No stack trace"}\n\nComponent Stack: ${errorInfo?.componentStack || "No component stack"}`;
    
    try {
      await Clipboard.setStringAsync(errorText);
      Alert.alert("Copied!", "Error details copied to clipboard. You can paste this in a bug report.");
    } catch (clipboardError) {
      Alert.alert("Error", "Failed to copy error details. Please take a screenshot.");
    }
  };

  render() {
    if (this.state.hasError) {
      const userMessage = toUserMessage(this.state.error);
      
      return (
        <View className="flex-1 justify-center items-center px-4 bg-primary">
          <Text className="text-white font-psemibold text-xl mb-2">
            Something went wrong
          </Text>
          <Text className="text-gray-100 font-pregular text-sm text-center mb-6">
            {userMessage}
          </Text>
          <CustomButton
            title="Try Again"
            handlePress={this.handleReset}
            containerStyles="w-full mb-3"
          />
          <CustomButton
            title="Report Bug"
            handlePress={this.handleReportBug}
            containerStyles="w-full bg-black-200"
            textStyles="text-gray-100"
          />
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;



