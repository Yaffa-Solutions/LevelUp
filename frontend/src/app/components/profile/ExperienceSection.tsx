'use client';

import { ChevronRight } from 'lucide-react';
import EditButton from './EditButton';
import AddButton from './AddButton';
import ExperienceCard from './ExperienceCard';
import { Experience } from '@/app/types/userTypes';
import { useState } from 'react';
import AddExperienceModal from './AddExperienceModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ExperiencesProps = {
  userId: string;
  experiences: Experience[];
  onUpdate: (newExperience: Experience) => void;
  isEditMode: boolean;
};

const ExperienceSection = ({
  experiences,
  userId,
  onUpdate,
  isEditMode = false,
}: ExperiencesProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleAddExperience = (newExp: Experience) => {
    onUpdate(newExp);
  };
  if (!experiences || experiences.length === 0) {
    return (
      <div className="relative p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Experiences</h2>
          {isEditMode && (
            <AddButton
              onClick={() => setIsAdding(true)}
              className="right-[10px]"
            />
          )}
        </div>
        <p className="text-gray-500">No experiences added yet.</p>
        {isAdding && isEditMode && (
          <AddExperienceModal
            userId="1"
            onSave={handleAddExperience}
            onClose={() => setIsAdding(false)}
          />
        )}
      </div>
    );
  }
  return (
    <div className="relative p-6  mt-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-900">Experiences</h2>
        {isEditMode && (
          <div className="flex items-center gap-2">
            <AddButton onClick={() => setIsAdding(true)} />
            <EditButton
              onClick={() => router.push('/profile/experiences')}
            />
          </div>
        )}
      </div>

      {experiences &&
        experiences.length > 0 &&
        experiences.slice(0, 2).map((exp, index) => (
          <div
            key={exp.id}
            className="flex justify-between px-4 py-4  mt-2 rounded-xl shadow-sm text-gray-800 bg-gray-50 text-sm font-medium"
          >
            <ExperienceCard
              key={index}
              id={exp.id}
              company_name={exp.company_name}
              position={exp.position}
              start_date={new Date(exp.start_date).getFullYear().toString()}
              end_date={new Date(exp.end_date || '').getFullYear().toString()}
              description={exp.description}
              employment_type={exp.employment_type}
            />
          </div>
        ))}

      {experiences.length > 2 && (
        <div className=" text-indigo-600 ">
          <Link
            href="/profile/experiences"
            className="mt-6 flex justify-center items-center text-sm hover:underline"
          >
            Show all experiences
            <ChevronRight className="w-4 h-4 " />
          </Link>
        </div>
      )}
      {isAdding && isEditMode && (
        <AddExperienceModal
          userId={userId}
          onSave={handleAddExperience}
          onClose={() => setIsAdding(false)}
        />
      )}
    </div>
  );
};

export default ExperienceSection;
