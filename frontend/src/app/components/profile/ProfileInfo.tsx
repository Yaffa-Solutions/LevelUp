import EditButton from './EditButton';
import { useState } from 'react';
import EditInfoModal from './EditInfoModal';
import toast from 'react-hot-toast';
import { User } from '@/app/types/userTypes';

type ProfileInfoProps = {
  userId: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  levelName?: string;
  companyName?: string;
  role: 'TALENT' | 'HUNTER' | 'BOTH';
  onUpdate?: (updateData: Partial<User>) => void;
  isEditMode?: boolean;
};

const ProfileInfo = ({
  firstName,
  lastName,
  jobTitle,
  levelName,
  companyName,
  role,
  userId,
  onUpdate,
  isEditMode = false,
}: ProfileInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (data: {
    first_name: string;
    last_name: string;
    job_title?: string;
  }): Promise<void> => {
    return fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/talent/${userId}/basic`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update basic info');
        return res.json();
      })
      .then((updateData) => {
        onUpdate?.(updateData);
        setIsEditing(false);
        toast.success('Profile information saved Looking good!');
      })
      .catch((error) => {
        console.error('Error updating basic info:', error);
        toast.error('Oops! Could not save your changes.');
      });
  };

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
    <div className="relative flex flex-col items-start mt-1 ml-5 ">
      <h2 className="mt-3 text-2xl font-medium text-gray-950">
        {formatText(firstName)} {formatText(lastName)}
      </h2>
      {(role === 'TALENT' || role === 'BOTH') && jobTitle && (
        <p className="text-gray-900">{formatText(jobTitle,'No job title')}</p>
      )}

      {(role === 'TALENT' || role === 'BOTH') && levelName && (
        <p className="text-gray-900">{formatText(levelName)}</p>
      )}

      {(role === 'HUNTER' || role === 'BOTH') && companyName && (
        <p className="text-gray-900">{formatText(companyName)}</p>
      )}

      {isEditMode && (
        <EditButton onClick={() => setIsEditing(true)} className="" />
      )}

      {isEditing && isEditMode && (
        <EditInfoModal
          firstName={firstName}
          lastName={lastName}
          jobTitle={jobTitle}
          onSave={handleSave}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default ProfileInfo;
