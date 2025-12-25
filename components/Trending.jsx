import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import * as Animatable from "react-native-animatable";
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import icons from "../constants/icons";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item }) => {
  const router = useRouter();
  const [play, setPlay] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Check if video URL is a direct video file (mp4, etc.)
  const isDirectVideo = item.video?.match(/\.(mp4|mov|avi|webm)$/i) || 
                       item.video?.startsWith('http') && !item.video?.includes('vimeo.com') && !item.video?.includes('youtube.com');
  
  const handlePress = () => {
    // Navigate to video detail page for better experience
    router.push(`/video/${item.$id}`);
  };

  const handlePlay = (e) => {
    e?.stopPropagation();
    if (isDirectVideo) {
      setPlay(true);
      setVideoError(false);
    } else {
      // For Vimeo/YouTube URLs, navigate to detail page
      router.push(`/video/${item.$id}`);
    }
  };

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play && !videoError && isDirectVideo ? (
        <Video
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-[33px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onError={(error) => {
            console.error("Video playback error:", error);
            setVideoError(true);
            setPlay(false);
          }}
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
            if (status.error) {
              setVideoError(true);
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.7}
          onPress={handlePress}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <TouchableOpacity
            className="absolute"
            onPress={handlePlay}
            activeOpacity={0.8}
          >
            <Image
              source={icons.play}
              className="w-12 h-12"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]?.$id);

  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  if (!posts || posts.length === 0) return null;

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170 }}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Trending;

