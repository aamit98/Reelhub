import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getVideos } from "../../lib/api";
import { icons } from "../../constants";
import { VideoCardInline, EmptyState, SearchInput } from "../../components";

const Search = () => {
  const router = useRouter();
  const { query: initialQuery } = useLocalSearchParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) {
      setVideos([]);
      return;
    }

    setLoading(true);
    try {
      const results = await getVideos(searchTerm);
      setVideos(results);
    } catch (error) {
      // Silent error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="px-4 mt-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-psemibold text-white">Search</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Image
                source={icons.leftArrow}
                className="w-6 h-6"
                resizeMode="contain"
                tintColor="#CDCDE0"
              />
            </TouchableOpacity>
          </View>
          <SearchInput initialQuery={initialQuery || ""} onSearch={performSearch} />
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center mt-20">
            <Text className="text-gray-100">Searching...</Text>
          </View>
        ) : videos.length > 0 ? (
          <View>
            {videos.map((item) => (
              <VideoCardInline key={item.$id} video={item} />
            ))}
          </View>
        ) : (
          <EmptyState
            title="Search for videos"
            subtitle="Enter a search term to find videos"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Search;

