import React from "react";
import { Text, View } from "react-native";
import { useTranslation } from "@/src/hooks/UseTranslation";

interface DeliveryWindow {
  time: string;
  titleKey: string;
}

const DELIVERY_WINDOWS: DeliveryWindow[] = [
  { time: "10:00 - 11:00", titleKey: "home.deliveryWindows.morning" },
  { time: "13:00 - 14:00", titleKey: "home.deliveryWindows.midday" },
  { time: "16:00 - 17:00", titleKey: "home.deliveryWindows.afternoon" },
  { time: "19:00 - 20:00", titleKey: "home.deliveryWindows.evening" },
];

export const DeliveryInfo = React.memo(() => {
  const { t } = useTranslation();

  return (
    <View className="mx-2  mt-4 rounded-3xl bg-white px-4">
      <Text className="text-lg font-bold text-gray-900">{t("home.deliveryTitle")}</Text>

      <View className="mt-3 flex-row flex-wrap justify-between gap-y-2">
        {DELIVERY_WINDOWS.map((window) => (
          <View
            key={window.time}
            className="w-[48%] rounded-xl  border border-primary/15 p-3"
          >
            <Text className="text-base font-bold text-center text-primary">{window.time}</Text>
            <Text className="mt-1 text-sm font-medium text-center text-gray-600" numberOfLines={2}>
              {t(window.titleKey)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});

DeliveryInfo.displayName = "DeliveryInfo";
