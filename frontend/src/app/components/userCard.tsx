'use client'
import Image from "next/image"
import { useState, useEffect } from "react"

interface User {
  first_name: string
  last_name: string
  profil_picture?: string | null
  level?: { name: string }
}

const UserCard = () =>{
  const [user, setUser] = useState<User | null>(null)
 
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Not authenticated");
      const userData = await res.json();
      setUser(userData);
    } catch (err) {
      console.error(err);
    }
  }
  fetchUser();
}, []);

  // if (!user) return <p>Loading...</p>
    if (!user) return <p className="p-4 w-full sm:w-[294px] mx-auto text-center bg-white rounded-lg shadow">Loading user profile...</p>


  return (
    <div className="bg-white rounded-xl  w-full sm:w-[280px] md:w-[294px] h-auto sm:h-[208px] mx-auto sm:ml-[100px] overflow-hidden">
      

      <div className="relative h-20 bg-gradient-to-r from-[#9333EA] to-[#2563EB] "> 
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4">
           {user?.profil_picture ? (
             <div className="border-4 border-white rounded-full w-[88px] h-[88px] overflow-hidden shadow-md">
               <Image
                 src={user.profil_picture}
                 alt={`${user.first_name} ${user.last_name}`}
                 width={88}
                 height={88}
                 className="object-cover"
               />
             </div>
           ) : (
             <div className="w-[88px] h-[88px] flex items-center justify-center bg-gray-200 rounded-full border-4 border-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#4b5563">
                  <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
                </svg>
             </div>
           )}
        </div>
      </div>

      <div className="flex flex-col items-center pt-14 pb-4">
        <h2 className="font-bold text-xl text-gray-800">
          {user.first_name} {user.last_name}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {user.level?.name || "No Level Defined"}
        </p>
      </div>
    </div>
  )
}

export default UserCard;