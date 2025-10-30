'use client';

import EditButton from './EditButton';
import React, { useState } from 'react';
import EditAboutModal from './EditAboutModal';
import { toast } from 'react-hot-toast';

type CompanyDescriptionProps = {
  companyDescription?: string;
  userId: string;
  onUpdate: (newDescription: string) => void;
  isEditMode?: boolean;
};

const CompanyDescriptionSection = ({
  companyDescription,
  userId,
  onUpdate,
  isEditMode = false,
}: CompanyDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (newDescription: string): Promise<void> => {
    return fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${userId}/company-description`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_description: newDescription }),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update company description');
        return res.json();
      })
      .then((updatedUser) => {
        onUpdate(updatedUser.company_description);
        toast.success('Company description updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating company description:', error);
        toast.error('Oops! Could not save your changes.');
      });
  };

  return (
    <div className="relative p-6 mt-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Company Description
        </h2>
        {isEditMode && <EditButton onClick={() => setIsEditing(true)} />}
      </div>

      <p className="text-gray-900 min-h-[48px]">
        {companyDescription || 'No company description added yet.'}
      </p>

      {isEditing && isEditMode && (
        <EditAboutModal
          title='Edit Company Description'
          description='Describe your company mission, vision, and what makes it unique'
          initialValue={companyDescription || ''}
          onSave={handleSave}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default CompanyDescriptionSection;
