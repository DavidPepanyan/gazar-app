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

export interface HomeBanner {
  id: number;
  title: string;
  description: string;
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
