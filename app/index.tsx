import { Image, ImageBackground } from "expo-image";
import { useAuth } from "@clerk/expo";
import { Redirect, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <ImageBackground
      source={require("../assets/images/OnBoarding/374.jpg")}
      className="flex-1"
      contentFit="cover"
    >
      <View className="absolute inset-0 bg-black/30" />

      <SafeAreaView className="relative flex-1">
        <View className="absolute inset-0 z-10 items-center justify-center">
          <Image
            source={require("../assets/images/logos/logo.png")}
            style={{ width: 180, height: 160 }}
            contentFit="contain"
          />
        </View>

        <View className="justify-end w-full h-full relative z-10">
          <Pressable
            onPress={() => router.push("/(auth)/sign-in")}
            className="bg-[#7ac943] px-5 py-3 rounded-3xl w-[90%] self-center items-center justify-center"
          >
            <Text className="text-white font-bold text-center text-xl">
              Welcome
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
