"use client";
import { useBasket } from "../../hooks/useBasket";
import BasketTable from "../../components/basket/BasketTable";
import { ShoppingBasket } from "lucide-react";

export default function BasketPage() {
  const { basketItems, loading, refetch } = useBasket();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
          <ShoppingBasket size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">ตะกร้าสินค้า</h1>
          <p className="text-gray-400 text-sm">รายการหนังสือที่เลือกไว้</p>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">กำลังโหลดตะกร้า...</p>
          </div>
        </div>
      ) : (
        <BasketTable items={basketItems} onUpdate={refetch} />
      )}
    </div>
  );
}