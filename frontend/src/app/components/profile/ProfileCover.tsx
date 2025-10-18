'use client';

import EditButton from './EditButton';

const ProfileCover = ({
  isEditMode,
}: {
  isEditMode: boolean;
}) => {
  const defaultCover =
    'https://cdn.prod.website-files.com/6768f29a6d5da42209173f20/6768f29b6d5da42209177469_Rectangle%20(51).svg';

  return (
    <div className="relative w-full h-56 rounded-t-xl overflow-hidden">
      <img
        src={defaultCover}
        alt="Cover"
        className="object-cover w-full h-full"
      />
      {isEditMode && (
        <EditButton onClick={() => alert('You clicked the edit button')} />
      )}
    </div>
  );
};

export default ProfileCover;
