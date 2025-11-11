'use client'
import Image from "next/image"
import { useState, useEffect } from "react"
import UserCard from "../components/userCard"
import PostCard from "../components/home/postCard"

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
    id:string
    first_name: string
    last_name: string
    profil_picture?: string | null
  }
  postReactions: PostReaction[]
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
  postReactions?: { user_id: string }[]
}

type ModalMode = "create" | "edit"
interface PostModalProps {
    show: boolean
    onClose: () => void
    onPost: (id?: string) => void
    newPost: string
    setNewPost: (content: string) => void
    user?: User | null
    mode: ModalMode
    post?: Post
}

const PostModal: React.FC<PostModalProps> = ({ show, onClose, onPost, newPost, setNewPost, user, mode, post }) => {
    if (!show) return null

    const handlePostAndClose = () => {
        if (mode === "edit" && post) {
         onPost(post.id) 
       } else {
         onPost() 
       }
       onClose()
    }

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} 
            onClick={onClose} 
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-300 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Create a Post</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {user && (
                    <div className="flex items-center p-4">
                        {user.profil_picture ? (
                            <Image src={user.profil_picture} alt="User Profile" width={40} height={40} className="rounded-full object-cover" />
                        ) : (
                            // <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                            //     <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                            // </div>
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">{user.first_name[0]}</div>
                        )}
                        <div className="ml-3">
                            <p className="font-semibold text-sm">{`${user.first_name} ${user.last_name}`}</p>
                            <p className="text-xs text-gray-500">Post to Feed</p>
                        </div>
                    </div>
                )}
                
                <div className="p-4 pt-0">
                    <textarea
                        value={newPost}
                        onChange={e => setNewPost(e.target.value)}
                        placeholder="What's on your mind?"
                        className="w-full min-h-[150px] p-2 text-lg border-none focus:ring-0 resize-none outline-none"
                    />
                </div>

                <div className="p-4  flex justify-between items-center">
                    <div className="flex gap-4">
                    </div>

                    <button 
                        onClick={handlePostAndClose} 
                        disabled={!newPost.trim()}
                        className={`px-6 py-2 rounded-full text-white font-semibold transition  bg-gradient-to-r from-[#9333EA] to-[#2563EB] ${
                            newPost.trim() 
                                ? 'bg-blue-600 hover:bg-blue-700' 
                                : 'bg-blue-300 cursor-not-allowed'
                        }`}
                    >
                    {mode === "edit" ? "Save Changes" : "Post"}

                    </button>
                </div>
            </div>
        </div>
    )
}

const Home = () =>{
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState("")
  const [showPostModal, setShowPostModal] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null)
   
  useEffect(() => {

    const fetchUserAndPosts = async () => {
      try {
        const resUser = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
          credentials: "include"
        })
        if (!resUser.ok) throw new Error("User not authenticated")
        const userData: User = await resUser.json()
        setUser(userData)

        const resPosts = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/withlikes`, {
          // headers: { Authorization: `Bearer ${token}` },
          credentials: "include"
        })
        const postsData = await resPosts.json()
        const mappedPosts: Post[] = postsData.map((p: RawPost) => {
          const reactions : PostReaction[] = p.postReactions || []
          const userLiked = reactions.some((r: PostReaction) => r.user_id === userData.id)
          return {
            ...p,
            postReactions: reactions,
            likes: reactions.length,
            userLiked
          }
        })

        setPosts(mappedPosts)
      } catch (err) {
        console.error(err)
        setUser(null)
      }
    }

    fetchUserAndPosts()
  }, [])

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return alert("Enter something to post")
    // if (!token) return alert("You must be logged in")

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newPost, user_id: user.id }),
        credentials: "include"
      })
      const createdPost: RawPost = await res.json()
      if (!res.ok) return alert((createdPost as { message?: string }).message || "Failed to create post")

      const reactions = createdPost.postReactions || []
      const userLiked = reactions.some(r => r.user_id === user.id)

      setPosts(prev => [
        {
          ...createdPost,
          postReactions: reactions,
          likes: reactions.length,
          userLiked,
          user: {
            id: user.id, 
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
  if (!user) return alert("You must be logged in");

  const post = posts.find(p => p.id === postId);
  if (!post) return;

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/post-reaction/${post.userLiked ? 'unlike' : 'like'}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
      credentials: "include"
    });

    const data = await res.json();

    if (res.ok || data.totalLikes !== undefined) {
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
    } else {
      console.error("Like/Unlike failed:", data.message);
    }
  } catch (err) {
    console.error("Network error:", err);
  }
};
const handleDelete = async (id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to delete')
    setPosts(prev => prev.filter(p => p.id !== id))
  } catch (err) {
    console.error(err)
  }
}

const handleEdit = (post: Post) => {
  setEditingPost(post)
  setNewPost(post.content)
  setShowPostModal(true)
}

const handleCreateOrEditPost = async (postId?: string) => {
  if (!newPost.trim()) return

  if (postId) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPost }),
        credentials: "include"
      })

      if (!res.ok) {
        const data = await res.json()
        return alert(data.message || "Failed to update post")
      }

      const updatedPost = await res.json()

      setPosts(prev => prev.map(p => p.id === postId ? { ...p, content: updatedPost.content } : p))
    } catch (err) {
      console.error(err)
      alert("Server error, try again later")
    }
  } else {
    handleCreatePost()

  }
  setEditingPost(null)
  setShowPostModal(false)
}

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="flex gap-[40px] mt-20 mb-7">
          <UserCard />

        <div className="flex-1 flex flex-col gap-6 mr-24">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div
                className="w-full border-b border-gray-300 pb-2 mb-2 cursor-pointer"
                onClick={() => setShowPostModal(true)}
            >
                <div className="bg-gray-100 rounded-full py-2 px-4">
                    <p className="text-gray-500 text-base">Start a post...</p>
                </div>
            </div>

            <div className="flex justify-around items-center pt-2">
                <button 
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition"
                    onClick={() => setShowPostModal(true)} 
                >
                    <span className="text-gray-600 font-medium">Photo</span>
                </button>
                <button 
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition"
                    onClick={() => setShowPostModal(true)} 
                >
                    <span className="text-gray-600 font-medium">Article</span> 
                </button>
            </div>
          </div>

          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard
                   key={post.id}
                   post={post}
                   currentUser={user}
                   onLike={handleLike}
                   onDelete={handleDelete}
                   onEdit={handleEdit}
                   openMenuPostId={openMenuPostId}
                   setOpenMenuPostId={setOpenMenuPostId}
                 />
                ))
              ) : (
            <p className="text-gray-500 text-center mt-10">No posts yet</p>
          )}
        </div>
      </div>

      <PostModal 
        show={showPostModal}
        mode={editingPost ? "edit" : "create"}
        post={editingPost ?? undefined}  
        onClose={() => {
            setShowPostModal(false)
            setNewPost("")
            setEditingPost(null) 
        }} 
        onPost={handleCreateOrEditPost}
        newPost={newPost}
        setNewPost={setNewPost}
        user={user}
      />
    </div>
  )
}

export default Home;