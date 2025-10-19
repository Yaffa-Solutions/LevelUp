import { Pencil } from "lucide-react";
import type { MouseEventHandler } from 'react';

type EditButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
};
const EditButton = ({ onClick, className }: EditButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`absolute top-3 right-3 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full transition ${className}`}
    >
      <Pencil size={18} />
    </button>
  );
}
export default EditButton;
