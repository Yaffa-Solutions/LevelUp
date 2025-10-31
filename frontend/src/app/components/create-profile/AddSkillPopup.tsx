import React, { useState, useEffect } from 'react';


function AddSkillPopup({
  open, onClose, onAdd,
}: { open: boolean; onClose: ()=>void; onAdd: (skill: string)=>void }) {
  const [val, setVal] = useState('');

  useEffect(()=>{ if(open) setVal(''); }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative z-10 w-[min(480px,92vw)] rounded-[18px] bg-white p-5 shadow-xl">
        <h3 className="mb-3 text-[16px] font-[800] text-[#1f1f1f]">Add New Skills</h3>

        <div className="flex items-center gap-3">
          <div className="w-full rounded-[14px] p-[1px] [background:linear-gradient(90deg,#7D4CFF,#0EA5E9)]">
            <input
              className="w-full rounded-[13px] border-0 bg-white px-4 py-2.5 text-[15px] text-[#222] outline-none"
              placeholder=""
              value={val}
              onChange={(e)=>setVal(e.target.value)}
              onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); onAdd(val); } }}
            />
          </div>
          <button
            onClick={()=>onAdd(val)}
            className="rounded-full bg-gradient-to-r from-[#7D4CFF] to-[#0EA5E9] px-5 py-2 text-[13px] font-[800] text-white shadow"
          >
            Add
          </button>
        </div>

        <button onClick={onClose} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200" title="Close">×</button>
      </div>
    </div>
  );
}

export default AddSkillPopup;
