import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import "@/src/utils/i18n";
import "@/src/store/Language.store";
import "../global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="language"
          options={{
            headerShown: true,
            presentation: "card",
            headerBackButtonDisplayMode: "minimal",
            contentStyle: {
              backgroundColor: "#ffffff",
            },
          }}
        />
        <Stack.Screen name="user-details" options={{ headerShown: false }} />
      </Stack>
    </ClerkProvider>
  );
}
