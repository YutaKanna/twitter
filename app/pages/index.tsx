// pages/index.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '' });

  useEffect(() => {
    // APIからアイテムを取得
    axios.get('/api/items').then(response => {
      setItems(response.data);
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post('/api/items', newItem);
    setNewItem({ name: '', description: '' }); // フォームをリセット
    // アイテムリストを更新
    const response = await axios.get('/api/items');
    setItems(response.data);
  };

  const handleChange = (event) => {
    setNewItem({ ...newItem, [event.target.name]: event.target.value });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={newItem.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <textarea
          name="description"
          value={newItem.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <button type="submit">Create Item</button>
      </form>

      <ul>
        {items.map(item => (
          <li key={item._id}>
            {item._id} - {item.name} - {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
