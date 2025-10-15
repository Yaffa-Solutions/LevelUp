'use client';

import { useEffect, useState } from 'react';
import ProfileCover from './components/ProfileCover';
import ProfileAvatar from './components/ProfileAvatar';
import ProfileInfo from './components/ProfileInfo';
import AboutSection from './components/AboutSetion';
import ExperienceSection from './components/ExperienceSection';
import SkillsSection from './components/SkillsSection';
import { User } from '@/app/types/userTypes';
import Spinner from './components/Spinner';

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const userId = '1';

  useEffect(() => {
    fetch(`http://localhost:4000/api/talent/1`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error('Error fetching user:', err));
  }, []);

  if (!user)
    return <Spinner/>;
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
          userId={userId}
          onUpdate={(updateData) =>
            setUser((prev) => (prev ? { ...prev, ...updateData } : prev))
          }
        />
      </section>

      <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
        <AboutSection
          about={user.about}
          userId={userId}
          onUpdate={(newAbout) =>
            setUser((prev) => (prev ? { ...prev, about: newAbout } : prev))
          }
        />
      </section>

      <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
        <ExperienceSection
          userId={userId}
          experiences={user.experiences || []}
          onUpdate={(newExp) =>
            setUser((prev) =>
              prev
                ? { ...prev, experiences: [newExp, ...prev.experiences] }
                : prev
            )
          }
        />
      </section>

      <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
        <SkillsSection skillTalents={user.skillTalents || []} />
      </section>
    </div>
  );
};

export default ProfilePage;
