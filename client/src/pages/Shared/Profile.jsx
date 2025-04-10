import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/auth/user-profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setForm({ name: res.data.name, phone: res.data.phone || '' });
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    await axios.put('/api/auth/update-profile', form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUpdated(true);
  };

  return user ? (
    <div>
      <h2>My Profile</h2>
      {updated && <p style={{ color: 'green' }}>Profile updated!</p>}
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Name"
      />
      <input
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="Phone"
      />
      <button onClick={handleUpdate}>Save Changes</button>
    </div>
  ) : <p>Loading...</p>;
};

export default Profile;
