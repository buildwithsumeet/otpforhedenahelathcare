import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Heart, 
  MessageCircle, 
  Share2, 
  Users, 
  Bell,
  Sparkles,
  Search,
  Plus,
  Home,
  User,
  Settings,
  Bookmark,
  Camera,
  Send,
  ThumbsUp,
  Smile,
  MoreHorizontal
} from "lucide-react";

const SocialMediaHome = () => {
  const [greeting, setGreeting] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
    
    setTimeout(() => setIsVisible(true), 100);
    
    // Initialize posts
    setPosts(dummyPosts);
  }, []);

  // Social Media Data
  const dummyPosts = [
    {
      id: 1,
      user: { name: "Ankita Sharma", avatar: "A", username: "@ankita_s" },
      timestamp: "2 hours ago",
      content: "Just finished an amazing React project! The feeling when your code finally works perfectly 🚀",
      image: null,
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false
    },
    {
      id: 2,
      user: { name: "Rahul Patel", avatar: "R", username: "@rahul_dev" },
      timestamp: "4 hours ago",
      content: "Beautiful sunset from my office window today. Sometimes you need to take a moment to appreciate the little things ✨",
      image: "https://via.placeholder.com/500x300/4F46E5/FFFFFF?text=Sunset+View",
      likes: 156,
      comments: 23,
      shares: 12,
      isLiked: true
    },
    {
      id: 3,
      user: { name: "Priya Singh", avatar: "P", username: "@priya_codes" },
      timestamp: "6 hours ago",
      content: "Celebrating my work anniversary today! 3 years of amazing growth and learning. Grateful for this journey 🎉",
      image: null,
      likes: 89,
      comments: 15,
      shares: 7,
      isLiked: false
    }
  ];

  const stories = [
    { id: 1, name: "Your Story", avatar: "S", hasStory: false, isYours: true },
    { name: "Ankita", avatar: "A", hasStory: true },
    { name: "Rahul", avatar: "R", hasStory: true },
    { name: "Priya", avatar: "P", hasStory: true },
    { name: "Amit", avatar: "Am", hasStory: true },
    { name: "Sneha", avatar: "Sn", hasStory: true }
  ];

  const suggestions = [
    { name: "Tech Enthusiasts", members: "12.5k", avatar: "T" },
    { name: "Web Developers", members: "8.2k", avatar: "W" },
    { name: "React Community", members: "15.7k", avatar: "R" }
  ];

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">LC</span>
              </div>
              <span className="text-xl font-bold text-gray-800 hidden sm:block">LetsConnect</span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search for friends, posts, or communities..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell size={24} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MessageCircle size={24} className="text-gray-600" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">S</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex max-w-6xl mx-auto">
        {/* Left Sidebar */}
        <div className="w-64 fixed left-0 top-16 h-full bg-white border-r border-gray-200 p-4 hidden lg:block">
          <div className="space-y-2">
            {[
              { icon: Home, label: "Home", id: "home" },
              { icon: User, label: "Profile", id: "profile" },
              { icon: Users, label: "Friends", id: "friends" },
              { icon: Bookmark, label: "Saved", id: "saved" },
              { icon: Calendar, label: "Events", id: "events" },
              { icon: Settings, label: "Settings", id: "settings" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id 
                    ? 'bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* User Profile Section */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">S</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Sumeet</p>
                <p className="text-sm text-gray-500">@sumeet_dev</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 lg:mr-80">
          <div className="max-w-2xl mx-auto p-4">
            {/* Welcome Banner */}
            <div className={`mb-6 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">{greeting}, Sumeet! 👋</h1>
                <p className="opacity-90">Welcome back to your social hub. Stay connected with your community.</p>
              </div>
            </div>

            {/* Stories */}
            <div className="mb-6">
              <div className="flex gap-4 overflow-x-auto pb-2">
                {stories.map((story, index) => (
                  <div key={index} className="flex-shrink-0 text-center">
                    <div className={`w-16 h-16 rounded-full border-2 p-1 mb-2 ${
                      story.hasStory ? 'border-gradient-to-r from-indigo-500 to-cyan-500' : 'border-gray-300'
                    } ${story.isYours ? 'border-dashed' : ''}`}>
                      <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full flex items-center justify-center relative">
                        <span className="text-white font-semibold">{story.avatar}</span>
                        {story.isYours && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                            <Plus size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 truncate w-16">{story.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Post */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">S</span>
                </div>
                <input 
                  type="text" 
                  placeholder="What's on your mind, Sumeet?"
                  className="flex-1 p-3 bg-gray-50 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                    <Camera size={20} />
                    <span className="text-sm font-medium">Photo</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                    <Smile size={20} />
                    <span className="text-sm font-medium">Feeling</span>
                  </button>
                </div>
                <button className="px-6 py-2 bg-indigo-500 text-white rounded-full font-medium hover:bg-indigo-600 transition-colors">
                  Post
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Post Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">{post.user.avatar}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{post.user.name}</p>
                        <p className="text-sm text-gray-500">{post.user.username} • {post.timestamp}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreHorizontal size={20} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-4">
                    <p className="text-gray-800 mb-3">{post.content}</p>
                    {post.image && (
                      <img 
                        src={post.image} 
                        alt="Post content" 
                        className="w-full rounded-lg"
                      />
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{post.likes} likes</span>
                        <span>{post.comments} comments</span>
                        <span>{post.shares} shares</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                          post.isLiked 
                            ? 'text-red-500 bg-red-50' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
                        <span className="font-medium">Like</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <MessageCircle size={20} />
                        <span className="font-medium">Comment</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <Share2 size={20} />
                        <span className="font-medium">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 fixed right-0 top-16 h-full bg-white border-l border-gray-200 p-4 hidden lg:block overflow-y-auto">
          {/* Suggestions */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Suggested Communities</h3>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{suggestion.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{suggestion.name}</p>
                      <p className="text-sm text-gray-500">{suggestion.members} members</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-indigo-500 text-white text-sm rounded-full hover:bg-indigo-600 transition-colors">
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Online Friends */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Online Friends</h3>
            <div className="space-y-3">
              {[
                { name: "Ankita Sharma", status: "Active now", avatar: "A" },
                { name: "Rahul Patel", status: "Active 2m ago", avatar: "R" },
                { name: "Priya Singh", status: "Active now", avatar: "P" }
              ].map((friend, index) => (
                <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{friend.avatar}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{friend.name}</p>
                    <p className="text-xs text-gray-500">{friend.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { 
          animation: float 6s ease-in-out infinite;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default SocialMediaHome;
