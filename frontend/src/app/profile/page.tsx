'use client';

import { useEffect, useState } from 'react';
import ProfileCover from './components/ProfileCover';
import ProfileAvatar from './components/ProfileAvatar';
import ProfileInfo from './components/ProfileInfo';
import AboutSection from './components/AboutSetion';
import ExperienceSection from './components/ExperienceSection';
import SkillsSection from './components/SkillsSection';
import { User } from '@/app/types/userTypes';

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userId = '1';

    fetch(`http://localhost:4000/api/talent/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error('Error fetching user:', err));
  }, []);

  if (!user) return <div className="text-center p-10 text-blue-700">Loading...</div>;

  return (
    <div className="mt-5">
      <section className="max-w-4xl mx-auto  bg-white rounded-xl shadow-sm">
        <ProfileCover />
        <ProfileAvatar />
        <ProfileInfo
          firstName={user.first_name}
          lastName={user.last_name}
          jobTitle={user.job_title}
          levelName={user.levels?.name}
        />
      </section>

      <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
        <AboutSection about={user.about} />
      </section>

      <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
        <ExperienceSection experiences={user.experiences || []} />
      </section>

      <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
        <SkillsSection skillTalents={user.skillTalents || []} />
      </section>
    </div>
  );
};

export default ProfilePage;
