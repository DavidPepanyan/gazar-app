import { API_ENDPOINTS } from "../constants/api";

interface SliderDetailResponse {
  id: number;
  title: string;
  description: string;
  link: string;
}

interface MainSliderGroupResponse {
  id: number;
  gzSliderDetails?: SliderDetailResponse[];
}

interface CategoryDetailResponse {
  name?: string;
  lan?: string;
  imageLink?: string;
}

interface HomeCategoryResponse {
  id: number;
  name?: string;
  gzCategoryDetails?: CategoryDetailResponse[];
}

interface FavoriteProductDetailResponse {
  name?: string;
}

interface FavoriteProductCategoryResponse {
  name?: string;
}

interface HomeFavoriteProductResponse {
  id: number;
  slug?: string;
  price?: number;
  unit?: string;
  gzProductDetails?: FavoriteProductDetailResponse[];
  GzCategory?: FavoriteProductCategoryResponse;
  discount?: number;
  discountType?: string;
  discountActive?: boolean;
  imageLink?: string;
  weight?: number;
  minLimit?: number;
  maxLimit?: number;
}

export interface HomeBanner {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface HomeCategory {
  id: number;
  slug: string;
  title: string;
  image: string;
}

export interface HomeFavoriteProduct {
  id: number;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  price: number;
  unit: "pc" | "kg";
  discount: number;
  discountType: string;
  discountActive: boolean;
  image: string;
  weight: number;
  minLimit: number;
  maxLimit: number;
}

const toCategorySlug = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const fetchHomeMainSlider = async (
  lan: string = "EN",
): Promise<HomeBanner[]> => {
  const response = await fetch(API_ENDPOINTS.HOME_MAIN_SLIDER(lan), {
    method: "GET",
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as MainSliderGroupResponse[];

  return data.flatMap((group) =>
    (group.gzSliderDetails || []).map((detail) => ({
      id: detail.id || group.id,
      title: detail.title || "",
      description: detail.description || "",
      image: detail.link || "",
    })),
  );
};

export const fetchHomeCategories = async (
  lan: string = "EN",
): Promise<HomeCategory[]> => {
  const response = await fetch(API_ENDPOINTS.HOME_CATEGORIES(lan), {
    method: "GET",
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as HomeCategoryResponse[];

  return data.map((category) => {
    const detail = category.gzCategoryDetails?.[0];

    return {
      id: category.id,
      slug: category.name || "",
      title: detail?.name || category.name || "",
      image: detail?.imageLink || "",
    };
  });
};

export const fetchHomeFavoriteProducts = async (
  lan: string = "EN",
): Promise<HomeFavoriteProduct[]> => {
  const response = await fetch(API_ENDPOINTS.HOME_FAVORITE_PRODUCTS(lan), {
    method: "GET",
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as HomeFavoriteProductResponse[];

  return data.map((product) => {
    const categoryName = product.GzCategory?.name || "";

    return {
      id: product.id,
      slug: product.slug || "",
      title: product.gzProductDetails?.[0]?.name?.trim() || product.slug || "",
      category: categoryName,
      categorySlug: toCategorySlug(categoryName),
      price: product.price || 0,
      unit: product.unit === "kg" ? "kg" : "pc",
      discount: product.discount || 0,
      discountType: product.discountType || "PRICE",
      discountActive: Boolean(product.discountActive),
      image: product.imageLink || "",
      weight: product.weight || 0,
      minLimit: product.minLimit || 1,
      maxLimit: product.maxLimit || 1,
    };
  });
};
