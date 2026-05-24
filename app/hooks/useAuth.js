"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getProfile } from "../lib/api";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const { data } = await getCurrentUser();
      setUser(data);
      const { data: profileData } = await getProfile(data.id);
      setProfile(profileData);
    } catch {
      localStorage.removeItem("token");
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return { user, profile, loading, logout, refetch: fetchUser };
}