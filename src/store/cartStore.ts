import { create } from 'zustand';

export interface Postcard {
  id: string;
  title: string;
  price: number;
  image: string;
  highResImage: string; // 고화질 이미지 (돋보기용)
  description: string;
}

interface CartItem extends Postcard {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (postcard: Postcard) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isOpen: false,
  addToCart: (postcard) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === postcard.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === postcard.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          isOpen: true, // 아이템 추가 시 장바구니 열기
        };
      }
      return {
        items: [...state.items, { ...postcard, quantity: 1 }],
        isOpen: true,
      };
    }),
  removeFromCart: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0), // 0이 되면 삭제
    })),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  clearCart: () => set({ items: [] }),
}));
