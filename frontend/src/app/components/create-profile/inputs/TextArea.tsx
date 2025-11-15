'use client';
import React from 'react';
interface textareaProps {
  label: string;
  value: string;
  onChangeAction: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function TextArea({ label, value, onChangeAction, placeholder, required }: textareaProps) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[13px] font-semibold text-[#5b5b5b]">
        {label}{required && <span className="ml-0.5 text-[#7c3aed]">*</span>}
      </div>
      <textarea
        className="w-full rounded-xl border border-[#e7e7e7] px-4 py-3 text-[15px] text-[#222] outline-none transition focus:border-[#c4b5fd] focus:ring-2 focus:ring-[#e9d5ff]"
        rows={4}
        placeholder={placeholder}
        value={value}
        onChange={e => onChangeAction(e.target.value)}
      />
    </label>
  );
}
