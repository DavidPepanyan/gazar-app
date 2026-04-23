import { ShopCatalog } from "@/src/components/shop/ShopCatalog";
import { useLocalSearchParams } from "expo-router";

export default function ShopScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const normalizedCategoryId = Array.isArray(categoryId) ? categoryId[0] : categoryId;
  const parsedCategoryId = Number(normalizedCategoryId);
  const selectedCategoryId = Number.isFinite(parsedCategoryId) ? parsedCategoryId : null;

  return <ShopCatalog selectedCategoryId={selectedCategoryId} />;
}