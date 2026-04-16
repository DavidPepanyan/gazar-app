import {
    Alert,
    Image,
    ImageBackground,
    Pressable,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/logos/logo.png";

export default function App() {
  return (
    <ImageBackground
      source={require("../assets/images/OnBoarding/374.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View className="absolute inset-0 bg-black/30" />
      <SafeAreaView className="flex-1 relative ">
        <View className="absolute inset-0 items-center justify-center">
          <Image source={logo} className="w-64 object-contain" />
        </View>

        <View className="justify-end w-full h-full">
          <Pressable
            onPress={() => Alert.alert("Button pressed")}
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
