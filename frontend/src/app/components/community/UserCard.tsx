'use client';

import { User } from '@/app/types/userTypes';
import Image from 'next/image';

type UserCardProps = {
  user: User;
  onClick?: () => void;
};

const UserCard = ({ user, onClick }: UserCardProps) => {
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

  const formatText = (text?: string, fallback: string = ''): string =>
    text && text.trim() !== ''
      ? text
          .split(' ')
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(' ')
      : fallback;

  return (
    <div
      onClick={onClick}
      className="p-5 bg-gradient-to-r from-[#9333EA]/10 to-[#2563EB]/10 rounded-lg shadow flex flex-col items-center cursor-pointer hover:shadow-lg transition"
    >
      {user.profil_picture ? (
        <div className="relative w-20 h-20 ">
          <Image
            src={user.profil_picture || defaultAvatar}
            alt={`${user.first_name} ${user.last_name}`}
            width={80}
            height={80}
            className="rounded-full shadow-md object-cover"
          />
        </div>
      ) : (
        <Image
          src={defaultAvatar}
          alt={`${user.first_name} ${user.last_name}`}
          width={80}
          height={80}
          className="rounded-full object-cover"
        />
      )}
      <h3 className="mt-1 text-gray-800 font-semibold text-center">
        {formatText(user.first_name)} {formatText(user.last_name)}
      </h3>

      <p className="text-gray-500 text-sm"> {formatText(user.job_title)}</p>

      {(user.role === 'HUNTER' || user.role === 'BOTH') &&
        user.company_name && (
          <p className="text-gray-500 text-sm">
            {formatText(user.company_name)}
          </p>
        )}

      {user.role === 'TALENT' || user.role === 'BOTH'
        ? user.levels?.name && (
            <p className="text-gray-700 text-sm mt-1">
              {formatText(user.levels.name)}
            </p>
          )
        : null}

      <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full mt-2">
        {user.role}
      </span>

    </div>
  );
};

export default UserCard;
