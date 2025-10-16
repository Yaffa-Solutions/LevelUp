import React from 'react';

type ActiveView = 'TALENT' | 'HUNTER';

interface RoleSwitcherProps {
  activeView: ActiveView;
  onSwitch: (view: ActiveView) => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ activeView, onSwitch }) => {
  return (
    <div className="flex justify-start px-8 py-3 bg-white border-b border-gray-200 shadow-sm">
      <button
        onClick={() => onSwitch('TALENT')}
        className={`px-4 py-2 font-medium ${
          activeView === 'TALENT' 
            ? 'border-b-2 border-purple-600 text-purple-600' 
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        Jobs for you
      </button>
      <button
        onClick={() => onSwitch('HUNTER')}
        className={`px-4 py-2 font-medium ml-4 ${
          activeView === 'HUNTER' 
            ? 'border-b-2 border-purple-600 text-purple-600' 
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        My Jobs
      </button>
    </div>
  );
};

export default RoleSwitcher;