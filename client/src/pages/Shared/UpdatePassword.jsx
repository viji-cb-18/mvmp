import React, { useState } from 'react';
import axios from 'axios';

const UpdatePassword = () => {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put('/api/auth/change-password', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('Password updated successfully!');
    } catch (err) {
      setMsg('Password update failed.');
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="Old Password" value={form.oldPassword} onChange={(e) => setForm({ ...form, oldPassword: e.target.value })} required />
        <input type="password" placeholder="New Password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} required />
        <input type="password" placeholder="Confirm New Password" value={form.confirmNewPassword} onChange={(e) => setForm({ ...form, confirmNewPassword: e.target.value })} required />
        <button type="submit">Update</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
};

export default UpdatePassword;
