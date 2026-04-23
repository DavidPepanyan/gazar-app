import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "@/src/hooks/UseTranslation";

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (nextValue: number) => void;
  unit?: string;
}

export const QuantitySelector = React.memo<QuantitySelectorProps>(
  ({ value, min = 1, max = 20, onChange, unit }) => {
    const { t } = useTranslation();
    const isDecreaseDisabled = value <= min;
    const isIncreaseDisabled = value >= max;

    const handleDecrease = React.useCallback(() => {
      if (isDecreaseDisabled) {
        return;
      }

      onChange(Math.max(min, value - 1));
    }, [isDecreaseDisabled, min, onChange, value]);

    const handleIncrease = React.useCallback(() => {
      if (isIncreaseDisabled) {
        return;
      }

      onChange(Math.min(max, value + 1));
    }, [isIncreaseDisabled, max, onChange, value]);

    return (
      <View className="flex-row items-center justify-between rounded-full w-full bg-neutral-100 px-1 py-1">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("quantity.decreaseA11y")}
          onPress={handleDecrease}
          disabled={isDecreaseDisabled}
          className={`min-h-[36px] min-w-[36px] items-center justify-center rounded-full ${
            isDecreaseDisabled ? "bg-gray-200" : "bg-white"
          }`}
        >
          <Text
            className={`text-lg font-bold ${
              isDecreaseDisabled ? "text-gray-400" : "text-gray-700"
            }`}
          >
            -
          </Text>
        </Pressable>

        <Text className="mx-3 min-w-[20px] text-center text-base font-semibold text-gray-900">
          {value} {unit}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("quantity.increaseA11y")}
          onPress={handleIncrease}
          disabled={isIncreaseDisabled}
          className={`min-h-[36px] min-w-[36px] items-center justify-center rounded-full ${
            isIncreaseDisabled ? "bg-gray-200" : "bg-primary"
          }`}
        >
          <Text
            className={`text-lg font-bold ${
              isIncreaseDisabled ? "text-gray-400" : "text-white"
            }`}
          >
            +
          </Text>
        </Pressable>
      </View>
    );
  },
);

QuantitySelector.displayName = "QuantitySelector";
