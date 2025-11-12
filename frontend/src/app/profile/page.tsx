'use client';

import { useEffect, useState } from 'react';
import Profile from '../components/profile';
import { User } from '@/app/types/userTypes';
import Spinner from '../components/profile/Spinner';
import { useRouter } from 'next/navigation';


const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

   useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/signin');
            return;
          }
          throw new Error(`Failed to fetch user: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log('Fetched user:', data);
        setUser(data.user);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
        router.push('/signin');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;
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
