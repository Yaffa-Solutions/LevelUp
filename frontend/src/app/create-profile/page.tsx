'use client';
import React, { useState } from 'react';
import Input from '../components/create-profile/inputs/Input';
import TextArea from '../components/create-profile/inputs/TextArea';
// import Select from '../components/create-profile/inputs/Select';
import AddExperienceModal from '../components/create-profile/AddExperienceModal';
import AddSkillPopup from '../components/create-profile/AddSkillPopup';
// import AddSkillMoadl from '../components/create-profile/AddSkillMoadl';
import IconBtn from '../components/create-profile/common/IconBtn';
import LabelRequired from '../components/create-profile/common/LabelRequired';
// import CloseButton from '../components/create-profile/CloseButton';
// import SaveButton from '../components/create-profile/AddButton'
// import AddButton from '../components/create-profile/AddButton';
import { toast } from 'react-hot-toast';

import Image from "next/image";
// import AddSkillModal from '../components/create-profile/AddSkillMoadl';

type Role = 'talent' | 'hunter' | 'both';

interface ParsedResumeData {
  data:{
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    company?: string;
    about?: string;
    skills?: string[];
    experiences?: ExperienceItem[];
  }
}
interface ExperienceItem {
  company: string;
  position: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  employmentType?: string;
  isCurrent?: boolean;
}

export default function CreateProfilePage() {
  // const [openExp, setOpenExp] = useState(false);
   const [role, setRole] = useState<Role>('talent'); 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [about, setAbout]         = useState('');
  const [jobTitle, setJobTitle]   = useState('');
  const [company, setCompany]     = useState('');
  const [companyDesc, setCompanyDesc] = useState('');
  const [skills, setSkills]       = useState<string[]>([]);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([
  ]);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const onPickAvatar = () => document.getElementById('avatar-input')?.click();
  const onAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    const url = URL.createObjectURL(f);
    setAvatarUrl(url);
  };

  const [openExp, setOpenExp] = useState(false);
  const [editIdx, setEditIdx] = useState<number | undefined>(undefined);
  const [openSkill, setOpenSkill] = useState(false);

  const startEditExp = (idx: number) => {
    setEditIdx(idx);
    setOpenExp(true);
  };
  const onSaveExp = (item: ExperienceItem, index?: number) => {
    setExperiences(prev =>
      typeof index === 'number' ? prev.map((x, i) => (i === index ? item : x)) : [item, ...prev]
    );
    setOpenExp(false);
    setEditIdx(undefined);
  };

  const removeSkill = (s: string) => setSkills(prev => prev.filter(x => x !== s));

