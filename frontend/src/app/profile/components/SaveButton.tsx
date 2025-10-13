
type SaveButtonProps = {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  text?: string;
  loadingText?: string;
};

const SaveButton = ({ onClick, className , disabled, text='Save Change', loadingText='Saving...'}: SaveButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-gradient-to-r from-[#9333EA] to-[#2563EB] text-white rounded-full hover:bg-blue-700 transition ${className}`}
    >
      {disabled ? loadingText : text}
    </button>
  );
};

export default SaveButton;
