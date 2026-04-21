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
