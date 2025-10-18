'use client';
import { ChevronRight } from 'lucide-react';
import EditButton from './EditButton';
import AddButton from './AddButton';
import Link from 'next/link';
import { SkillTalent } from '@/app/types/userTypes';
import AddSkillModal from './AddSkillModal';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const SkillsSection = ({
  skillTalents,
  isEditMode,
}: {
  skillTalents: SkillTalent[];
  isEditMode?: boolean;
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [skills, setSkills] = useState(skillTalents || []);
  const router = useRouter();

  const handleAddSkill = async (skillName: string): Promise<void> => {
    if (!skillName.trim()) {
      toast.error('Please enter a skill name');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/skills/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: '1',
          skill_name: skillName,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        const error = new Error(err.error || 'Failed to add skill') as Error & {
          status?: number;
        };
        error.status = res.status;
        throw error;
      }

      const newSkill = await res.json();
      setSkills((prev) => [...prev, newSkill]);
      toast.success('Skill added successfully!');
    } catch (error: unknown) {
      throw error;
    }
  };

  const visibleSkills = skills.slice(0, 4);

  return (
    <div className="relative p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
        {isEditMode && (
          <div className="flex gap-2">
            <AddButton onClick={() => setShowAddModal(true)} />
            <EditButton onClick={() => router.push('/profile/skills')} />
          </div>
        )}
      </div>

      {skills.length === 0 ? (
        <p className="text-gray-500">No skills added yet.</p>
      ) : (
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
      )}

      {skills.length > 4 && (
        <div className=" text-indigo-600 ">
          <Link
            href="/profile/skills"
            className="mt-6 flex justify-center items-center text-sm hover:underline"
          >
            Show all skills
            <ChevronRight className="w-4 h-4 " />
          </Link>
        </div>
      )}

      {showAddModal && isEditMode && (
        <AddSkillModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddSkill}
        />
      )}
    </div>
  );
};

export default SkillsSection;
