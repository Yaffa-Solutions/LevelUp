'use client';

import { useEffect, useState } from 'react';
import Profile from '../components/profile';
import { User } from '@/app/types/userTypes';
import Spinner from '../components/profile/Spinner';

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const userId ='1';

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/talent/1`)
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
