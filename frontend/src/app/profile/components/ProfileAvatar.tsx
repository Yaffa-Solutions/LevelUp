'use client'

import EditButton from './EditButton';

const ProfileAvatar = ({avatarUrl}:any) => {
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

  return (
    <div className="relative flex flex-col items-start -mt-16 ml-7">
      <div className="relative">
        <img
          src={avatarUrl || defaultAvatar}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
        />
        <EditButton onClick={() => alert('You clicked the edit button')} className='top-22' />
      </div>
    </div>
  );
}

export default ProfileAvatar;