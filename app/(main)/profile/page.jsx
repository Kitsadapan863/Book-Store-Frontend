"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getCurrentUser, getProfile, updateProfile } from "../../lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    bio: "",
    avatar: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getCurrentUser();
        const userData = userRes.data;
        setUser(userData);
        
        const profileRes = await getProfile(userData.id);
        setProfile(profileRes.data);
        
        setFormData({
          username: userData.username || "",
          email: userData.email || "",
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          bio: profileRes.data?.bio || "",
          avatar: null,
        });
      } catch (err) {
        setError("Failed to load profile data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, avatar: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      const formDataObj = new FormData();
      formDataObj.append("bio", formData.bio);
      if (formData.avatar) {
        formDataObj.append("avatar", formData.avatar);
      }
      
      await updateProfile(user.id, formDataObj);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    }
  };

  const handleReset = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      bio: profile?.bio || "",
      avatar: null,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Profile Form */}
        <div>
          {/* Avatar */}
          <div className="mb-6 flex justify-center">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt="profile avatar"
                className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                No Avatar
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* First Name */}
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">First name cannot be changed</p>
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Last name cannot be changed</p>
            </div>

            <div className="pt-2">
              <Link
                href="/change-password"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Change Password
              </Link>
            </div>

            <hr className="my-4" />

            {/* Avatar Upload */}
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture
              </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md font-semibold hover:bg-gray-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-white text-gray-900 border border-gray-900 rounded-md font-semibold hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Right: Orders Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order History</h2>
          <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
            <p>Order history will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}