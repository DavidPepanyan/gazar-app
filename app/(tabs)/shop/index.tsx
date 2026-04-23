import { Text, View } from "react-native";
import { useTranslation } from "@/src/hooks/UseTranslation";

export default function ShopScreen() {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>{t("shop.title")}</Text>
    </View>
  );
}