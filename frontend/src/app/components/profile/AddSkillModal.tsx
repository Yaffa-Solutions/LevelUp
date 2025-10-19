import { useState } from 'react';
import CloseButton from './CloseButton';
import SaveButton from './SaveButton';
import toast from 'react-hot-toast';

type AddSkillModalProps = {
  onClose: () => void;
  onSave: (skillName: string) => Promise<void>;
};

const AddSkillModal = ({ onClose, onSave }: AddSkillModalProps) => {
  const [skillName, setSkillName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!skillName.trim()) {
      toast.error('Please enter a skill name');
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      await onSave(skillName);
      setSkillName('');
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'You already have this skill.');
      } else {
        toast.error('Error adding skill');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl relative">
        <div className="relative flex  mb-4">
          <CloseButton onClick={onClose} />
          <h3 className="text-lg font-semibold text-gray-900">Add New Skill</h3>
        </div>
          <input
            id="skillName"
            type="text"
            placeholder="skill Name"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            className="w-full pl-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none  focus:ring-1 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 transition duration-200"
          />
          <SaveButton
            onClick={handleSave}
            disabled={loading}
            loading={loading}
            text="Add"
            loadingText="Adding..."
          />
      </div>
    </div>
  );
};

export default AddSkillModal;
