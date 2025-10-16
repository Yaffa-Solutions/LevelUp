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
    fetch(`http://localhost:4000/api/talent/${userId}`)
      .then((res) => res.json())
      .then(setUser)
      .catch((err) => console.error('Error:', err));
  }, [userId]);

  if (!user) return <Spinner />;

  return <Profile user={user} isEditMode={false} />;
};

export default PublicProfilePage;
