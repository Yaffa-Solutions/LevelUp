'use client';
import React, { ReactNode } from 'react';
interface SelectProps {
   value: number | string;
   onChangeAction:(v:string)=>void;
   disabled?: boolean;
   children: ReactNode;
   className?: string;
}
export default function Select({ value, onChangeAction, disabled, children, className = '' }: SelectProps) {
  return (
    <select
      className={`appearance-none ${className}`}
      value={value}
      onChange={e => onChangeAction(e.target.value)}
      disabled={disabled}
    >
      {children}
    </select>
  );
}
