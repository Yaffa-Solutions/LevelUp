import EditButton from './EditButton';
import { useState } from 'react';
import EditInfoModal from './EditInfoModal';
import toast from 'react-hot-toast';

type ProfileInfoProps = {
  userId: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  levelName?: string;
  onUpdate?: (updateData: any) => void;
  isEditMode?: boolean;
};

const ProfileInfo = ({
  firstName,
  lastName,
  jobTitle,
  levelName,
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
    return fetch(`http://localhost:4000/api/talent/${userId}/basic`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
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
  return (
    <div className="relative flex flex-col items-start mt-1 ml-5 ">
      <h2 className="mt-3 text-2xl font-medium text-gray-950">
        {firstName || 'No first name'} {lastName || 'No last name'}
      </h2>
      <p className="text-gray-900">{jobTitle || 'No job title yet'}</p>
      <p className="text-gray-900">{levelName || 'No have level yet'}</p>

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
