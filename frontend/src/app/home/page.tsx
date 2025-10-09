'use client'
import Image from "next/image"
import { useState, useEffect } from "react"

interface PostReaction {
  user_id: string
}

interface User {
  id: string
  first_name: string
  last_name: string
  profil_picture?: string | null
}

interface Post {
  id: string
  content: string
  created_at: string
  updated_at: string
  user: {
    first_name: string
    last_name: string
    profil_picture?: string | null
  }
  PostReactions: PostReaction[]
  likes: number
  userLiked: boolean
}

interface RawPost {
  id: string
  content: string
  created_at: string
  updated_at: string
  user: {
    first_name: string
    last_name: string
    profil_picture?: string | null
  }
  PostReactions?: { user_id: string }[]
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState("")
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  useEffect(() => {
    if (!token) return

    const fetchUserAndPosts = async () => {
      try {
        const resUser = await fetch("http://localhost:5000/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!resUser.ok) throw new Error("User not authenticated")
        const userData: User = await resUser.json()
        setUser(userData)

        const resPosts = await fetch("http://localhost:5000/posts/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const postsData = await resPosts.json()
        const postsArray: RawPost[] = Array.isArray(postsData)
          ? postsData
          : postsData.posts || postsData.data || []

        const mappedPosts: Post[] = postsArray.map(p => {
          const reactions = p.PostReactions || []
          const userLiked = reactions.some(r => r.user_id === userData.id)
          return {
            ...p,
            PostReactions: reactions,
            likes: reactions.length,
            userLiked
          }
        })

        setPosts(mappedPosts)
      } catch (err) {
        console.error(err)
        localStorage.removeItem("token")
        setUser(null)
      }
    }

    fetchUserAndPosts()
  }, [token])

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return alert("Enter something to post")
    if (!token) return alert("You must be logged in")

    try {
      const res = await fetch("http://localhost:5000/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newPost, user_id: user.id }),
      })
      const createdPost: RawPost = await res.json()
      if (!res.ok) return alert((createdPost as any).message || "Failed to create post")

      const reactions = createdPost.PostReactions || []
      const userLiked = reactions.some(r => r.user_id === user.id)

      setPosts(prev => [
        {
          ...createdPost,
          PostReactions: reactions,
          likes: reactions.length,
          userLiked,
          user: {
            first_name: user.first_name,
            last_name: user.last_name,
            profil_picture: user.profil_picture || null,
          },
        },
        ...prev,
      ])
      setNewPost("")
    } catch (err) {
      console.error(err)
      alert("Server error, try again later")
    }
  }

  const handleLike = async (postId: string) => {
  if (!user || !token) return alert("You must be logged in");

  const post = posts.find(p => p.id === postId);
  if (!post) return;

  const url = `http://localhost:5000/post-reaction/${post.userLiked ? 'unlike' : 'like'}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ postId }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Error");

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            userLiked: !p.userLiked,
            likes: data.totalLikes
          };
        }
        return p;
      })
    );
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
            <button onClick={handleCreatePost} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
              Post
            </button>
          </div>

          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-3">
                  {post.user?.profil_picture ? (
                    <Image src={post.user.profil_picture} alt="user" width={50} height={50} className="rounded-full" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">👤</div>
                  )}
                  <div>
                    <h3 className="font-semibold text-sm">{`${post.user.first_name} ${post.user.last_name}`}</h3>
                    <p className="text-gray-500 text-xs">{new Date(post.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                <div className="border-t border-gray-200 mt-3 mb-3 "></div>
                {post.likes > 0 && (
                  <div className="flex items-center gap-1 text-gray-500 mb-2 ml-1">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" width="12" height="12">
                        <path d="M2 10a8 8 0 1116 0A8 8 0 012 10zm9-3.5v5a.5.5 0 01-.5.5H8a.5.5 0 01-.5-.5v-5a.5.5 0 01.5-.5h2.5a.5.5 0 01.5.5z" />
                      </svg>
                    </div>
                    <span className="text-sm">{post.likes}</span>
                  </div>
                )}

              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2 px-2 py-1 rounded transition ${
                  post.userLiked ? "text-blue-600" : "text-gray-600"
                } hover:bg-gray-100`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 0 24 24"
                  width="20px"
                  fill={post.userLiked ? "#2563eb" : "#6b7280"}
                >
                  <path d="M2 21h4V9H2v12zM23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 2 7.59 8.59C7.22 8.95 7 9.45 7 10v9c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1z" />
                </svg>
                <span className="text-sm font-medium">Like</span>
              </button>

                            </div>
                          ))
                        ) : (
            <p className="text-gray-500 text-center mt-10">No posts yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
