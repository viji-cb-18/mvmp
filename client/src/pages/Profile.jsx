import React, { useState, useEffect } from "react";
import { UserIcon, PencilSquareIcon, CameraIcon, PowerIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const Profile = () => {
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(null);
    const [selectedFile,setSelectedFile] = useState(null);


    useEffect(() => {
        const fectchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5001/api/auth/", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fectching user data", error);
                setLoading(false);
            }
        };
        fectchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        Navigate("/login");
    }

    const handleImageUploaded = async (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post("http://localhost:5001/api/aut/upload-profile", formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
            });
            setUser({ ...user, profileImage: res.data.imageUrl });
        } catch (error) {
            console.error("Error uploading image", error);
        }
        
    };

    if (loading) return <p>Loading profile...</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>

            <div className="relative w-24 h-24 mt-4">
                <img 
                    src={user?.profileImage || "https://via.placeholder.com/150"} 
                    alt="Profile" 
                    className="w-full h-full rounded-full border border-gray-300"
                />
                <label className="absolute bottom-0 right-0 bg-gray-200 p-1 rounded-full cursor-pointer">
                    <CameraIcon className="h-5 w-5 text-gray-600" />
                    <input type="file" className="hidden" onChange={handleImageUpload} />
                </label>
            </div>   


            <div className="mt-4 space-y-2">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Phone:</strong> {user?.phone || "Not provided"}</p>
                <p><strong>Address:</strong> {user?.address || "Not provided"}</p>
                <p className="capitalize"><strong>Role:</strong> {user?.role}</p>
            </div>

            <div className="mt-6 space-y-2">
                <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md">
                    <PencilSquareIcon className="h-5 w-5 mr-2" /> Edit Profile
                </button>
                <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md">
                    <UserIcon className="h-5 w-5 mr-2" /> Change Password
                </button>

                <button 
                    onClick={handleLogout} 
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                    <PowerIcon className="h-5 w-5 mr-2" /> Logout
                </button>
            </div>
        </div>    
    );
 
};

export default Profile;