import { API_ENDPOINTS } from "../constants/api";

interface ShopProductDetailResponse {
  name?: string;
}

interface ShopProductCategoryResponse {
  name?: string;
}

interface ShopProductResponse {
  id: number;
  slug?: string;
  price?: number;
  unit?: string;
  gzProductDetails?: ShopProductDetailResponse[];
  GzCategory?: ShopProductCategoryResponse;
  discount?: number;
  discountType?: string;
  discountActive?: boolean;
  imageLink?: string;
  weight?: number;
  minLimit?: number;
  maxLimit?: number;
}

export interface ShopProduct {
  id: number;
  slug: string;
  title: string;
  category: string;
  price: number;
  unit: "piece" | "kg";
  discount: number;
  discountType: string;
  discountActive: boolean;
  image: string;
  weight: number;
  minLimit: number;
  maxLimit: number;
}

export const fetchShopProducts = async (
  lan: string = "EN",
  categoryId?: number,
): Promise<ShopProduct[]> => {
  const response = await fetch(API_ENDPOINTS.SHOP_PRODUCTS(lan, categoryId), {
    method: "GET",
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as ShopProductResponse[];

  return data.map((product) => ({
    id: product.id,
    slug: product.slug || "",
    title: product.gzProductDetails?.[0]?.name?.trim() || product.slug || "",
    category: product.GzCategory?.name || "",
    price: product.price || 0,
    unit: product.unit === "kg" ? "kg" : "piece",
    discount: product.discount || 0,
    discountType: product.discountType || "PRICE",
    discountActive: Boolean(product.discountActive),
    image: product.imageLink || "",
    weight: product.weight || 0,
    minLimit: product.minLimit || 1,
    maxLimit: product.maxLimit || 1,
  }));
};
