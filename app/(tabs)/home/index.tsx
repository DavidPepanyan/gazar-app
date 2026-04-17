import { useAuth } from "@clerk/expo";
import { Stack, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Home() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <>
      <Stack.Screen options={{ title: "Home" }} />

      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-bold mb-6">Home</Text>

        <Pressable
          onPress={handleLogout}
          className="bg-red-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Logout</Text>
        </Pressable>
      </View>
    </>
  );
}