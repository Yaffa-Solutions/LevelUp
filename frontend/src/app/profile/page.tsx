'use client';

import { useEffect, useState } from 'react';
import Profile from '../components/profile';
import { User } from '@/app/types/userTypes';
import Spinner from '../components/profile/Spinner';

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  // const userId = '11111111-1111-1111-1111-111111111111';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
          method: "GET",
          credentials: "include", // مهم إذا عندك cookies/session
        });

        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUserId(data.id); // هنا نجيب الـ id من response
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error('Error fetching user:', err));
  }, []);

  if (!user) return <Spinner />;
  return (
    <Profile
      user={user}
      isEditMode={true}
      onUpdate={(updateData) =>
        setUser((prev) => (prev ? { ...prev, ...updateData } : prev))
      }
    />
  );
};

export default ProfilePage;
