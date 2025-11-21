"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { Search } from "lucide-react";

declare global {
  interface Window {
    daum: any;
  }
}

interface CheckoutFormProps {
  onCancel: () => void;
  onComplete: (orderData: any) => void;
}

export default function CheckoutForm({ onCancel, onComplete }: CheckoutFormProps) {
  const { items } = useCartStore();
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    detailAddress: "",
    message: "",
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    let formatted = value;
    if (value.length > 3 && value.length <= 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    setFormData({ ...formData, phone: formatted });
  };

  const handleAddressSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data: any) {
        setFormData((prev) => ({
          ...prev,
          address: data.roadAddress || data.jibunAddress,
        }));
      },
    }).open();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 유효성 검사 등 추가 가능
    onComplete({ ...formData, items, totalAmount, date: new Date().toISOString() });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-muted mb-1">이름</label>
        <input
          type="text"
          required
          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="받으실 분 성함"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-1">연락처</label>
        <input
          type="tel"
          required
          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
          value={formData.phone}
          onChange={handlePhoneChange}
          placeholder="010-0000-0000"
          maxLength={13}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-1">이메일</label>
        <input
          type="email"
          required
          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="receipt@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-1">주소</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            readOnly
            required
            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed"
            value={formData.address}
            placeholder="주소 검색을 이용해주세요"
          />
          <button
            type="button"
            onClick={handleAddressSearch}
            className="bg-[#1A1A1A] text-white px-4 rounded-lg hover:bg-black/80 transition-colors flex items-center justify-center"
          >
            <Search size={18} />
          </button>
        </div>
        <input
          type="text"
          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
          value={formData.detailAddress}
          onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
          placeholder="상세 주소 입력 (동, 호수 등)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-1">응원 메시지 (선택)</label>
        <textarea
          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none h-24"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="작가님에게 전하고 싶은 말이 있다면 적어주세요 :)"
        />
      </div>

      <div className="bg-accent/10 p-4 rounded-lg mt-6">
        <p className="text-sm text-accent font-bold mb-1">계좌번호 안내</p>
        <p className="text-sm text-[#1A1A1A]">카카오뱅크 3333-XX-XXXXXX (예금주: 김건우)</p>
        <p className="text-xs text-muted mt-1">* 주문 후 24시간 이내에 입금해주세요.</p>
      </div>

      <div className="pt-4 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 rounded-xl font-medium text-muted hover:bg-gray-100 transition-colors"
        >
          이전으로
        </button>
        <button
          type="submit"
          className="flex-[2] bg-accent text-white py-4 rounded-xl font-bold text-lg hover:bg-[#C08E5E] transition-colors shadow-lg active:scale-[0.98]"
        >
          {totalAmount.toLocaleString()}원 결제하기
        </button>
      </div>
    </form>
  );
}
