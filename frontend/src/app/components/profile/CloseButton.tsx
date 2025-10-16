import { X } from 'lucide-react';

type CloseButtonProps = {
  onClick: () => void;
  className?: string;
};

const CloseButton = ({ onClick, className }: CloseButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`absolute right-1 text-gray-500 hover:text-red-600 transition ${className}`}
      aria-label="Close"
    >
      <X size={18} />
    </button>
  );
};

export default CloseButton;
