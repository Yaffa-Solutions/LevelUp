'use client'
import Image from "next/image"
import { useState, useEffect } from "react"

interface Post {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    first_name: string;
    last_name: string;
    profil_picture?: string | null;
  };
  // postReactions: any[];
  PostReactions: string[];
  likes?: number;
}

interface User {
  id:string;
  first_name: string;
  last_name: string;
  profil_picture?: string | null;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    fetch("http://localhost:5000/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err))

   
    fetch("http://localhost:5000/posts/", {
        headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
           const mappedPosts = data.map(p => ({
             ...p,
             likes: p.PostReactions.length,
             PostReactions: p.PostReactions.map(r => r.user_id)
           }));
           setPosts(mappedPosts)
        }
      })
      .catch(err => console.error("Error fetching posts:", err))
  }, [])

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return alert("Enter something to post");

    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in");

    try {
      const res = await fetch("http://localhost:5000/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newPost,
          user_id: user.id 
        })
      });

      const createdPost = await res.json();
      console.log("Created Post:", createdPost);

      if (res.ok) {
        setPosts(prev => [
          {
            ...createdPost,
            likes: createdPost.postReactions?.length || 0,
            user: {
              first_name: user.first_name,
              last_name: user.last_name,
              profil_picture: user.profil_picture || null
            }
          },
        ...prev
        ]);
        setNewPost("");
      } else {
        alert(createdPost.message || "Failed to create post");
      }

    } catch (err) {
      console.error("Error creating post:", err);
      alert("Server error, try again later");
    }
  };


  // const handleLike = (postId: string) => {
  //   setPosts(prev => prev.map(p => {
  //     if (p.id === postId) {
  //       const incrementedLikes = (p.likes || 0) + 1;
  //       return { ...p, likes: incrementedLikes };
  //     }
  //     return p;
  //   }))
  // }

  const handleLike = async (postId: string) => {
  if (!user) return;
  const token = localStorage.getItem("token");
  if (!token) return;

  const hasLiked = posts.find(p => p.id === postId)?.PostReactions.includes(user.id);

  try {
    const res = await fetch(`http://localhost:5000/post-reaction/${hasLiked ? 'unlike' : 'like'}`, {
      method: 'POST',
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ postId })
    });

    const data = await res.json();
    if (res.ok) {
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          let newReactions = [...p.PostReactions];
          if (hasLiked) {
            newReactions = newReactions.filter(id => id !== user.id);
          } else {
            newReactions.push(user.id);
          }
          return { ...p, PostReactions: newReactions, likes: newReactions.length };
        }
        return p;
      }));
    } else {
      alert(data.message || "Error liking post");
    }
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="flex gap-[40px] mt-7 mb-7">

        <div className="bg-white rounded-lg shadow flex flex-col items-center p-4" style={{ width: "294px", height: "208px", marginLeft: "100px" }}>
          {user?.profil_picture ? (
            <Image src={user.profil_picture} alt={`${user.first_name} ${user.last_name}`} width={80} height={80} className="rounded-full" />
          ) : (
            <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-full">
              <span className="text-gray-500 text-2xl">👤</span>
            </div>
          )}
          <h2 className="mt-4 font-semibold">{user ? `${user.first_name} ${user.last_name}` : "Your Name"}</h2>
        </div>

        <div className="flex-1 flex flex-col gap-6 mr-24">
          <div className="bg-white p-4 rounded-lg shadow">
            <textarea
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              placeholder="Write something..."
              className="w-full p-2 border rounded-lg resize-none"
            />
            <button
              onClick={handleCreatePost}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Post
            </button>
          </div>

          {posts.length > 0 ? posts.map(post => (
            <div key={post.id} className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                {post.user?.profil_picture ? (
                  <Image src={post.user.profil_picture} alt="user" width={50} height={50} className="rounded-full" />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    👤
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-sm">{`${post.user.first_name} ${post.user.last_name}`}</h3>
                  <p className="text-gray-500 text-xs">{new Date(post.created_at).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>

              <div className="border-t border-gray-200 mt-3 mb-3"></div>
              <button
                onClick={() => handleLike(post.id)}
                // className="flex items-center gap-2 text-blue-600 font-semibold"
                 className={`px-2 py-1 rounded ${post.PostReactions.includes(user?.id || '') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                ❤️ {post.likes || 0} Likes
              </button>
            </div>
          )) : (
            <p className="text-gray-500 text-center mt-10">No posts yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
