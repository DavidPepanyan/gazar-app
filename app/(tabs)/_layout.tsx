import { useTranslation } from "@/src/hooks/UseTranslation";
import { useAuth } from "@clerk/expo";
import { Redirect, Tabs } from "expo-router";
import { House, Menu, ShoppingBag, ShoppingCart } from "lucide-react-native";

export default function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { t } = useTranslation();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "#ffffff" },
        tabBarStyle: { backgroundColor: "#ffffff" },
        tabBarActiveTintColor: "#7ac943",
        tabBarInactiveTintColor: "#9ca3af",
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="shop/index"
        options={{
          title: t("tabs.shop"),
          tabBarIcon: ({ color, size }) => (
            <ShoppingBag color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="basket/index"
        options={{
          title: t("tabs.basket"),
          tabBarIcon: ({ color, size }) => (
            <ShoppingCart color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="more/index"
        options={{
          title: t("tabs.more"),
          tabBarIcon: ({ color, size }) => <Menu color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
