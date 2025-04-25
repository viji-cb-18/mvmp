import React, { useState } from 'react';
import { useEffect } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import {
  getProfile,
  updateProfile,
  changePassword,
  updateProfileImage,
} from "../../services/authServices";


const AdminProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profileImage: user?.profileImage || '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.profileImage || '');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const profile = res.data;
        setEditData({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          profileImage: profile.profileImage || '',
        });
        setImagePreview(profile.profileImage || '');
        dispatch(setCredentials({
          token: localStorage.getItem("token"),
          user: profile,
        }));
        localStorage.setItem("user", JSON.stringify(profile));
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, [dispatch]);

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.warning('Please choose an image first');
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profileImage", imageFile);
      const res = await updateProfileImage(formData);
      setImagePreview(res.data.profileImage);
      dispatch(setCredentials({
        token: localStorage.getItem("token"),
        user: { ...user, profileImage: res.data.profileImage },
      }));
      toast.success('Profile image uploaded!');
      setImageFile(null);
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleSaveChanges = async () => {
    const phoneRegex = /^[0-9]{10,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!editData.name || !editData.email || !editData.phone) {
      return toast.error('All fields are required');
    }
    if (!emailRegex.test(editData.email)) return toast.error('Invalid email');
    if (!phoneRegex.test(editData.phone)) return toast.error('Invalid phone');
  
    try {
      const res = await updateProfile(editData); 
      const updatedUser = res.data.user;
  
      dispatch(setCredentials({
        token: localStorage.getItem("token"),
        user: updatedUser,
      }));
      localStorage.setItem("user", JSON.stringify(updatedUser)); 
  
      toast.success('Profile updated');
      setEditModal(false);
    } catch (err) {
      toast.error('Update failed');
    }
  };
  

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      return toast.error('All password fields are required');
    }
    if (passwords.new.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }
    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords don't match");
    }
    try {
      await changePassword({
        oldPassword: passwords.current,
        newPassword: passwords.new,
        confirmNewPassword: passwords.confirm
      });
      toast.success('Password changed');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      toast.error("Failed to change password");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <section className="bg-[#F3F8FD] p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#2D70E4]">👤 Admin Profile</h2>
          <button
            className="bg-[#3ED6B5] hover:bg-[#31b9a1] text-white px-4 py-2 rounded text-sm"
            onClick={() => setEditModal(true)}
          >
            Edit Info
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm">Full Name</p>
              <p className="text-lg font-semibold text-gray-800">{editData.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="text-lg font-semibold text-gray-800">{editData.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Phone</p>
              <p className="text-lg font-semibold text-gray-800">{editData.phone || 'N/A'}</p>
            </div>
          </div>

          <div className="w-full flex flex-col items-center">
            <img
              src={imagePreview || '/no-image.png'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border mb-3"
            />
            <label className="mt-1">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  setImageFile(e.target.files[0]);
                  setImagePreview(URL.createObjectURL(e.target.files[0]));
                }}
              />
              <span className="inline-block cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1 rounded text-xs">
                📤 Choose Image
              </span>
            </label>
            <button
              onClick={handleImageUpload}
              className="mt-2 bg-[#2D70E4] hover:bg-blue-700 text-white px-4 py-1 rounded text-xs"
            >
              Upload
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#F3F8FD] p-6 rounded-xl shadow ">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">🔐 Change Password</h3>
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          <input
            type="password"
            placeholder="Current Password"
            className="border px-3 py-2 rounded"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
          />
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              className="border px-3 py-2 rounded w-full pr-10"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            />
            <span
              className="absolute top-2 right-3 cursor-pointer text-gray-500"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              className="border px-3 py-2 rounded w-full pr-10"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />
            <span
              className="absolute top-2 right-3 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </div>
        <button
          onClick={handleChangePassword}
          className="mt-4 bg-[#2D70E4] text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Password
        </button>
      </section>

      {editModal && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
    <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
      <h3 className="text-xl font-semibold mb-4">✏️ Edit Info</h3>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full Name"
          className="border px-3 py-2 rounded"
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="border px-3 py-2 rounded"
          value={editData.email}
          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          className="border px-3 py-2 rounded"
          value={editData.phone}
          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setEditModal(false)}
            className="px-4 py-2 text-gray-600 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="bg-[#3ED6B5] text-white px-4 py-2 rounded hover:bg-[#31b9a1]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AdminProfilePage;