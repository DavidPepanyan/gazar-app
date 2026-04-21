import { Image } from "expo-image";
import React from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { HomeBanner } from "../../services/home.service";

interface BannerSliderProps {
  banners: HomeBanner[];
  onBannerPress?: (banner: HomeBanner) => void;
}

const WINDOW_WIDTH = Dimensions.get("window").width;
const BANNER_WIDTH = WINDOW_WIDTH;
const BANNER_HEIGHT = 180;

export const BannerSlider = React.memo<BannerSliderProps>(
  ({ banners, onBannerPress }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    if (!banners.length) {
      return null;
    }

    return (
      <View>
        <Carousel
          width={BANNER_WIDTH}
          height={BANNER_HEIGHT}
          style={{ width: WINDOW_WIDTH }}
          data={banners}
          autoPlay
          autoPlayInterval={3500}
          loop
          scrollAnimationDuration={800}
          onSnapToItem={setCurrentIndex}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onBannerPress?.(item)}
              className="relative mx-6 h-[180px] overflow-hidden rounded-3xl bg-black"
            >
              <Image
                source={{ uri: item.image }}
                contentFit="cover"
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  width: "100%",
                  height: BANNER_HEIGHT,
                }}
              />
              <View
                pointerEvents="none"
                className="absolute inset-0 bg-black/20"
              />

              <View className="absolute inset-0 z-10 justify-between p-5">
                <View>
                  {item.description?.trim() ? (
                    <Text
                      className="text-sm font-medium"
                      style={{ color: "#FFFFFFE6" }}
                      numberOfLines={1}
                    >
                      {item.description}
                    </Text>
                  ) : null}

                  <Text
                    className="mt-2 w-[90%] text-lg font-bold leading-normal"
                    style={{ color: "#FFFFFF" }}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                </View>

                <Pressable className="self-start rounded-full bg-white px-4 py-1.5">
                  <Text className="text-base font-bold text-black">Shop Now</Text>
                </Pressable>
              </View>
            </Pressable>
          )}
        />

        {banners.length > 1 && (
          <View className="mt-4 flex-row items-center justify-center gap-2">
            {banners.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-6 bg-primary"
                    : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </View>
        )}
      </View>
    );
  },
);

BannerSlider.displayName = "BannerSlider";
