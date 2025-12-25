import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, RefreshControl, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getVideos, getTrendingVideos } from "../../lib/api";
import { images } from "../../constants";
import { VideoCardInline, EmptyState, Trending, SearchInput, Loader, VideoCardSkeleton } from "../../components";

const Home = () => {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async (silent = false) => {
    try {
      const [allVideos, trending] = await Promise.all([
        getVideos(),
        getTrendingVideos().catch(() => []) // Fallback to empty array if trending fails
      ]);
      setVideos(allVideos);
      setTrendingVideos(trending.length > 0 ? trending : allVideos.slice(0, 4));
    } catch (error) {
      // Silent error handling
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchVideos(true);
  }, []);

  // Get all videos for the feed
  const feedVideos = videos;

  return (
    <SafeAreaView className="bg-primary h-full">
      {loading ? (
        <ScrollView className="px-4 my-6">
          <View className="mb-6">
            <VideoCardSkeleton />
            <VideoCardSkeleton />
            <VideoCardSkeleton />
          </View>
        </ScrollView>
      ) : (
      <FlatList
        data={feedVideos}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCardInline video={item} />
        )}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-1">
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white mt-1">
                  Discover
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logo}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            {trendingVideos.length > 0 && (
              <View className="mt-6">
                <Text className="text-xl font-psemibold text-white mb-3">
                  Trending Videos
                </Text>
                <Trending posts={trendingVideos} />
              </View>
            )}

            <View className="mt-6">
              <Text className="text-xl font-psemibold text-white mb-3">
                Latest Videos
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#FF9C01"
            colors={["#FF9C01"]}
          />
        }
        contentContainerStyle={{
          paddingBottom: 20
        }}
      />
      )}
    </SafeAreaView>
  );
};

export default Home;
