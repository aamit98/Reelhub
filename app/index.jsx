import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { useGlobalContext } from "../context/GlobalProvider";

export default function App() {
  const { isLogged, loading } = useGlobalContext();

  if (loading) {
    return null; // Or a loading screen
  }

  if (isLogged) {
    return <Redirect href="/home" />;
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View className="w-full justify-start items-center min-h-[85vh] px-4 pt-16">
          <Image 
            source={images.logo}
            className="w-[220px] h-[140px]"
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
            />

            <View className="relative mt-5 items-center">
              <Text className="text-3xl text-white font-bold text-center ">
                Discover Endless{'\n'}
                Possibilities with {' '}
                <Text className="text-secondary">ReelHub!</Text>
              </Text>
              <Image 
                source={images.path}
                className="w-[136px] h-[15px] absolute bottom-2 -right-[110px]"
                resizeMode="contain"
              />
            </View>
            <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">where creativity meets innovation: embark on a 
              journey of limitless exploration with ReelHub 
            </Text>
            <CustomButton title="Continue with Email:"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-7"/>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#0F0B1E" style="light"/>
    </SafeAreaView>
  );
}
