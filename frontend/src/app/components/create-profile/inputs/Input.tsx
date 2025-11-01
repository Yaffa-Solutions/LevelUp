'use client';
import React from 'react';

interface InputProps {
  label: string;
  value: string;
  onChangeAction: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function Input({ label, value, onChangeAction, placeholder, required }: InputProps) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[13px] font-semibold text-[#5b5b5b]">
        {label}{required && <span className="ml-0.5 text-[#7c3aed]">*</span>}
      </div>
      <input
        className="w-full h-12 rounded-xl border border-[#e7e7e7] px-4 text-[15px] text-[#222] outline-none transition focus:border-[#c4b5fd] focus:ring-2 focus:ring-[#e9d5ff]"
        placeholder={placeholder}
        value={value}
        onChange={e => onChangeAction(e.target.value)}
      />
    </label>
  );
}
