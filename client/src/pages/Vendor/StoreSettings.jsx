import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StoreSettings = () => {
  const [store, setStore] = useState({ storeName: '', phone: '', description: '' });

  useEffect(() => {
    const fetchStore = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('/api/vendors/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStore(res.data);
      } catch (err) {
        console.error('Failed to fetch vendor store:', err);
      }
    };

    fetchStore();
  }, []);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put('/api/vendors/store-info', store, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Store info updated');
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div>
      <h2>Store Settings</h2>
      <input
        placeholder="Store Name"
        value={store.storeName}
        onChange={(e) => setStore({ ...store, storeName: e.target.value })}
      />
      <input
        placeholder="Phone"
        value={store.phone}
        onChange={(e) => setStore({ ...store, phone: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={store.description}
        onChange={(e) => setStore({ ...store, description: e.target.value })}
      />
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default StoreSettings;
