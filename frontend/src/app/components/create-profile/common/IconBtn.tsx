'use client';
import React, { ReactNode } from 'react';

interface iconbtn{
     children: ReactNode; 
     title?: string; 
     onClick?: () => void 
}

export default function IconBtn({ children, title, onClick }: iconbtn) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
    >
      {children}
    </button>
  );
}