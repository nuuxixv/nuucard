"use client";

import { useRef } from "react";
import html2canvas from "html2canvas";
import { Download, Check } from "lucide-react";
import { Postcard } from "@/store/cartStore";

interface OrderData {
  name: string;
  phone: string;
  email: string;
  address: string;
  detailAddress: string;
  message: string;
  items: (Postcard & { quantity: number })[];
  totalAmount: number;
  date: string;
}

interface ReceiptProps {
  orderData: OrderData;
  onClose: () => void;
}

export default function Receipt({ orderData, onClose }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // 고해상도
        backgroundColor: null, // 투명 배경 지원 (필요시)
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `receipt_${new Date().getTime()}.png`;
      link.click();
    } catch (err) {
      console.error("Receipt download failed:", err);
      alert("영수증 저장에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 bg-[#E5E5E5] flex items-center justify-center">
        {/* 영수증 UI */}
        <div
          ref={receiptRef}
          className="bg-white w-full max-w-sm p-6 shadow-xl relative text-[#1A1A1A] font-mono text-sm leading-relaxed"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 0)",
            backgroundSize: "20px 20px", // 도트 패턴 배경 (영수증 느낌)
            backgroundColor: "#fff",
          }}
        >
            {/* 상단 톱니 모양 (CSS로 구현하거나 이미지 사용) - 여기선 심플하게 */}
            <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
                <h2 className="text-2xl font-bold uppercase tracking-widest mb-1">nuucard</h2>
                <p className="text-xs text-gray-500">Order Receipt</p>
                <p className="text-xs text-gray-500">{new Date(orderData.date).toLocaleString()}</p>
            </div>

            <div className="mb-4">
                <p className="font-bold">Customer:</p>
                <p>{orderData.name} ({orderData.phone})</p>
                <p className="text-xs text-gray-500 break-all">{orderData.address} {orderData.detailAddress}</p>
            </div>

            <div className="border-b-2 border-dashed border-gray-300 pb-4 mb-4">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-500 border-b border-gray-200">
                            <th className="pb-1 font-normal">Item</th>
                            <th className="pb-1 font-normal text-right">Qty</th>
                            <th className="pb-1 font-normal text-right">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderData.items.map((item, idx) => (
                            <tr key={idx}>
                                <td className="py-1">{item.title}</td>
                                <td className="py-1 text-right">{item.quantity}</td>
                                <td className="py-1 text-right">{(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center font-bold text-lg mb-6">
                <span>TOTAL</span>
                <span>{orderData.totalAmount.toLocaleString()}원</span>
            </div>

            <div className="text-center text-xs text-gray-500">
                <p>Thank you for your purchase!</p>
                <p>문의: instagram @nuucard</p>
            </div>
            
            {/* 바코드 데코레이션 */}
            <div className="mt-6 h-12 bg-black/10 w-full flex items-center justify-center font-barcode text-2xl tracking-widest opacity-50">
                ||| || ||| | |||| ||
            </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 bg-white border-t border-gray-200 space-y-3">
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] text-white py-3 rounded-xl font-medium hover:bg-black transition-colors"
        >
          <Download size={18} />
          영수증 이미지 저장
        </button>
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 bg-gray-100 text-[#1A1A1A] py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          <Check size={18} />
          확인 (닫기)
        </button>
      </div>
    </div>
  );
}
