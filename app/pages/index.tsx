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
    // console.log("newItem", newItem)
    // console.log("newItem.name", newItem.name)
    newItem.name = "ユーザー名";
    await axios.post('/api/items', newItem);
    setNewItem({ name: '', description: '' }); // フォームをリセット
    // アイテムリストを更新
    const response = await axios.get('/api/items');
    setItems(response.data);
  };

  const handleChange = (event) => {
    setNewItem({ ...newItem, [event.target.name]: event.target.value });
  };

  const getDummyAvatar = () => {
    // ここで適当なユーザーIDを設定
    return `https://i.pravatar.cc/150?u=dummyId`;
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-start space-x-2"> {/* アイテムの垂直方向の位置を揃える */}
        <img src={getDummyAvatar()} alt="User Avatar" className="w-12 h-12 rounded-full" />
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="description"
            value={newItem.description}
            onChange={handleChange}
            placeholder="詳細を追加..."
            required
            rows="3"
          ></textarea>
          <div className="flex justify-end mt-2"> {/* ボタンを右に移動 */}
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              ポストする
            </button>
          </div>
        </form>
      </div>
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
