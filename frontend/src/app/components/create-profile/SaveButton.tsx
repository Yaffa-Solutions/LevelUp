type SaveButtonProps = {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  text?: string;
  loadingText?: string;
};

const SaveButton = ({
  onClick,
  className,
  disabled,
  loading = false,
  text = 'Save Change',
  loadingText = 'Saving...',
}: SaveButtonProps) => {
  return (
    <div className={`flex justify-end mt-4 ${className}`}>
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`px-4 py-2 bg-gradient-to-r from-[#9333EA] to-[#2563EB] text-white rounded-full hover:bg-blue-700 transition ${className}`}
      >
        {disabled ? loadingText : text}
      </button>
    </div>
  );
};

export default SaveButton;
