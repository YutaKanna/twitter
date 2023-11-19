// pages/tweets/[id].tsx
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TweetDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [tweet, setTweet] = useState({ name: '', description: '' });

  useEffect(() => {
    if (id) {
      axios.get(`/api/tweets/${id}`).then(response => {
        setTweet(response.data);
      });
    }
  }, [id]);

  const handleUpdate = async () => {
    await axios.put(`/api/tweets/${id}`, tweet);
    router.push('/');
  };

  const handleDelete = async () => {
    await axios.delete(`/api/tweets/${id}`);
    router.push('/');
  };

  const handleChange = (event) => {
    setTweet({ ...tweet, [event.target.name]: event.target.value });
  };

  return (
    <div>
      <input
        name="name"
        value={tweet.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <textarea
        name="description"
        value={tweet.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <button onClick={handleUpdate}>Update Tweet</button>
      <button onClick={handleDelete}>Delete Tweet</button>
    </div>
  );
}
