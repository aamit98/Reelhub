import { useState } from "react";
import { router } from "expo-router";
import { ResizeMode, Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { icons } from "../../constants";
import { createVideo } from "../../lib/api";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    videoUrl: "",
    thumbnail: null,
    thumbnailUrl: "",
    prompt: "",
  });
  const [useVideoUrl, setUseVideoUrl] = useState(false);
  const [useThumbnailUrl, setUseThumbnailUrl] = useState(false);

  const openVideoPicker = async () => {
    try {
      // Request permissions for iOS
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed", 
          "We need access to your media library to select videos. Please enable it in Settings."
        );
        return;
      }

      // Use ImagePicker for videos - iPhone compatible settings
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'videos',
        allowsEditing: false,
        quality: 1,
        videoMaxDuration: 60,
      });

      if (result.canceled) {
        return; // User cancelled, no error
      }

      if (!result.assets || result.assets.length === 0) {
        Alert.alert("Error", "No video selected. Please try again.");
        return;
      }

      setForm({
        ...form,
        video: result.assets[0],
      });
    } catch (error) {
      Alert.alert(
        "Error", 
        error.message || "Failed to pick video. Please check permissions in Settings and try again."
      );
    }
  };

  const openImagePicker = async () => {
    try {
      // Request permissions for iOS
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed", 
          "We need access to your photos to select a thumbnail. Please enable it in Settings."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (result.canceled) {
        return; // User cancelled, no error
      }

      if (!result.assets || result.assets.length === 0) {
        Alert.alert("Error", "No image selected. Please try again.");
        return;
      }

      setForm({
        ...form,
        thumbnail: result.assets[0],
      });
    } catch (error) {
      Alert.alert(
        "Error", 
        error.message || "Failed to pick image. Please check permissions in Settings and try again."
      );
    }
  };

  const submit = async () => {
    if (form.prompt === "" || form.title === "") {
      return Alert.alert("Error", "Please provide title and prompt");
    }

    // Validate video source
    if (useVideoUrl) {
      if (!form.videoUrl || !form.videoUrl.trim()) {
        return Alert.alert("Error", "Please provide a video URL");
      }
    } else {
      if (!form.video) {
        return Alert.alert("Error", "Please select a video or provide a video URL");
      }
    }

    // Validate thumbnail source
    if (useThumbnailUrl) {
      if (!form.thumbnailUrl || !form.thumbnailUrl.trim()) {
        return Alert.alert("Error", "Please provide a thumbnail URL");
      }
    } else {
      if (!form.thumbnail) {
        return Alert.alert("Error", "Please select a thumbnail or provide a thumbnail URL");
      }
    }

    setUploading(true);
    try {
      // Prepare video data with file objects or URLs
      const videoData = {
        title: form.title,
        prompt: form.prompt,
        video: useVideoUrl ? form.videoUrl.trim() : form.video, // URL string or file object
        thumbnail: useThumbnailUrl ? form.thumbnailUrl.trim() : form.thumbnail, // URL string or file object
      };

      // createVideo will handle uploading files to server if they're local files
      await createVideo(videoData);
      Alert.alert("Success", "Video uploaded successfully!");
      
      // Reset form
      setForm({
        title: "",
        video: null,
        videoUrl: "",
        thumbnail: null,
        thumbnailUrl: "",
        prompt: "",
      });
      setUseVideoUrl(false);
      setUseThumbnailUrl(false);
      
      router.push("/home");
    } catch (error) {
      let errorMessage = "Failed to upload video. Please try again.";
      if (error?.message) {
        if (error.message.includes("Invalid value")) {
          errorMessage = "Please ensure video and thumbnail are valid files.";
        } else if (error.message.includes("timeout") || error.message.includes("connect")) {
          errorMessage = "Cannot connect to server. Please check your connection and ensure the backend is running.";
        } else if (error.message.includes("upload")) {
          errorMessage = error.message;
        } else {
          errorMessage = error.message;
        }
      }
      Alert.alert("Upload Failed", errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center mb-2">
          <View className="w-1 h-8 bg-secondary rounded-full mr-3" />
          <Text className="text-3xl text-white font-psemibold">Create Video</Text>
        </View>
        <Text className="text-gray-400 text-sm mb-6">Share your creativity with the world</Text>

        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give your video a catchy title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-8"
        />

        <View className="mt-7 space-y-2">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base text-gray-100 font-pmedium">
              Video Source
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => {
                  setUseVideoUrl(false);
                  setForm({ ...form, videoUrl: "" });
                }}
                className={`px-3 py-1 rounded-lg ${!useVideoUrl ? 'bg-secondary' : 'bg-black-200'}`}
              >
                <Text className={`text-xs font-pmedium ${!useVideoUrl ? 'text-primary' : 'text-gray-400'}`}>
                  From Phone
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setUseVideoUrl(true);
                  setForm({ ...form, video: null });
                }}
                className={`px-3 py-1 rounded-lg ${useVideoUrl ? 'bg-secondary' : 'bg-black-200'}`}
              >
                <Text className={`text-xs font-pmedium ${useVideoUrl ? 'text-primary' : 'text-gray-400'}`}>
                  From URL
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {useVideoUrl ? (
            <View className="space-y-2">
              <TextInput
                className="w-full h-14 px-4 bg-black-100 rounded-2xl border border-black-200 text-white font-pregular"
                placeholder="Enter video URL (e.g., https://example.com/video.mp4)"
                placeholderTextColor="#7b7b8b"
                value={form.videoUrl}
                onChangeText={(text) => setForm({ ...form, videoUrl: text })}
                autoCapitalize="none"
                keyboardType="url"
              />
              {form.videoUrl && (
                <TouchableOpacity
                  onPress={() => setForm({ ...form, videoUrl: "" })}
                  className="self-start px-3 py-1 bg-red-500/20 rounded-lg"
                >
                  <Text className="text-red-400 text-xs font-pmedium">Clear</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              <View className="flex-row items-center justify-between">
                {form.video && (
                  <TouchableOpacity
                    onPress={() => setForm({ ...form, video: null })}
                    className="px-3 py-1 bg-red-500/20 rounded-lg"
                  >
                    <Text className="text-red-400 text-xs font-pmedium">Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity onPress={openVideoPicker} activeOpacity={0.8}>
            {form.video ? (
              <View className="relative">
                <Video
                  source={{ uri: form.video.uri || form.video }}
                  className="w-full h-64 rounded-2xl"
                  useNativeControls
                  resizeMode={ResizeMode.COVER}
                  isLooping={false}
                  shouldPlay={false}
                  onError={(error) => {
                    Alert.alert("Video Error", "Unable to preview video. It will still upload correctly.");
                  }}
                />
                <View className="absolute top-2 right-2 bg-black/60 rounded-full p-2">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-4 h-4"
                    tintColor="#FFA001"
                  />
                </View>
                <View className="absolute bottom-2 left-2 bg-black/60 rounded-lg px-2 py-1">
                  <Text className="text-white text-xs font-pmedium">
                    {form.video.fileName || form.video.uri?.split('/').pop() || 'Video selected'}
                  </Text>
                </View>
              </View>
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border-2 border-dashed border-secondary/50 flex justify-center items-center">
                <View className="w-16 h-16 bg-secondary/10 rounded-full flex justify-center items-center mb-3">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-8 h-8"
                    tintColor="#FFA001"
                  />
                </View>
                <Text className="text-base text-white font-psemibold">
                  Tap to select video
                </Text>
                <Text className="text-xs text-gray-400 font-pregular mt-1">
                  MP4, MOV up to 60 seconds
                </Text>
              </View>
            )}
          </TouchableOpacity>
            </>
          )}
        </View>

        <View className="mt-7 space-y-2">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base text-gray-100 font-pmedium">
              Thumbnail Source
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => {
                  setUseThumbnailUrl(false);
                  setForm({ ...form, thumbnailUrl: "" });
                }}
                className={`px-3 py-1 rounded-lg ${!useThumbnailUrl ? 'bg-secondary' : 'bg-black-200'}`}
              >
                <Text className={`text-xs font-pmedium ${!useThumbnailUrl ? 'text-primary' : 'text-gray-400'}`}>
                  From Phone
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setUseThumbnailUrl(true);
                  setForm({ ...form, thumbnail: null });
                }}
                className={`px-3 py-1 rounded-lg ${useThumbnailUrl ? 'bg-secondary' : 'bg-black-200'}`}
              >
                <Text className={`text-xs font-pmedium ${useThumbnailUrl ? 'text-primary' : 'text-gray-400'}`}>
                  From URL
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {useThumbnailUrl ? (
            <View className="space-y-2">
              <TextInput
                className="w-full h-14 px-4 bg-black-100 rounded-2xl border border-black-200 text-white font-pregular"
                placeholder="Enter thumbnail image URL (e.g., https://example.com/image.jpg)"
                placeholderTextColor="#7b7b8b"
                value={form.thumbnailUrl}
                onChangeText={(text) => setForm({ ...form, thumbnailUrl: text })}
                autoCapitalize="none"
                keyboardType="url"
              />
              {form.thumbnailUrl && (
                <TouchableOpacity
                  onPress={() => setForm({ ...form, thumbnailUrl: "" })}
                  className="self-start px-3 py-1 bg-red-500/20 rounded-lg"
                >
                  <Text className="text-red-400 text-xs font-pmedium">Clear</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              <View className="flex-row items-center justify-between">
                {form.thumbnail && (
                  <TouchableOpacity
                    onPress={() => setForm({ ...form, thumbnail: null })}
                    className="px-3 py-1 bg-red-500/20 rounded-lg"
                  >
                    <Text className="text-red-400 text-xs font-pmedium">Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity onPress={openImagePicker} activeOpacity={0.8}>
            {form.thumbnail ? (
              <View className="relative">
                <Image
                  source={{ uri: form.thumbnail.uri || form.thumbnail }}
                  resizeMode="cover"
                  className="w-full h-64 rounded-2xl"
                />
                <View className="absolute top-2 right-2 bg-black/60 rounded-full p-2">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-4 h-4"
                    tintColor="#FFA001"
                  />
                </View>
              </View>
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border-2 border-dashed border-secondary/50 flex justify-center items-center">
                <View className="w-16 h-16 bg-secondary/10 rounded-full flex justify-center items-center mb-3">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-8 h-8"
                    tintColor="#FFA001"
                  />
                </View>
                <Text className="text-base text-white font-psemibold">
                  Tap to select thumbnail
                </Text>
                <Text className="text-xs text-gray-400 font-pregular mt-1">
                  JPG, PNG recommended 16:9
                </Text>
              </View>
            )}
          </TouchableOpacity>
            </>
          )}
        </View>

        <View className="mt-7">
          <Text className="text-base text-gray-100 font-pmedium mb-2">AI Prompt / Description</Text>
          <View className="w-full min-h-[120px] px-4 py-3 bg-black-100 rounded-2xl border border-black-200">
            <TextInput
              className="text-white font-pregular text-base flex-1"
              value={form.prompt}
              placeholder="Describe your video or the AI prompt used..."
              placeholderTextColor="#7b7b8b"
              onChangeText={(e) => setForm({ ...form, prompt: e })}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={{ minHeight: 100 }}
            />
          </View>
        </View>

        <CustomButton
          title={uploading ? "Uploading..." : "Publish Video"}
          handlePress={submit}
          containerStyles="mt-7 mb-8"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
