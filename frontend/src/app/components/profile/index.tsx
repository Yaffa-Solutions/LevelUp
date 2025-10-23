'use client';

import ProfileCover from './ProfileCover';
import ProfileAvatar from './ProfileAvatar';
import ProfileInfo from './ProfileInfo';
import AboutSection from './AboutSetion';
import ExperienceSection from './ExperienceSection';
import SkillsSection from './SkillsSection';
import { User } from '@/app/types/userTypes';

type ProfileProps = {
  user: User;
  isEditMode?: boolean;
  onUpdate?: (partial: Partial<User>) => void;
};

const ProfilePage = ({ user, isEditMode = false, onUpdate }: ProfileProps) => {
  const isTalent = user.role === 'TALENT' || user.role === 'BOTH';
  const isHunter = user.role === 'HUNTER' || user.role === 'BOTH';
  return (
    <div className="mt-5">
      <section className="max-w-4xl mx-auto  bg-white rounded-xl shadow-sm">
        <ProfileCover />
        <ProfileAvatar
          userId={user.id}
          avatarUrl={user.profil_picture}
          isEditMode={isEditMode}
        />
        <ProfileInfo
          firstName={user.first_name}
          lastName={user.last_name}
          jobTitle={user.job_title}
          levelName={user.levels?.name}
          companyName={user.company_name}
          role={user.role}
          userId={user.id}
          isEditMode={isEditMode}
          onUpdate={onUpdate}
        />
      </section>

      <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
        <AboutSection
          about={user.about}
          userId={user.id}
          isEditMode={isEditMode}
          onUpdate={(newAbout) => onUpdate && onUpdate({ about: newAbout })}
        />
      </section>
      {isTalent && (
        <>
          <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
            <ExperienceSection
              userId={user.id}
              experiences={user.experiences || []}
              onUpdate={(newExp) =>
                onUpdate &&
                onUpdate({
                  experiences: [newExp, ...(user.experiences || [])],
                })
              }
              isEditMode={isEditMode}
            />
          </section>

          <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
            <SkillsSection
              skillTalents={user.skillTalents || []}
              isEditMode={isEditMode}
            />
          </section>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
