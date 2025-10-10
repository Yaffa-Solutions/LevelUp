'use client';
import { ChevronRight } from 'lucide-react';
import EditButton from './EditButton';
import AddButton from './AddButton';
import { SkillTalent } from '@/app/types/userTypes';


const SkillsSection = ({ skillTalents }: { skillTalents: SkillTalent[] }) => {
  if (!skillTalents || skillTalents.length === 0) {
    return (
      <div className="relative p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
          <AddButton
            onClick={() => alert('Add new skill')}
            className="right-[10px]"
          />
        </div>
        <p className="text-gray-500">No skills added yet.</p>
      </div>
    );
  }

  const visibleSkills = skillTalents.slice(0, 4); 

  return (
    <div className="relative p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
        <div className="flex gap-2">
          <AddButton onClick={() => alert('Add skill')} />
          <EditButton onClick={() => alert('Edit skills')} />
        </div>
      </div>

      <div className="flex flex-wrap flex-col gap-3">
        {visibleSkills.map((st) => (
          <span
            key={st.id}
            className="px-4 py-2 bg-gray-50 text-gray-800 rounded-full text-sm font-medium"
          >
            {st.skill.skill_name}
          </span>
        ))}
      </div>

      {skillTalents.length > 6 && (
        <div className="flex justify-center">
          <button
            className="mt-6 inline-flex items-center text-sm text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] to-[#2563EB] hover:text-white hover:no-underline"
            onClick={() => alert('Navigate to all skills page')}
          >
            Show all skills <ChevronRight className="w-4 h-4 text-blue-700" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
