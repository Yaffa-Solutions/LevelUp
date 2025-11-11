import React, { useState } from 'react';
import CloseButton from './CloseButton';
import SaveButton from './SaveButton';

type EditAboutModalProps = {
  title: string;
  description: string;
  initialValue: string;
  onClose: () => void;
  onSave: (newAbout: string) => Promise<void>;
};

const EditAboutModal = ({
  title,
  description,
  initialValue,
  onClose,
  onSave,
}: EditAboutModalProps) => {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    onSave(value)
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
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <hr />

          <p className="text-gray-600 text-sm mb-3">{description}</p>

          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            rows={5}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <SaveButton onClick={handleSave} disabled={loading} />
        </div>
      </div>
    </>
  );
};

export default EditAboutModal;
