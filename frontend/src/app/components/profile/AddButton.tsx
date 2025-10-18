import { Plus } from 'lucide-react';
import type { MouseEventHandler } from 'react';

type AddButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

const AddButton = ({ onClick, className }: AddButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`absolute top-3 right-13 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full transition ${className}`}
    >
      <Plus size={18} />
    </button>
  );
};

export default AddButton;
