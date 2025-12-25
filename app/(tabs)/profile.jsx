import { View, Text, ScrollView, TouchableOpacity, Image, Alert, TextInput, Modal, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getUserVideos, updateUserProfile } from "../../lib/api";
import { icons, images } from "../../constants";
import { VideoCardInline, EmptyState, InfoBox, FormField, CustomButton } from "../../components";
import * as ImagePicker from "expo-image-picker";

const Profile = () => {
  const router = useRouter();
  const { user, session } = useGlobalContext();
  const [userVideos, setUserVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.$id) {
      fetchUserVideos();
    }
  }, [user]);

  // Refresh when profile tab comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.$id) {
        fetchUserVideos();
      }
    }, [user?.$id])
  );

  const fetchUserVideos = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const videos = await getUserVideos(user.$id);
      setUserVideos(videos);
    } catch (error) {
      // Silent error handling
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserVideos(true);
  }, [user?.$id]);

  const logout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await session.signOut();
          router.replace("/sign-in");
        },
      },
    ]);
  };

  const openEditModal = () => {
    setEditForm({
      username: user?.username || "",
      bio: user?.bio || "",
      avatar: user?.avatar || "",
    });
    setIsEditModalVisible(true);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "We need access to your photos to set a profile picture");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Images],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setEditForm({ ...editForm, avatar: result.assets[0].uri });
    }
  };

  const handleSaveProfile = async () => {
    if (!editForm.username.trim()) {
      Alert.alert("Error", "Username is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const profileData = {
        username: editForm.username.trim(),
        bio: editForm.bio.trim() || '',
      };

      if (editForm.avatar && editForm.avatar !== user?.avatar) {
        profileData.avatar = editForm.avatar;
      }

      const updatedUser = await updateUserProfile(user.$id, profileData);
      if (updatedUser) {
        // Refresh session to get updated user data
        await session.refresh();
        setIsEditModalVisible(false);
        Alert.alert("Success", "Profile updated successfully");
      } else {
        throw new Error("No user data returned");
      }
    } catch (error) {
      const errorMessage = error?.message || "Failed to update profile. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF9C01"
            colors={["#FF9C01"]}
          />
        }
      >
        <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
          <TouchableOpacity
            className="w-full items-end mb-10"
            onPress={logout}
          >
            <Image
              source={icons.logout}
              resizeMode="contain"
              className="w-6 h-6"
            />
          </TouchableOpacity>

          <View className="w-16 h-16 border border-secondary rounded-2xl flex justify-center items-center">
            <Image
              key={user?.avatar}
              source={{ uri: user?.avatar || "https://via.placeholder.com/100" }}
              className="w-[90%] h-[90%] rounded-2xl"
              resizeMode="cover"
            />
          </View>

          <Text className="text-white font-psemibold text-2xl mt-5">
            {user?.username}
          </Text>

          {user?.bio && (
            <Text className="text-gray-100 font-pregular text-sm mt-2 text-center px-4">
              {user.bio}
            </Text>
          )}

          <View className="flex-row gap-2 mt-4">
            <InfoBox
              title={userVideos.length.toString()}
              subtitle="Videos"
              containerStyles="px-4 py-2 rounded-2xl bg-black-100"
              titleStyles="text-secondary text-lg"
            />
          </View>

          <TouchableOpacity
            onPress={openEditModal}
            className="mt-4 px-6 py-2 bg-secondary rounded-2xl"
          >
            <Text className="text-primary font-psemibold text-center">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Profile Modal */}
        <Modal
          visible={isEditModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsEditModalVisible(false)}
        >
          <View className="flex-1 bg-black/80 justify-end">
            <View className="bg-primary rounded-t-3xl pt-6 pb-8 px-4">
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-white font-psemibold text-xl">Edit Profile</Text>
                <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                  <Text className="text-secondary font-psemibold">Done</Text>
                </TouchableOpacity>
              </View>

              <View className="items-center mb-6">
                <TouchableOpacity onPress={pickImage} className="relative">
                  <Image
                    source={{ uri: editForm.avatar || "https://via.placeholder.com/100" }}
                    className="w-24 h-24 rounded-full border-2 border-secondary"
                    resizeMode="cover"
                  />
                  <View className="absolute bottom-0 right-0 bg-secondary rounded-full p-2">
                    <Image
                      source={icons.upload}
                      className="w-4 h-4"
                      resizeMode="contain"
                      tintColor="#161622"
                    />
                  </View>
                </TouchableOpacity>
                <Text className="text-gray-400 text-sm mt-2">Tap to change photo</Text>
              </View>

              <FormField
                title="Username"
                value={editForm.username}
                handleChangeText={(text) => setEditForm({ ...editForm, username: text })}
                otherStyles="mt-4"
                placeholder="Enter your username"
              />

              <View className="mt-4">
                <Text className="text-base text-gray-100 font-pmedium mb-2">Bio</Text>
                <TextInput
                  className="bg-black-100 rounded-2xl px-4 py-3 text-white font-pregular min-h-[100px]"
                  placeholder="Tell us about yourself..."
                  placeholderTextColor="#7b7b8b"
                  value={editForm.bio}
                  onChangeText={(text) => setEditForm({ ...editForm, bio: text })}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <CustomButton
                title="Save Changes"
                handlePress={handleSaveProfile}
                containerStyles="w-full mt-6"
                isLoading={isSubmitting}
              />
            </View>
          </View>
        </Modal>

        {userVideos.length > 0 ? (
          <View>
            <View className="px-4 mb-3">
              <Text className="text-white font-psemibold text-xl">
                My Videos
              </Text>
            </View>
            {userVideos.map((item) => (
              <VideoCardInline key={item.$id} video={item} />
            ))}
          </View>
        ) : (
          <EmptyState
            title="No videos yet"
            subtitle="Upload your first video to get started!"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
