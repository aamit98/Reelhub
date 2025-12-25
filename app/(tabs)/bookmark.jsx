import { View, Text, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getBookmarks } from "../../lib/api";
import { VideoCard, EmptyState } from "../../components";

const Bookmark = () => {
  const { user } = useGlobalContext();
  const [bookmarkedVideos, setBookmarkedVideos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const videos = await getBookmarks();
      setBookmarkedVideos(videos);
    } catch (error) {
      // Silent error handling
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBookmarks();
  }, []);

  if (!user) {
    return (
      <SafeAreaView className="bg-primary h-full justify-center items-center">
        <EmptyState
          title="Please sign in"
          subtitle="Sign in to view your bookmarked videos"
        />
      </SafeAreaView>
    );
  }

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
        <View className="px-4 my-6">
          <Text className="text-2xl font-psemibold text-white">Bookmarks</Text>
          <Text className="text-sm font-pregular text-gray-100 mt-1">
            {bookmarkedVideos.length} saved videos
          </Text>
        </View>

        {bookmarkedVideos.length > 0 ? (
          <View className="px-4">
            {bookmarkedVideos.map((item, index) => (
              <VideoCard key={item.$id} video={item} index={index} />
            ))}
          </View>
        ) : (
          <EmptyState
            title="No bookmarks yet"
            subtitle="Save videos you like to watch them later"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Bookmark;
