import { useState } from 'react';
import CancelButton from './CancelButton';
import CloseButton from './CloseButton';
import SaveButton from './SaveButton';

type EditInfoModalProps = {
  firstName: string;
  lastName: string;
  jobTitle?: string;
  onClose: () => void;
  onSave: (data: {
    first_name: string;
    last_name: string;
    job_title?: string;
  }) => Promise<void>;
};

const EditInfoModal = ({
  firstName,
  lastName,
  jobTitle,
  onClose,
  onSave,
}: EditInfoModalProps) => {
  const [newFirstName, setNewFirstName] = useState(firstName);
  const [newLastName, setNewLastName] = useState(lastName);
  const [newJobTitle, setNewJobTitle] = useState(jobTitle);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    onSave({
      first_name: newFirstName,
      last_name: newLastName,
      job_title: newJobTitle,
    })
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
    <div
      className="fixed w-full inset-0 bg-black  flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl">
        <div className="relative flex ">
          <CloseButton onClick={onClose} />
          <h3 className="text-lg font-semibold text-gray-900">
            Edit Information
          </h3>
        </div>
        <div className="space-y-3">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First Name{' '}
            <input
              id="firstName"
              type="text"
              placeholder="First Name"
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
              className="w-full pl-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none  focus:ring-1 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 transition duration-200"
            />
          </label>

          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last Name
            <input
              type="text"
              placeholder="Last Name"
              value={newLastName}
              onChange={(e) => setNewLastName(e.target.value)}
              className="w-full pl-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none  focus:ring-1 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 transition duration-200"
            />
          </label>

          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Job Title
            <input
              type="text"
              placeholder="Job Title"
              value={newJobTitle || ''}
              onChange={(e) => setNewJobTitle(e.target.value)}
              className="w-full pl-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none  focus:ring-1 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 transition duration-200"
            />
          </label>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          {/* <CancelButton onClick={onClose} /> */}

          <SaveButton onClick={handleSave} disabled={loading} />
        </div>{' '}
      </div>
    </div>
  );
};

export default EditInfoModal;
