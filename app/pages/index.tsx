// pages/index.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState({ name: '', description: '' });
  const [userName, setUserName] = useState([]);

  const getUserInfoFromJWT = () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decoded = jwtDecode(token);
      return { userName: decoded.userName, userId: decoded.userId }; // ユーザー名とIDを返す
    }
    return { userName: '', userId: '' };
  };

  useEffect(() => {
    // APIからアイテムを取得
    axios.get('/api/tweets').then(response => {
      setTweets(response.data);
    });

    const userInfo = getUserInfoFromJWT();
    setUserName(userInfo.userName);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userInfo = getUserInfoFromJWT();
    newTweet.name = userInfo.userName; // JWTから取得したユーザー名を設定
    newTweet.user_id = userInfo.userId; // JWTから取得したユーザーIDも設定
    await axios.post('/api/tweets', newTweet);
    setNewTweet({ name: '', description: '' }); // フォームをリセット

    const response = await axios.get('/api/tweets');
    setTweets(response.data);
  };

  const handleChange = (event) => {
    setNewTweet({ ...newTweet, [event.target.name]: event.target.value });
  };

  const getDummyAvatar = () => {
    // ここで適当なユーザーIDを設定
    return `https://i.pravatar.cc/150?u=dummyId`;
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-start space-x-2"> {/* アイテムの垂直方向の位置を揃える */}
        <img src={getDummyAvatar()} alt="User Avatar" className="w-12 h-12 rounded-full" />
        <div>{userName}</div>
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="description"
            value={newTweet.description}
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
        {tweets.map(tweet => (
          <div key={tweet._id} className="flex items-center space-x-4 py-4">
            {/* ダミーのアイコンを使用します */}
            <img src={`https://i.pravatar.cc/150?u=${tweet._id}`} alt="Profile" className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <h3 className="font-bold text-sm">{tweet.name}</h3>
              <p className="text-xs text-gray-600">{tweet.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
