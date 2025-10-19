'use client';

import EditButton from './EditButton';
import { useState } from 'react';
import EditProfilePictureModal from './EditProfilePictureModal';
import toast from 'react-hot-toast';
import Image from 'next/image';

type ProfileAvatarProps = {
  userId: string;
  avatarUrl: string;
  isEditMode: boolean;
  onUpdate?: (partial: { profil_picture?: string | null }) => void;
};

const ProfileAvatar = ({
  userId,
  avatarUrl,
  isEditMode,
  onUpdate,
}: ProfileAvatarProps) => {
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(
    avatarUrl && avatarUrl !== 'null' ? avatarUrl : null
  );
  const [isEditing, setIsEditing] = useState(false);

  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

  return (
    <div className="relative flex flex-col items-start -mt-16 ml-7">
      <div className="relative w-32 h-32 ">
        <Image
          src={
            currentAvatar &&
            currentAvatar.trim() !== '' &&
            currentAvatar !== 'null'
              ? currentAvatar
              : defaultAvatar
          }
          alt="Profile"
          fill
          sizes="128px"
          className="rounded-full border-4 border-white shadow-md object-cover"
        />
        {isEditMode && (
          <EditButton onClick={() => setIsEditing(true)} className="top-22" />
        )}
      </div>
      {isEditing && (
        <EditProfilePictureModal
          mockUpload={true}
          currentImage={currentAvatar || defaultAvatar}
          onClose={() => setIsEditing(false)}
          onSave={async (newImageUrl) => {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/talent/${userId}/profile-picture`,
              {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profil_picture: newImageUrl }),
              }
            );

            const updatedUser = await res.json();
            setCurrentAvatar(updatedUser.profil_picture);
            onUpdate?.({ profil_picture: updatedUser.profil_picture });
            toast.success('Profile updated succssfully');
          }}
          onDelete={async () => {
            try {
               await fetch(
                 `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/talent/${userId}/profile-picture`,
                 {
                   method: 'PATCH',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ profil_picture: null }),
                 }
               );

              onUpdate?.({ profil_picture: null });
              setCurrentAvatar(null);
            } catch (error) {
              console.error('Error deleting profile picture:', error);
              toast.error('Failed to delete profile picture');
            }
          }}
        />
      )}
    </div>
  );
};

export default ProfileAvatar;
