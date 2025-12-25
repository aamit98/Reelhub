import { Tabs } from "expo-router";
import { Image } from "expo-image";
import icons from "../../constants/icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FFA001",
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "#161622",
          borderTopWidth: 1,
          borderTopColor: "#232533",
          height: 84,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={icons.home}
              resizeMode="contain"
              tintColor={color}
              style={{ width: 24, height: 24, alignSelf: 'center' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          title: "Bookmark",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={icons.bookmark}
              resizeMode="contain"
              tintColor={color}
              style={{ width: 24, height: 24, alignSelf: 'center' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={icons.plus}
              resizeMode="contain"
              tintColor={color}
              style={{ width: 24, height: 24, alignSelf: 'center' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={icons.profile}
              resizeMode="contain"
              tintColor={color}
              style={{ width: 24, height: 24, alignSelf: 'center' }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
