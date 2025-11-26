import { Postcard } from "@/store/cartStore";

export const POSTCARDS: Postcard[] = [
  {
    id: "card-01",
    title: "Sample Card 01",
    price: 1500,
    image: "/images/postcards/webp/card-01.webp",
    highResImage: "/images/postcards/original/card-01.jpg",
    description: "샘플 엽서 01입니다.",
  },
  {
    id: "card-02",
    title: "Sample Card 02",
    price: 1500,
    image: "/images/postcards/webp/card-02.webp",
    highResImage: "/images/postcards/original/card-02.jpg",
    description: "샘플 엽서 02입니다.",
  },
  {
    id: "card-03",
    title: "Sample Card 03",
    price: 1500,
    image: "/images/postcards/webp/card-03.webp",
    highResImage: "/images/postcards/original/card-03.jpg",
    description: "샘플 엽서 03입니다.",
  },
  {
    id: "card-04",
    title: "Sample Card 04",
    price: 1500,
    image: "/images/postcards/webp/card-04.webp",
    highResImage: "/images/postcards/original/card-04.jpg",
    description: "샘플 엽서 04입니다.",
  },
  {
    id: "card-05",
    title: "Sample Card 05",
    price: 1500,
    image: "/images/postcards/webp/card-05.webp",
    highResImage: "/images/postcards/original/card-05.jpg",
    description: "샘플 엽서 05입니다.",
  },
];

// 엽서 뒷면 이미지 (공통)
export const POSTCARD_BACK_IMAGE = "/images/postcards/back.jpg";