const onSaveForm = async () => {
  try {
    setParsing(true); 

    let uploadedAvatarUrl = null;
    let parsedData: ParsedResumeData['data'] | null = null;

    if (avatarFile) {
      const avatarData = new FormData();
      avatarData.append("profilePicture", avatarFile);

      const avatarRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/upload-picture`, {
        method: "POST",
        body: avatarData,
      });

      if (!avatarRes.ok) throw new Error("failed upload picture");
      const avatarJson = await avatarRes.json();
      uploadedAvatarUrl = avatarJson.imageUrl; 
      toast.success("✅ upload picture done");
    }


    if (cvFile) {
      const formData = new FormData();
      formData.append("resume", cvFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/resume/upload-resume`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("falle resuming CV");
      const responseJson: ParsedResumeData = await res.json();
      parsedData = responseJson.data ;

      setFirstName(parsedData.firstName ?? '');
      setLastName(parsedData.lastName ?? '');
      setJobTitle(parsedData.jobTitle ?? '');
      setCompany(parsedData.company ?? '');
      setAbout(parsedData.about ?? '');
      setSkills(parsedData.skills ?? []);
      setExperiences(
       Array.isArray(parsedData.experiences)
         ? parsedData.experiences.map((exp: ExperienceItem) => ({
             company: exp.company || "",
             position: exp.position || "",
             description: exp.description || "",
             startDate: exp.startDate || "",
             endDate: exp.endDate || "",
             employmentType: exp.employmentType || "",
             isCurrent: exp.isCurrent ?? false,
           }))
         : []
     );


    }
    const payload = {
      role,
      firstName: parsedData?.firstName ?? firstName,
      lastName: parsedData?.lastName ?? lastName,
      about: parsedData?.about ?? about,
      jobTitle: parsedData?.jobTitle ?? jobTitle,
      company: parsedData?.company ?? company,
      companyDesc,
      skills: parsedData?.skills ?? skills,
      experiences: parsedData?.experiences ?? experiences,
      profilePicture: uploadedAvatarUrl,
    };


    toast.success("✅ outofilling");
    console.log("Saved profile:", payload);
  } catch (err) {
    console.error(err);
    toast.error("❌");
  } finally {
    setParsing(false); 
  }
};
  return(
    <div className="min-h-[100svh] bg-[#f6f7fb] py-10 relative">
      {parsing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            <span className="text-white font-semibold">Parsing resume...</span>
          </div>
        </div>
      )}
      <div className="mx-auto w-full max-w-3xl rounded-[28px] bg-white px-7 py-10 shadow-[0_6px_30px_rgba(16,24,40,.06)] ring-1 ring-black/5">
        <h1 className="text-center text-[22px] font-[800] text-[#1f1f1f] tracking-tight">Create Profile</h1>

        <div className="mt-6 flex justify-center">
          <div className="relative">
            <div className="grid h-[84px] w-[84px] place-items-center rounded-full bg-gray-200">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="avatar" className="h-[84px] w-[84px] rounded-full object-cover" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="h-10 w-10 fill-gray-400">
                  <path d="M480-520q-83 0-141.5-58.5T280-720q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720q0 83-58.5 141.5T480-520Zm0 80q118 0 219 54.5T858-280q-20 36-53.5 63T725-171q-93-39-245-39t-245 39q-46 19-79.5 46T102-280q40-90 141-145t237-55Z"/>
                </svg>
              )}
            </div>
            <button
              onClick={onPickAvatar}
              className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-gradient-to-r from-[#9333EA] to-[#2563EB] text-white shadow"
              title="Upload avatar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="h-4 w-4 fill-white">
                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
              </svg>
            </button>
            <input id="avatar-input" type="file" accept="image/*" hidden onChange={onAvatarChange}/>
          </div>
        </div>

        <div className="mt-7 flex justify-center gap-3">
          {(['talent','hunter','both'] as Role[]).map(r => {
            const active = role === r;
            return (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`rounded-full border px-7 py-2 text-[14px] font-semibold transition
                  ${active
                    ? 'border-transparent bg-white shadow-[0_2px_10px_rgba(99,102,241,.25)] ring-1 ring-[#7c3aed]'
                    : 'border-[#e5e7eb] text-[#111827] hover:bg-gray-50'}
                `}
              >
                {r === 'talent' ? 'Talent' : r === 'hunter' ? 'Hunter' : 'Both'}
              </button>
            );
          })}
        </div>

       {(role === 'talent' || role === 'both') && ( 
        <div className="mt-7 grid gap-6">
          <div className="space-y-2">
            
            <LabelRequired>Attach CV</LabelRequired>
            <div className="space-y-2">
             <div className="flex w-full items-center overflow-hidden rounded-full border border-gray-300">
               <label
                 htmlFor="cv-input"
                 className="cursor-pointer bg-gray-400 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-gray-500"
               >
                 Choose File
               </label>
               <div className="flex-1 px-4 py-2.5 text-[13px] text-gray-500">
                 {cvFile ? cvFile.name : 'No file chosen'}
               </div>
               <input
                 id="cv-input"
                 type="file"
                 className="hidden"
                 accept=".pdf,.doc,.docx"
                 onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
               />
             </div>

            <button
              onClick={onSaveForm}
              disabled={!cvFile || parsing}
              className="rounded-full bg-blue-600 px-5 py-2 text-[13px] font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {parsing ? "Parsing CV..." : "Upload & Parse"}
            </button>
          </div>
          </div>
          </div>
       )}
          

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="First Name" required placeholder="e.g. John" value={firstName} onChangeAction={ (value: string) =>setFirstName(value)}/>
            <Input label="Last Name" required placeholder="e.g. John" value={lastName} onChangeAction={(value: string) => setLastName(value)}/>
          </div>

          {(role === 'hunter' || role === 'both') && (
            <Input label="Job Title" required placeholder="e.g. Software Engineer" value={jobTitle} onChangeAction={(value: string) =>setJobTitle(value)}/>
          )}

          <TextArea label="About" required placeholder="Tell us a bit about yourself ..." value={about} onChangeAction={(value: string) =>setAbout(value)}/>

          {(role === 'talent' || role === 'both') && (
            <div className="w-full">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#5b5b5b]">Experiences</span>
                <button
                  className="flex items-center gap-1 rounded-full px-2 py-[2px] text-[13px] font-semibold text-[#7c3aed] hover:bg-purple-50"
                  onClick={() => setOpenExp(true)}
                >
                  <span className="text-[18px] leading-none">+</span> Add Experiences
                </button>
              </div>

              <div className="rounded-2xl border border-[#e7e7e7] p-4">
                {experiences.length === 0 ? (
                  <p className="text-sm text-gray-500">No experiences added yet.</p>
                ) : (
                  <div className="space-y-4">
                    {experiences.map((e, i) => (
                      <div key={i}>
                        <div className="flex items-start justify-between">
                          <div className="space-y-0.5">
                            <div className="text-[13px] font-[800] text-[#222]">{e.company}</div>
                            <div className="text-[12px] font-[600] text-[#6b7280]">{e.position}</div>
                            <div className="text-[11px] text-gray-400">
                              {e.startDate ? new Date(e.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                              {e.endDate ? new Date(e.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}

                              {e.employmentType ? <span className="block">{e.employmentType}</span> : null}
                            </div>
                            {e.description && <div className="pt-1 text-[12px] leading-5 text-[#5b5b5b]">{e.description}</div>}
                          </div>

                          <div className="flex gap-2">
                            <IconBtn title="Edit" onClick={() => startEditExp(i)}>
                              <svg viewBox="0 -960 960 960" className="h-4 w-4 fill-current"><path d="M200-200h56l365-365-56-56-365 365v56Zm-40 80v-168l424-424q12-12 28-18t32-6q16 0 32 6t28 18l56 56q12 12 18 28t6 32q0 16-6 32t-18 28L296-120H160Z"/></svg>
                            </IconBtn>
                            <IconBtn title="Delete" onClick={()=>setExperiences(prev=>prev.filter((_,idx)=>idx!==i))}>
                              <svg viewBox="0 -960 960 960" className="h-4 w-4 fill-current"><path d="M280-160q-33 0-56.5-23.5T200-240v-440h-40v-80h200v-40h240v40h200v80h-40v440q0 33-23.5 56.5T680-160H280Zm80-120h80v-320h-80v320Zm240 0h80v-320h-80v320Z"/></svg>
                            </IconBtn>
                          </div>
                        </div>
                        {i < experiences.length - 1 && <div className="mt-3 h-px w-full bg-gray-100" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {role !== 'hunter' && (
            <div className="w-full">
              <div className="mb-1.5 flex items-center justify-between">
                <LabelRequired>Skills</LabelRequired>
                <button
                  className="flex items-center gap-2 rounded-full px-2 py-[2px] text-[13px] font-semibold text-[#7c3aed] hover:bg-purple-50"
                  onClick={() => setOpenSkill(true)}
                >
                  <span className="text-[18px] leading-none">+</span> Add Skills
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 rounded-full bg-[#f3e8ff] px-3 py-[6px] text-[12px] font-semibold text-[#7c3aed]">
                    {s}
                    <button onClick={() => removeSkill(s)} title="Remove" className="ml-1 rounded-full bg-[#e9d5ff] px-1 text-[12px] leading-none">x</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {(role === 'hunter' || role === 'both') && (
            <>
              <Input label="Company" placeholder="Company" value={company} onChangeAction={setCompany}/>
              <TextArea label="Company Description" placeholder="Tell us a bit about yourself ..." value={companyDesc} onChangeAction={setCompanyDesc}/>
            </>
          )}
           <div className="mt-1 flex justify-end">
            <button
              // onClick={}
              className="rounded-full bg-gradient-to-r from-[#9333EA] to-[#2563EB] px-8 py-2.5 text-[14px] font-[800] text-white shadow"
            >
              Save
            </button>
          </div>
      <AddExperienceModal
       isOpen={openExp}
       onClose={() => setOpenExp(false)}
       onSave={(item) => onSaveExp(item, editIdx)}
      //  defaultValue={typeof editIdx === 'number' ? experiences[editIdx] : undefined}
     />


      <AddSkillPopup
        open={openSkill}
        onClose={() => setOpenSkill(false)}
        onAdd={(val) => {
          const v = val.trim();
          if (v && !skills.includes(v)) setSkills(prev => [...prev, v]);
          setOpenSkill(false);
        }}
        
      />
    </div>
    </div>
   

  )
}