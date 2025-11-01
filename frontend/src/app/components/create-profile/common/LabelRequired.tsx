'use client';
import React, { ReactNode } from 'react';
interface label{
  children: ReactNode;
}
export default function LabelRequired({ children }: label) {
  return (
    <div className="text-[13px] font-semibold text-[#5b5b5b]">
      {children}<span className="ml-0.5 text-[#7c3aed]">*</span>
    </div>
  );
}
