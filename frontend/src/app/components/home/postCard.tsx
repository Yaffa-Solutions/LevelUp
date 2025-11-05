'use client'
import Image from 'next/image'

interface PostReaction {
  user_id: string
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

interface User {
  id: string
  first_name: string
  last_name: string
  profil_picture?: string | null
}

interface Props {
  post: Post
  currentUser: User | null
  onLike: (id: string) => void
  onDelete: (id: string) => void
  onEdit?: (post: Post) => void;
  openMenuPostId: string | null
  setOpenMenuPostId: (id: string | null) => void
}

const PostCard: React.FC<Props> = ({ post, currentUser, onLike, onDelete, onEdit, openMenuPostId, setOpenMenuPostId }) => {
  const isOwner = !!currentUser && String(currentUser.id) === String(post.user.id);

  const isMenuOpen = openMenuPostId === post.id

  return (
    <div className="relative bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
      <div className="flex items-center gap-3 mb-3">
        {post.user.profil_picture ? (
          <Image src={post.user.profil_picture} alt="user" width={50} height={50} className="rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            <span>{post.user.first_name[0]}{post.user.last_name[0]}</span>
          </div>
        )}
        <div>
          <h3 className="font-semibold text-sm">{`${post.user.first_name} ${post.user.last_name}`}</h3>
          <p className="text-gray-500 text-xs">{new Date(post.created_at).toLocaleString()}</p>
        </div>

        {isOwner && (
          <div className="ml-auto relative">
            <button onClick={() => 
               setOpenMenuPostId(isMenuOpen ? null : post.id)}
              >
              <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="#666">
                <path d="M10 13.333q.542 0 .937-.395.396-.396.396-.938t-.396-.937Q10.542 10.667 10 10.667t-.937.396q-.396.395-.396.937t.396.938q.395.395.937.395Zm0-4.666q.542 0 .937-.395.396-.396.396-.938t-.396-.937Q10.542 6 10 6t-.937.396q-.396.395-.396.937t.396.938q.395.395.937.395Zm0-4.667q.542 0 .937-.395Q11.333 3.21 11.333 2.667q0-.542-.396-.937Q10.542 1.333 10 1.333t-.937.397q-.396.395-.396.937 0 .543.396.938.395.395.937.395Z"/>
              </svg>
            </button>

            {isMenuOpen  && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border p-2 z-50">
                 {onEdit && (<button
                  onClick={() => 
                    
                    { onEdit(post); setOpenMenuPostId(null) }
                  }
                  className="block px-3 py-1 text-blue-500 hover:bg-gray-100 rounded text-sm w-full text-left"
                >
                  Edit
                </button>
                 )}
                  <button
                    onClick={() => 
                      { onDelete(post.id); setOpenMenuPostId(null) }
                    }
                    className="block px-3 py-1 text-red-500 hover:bg-gray-100 rounded text-sm w-full text-left"
                  >
                     Delete
                  </button>
                
              </div>
            )}
 
          </div>
        )}
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
                onClick={() => onLike(post.id)}
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
  )
}

export default PostCard
