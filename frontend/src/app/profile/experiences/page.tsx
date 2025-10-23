'use client';

import { useEffect, useState } from 'react';
import { Trash2, ChevronLeft, Pencil } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Experience } from '@/app/types/userTypes';
import ExperienceCard from '../../components/profile/ExperienceCard';
import EditExperienceModal from '../../components/profile/EditExperienceModal';

const AllExperiencesPage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );

  const userId = '1';

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/experiences/talent/${userId}`)
      .then((res) => res.json())
      .then((data) => setExperiences(data))
      .catch(() => toast.error('Failed to fetch experiences'));
  });

  const handleDeleteExperience = (experienceId: string) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/experiences/${experienceId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete experience');
        toast.success('experience deleted successfully');
        setExperiences((prev) => prev.filter((exp) => exp.id !== experienceId));
      })
      .catch(() => toast.error('Error deleting experience'));
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

      <h1 className="text-2xl font-bold text-gray-900 mb-4">Experiences</h1>

      <div className="flex flex-wrap flex-col gap-3">
        {experiences.map((exp, index) => (
          <div
            key={exp.id}
            className="flex justify-between px-4 py-4 rounded-xl shadow-sm text-gray-800 bg-gray-50 text-sm font-medium"
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
            <div className="flex flex-col justify-around ">
              <button
                onClick={() => setEditingExperience(exp)}
                className="text-gray-800 hover:text-gray-600  transition"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDeleteExperience(exp.id)}
                className="text-red-500 hover:text-red-700"
                title="Delete experience"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <p className="text-gray-500 mt-4">No experience added yet.</p>
        )}
      </div>
      {editingExperience && (
        <EditExperienceModal
          experience={editingExperience}
          onSave={(updatedExp) => {
            setExperiences((prev) =>
              prev.map((exp) => (exp.id === updatedExp.id ? updatedExp : exp))
            );
            setEditingExperience(null);
          }}
          onClose={() => setEditingExperience(null)}
        />
      )}
    </div>
  );
};
export default AllExperiencesPage;
