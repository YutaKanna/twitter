// pages/items/[id].tsx
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ItemDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState({ name: '', description: '' });

  useEffect(() => {
    if (id) {
      axios.get(`/api/items/${id}`).then(response => {
        setItem(response.data);
      });
    }
  }, [id]);

  const handleUpdate = async () => {
    await axios.put(`/api/items/${id}`, item);
    router.push('/');
  };

  const handleDelete = async () => {
    await axios.delete(`/api/items/${id}`);
    router.push('/');
  };

  const handleChange = (event) => {
    setItem({ ...item, [event.target.name]: event.target.value });
  };

  return (
    <div>
      <input
        name="name"
        value={item.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <textarea
        name="description"
        value={item.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <button onClick={handleUpdate}>Update Item</button>
      <button onClick={handleDelete}>Delete Item</button>
    </div>
  );
}
