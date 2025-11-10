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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/signin');
            return;
          }
          throw new Error(
            `Failed to fetch user: ${res.status} ${res.statusText}`
          );
        }

        const data = await res.json();
        setUserId(data.id);
      } catch (err) {
        console.error('Error fetching user ID:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
        setLoading(false);
        router.push('/signin');

      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/`,
          {
            credentials: 'include',
          }
        );

        if (!res.ok) {
          throw new Error(
            `Failed to fetch user data: ${res.status} ${res.statusText}`
          );
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch user data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <Spinner />;
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
