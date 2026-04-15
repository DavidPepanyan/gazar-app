import { Button, Text, View } from "react-native";
 
export default function App() {
  return (
    <View className="flex-1 items-center  justify-center bg-white">
      <Text className="text-xl font-bold text-green-500 bg-red-500">
        Welcome to Nativewind!asas
      </Text>

      <Button title="Click me" onPress={() => alert("Button pressed")} />
    </View>
  );
}