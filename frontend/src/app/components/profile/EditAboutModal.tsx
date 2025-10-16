import React, { useState } from 'react';
import CloseButton from './CloseButton';
import SaveButton from './SaveButton';

type EditAboutModalProps = {
  about: string;
  onClose: () => void;
  onSave: (newAbout: string) => Promise<void>;
};

const EditAboutModal = ({ about, onClose, onSave }: EditAboutModalProps) => {
  const [newAbout, setNewAbout] = useState(about);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    onSave(newAbout)
      .then(() => {
        onClose();
        setLoading(false);
      })
      .catch((error) => {
        console.error('error during save', error);
        setLoading(false);
      });
  };
  return (
    <>
      <div
        className="fixed w-full inset-0 bg-black  flex items-center justify-center z-50"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      >
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl">
          <div className="relative flex  ">
            <CloseButton onClick={onClose} />
            <h3 className="text-lg font-semibold text-gray-900">Edit About</h3>
          </div>
          <hr />

          <p className="text-gray-600 text-sm mb-3">
            Write a brief summary about your professional background, years of
            experience, the industry you work in, and your key skills.
          </p>

          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            rows={5}
            value={newAbout}
            onChange={(e) => setNewAbout(e.target.value)}
          />

            <SaveButton onClick={handleSave} disabled={loading}  />
        </div>
      </div>
    </>
  );
};

export default EditAboutModal;
