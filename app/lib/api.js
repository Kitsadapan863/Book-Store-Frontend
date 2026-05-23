import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("API Base URL:", BASE_URL);
// ── Axios instance ──────────────────────────────────────────
const api = axios.create({ baseURL: BASE_URL });

// แนบ token อัตโนมัติทุก request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// ── Auth ────────────────────────────────────────────────────
export const login = (username, password) =>
  api.post("/api/login/", { username, password });

export const register = (username, email, password, password2) =>
  api.post("/api/register", { username, email, password, password2 });

export const getCurrentUser = () => api.get("/api/current_user/");

export const getProfile = (userId) => api.get(`/api/profiles/${userId}`);

export const updateProfile = (userId, formData) =>
  api.patch(`/api/profiles/${userId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const changePassword = (old_password, new_password, confirm_password) =>
  api.post("/api/change-password/", { old_password, new_password, confirm_password });

// ── Books ───────────────────────────────────────────────────
export const getBooks = () => api.get("/shows/books/");

export const getBookById = (id) => api.get(`/shows/books/${id}`);

export const getGenres = () => api.get("/shows/genres/");

// ── Baskets ─────────────────────────────────────────────────
export const getBasketItems = () => api.get("/baskets/show/items");

export const getBasketCount = () => api.get("/baskets/show/count");

export const addToBasket = (isbn) =>
  api.post("/baskets/add/basket", { isbn });

export const increaseBasketItem = (isbn) =>
  api.post("/baskets/item/increase", { isbn });

export const decreaseBasketItem = (isbn) =>
  api.post("/baskets/item/decrease", { isbn });

export const submitOrder = () => api.post("/baskets/add/orders");

// ── Chart ───────────────────────────────────────────────────
export const getTop10Books = (start_date, end_date) =>
  api.get("/baskets/show/top10", { params: { start_date, end_date } });

export default api;