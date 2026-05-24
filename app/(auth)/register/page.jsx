"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "../../lib/api";
import { BookOpen, Eye, EyeOff, AlertCircle, CheckCircle2, Check, X } from "lucide-react";

const rules = [
  { id: "length", label: "อย่างน้อย 8 ตัวอักษร", test: (v) => v.length >= 8 },
  { id: "upper",  label: "ตัวอักษรพิมพ์ใหญ่ (A-Z)",  test: (v) => /[A-Z]/.test(v) },
  { id: "number", label: "ตัวเลข (0-9)",              test: (v) => /[0-9]/.test(v) },
];

function validatePassword(pwd) {
  const errors = [];
  if (!pwd || pwd.length < 8) errors.push("length");
  if (!/[A-Z]/.test(pwd)) errors.push("upper");
  if (!/[0-9]/.test(pwd)) errors.push("number");
  return errors; // [] = ok
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "", password2: "" });
  const [showPwd, setShowPwd]   = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const passwordMatch = form.password2.length > 0 && form.password === form.password2;
  const passwordMismatch = form.password2.length > 0 && form.password !== form.password2;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      setError("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
      return;
    }
    const pwdErrors = validatePassword(form.password);
    if (pwdErrors.length > 0) {
      const labels = pwdErrors.map((id) => rules.find((r) => r.id === id)?.label || id);
      setError(`รหัสผ่านต้องมี: ${labels.join(", ")}`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(form.username, form.email, form.password, form.password2);
      setSuccess(true);
      setTimeout(() => router.replace("/auth/login"), 2000);
    } catch (err) {
      console.error("Register error:", err);
      const data = err?.response?.data;
      if (data?.username)      setError("ชื่อผู้ใช้นี้ถูกใช้งานแล้ว");
      else if (data?.email)    setError("อีเมลนี้ถูกใช้งานแล้ว");
      else if (data?.password) setError(Array.isArray(data.password) ? data.password[0] : data.password);
      else                     setError("สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden text-center px-8 py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">สมัครสมาชิกสำเร็จ!</h2>
          <p className="text-gray-500 text-sm">กำลังพาไปหน้า Login...</p>
          <div className="mt-4 w-8 h-8 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto" />
        </div>
      </div>
          </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gray-900 px-8 py-7 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500 mb-3">
            <BookOpen size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">สมัครสมาชิก</h1>
          <p className="text-gray-400 text-sm mt-1">สร้างบัญชีใหม่เพื่อเริ่มต้นใช้งาน</p>
        </div>

        {/* Form */}
        <div className="px-8 py-7">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
              <input
                type="text" name="username" value={form.username}
                onChange={handleChange} required placeholder="กรอก username"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder-gray-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} required placeholder="example@email.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder-gray-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"} name="password" value={form.password}
                  onChange={handleChange} required placeholder="กรอก password"
                  className="w-full px-4 py-2.5 pr-11 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder-gray-400"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength rules */}
              {form.password.length > 0 && (
                <div className="mt-2 space-y-1">
                  {rules.map((r) => {
                    const pass = r.test(form.password);
                    return (
                      <div key={r.id} className={`flex items-center gap-2 text-xs transition-colors ${pass ? "text-green-600" : "text-gray-400"}`}>
                        {pass
                          ? <Check size={12} className="shrink-0" />
                          : <X size={12} className="shrink-0" />}
                        {r.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPwd2 ? "text" : "password"} name="password2" value={form.password2}
                  onChange={handleChange} required placeholder="ยืนยัน password"
                  className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:border-transparent transition placeholder-gray-400
                    ${passwordMismatch ? "border-red-400 focus:ring-red-400"
                    : passwordMatch   ? "border-green-400 focus:ring-green-400"
                    :                   "border-gray-300 focus:ring-gray-900"}`}
                />
                <button type="button" onClick={() => setShowPwd2(!showPwd2)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPwd2 ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordMismatch && (
                <p className="text-xs text-red-500 mt-1">รหัสผ่านไม่ตรงกัน</p>
              )}
              {passwordMatch && (
                <p className="text-xs text-green-600 mt-1">รหัสผ่านตรงกัน ✓</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  กำลังสมัครสมาชิก...
                </>
              ) : "สมัครสมาชิก"}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500 mt-5">
            มีบัญชีอยู่แล้ว?{" "}
            <Link href="/login" className="text-gray-900 font-semibold hover:underline">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}