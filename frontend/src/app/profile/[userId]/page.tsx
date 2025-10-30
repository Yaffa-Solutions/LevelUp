'use client';
import { useEffect, useState } from 'react';
import Profile from '@/app/components/profile';
import Spinner from '@/app/components/profile/Spinner';
import { useParams } from 'next/navigation';
import { User } from '@/app/types/userTypes';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${userId}`)
      .then((res) => res.json())
      .then(setUser)
      .catch((err) => console.error('Error:', err));
  }, [userId]);

  if (!user) return <Spinner />;

  return <Profile user={user} isEditMode={false} />;
};

export default PublicProfilePage;
