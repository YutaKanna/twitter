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

  const getDummyAvatar = (userId) => {
    return `https://i.pravatar.cc/150?u=${userId}`;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="divide-y divide-gray-200">
        {items.map(item => (
          <div key={item._id} className="flex items-center space-x-4 py-4">
            {/* ダミーのアイコンを使用します */}
            <img src={`https://i.pravatar.cc/150?u=${item._id}`} alt="Profile" className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <h3 className="font-bold text-sm">{item.name}</h3>
              <p className="text-xs text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}







