'use client';

import { ChevronRight } from 'lucide-react';
import EditButton from './EditButton';
import AddButton from './AddButton';
import ExperienceCard from './ExperienceCard';
import { Experience } from '@/app/types/userTypes';

type ExperiencesProps = {
  experiences: Experience[];
};

const ExperienceSection = ({ experiences }: ExperiencesProps) => {
    if (!experiences || experiences.length === 0) {
      return (
        <div className="relative p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Experiences</h2>
            <AddButton
              onClick={() => alert('Add new Experience')}
              className="right-[10px]"
            />
          </div>
          <p className="text-gray-500">No experiences added yet.</p>
        </div>
      );
    }
  return (
    <div className="relative p-6  mt-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-900">Experiences</h2>
        <div className="flex items-center gap-2">
          <AddButton onClick={() => alert('Add new experience')} />
          <EditButton onClick={() => alert('Edit experience section')} />
        </div>
      </div>

      {experiences &&
        experiences.length > 0 &&
        experiences
          .slice(0, 2)
          .map((exp, index) => (
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
          ))}

      {experiences.length > 2 && (
        <div className="flex justify-center ">
          <button
            className="mt-6 inline-flex items-center text-sm hover:underline bg-gradient-to-r from-[#9333EA] to-[#2563EB] bg-clip-text text-transparent "
            onClick={() => alert('Navigate to all experiences page')}
          >
            Show all experiences <ChevronRight className="w-4 h-4 " />
          </button>
        </div>
      )}
    </div>
  );
};

export default ExperienceSection;
