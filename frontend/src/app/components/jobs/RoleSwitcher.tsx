// import React from 'react';

// type ActiveView = 'TALENT' | 'HUNTER';

// interface RoleSwitcherProps {
//   activeView: ActiveView;
//   onSwitch: (view: ActiveView) => void;
// }

// const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ activeView, onSwitch }) => {
//   return (
//     <div className="flex justify-start px-8 py-3 bg-white border-b border-gray-200 shadow-sm">
//       <button
//         onClick={() => onSwitch('TALENT')}
//         className={`px-4 py-2 font-medium ${
//           activeView === 'TALENT' 
//             ? 'border-b-2 border-purple-600 text-purple-600' 
//             : 'text-gray-500 hover:text-gray-900'
//         }`}
//       >
//         Jobs for you
//       </button>
//       <button
//         onClick={() => onSwitch('HUNTER')}
//         className={`px-4 py-2 font-medium ml-4 ${
//           activeView === 'HUNTER' 
//             ? 'border-b-2 border-purple-600 text-purple-600' 
//             : 'text-gray-500 hover:text-gray-900'
//         }`}
//       >
//         My Jobs
//       </button>
//     </div>
//   );
// };

// export default RoleSwitcher;

import React, { useState } from 'react';

type ActiveView = 'TALENT' | 'HUNTER';

interface RoleSwitcherProps {
  activeView: ActiveView;
  onSwitch: (view: ActiveView) => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ activeView, onSwitch }) => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  const handleSelect = (view: ActiveView) => {
    onSwitch(view);
    setOpen(false);
  };

  return (
    <div className="relative text-xl font-bold px-8 py-3 ml-20">
      <button
        onClick={toggleMenu}
        className="flex items-center gap-1 font-medium text-gray-800 focus:outline-none"
      >
        {activeView === 'TALENT' ? 'Jobs for you' : 'My Jobs'}
        <span className="text-sm">▾</span>
      </button>

      {open && (
        <div className="absolute left-8 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md z-10">
          <button
            onClick={() => handleSelect('TALENT')}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
              activeView === 'TALENT' ? 'text-purple-600 font-semibold' : ''
            }`}
          >
            Jobs for you
          </button>
          <button
            onClick={() => handleSelect('HUNTER')}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
              activeView === 'HUNTER' ? 'text-purple-600 font-semibold' : ''
            }`}
          >
            My Jobs
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;
