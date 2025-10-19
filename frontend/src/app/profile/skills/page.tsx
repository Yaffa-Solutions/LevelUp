'use client';

import { useEffect, useState } from 'react';
import { Trash2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { SkillTalent } from '@/app/types/userTypes';

export default function AllSkillsPage() {
  const [skills, setSkills] = useState<SkillTalent[]>([]);
  const userId = '1';

useEffect(() => {
  const fetchSkills = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/skills/talent/${userId}`
      );
      if (!res.ok) throw new Error('Failed to fetch skills');
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      toast.error('Failed to fetch skills');
      console.error('Error fetching skills:', error);
    }
  };

  if (userId) fetchSkills();
}, [userId]);

const handleDeleteSkill = async (skillId: string) => {
  console.log('Deleting skill:', skillId);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/skills/${skillId}`,
      {
        method: 'DELETE',
      }
    );

    console.log('Response status:', res.status);

    if (res.status === 204 || res.status === 200) {
      toast.success('Skill deleted successfully');
      setSkills((prev) => prev.filter((s) => s.id !== skillId));
    } else {
      throw new Error(`Failed to delete skill (status: ${res.status})`);
    }
  } catch (error) {
    console.error('Error deleting skill:', error);
    toast.error('Error deleting skill');
  }
};


  return (
    <div className="max-w-4xl mx-auto  bg-white rounded-xl shadow-sm mt-5 p-11">
      <div className="flex items-center mb-6">
        <Link
          href="/profile"
          className="flex items-center text-indigo-600 transition text-sm hover:underline"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">Skills</h1>

      <div className="flex flex-wrap flex-col gap-3">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex justify-between px-4 py-4 rounded-xl shadow-sm text-gray-800 bg-gray-50 text-sm font-medium"
          >
            <span>{skill.skill.skill_name}</span>
            <button
              onClick={() => handleDeleteSkill(skill.id)}
              className="text-red-500 hover:text-red-700"
              title="Delete skill"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {skills.length === 0 && (
          <p className="text-gray-500 mt-4">No skills added yet.</p>
        )}
      </div>
    </div>
  );
}
