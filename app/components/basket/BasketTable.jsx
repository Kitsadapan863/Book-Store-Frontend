"use client";
import { useState } from "react";
import { ShoppingBasket, CheckCircle2, X } from "lucide-react";
import BasketRow from "./BasketRow";
import { submitOrder } from "../../lib/api";

export default function BasketTable({ items, onUpdate }) {

  const [showModal, setShowModal] = useState(false);
  const [ordering, setOrdering]   = useState(false);
  const [ordered, setOrdered]     = useState(false);

  const grandTotal = items.reduce((sum, item) => sum + (item.detail?.price || 0) * item.count, 0);
  const totalItems = items.reduce((sum, item) => sum + (item.count || 0), 0);

  const handleOrder = async () => {
    setOrdering(true);
    try {
      await submitOrder();
      setShowModal(false);
      setOrdered(true);
      onUpdate?.();
    } catch (err) {
      console.error("Order failed:", err);
    } finally {
      setOrdering(false);
    }
  };

  // Order success state
  if (ordered) {
    return (
      <div className="bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center py-20 px-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">สั่งซื้อสำเร็จ!</h2>
        <p className="text-gray-500 text-sm">ขอบคุณที่ใช้บริการ ระบบกำลังดำเนินการคำสั่งซื้อของคุณ</p>
        <button
          onClick={() => setOrdered(false)}
          className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition"
        >
          กลับไปหน้าตะกร้า
        </button>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center py-20 px-8 text-center">
        <ShoppingBasket size={48} className="text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-600">ตะกร้าสินค้าว่างเปล่า</h2>
        <p className="text-gray-400 text-sm mt-1">เพิ่มหนังสือที่ต้องการจากหน้าหลัก</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">หนังสือ</th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">ราคา/เล่ม</th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">จำนวน</th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">รวม</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <BasketRow key={item.detail?.isbn || item.isbn} item={item} onUpdate={onUpdate} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="border-t border-gray-100 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">{totalItems} รายการ</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">
              ฿{Number(grandTotal).toLocaleString()}
              <span className="text-sm font-normal text-gray-400 ml-1">บาท</span>
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-8 py-3 bg-gray-900 hover:bg-gray-700 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            สั่งซื้อ
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !ordering && setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <button
              onClick={() => setShowModal(false)}
              disabled={ordering}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-40"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBasket size={22} className="text-gray-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">ยืนยันการสั่งซื้อ</h3>
              <p className="text-sm text-gray-500 mt-1">
                คุณต้องการสั่งซื้อหนังสือ {totalItems} รายการ
              </p>
            </div>

            {/* Order summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-1.5">
              {items.map((item) => (
                <div key={item.isbn} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate mr-2">{item.detail?.book_name}</span>
                  <span className="text-gray-800 shrink-0">x{item.count}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-gray-900">
                <span>รวมทั้งหมด</span>
                <span>฿{Number(grandTotal).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={ordering}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleOrder}
                disabled={ordering}
                className="flex-1 py-2.5 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {ordering ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    กำลังสั่งซื้อ...
                  </>
                ) : "ยืนยัน"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}