import React, { useEffect, useState } from "react";
import {
  FiEdit,
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import {
  getProfile,
  updateProfile,
  changePassword,
  updateProfileImage,
  updateStoreLogo,
} from "../../services/authServices";
import { toast } from "react-toastify";

const VendorProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    storeName: "",
  });
  const [files, setFiles] = useState({
    profileImage: null,
    storeLogo: null,
  });
  const [preview, setPreview] = useState({
    profileImage: null,
    storeLogo: null,
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getProfile();
        setProfile(res.data);
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          storeName: res.data.storeName || "",
          description: res.data.description || "",
        });
        setPreview({
          profileImage: res.data.profileImage || null,
          storeLogo: res.data.storeLogo || null,
        });
      } catch (err) {
        toast.error("Failed to load profile");
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files: fileList } = e.target;
    if (fileList) {
      const file = fileList[0];
      setFiles((prev) => ({ ...prev, [name]: file }));
      setPreview((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (type) => {
    try {
      const formData = new FormData();
      const fieldName = type === "profileImage" ? "profileImage" : "image";
      formData.append(fieldName, files[type]);

      if (type === "profileImage") await updateProfileImage(formData);
      else await updateStoreLogo(formData);

      toast.success(`${type === "profileImage" ? "Profile image" : "Store logo"} uploaded`);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Image upload failed");
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!form.name || !form.email || !form.phone || !form.storeName) {
      return toast.error("All fields required");
    }
    if (!emailRegex.test(form.email)) return toast.error("Invalid email");
    if (!phoneRegex.test(form.phone)) return toast.error("Invalid phone");

    try {
      await updateProfile(form);
      toast.success("Profile updated");
      setEditModal(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwords;
    if (!currentPassword || !newPassword || !confirmPassword)
      return toast.error("All fields required");
    if (newPassword.length < 8) return toast.error("Min 8 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords don't match");

    try {
      await changePassword({ oldPassword: currentPassword, newPassword, confirmNewPassword: confirmPassword });
      toast.success("Password changed");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordModal(false);
    } catch {
      toast.error("Failed to change password");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
     

      <div className="bg-gradient-to-br from-[#E0F7F4] to-[#FFFFFF] p-6 rounded-xl shadow-md flex flex-col sm:flex-row items-start justify-between gap-6 border border-gray-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border">
            <img
              src={preview.profileImage || "/no-image.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <label htmlFor="profileImage" className="bg-gray-100 px-3 py-1 rounded cursor-pointer hover:bg-gray-200">📤 Choose</label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              className="hidden"
              accept="image/*"
              onChange={handleChange}
            />
            {files.profileImage && (
              <button
                onClick={() => handleImageUpload("profileImage")}
                className="text-green-600 hover:underline"
              >
                Upload
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <h2 className="text-xl font-bold text-gray-800">{form.name}</h2>
          <p className="text-sm text-gray-500">{form.email}</p>
          <p className="text-sm text-gray-500">Role: {profile.role?.toUpperCase()}</p>
          <p className="text-sm text-green-700">Status: {profile.approvalStatus}</p>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setEditModal(true)} className="bg-[#3ED6B5] hover:bg-[#2DB69C] text-white px-4 py-2 rounded text-sm flex items-center gap-1">
              <FiEdit /> Edit Info
            </button>
            <button onClick={() => setPasswordModal(true)} className="bg-[#2D70E4] hover:bg-[#245bbd] text-white px-4 py-2 rounded text-sm flex items-center gap-1">
              <FiLock /> Change Password
            </button>
          </div>
        </div>
      </div>

  
<div className="bg-gradient-to-br from-[#E0F7F4] to-[#FFFFFF] p-6 rounded-xl shadow-md border border-gray-200">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">Store Details</h3>
  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
    <div className="flex flex-col items-center gap-2">
      <img
        src={preview.storeLogo || "/no-image.png"}
        alt="Store Logo"
        className="w-24 h-24 object-cover rounded border shadow-sm"
      />
      <label
        htmlFor="storeLogo"
        className="text-xs flex items-center gap-1 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 cursor-pointer"
      >
        📤 <span>Choose</span>
      </label>
      <input
        type="file"
        id="storeLogo"
        name="storeLogo"
        className="hidden"
        onChange={handleChange}
      />
      {files.storeLogo && (
        <button
          onClick={() => handleImageUpload("storeLogo")}
          className="text-xs text-green-600 hover:underline"
        >
          Upload
        </button>
      )}
    </div>
    <div className="space-y-1">
      <p className="text-md font-semibold text-gray-900">{form.storeName || 'No Store Name'}</p>
      <p className="text-sm text-gray-600">{form.description || 'No description provided'}</p>
    </div>
  </div>
</div>


 
      {editModal && (
        <EditModal form={form} setForm={setForm} setEditModal={setEditModal} handleSubmit={handleProfileSubmit} />
      )}
      {passwordModal && (
        <PasswordModal
          passwords={passwords}
          setPasswords={setPasswords}
          handlePasswordChange={handlePasswordChange}
          setPasswordModal={setPasswordModal}
          showNewPassword={showNewPassword}
          setShowNewPassword={setShowNewPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
        />
      )}
    </div>
  );
};

const EditModal = ({ form, setForm, setEditModal, handleSubmit }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">✏️ Update Profile & Store Info</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border p-2 rounded" />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-2 rounded" />
        <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border p-2 rounded" />
        <input type="text" name="storeName" placeholder="Store Name" value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} className="border p-2 rounded" />
        <textarea name="description" placeholder="Store Description" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border p-2 rounded"></textarea>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setEditModal(false)} className="text-gray-600 hover:underline">Cancel</button>
          <button type="submit" className="bg-[#3ED6B5] text-white px-4 py-2 rounded hover:bg-[#2ab99f]">Save</button>
        </div>
      </form>
    </div>
  </div>
);

const PasswordModal = ({ passwords, setPasswords, handlePasswordChange, setPasswordModal, showNewPassword, setShowNewPassword, showConfirmPassword, setShowConfirmPassword }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">🔐 Change Password</h3>
      <form onSubmit={handlePasswordChange} className="grid grid-cols-1 gap-4">
        <input type="password" name="currentPassword" placeholder="Current Password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} className="border p-2 rounded" />
        <div className="relative">
          <input type={showNewPassword ? "text" : "password"} name="newPassword" placeholder="New Password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="border p-2 rounded w-full pr-10" />
          <button type="button" onClick={() => setShowNewPassword((prev) => !prev)} className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500">
            {showNewPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        <div className="relative">
          <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} className="border p-2 rounded w-full pr-10" />
          <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500">
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setPasswordModal(false)} className="text-gray-600 hover:underline">Cancel</button>
          <button type="submit" className="bg-[#2D70E4] text-white px-4 py-2 rounded hover:bg-[#245bbd]">Update</button>
        </div>
      </form>
    </div>
  </div>
);

export default VendorProfilePage;
