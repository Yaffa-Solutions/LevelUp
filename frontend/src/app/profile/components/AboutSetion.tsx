'use client';

import EditButton from './EditButton';
import React, { useState } from 'react';
import EditAboutModal from './EditAboutModal';
import { toast } from 'react-hot-toast';


type AboutProps = {
  about?: string;
  userId: string;
  onUpdate: (newAbout: string) => void;
};

const AboutSection = ({ about,userId, onUpdate }: AboutProps) => {
  const [isEditing, setIsEditing] = useState(false);

 const handleSave = (newAbout: string): Promise<void> => {
   return fetch(`http://localhost:4000/api/talent/${userId}/about`, {
     method: 'PATCH',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ about: newAbout }),
   })
     .then((res) => {
       if (!res.ok) throw new Error('Failed to update about');
       return res.json();
     })
     .then((updatedUser) => {
       onUpdate(updatedUser.about);
       toast.success(' Your About updated successfully!');
     })
     .catch((error) => {
       console.error('Error updating your about:', error);
       toast.error('Oops! Could not save your changes.');
     });
 };
  return (
    <div className="relative p-6  mt-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">About</h2>
        <EditButton onClick={() => setIsEditing(true)} />
      </div>
      <p className="text-gray-900 min-h-[48px]">
        {about || 'No bio added yet.'}
      </p>

      {isEditing && (
        <EditAboutModal
          about={about || ''}
          onSave={handleSave}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};
export default AboutSection;
