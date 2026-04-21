import React from "react";
import { Text, View } from "react-native";

interface DeliveryWindow {
  time: string;
  title: string;
}

const DELIVERY_WINDOWS: DeliveryWindow[] = [
  { time: "10:00 - 11:00", title: "Morning freshness" },
  { time: "13:00 - 14:00", title: "A healthy break" },
  { time: "16:00 - 17:00", title: "Late-day freshness" },
  { time: "19:00 - 20:00", title: "Vitamin charging" },
];

export const DeliveryInfo = React.memo(() => {
  return (
    <View className="mx-2 mt-4 rounded-3xl bg-white p-4">
      <Text className="text-lg font-bold text-black">Free Delivery</Text>

      <View className="mt-3 flex-row flex-wrap justify-between gap-y-2">
        {DELIVERY_WINDOWS.map((window) => (
          <View
            key={window.time}
            className="w-[48%] rounded-xl  bg-[#f1f1f1] p-3"
          >
            <Text className="text-base font-bold text-center text-primary">{window.time}</Text>
            <Text className="mt-1 text-sm font-medium text-center text-gray-700" numberOfLines={2}>
              {window.title}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});

DeliveryInfo.displayName = "DeliveryInfo";
