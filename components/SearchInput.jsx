import { useState } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Image, TextInput, Alert } from "react-native";
import icons from "../constants/icons";
import { triggerHaptic } from "../lib/haptics";

const SearchInput = ({ initialQuery, onSearch }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  const handleSearch = () => {
    triggerHaptic("light");
    if (query.trim() === "") {
      Alert.alert(
        "Missing Query",
        "Please input something to search results across database"
      );
      return;
    }

    // If onSearch callback provided, use it (for search page)
    if (onSearch) {
      onSearch(query.trim());
      return;
    }

    // Otherwise use router navigation (for home page)
    router.push({
      pathname: '/search',
      params: { query: query.trim() }
    });
  };

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder="Search a video topic"
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity onPress={handleSearch}>
        <Image 
          source={icons.search} 
          className="w-5 h-5" 
          resizeMode="contain"
          tintColor="#CDCDE0"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;

