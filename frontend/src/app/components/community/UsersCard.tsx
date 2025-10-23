'use client';
import { User } from '@/app/types/userTypes';
import UserCard from './UserCard';
import { useRouter } from 'next/navigation';

type UsersCardProps = {
  users: User[];
};

const UsersCard = ({ users }: UsersCardProps) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-4 gap-6">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onClick={() => router.push(`/profile/${user.id}`)}
        />
      ))}
    </div>
  );
};

export default UsersCard;
