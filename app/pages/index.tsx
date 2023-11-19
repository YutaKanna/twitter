// pages/index.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Head from 'next/head';
import Image from 'next/image';
import { JwtPayload } from 'jsonwebtoken';
import User from '../../../models/User';

interface CustomJwtPayload extends JwtPayload {
  userName?: string;
  userId?: string;
}

export default function Home() {
  const [tweets, setTweets] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTweet, setNewTweet] = useState({ name: '', description: '' });
  const [newFollow, setNewFollow] = useState([]);
  const [userName, setUserName] = useState<string>(''); // 正しい型宣言
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getUserInfoFromJWT = () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      return { userName: decoded.userName, userId: decoded.userId }; // ユーザー名とIDを返す
    }
    return { userName: '', userId: '' };
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken'); // トークンを取得

    // APIからツイートを取得
    axios.get('/api/tweets', {
      headers: {
        'Authorization': `Bearer ${token}` // トークンをヘッダーに設定
      }
    })
    .then(response => {
      console.log("response.data", response.data)
      setTweets(response.data); // レスポンスデータを使用
    })
    .catch(error => {
      console.error('Error fetching tweets:', error); // エラーハンドリング
    });

    const userInfo = getUserInfoFromJWT();
    setUserName(userInfo.userName ?? '');

    // ユーザー情報の取得
    axios.get('/api/users').then(response => {
      const userInfo = getUserInfoFromJWT();
      const filteredUsers = response.data.filter((user: User) => user._id !== userInfo.userId).slice(0, 3);
      setUsers(filteredUsers);
    });

    const body = document.querySelector('body');

    if (isDarkMode) {
        document.querySelector('html').classList.add('dark');
        body.classList.add('dark:bg-dim-900');
        body.classList.remove('bg-white');
    } else {
        document.querySelector('html').classList.remove('dark');
        body.classList.add('bg-white');
        body.classList.remove('dark:bg-dim-900');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

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

  const handleFollow = async (userId) => {
    const userInfo = getUserInfoFromJWT();
    if (!userInfo.userId) {
      console.log('ユーザーは認証されていません');
      return;
    }

    const follower_id = userInfo.userId;
    const followee_id = userId;
  
    // newFollow.follower_id = userId;
    // newFollow.followee_id = userInfo.userId;
    await axios.post('/api/follows', { follower_id, followee_id });
  };

  return (
    <div>
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      </Head>
      <div className="container mx-auto h-screen flex xl:max-w-[1200px]">
        {/* 左側のコンポーネント */}
        <div className="xl:w-1/5 w-20 h-full flex flex-col xl:pr-4">
          {/* ロゴ */}
          <a href="#" className="link-active my-2">
            <i className="fa-brands fa-twitter text-4xl"></i>
          </a>
          {/* ナビゲーション */}
          <nav className="mt-5">
            {/* ホーム */}
            <a href="#" className="link-active mb-8">
              <i className="fa-solid fa-house text-xl"></i>
              <span className="icon">Home</span>
            </a>
            {/* 探索 */}
            <a href="#" className="link mb-8">
              <i className="fa-solid fa-hashtag text-xl"></i>
              <span className="icon">Explore</span>
            </a>
            {/* 通知 */}
            <a href="#" className="link mb-8">
              <i className="fa-solid fa-bell text-xl"></i>
              <span className="icon">Notifications</span>
            </a>
            {/* メッセージ */}
            <a href="#" className="link mb-8">
              <i className="fa-solid fa-envelope text-xl"></i>
              <span className="icon">Messages</span>
            </a>
            {/* ブックマーク */}
            <a href="#" className="link mb-8">
              <i className="fa-solid fa-bookmark text-xl"></i>
              <span className="icon">Bookmarks</span>
            </a>
            {/* リスト */}
            <a href="#" className="link mb-8">
              <i className="fa-solid fa-list-ul text-xl"></i>
              <span className="icon">Lists</span>
            </a>
            {/* プロフィール */}
            <a href="#" className="link mb-8">
              <i className="fa-solid fa-user text-xl"></i>
              <span className="icon">Profile</span>
            </a>
            {/* その他 */}
            <a href="#" className="link mb-8">
              <i className="fa-solid fa-ellipsis text-xl"></i>
              <span className="icon">More</span>
            </a>
          </nav>

          {/* ボタン */}
          <a href="#"
            className="mx-auto w-11 h-11 xl:w-full flex items-center justify-center bg-blue-400 rounded-full text-white font-bold">
            <i className="fa-solid fa-feather text-xl block xl:hidden"></i>
            <span className="icon xl:ml-0">Tweet</span>
          </a>

          {/* ユーザー */}
          <div className="w-14 xl:w-full mx-auto mt-auto flex justify-between mb-2 rounded-full p-2 cursor-pointer">
            <Image className="w-10 h-10 rounded-full"
              src="https://pbs.twimg.com/profile_images/1444753598328496128/hCCopfyz_400x400.jpg" alt="" width={400} height={400} />
            <div className="hidden xl:flex flex-col">
              <h4 className="text-gray-800 dark:text-white font-bold text-sm">{userName}</h4>
              <p className="text-gray-400 text-sm">@dummy-username</p>
            </div>
            <i className="fa-solid fa-chevron-down text-xs hidden xl:flex items-center xl:ml-4 text-gray-800 dark:text-white"></i>
          </div>
        </div>
        {/* 中央のコンポーネント */}
        <div className="w-full xl:w-1/2 h-screen overflow-y-auto">
          {/* スティッキーヘッダー */}
          <div className="flex justify-between items-center border px-4 py-3 sticky top-0 bg-white dark:bg-dim-900 border-gray-200 dark:border-gray-700">
            <h4 className="text-gray-800 dark:text-gray-100 font-bold">Home</h4>
            <i className="fa-brands fa-twitter text-lg text-blue-400"></i>
          </div>

          {/* ツイートボックス */}
          <div className="border pb-3 border-gray-200 dark:border-dim-200">
            <form onSubmit={handleSubmit}>
              <div className="flex p-4">
                <Image className="w-10 h-10 rounded-full"
                  src="https://pbs.twimg.com/profile_images/1444753598328496128/hCCopfyz_400x400.jpg" alt="" width={400} height={400}/>
                <textarea
                  className="p-2 dark:text-white text-gray-900 w-full h-16 bg-transparent focus:outline-none resize-none"
                  name="description"
                  value={newTweet.description}
                  onChange={handleChange}
                  placeholder="What's happening?"></textarea>
              </div>
              <div className="flex p-4 w-full">
                {/* アイコンボタン（例: 画像アップロードなど）*/}
                <a href="#" className="text-blue-400 rounded-full p-2">
                  <i className="fa-solid fa-image text-lg"></i>
                </a>
                <a href="#" className="text-blue-400 rounded-full p-2">
                  <i className="fa-solid fa-image text-lg"></i>
                </a>
                <a href="#" className="text-blue-400 rounded-full p-2">
                  <i className="fa-solid fa-image text-lg"></i>
                </a>
                <a href="#" className="text-blue-400 rounded-full p-2">
                  <i className="fa-solid fa-image text-lg"></i>
                </a>
                <a href="#" className="text-blue-400 rounded-full p-2">
                  <i className="fa-solid fa-image text-lg"></i>
                </a>
                {/* ツイートボタン */}
                <button type="submit" className="font-bold bg-blue-400 text-white rounded-full px-6 ml-auto mr-1 flex items-center">
                  Tweet
                </button>
              </div>
            </form>
          </div>
          {/* ツイート表示 */}
          <div className="text-center py-4 bg-white dark:bg-dim-900 border border-gray-200 dark:border-dim-200 cursor-pointer text-blue-400 text-sm">
            Show 9 Tweets
          </div>
          {/* ツイートコンポーネント */}
          {/* ここにツイートの一覧を表示するコンポーネントが来ます */}
          {tweets.map(tweet => (
            <div key={tweet._id}>
              <div className="border border-gray-200 dark:border-dim-200 cursor-pointer pb-4">
                <div className="flex p-4 pb-0">
                  <Image className="h-9 w-9 rounded-full"
                    src="https://pbs.twimg.com/profile_images/1444753598328496128/hCCopfyz_400x400.jpg"
                    alt=""
                    width={400}
                    height={400}
                     />
                  <p className="ml-2 flex flex-shrink-0 items-center font-medium text-gray-800 dark:text-white">
                    {tweet.name}
                    <span className="ml-1 text-sm leading-5 text-gray-400">
                      @dummy-username . Nov 2
                    </span>
                  </p>
                </div>
                <div className="pl-8 xl:pl-16 pr-4">
                  <p className="w-auto font-medium text-gray-800 dark:text-white">{tweet.description}</p>
                  <Image className="rounded-2xl border border-gray-600 my-3 mr-2 w-full"
                    src="https://images.nature.com/original/magazine-assets/d41586-019-00653-5/d41586-019-00653-5_16459150.jpg"
                    alt=""
                    width={400}
                    height={400}
                     />
                  <div className="flex items-center w-full justify-between">
                    <div className="flex items-center dark:text-white text-xs text-gray-400 hover:text-blue-400 dark:hover:text-blue-400">
                      <i className="fa-solid fa-comment mr-2 text-lg"></i>
                      12.3 k
                    </div>
                    <div className="flex items-center dark:text-white text-xs text-gray-400 hover:text-green-400 dark:hover:text-green-400">
                      <i className="fa-solid fa-retweet mr-2 text-lg"></i>
                      14 k
                    </div>
                    <div className="flex items-center dark:text-white text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-600">
                      <i className="fa-solid fa-heart mr-2 text-lg"></i>
                      14 k
                    </div>
                    <div className="flex items-center dark:text-white text-xs text-gray-400 hover:text-blue-400 dark:hover:text-blue-400">
                      <i className="fa-solid fa-share mr-2 text-lg"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* ダミーを1件だけ表示 */}
          <div className="border border-gray-200 dark:border-dim-200 cursor-pointer pb-4">
            <div className="flex p-4 pb-0">
              <Image className="h-9 w-9 rounded-full"
                src="https://pbs.twimg.com/profile_images/1444753598328496128/hCCopfyz_400x400.jpg"
                alt=""
                width={400}
                height={400}
                 />
              <p className="ml-2 flex flex-shrink-0 items-center font-medium text-gray-800 dark:text-white">
                Ag Coding
                <span className="ml-1 text-sm leading-5 text-gray-400">
                  @abdoelazizgamal . Nov 2
                </span>
              </p>
            </div>
            <div className="pl-8 xl:pl-16 pr-4">
              <p className="w-auto font-medium text-gray-800 dark:text-white">
                Any fool can write code that a computer can understand. Good programmers write code that humans can
                understand.<br /><br />
                Experience is the name everyone gives to their
                <a href="#" className="text-blue-400">#mistakes</a>
                <br /><br />
                Simplicity is the soul of efficiency.
              </p>
              <Image className="rounded-2xl border border-gray-600 my-3 mr-2 w-full"
                src="https://images.nature.com/original/magazine-assets/d41586-019-00653-5/d41586-019-00653-5_16459150.jpg"
                width={400}
                height={400}
                alt="" />
              <div className="flex items-center w-full justify-between">
                <div className="flex items-center dark:text-white text-xs text-gray-400 hover:text-blue-400 dark:hover:text-blue-400">
                  <i className="fa-solid fa-comment mr-2 text-lg"></i>
                  12.3 k
                </div>
                <div className="flex items-center dark:text-white text-xs text-gray-400 hover:text-green-400 dark:hover:text-green-400">
                  <i className="fa-solid fa-retweet mr-2 text-lg"></i>
                  14 k
                </div>
                <div className="flex items-center dark:text-white text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-600">
                  <i className="fa-solid fa-heart mr-2 text-lg"></i>
                  14 k
                </div>
                <div className="flex items-center dark:text-white text-xs text-gray-400 hover:text-blue-400 dark:hover:text-blue-400">
                  <i className="fa-solid fa-share mr-2 text-lg"></i>
                </div>
              </div>
            </div>
          </div>
          {/* ビューのカスタマイズ */}
          <div className="py-2 border border-gray-200 dark:border-dim-200 bg-gray-50 dark:bg-dim-300">
            <div className="text-center p-6 bg-white dark:bg-dim-900 border-b border-t border-gray-200 dark:border-dim-200">
              <h3 className="dark:text-white text-gray-900 text-2xl font-bold mb-2">Customize your view</h3>
              <p className="text-gray-500 mb-5 text-sm">
                Manage your font size, color and background. These settings affect all the Twitter accounts on this browser.
              </p>
              <a 
                href="javascript:void(0)" 
                onClick={toggleDarkMode}
                className="mx-auto w-11 h-11 xl:w-48 flex items-center justify-center bg-blue-400 py-3 rounded-full text-white font-bold"
              >
                <i className="fa-solid fa-cloud-moon block xl:hidden text-lg"></i>
                <span className="hidden xl:block font-bold">Toggle Dark Mode</span>
              </a>
            </div>
          </div>

          {/* スピナー */}
          <div className="p-4 border border-gray-200 dark:border-gray-700">
            <svg className="w-8 h-8 mx-auto animate-spin-fast">
              <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4" style={{ stroke: "rgb(29, 161, 242)", opacity: 0.2 }}></circle>
              <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4" style={{ stroke: "rgb(29, 161, 242)", strokeDasharray: 80, strokeDashoffset: 60 }}></circle>
            </svg>
          </div>
        </div>

        {/* 右側のコンポーネント */}
        <div className="hidden w-[30%] xl:block">
          {/* 検索ボックス */}
          <div className="relative m-2">
            <i className="fa-solid fa-magnifying-glass text-gray-600 absolute left-4 top-1/2 -translate-y-1/2"></i>
            <input type="text"
              className="w-full bg-gray-200 dark:bg-dim-400 border-gray-200 dark:border-dim-400 text-gray-100 focus:outline-none font-normal h-9 pl-12 text-sm rounded-full"
              placeholder="Search Twitter" />
          </div>
          {/* トレンドセクション */}
          <div className="bg-gray-50 dark:bg-dim-700 rounded-2xl m-2">
            <h3 className="text-gray-900 dark:text-white font-bold p-3 border-b border-gray-200 dark:border-dim-200">
              What’s happening
            </h3>
            {/* トレンドアイテム */}
            {/* 繰り返し要素は実際のデータに基づいて生成されるべき */}
            <div className="p-3 border-b border-gray-200 dark:border-dim-200">
              <h4 className="font-bold text-gray-800 dark:text-white">
                #Palestine
              </h4>
              <p className="text-xs text-gray-400">29.7K Tweets</p>
            </div>
            <div className="p-3 border-b border-gray-200 dark:border-dim-200">
              <h4 className="font-bold text-gray-800 dark:text-white">
                #Palestine
              </h4>
              <p className="text-xs text-gray-400">29.7K Tweets</p>
            </div>
            <div className="p-3 border-b border-gray-200 dark:border-dim-200">
              <h4 className="font-bold text-gray-800 dark:text-white">
                #Palestine
              </h4>
              <p className="text-xs text-gray-400">29.7K Tweets</p>
            </div>
            {/* その他のトレンドアイテム */}
            <div className="text-blue-400 p-3 cursor-pointer">
              Show more
            </div>
          </div>
          {/* フォローすべきユーザー */}
          <div className="bg-gray-50 dark:bg-dim-700 rounded-2xl m-2">
            <h3 className="text-gray-900 dark:text-white font-bold p-3 border-b border-gray-200 dark:border-dim-200">
              Who to follow
            </h3>
            {/* ユーザーアイテム */}
            {/* この部分も実際のデータに基づいて生成されるべき */}
            {users.map(user => (
              <div key={user._id}>
                <div className="p-5 border-b border-gray-200 dark:border-dim-200 flex justify-between items-center">
                  <div className="flex">
                    <Image className="w-10 h-10 rounded-full"
                      src="https://pbs.twimg.com/profile_images/1444753598328496128/hCCopfyz_400x400.jpg"
                      width={400}
                      height={400}
                      alt="" />
                    <div className="ml-2 text-sm">
                      <h5 className="text-gray-900 dark:text-white font-bold">
                        {user.username}
                      </h5>
                      <p className="text-gray-400">@dummy-username</p>
                    </div>
                  </div>
                  {/* <a href="#" className="text-xs font-bold text-blue-400 px-4 py-1 rounded-full border-2 border-blue-400">Follow</a> */}
                  <button 
                    onClick={() => handleFollow(user._id)}
                    className="text-xs font-bold text-blue-400 px-4 py-1 rounded-full border-2 border-blue-400">
                    フォロー
                  </button>
                </div>
              </div>
            ))}
            {/* その他のユーザーアイテム */}
            <div className="text-blue-400 p-3 cursor-pointer">
              Show more
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
