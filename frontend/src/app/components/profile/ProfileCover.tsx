'use client';

import Image from 'next/image';

const ProfileCover = () => {
  const defaultCover =
    'https://cdn.prod.website-files.com/6768f29a6d5da42209173f20/6768f29b6d5da42209177469_Rectangle%20(51).svg';

  return (
    <div className="relative w-full h-56 rounded-t-xl overflow-hidden">
      <Image
        src={defaultCover}
        alt="Cover"
        fill
        className="object-cover w-full h-full"
      />
    </div>
  );
};

export default ProfileCover;
