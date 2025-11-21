import { Postcard } from "@/store/cartStore";

export const POSTCARDS: Postcard[] = [
  {
    id: "card-01",
    title: "Sunset in Seoul",
    price: 1500,
    image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=800&auto=format&fit=crop",
    highResImage: "https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=2400&auto=format&fit=crop",
    description: "서울의 노을, 그 따뜻한 순간.",
  },
  {
    id: "card-02",
    title: "Winter Silence",
    price: 1500,
    image: "https://images.unsplash.com/photo-1485594050903-8e8ee5326c90?q=80&w=800&auto=format&fit=crop",
    highResImage: "https://images.unsplash.com/photo-1485594050903-8e8ee5326c90?q=80&w=2400&auto=format&fit=crop",
    description: "고요한 겨울 숲의 정적.",
  },
  {
    id: "card-03",
    title: "Cafe Morning",
    price: 1500,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop",
    highResImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2400&auto=format&fit=crop",
    description: "커피 향 가득한 아침의 여유.",
  },
  {
    id: "card-04",
    title: "Ocean Breeze",
    price: 1500,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
    highResImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2400&auto=format&fit=crop",
    description: "바다 내음이 실려오는 바람.",
  },
  {
    id: "card-05",
    title: "Night Lights",
    price: 1500,
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop",
    highResImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2400&auto=format&fit=crop",
    description: "도시의 밤, 반짝이는 불빛들.",
  },
];

// 엽서 뒷면 이미지 (공통)
export const POSTCARD_BACK_IMAGE = "/images/postcards/back.jpg";
