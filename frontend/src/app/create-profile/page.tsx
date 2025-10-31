'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import Image from "next/image";

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

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const YEARS = Array.from({ length: 60 }, (_, i) => new Date().getFullYear() - i);

export default function CreateProfilePage() {
  const [role, setRole] = useState<Role>('hunter'); 
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


      // toast.success("📄 resuming cv successfully");
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


  return (
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="First Name" required placeholder="e.g. John" value={firstName} onChange={ (value: string) =>setFirstName(value)}/>
            <Input label="Last Name" required placeholder="e.g. John" value={lastName} onChange={(value: string) => setLastName(value)}/>
          </div>

          {(role === 'hunter' || role === 'both') && (
            <Input label="Job Title" required placeholder="e.g. Software Engineer" value={jobTitle} onChange={(value: string) =>setJobTitle(value)}/>
          )}

          <TextArea label="About" required placeholder="Tell us a bit about yourself ..." value={about} onChange={(value: string) =>setAbout(value)}/>

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
                              {/* {e.startDate?.label} {e.endDate?.label ? `- ${e.end?.label}` : ''}{' '} */}
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
              <Input label="Company" placeholder="Company" value={company} onChange={setCompany}/>
              <TextArea label="Company Description" placeholder="Tell us a bit about yourself ..." value={companyDesc} onChange={setCompanyDesc}/>
            </>
          )}

          <div className="mt-1 flex justify-center">
            <button
              // onClick={}
              className="rounded-full bg-gradient-to-r from-[#7D4CFF] to-[#0EA5E9] px-8 py-2.5 text-[14px] font-[800] text-white shadow"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <ExperiencePopup
        open={openExp}
        onClose={() => { setOpenExp(false); setEditIdx(undefined); }}
        onSave={(item) => onSaveExp(item, editIdx)}
        defaultValue={typeof editIdx === 'number' ? experiences[editIdx] : undefined}
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
  );
}

function LabelRequired({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[13px] font-semibold text-[#5b5b5b]">
      {children}<span className="ml-0.5 text-[#7c3aed]">*</span>
    </div>
  );
}

function Input(props: { label: string; placeholder?: string; value: string; onChange: (v: string)=>void; required?: boolean }) {
  const { label, placeholder, value, onChange, required } = props;
  return (
    <label className="block">
      <div className="mb-1.5 text-[13px] font-semibold text-[#5b5b5b]">
        {label}{required && <span className="ml-0.5 text-[#7c3aed]">*</span>}
      </div>
      <input
        className="w-full h-12 rounded-xl border border-[#e7e7e7] px-4 text-[15px] text-[#222] outline-none transition focus:border-[#c4b5fd] focus:ring-2 focus:ring-[#e9d5ff]"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </label>
  );
}

function TextArea(props: { label: string; placeholder?: string; value: string; onChange: (v: string)=>void; required?: boolean }) {
  const { label, placeholder, value, onChange, required } = props;
  return (
    <label className="block">
      <div className="mb-1.5 text-[13px] font-semibold text-[#5b5b5b]">
        {label}{required && <span className="ml-0.5 text-[#7c3aed]">*</span>}
      </div>
      <textarea
        className="w-full rounded-xl border border-[#e7e7e7] px-4 py-3 text-[15px] text-[#222] outline-none transition focus:border-[#c4b5fd] focus:ring-2 focus:ring-[#e9d5ff]"
        placeholder={placeholder}
        rows={4}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </label>
  );
}

function IconBtn({ children, title, onClick }: { children: React.ReactNode; title?: string; onClick?: () => void }) {
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

function ExperiencePopup(props: {
  open: boolean;
  onClose: () => void;
  onSave: (item: ExperienceItem) => void;
  defaultValue?: ExperienceItem;
}) {
const { open, onClose, onSave, defaultValue } = props;
const [company, setCompany] = useState(defaultValue?.company ?? '');
const [position, setPosition] = useState(defaultValue?.position ?? '');
const [description, setDescription] = useState(defaultValue?.description ?? '');
const [isCurrent, setIsCurrent] = useState(!!defaultValue?.isCurrent);

const [startMonth, setStartMonth] = useState<number>(
  defaultValue?.startDate ? new Date(defaultValue.startDate).getMonth() + 1 : 1
);
const [startYear, setStartYear] = useState<number>(
  defaultValue?.startDate ? new Date(defaultValue.startDate).getFullYear() : new Date().getFullYear()
);

const [endMonth, setEndMonth] = useState<number>(
  defaultValue?.endDate ? new Date(defaultValue.endDate).getMonth() + 1 : 1
);
const [endYear, setEndYear] = useState<number>(
  defaultValue?.endDate ? new Date(defaultValue.endDate).getFullYear() : new Date().getFullYear()
);


const [noEndDate, setNoEndDate] = useState<boolean>(!!defaultValue?.isCurrent);

const [employmentType, setEmploymentType] = useState(defaultValue?.employmentType ?? 'Full Time');

useEffect(() => {
  if (!open) return;

  setCompany(defaultValue?.company ?? '');
  setPosition(defaultValue?.position ?? '');
  setDescription(defaultValue?.description ?? '');
  setIsCurrent(!!defaultValue?.isCurrent);
  setStartMonth(defaultValue?.startDate ? new Date(defaultValue.startDate).getMonth() + 1 : 1);
  setStartYear(defaultValue?.startDate ? new Date(defaultValue.startDate).getFullYear() : new Date().getFullYear());
  setEndMonth(defaultValue?.endDate ? new Date(defaultValue.endDate).getMonth() + 1 : 1);
  setEndYear(defaultValue?.endDate ? new Date(defaultValue.endDate).getFullYear() : new Date().getFullYear());
  setNoEndDate(!!defaultValue?.isCurrent);
  setEmploymentType(defaultValue?.employmentType ?? 'Full Time');
}, [open, defaultValue]);

const startDate = `${startYear}-${String(startMonth).padStart(2, '0')}-01`;
const endDate = noEndDate ? undefined : `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

const handleSave = () =>
  onSave({ company, position, description, isCurrent, startDate, endDate, employmentType });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[min(760px,92vw)] max-w-[760px] rounded-[24px] bg-white p-7 shadow-xl">
        <h2 className="mb-5 text-[20px] font-[800] text-[#1f1f1f]">Add Experiences</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Company Name" placeholder="e.g. Tech Corp" value={company} onChange={setCompany}/>
          <Input label="Position" placeholder="e.g. Software Engineer" value={position} onChange={setPosition}/>
        </div>

        <div className="mt-3">
          <TextArea label="Description" placeholder="e.g. I led a team to develop a new mobile app feature..." value={description} onChange={setDescription}/>
        </div>

        <div className="mt-5 space-y-4">
          <label className="flex items-center gap-2 text-[14px] text-gray-800">
            <input
              type="checkbox"
              className="h-5 w-5 accent-black"
              checked={noEndDate}
              onChange={(e) => setNoEndDate(e.target.checked)}
            />
            I am currently on this career break
          </label>

          <div className="grid gap-6">
            <div>
              <div className="mb-2 text-[13px] font-medium text-gray-700">Start Date</div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Select
                  value={startMonth}
                  onChange={(v) => setStartMonth(Number(v))}
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-[15px] shadow-sm focus:border-gray-900 focus:ring-4 focus:ring-gray-200"
                >
                  <option value="" disabled>Month</option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </Select>

                <Select
                  value={startYear}
                  onChange={(v) => setStartYear(Number(v))}
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-[15px] shadow-sm focus:border-gray-900 focus:ring-4 focus:ring-gray-200"
                >
                  <option value="" disabled>Year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <div className="mb-2 text-[13px] font-medium text-gray-700">End Date</div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Select
                  value={noEndDate ? '' : endMonth}
                  onChange={(v) => setEndMonth(Number(v))}
                  disabled={noEndDate}
                  className="h-12 w-full rounded-xl border px-4 text-[15px] shadow-sm bg-white border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Month</option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </Select>

                <Select
                  value={noEndDate ? '' : endYear}
                  onChange={(v) => setEndYear(Number(v))}
                  disabled={noEndDate}
                  className="h-12 w-full rounded-xl border px-4 text-[15px] shadow-sm bg-white border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 text-[13px] font-medium text-gray-700">Employment type</div>
          <div className="relative">
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="appearance-none h-12 w-full rounded-xl border border-[#e7e7e7] bg-white px-4 text-[15px] text-[#222] outline-none transition focus:border-[#c4b5fd] focus:ring-2 focus:ring-[#e9d5ff]"
            >
              <option value="" disabled hidden>Please Select</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Freelance">Freelance</option>
              <option value="Self Employed">Self Employed</option>
              <option value="Internship">Internship</option>
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-end gap-3">
          <button onClick={onClose} className="rounded-xl bg-gray-100 px-5 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-200">Cancel</button>
          <button onClick={handleSave} className="rounded-full bg-gradient-to-r from-[#9333EA] to-[#2563EB] px-6 py-2 text-[13px] font-[800] text-white shadow">
            {defaultValue ? 'Update' : 'Add'}
          </button>
        </div>

        <button onClick={onClose} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200" title="Close">×</button>
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  disabled,
  children,
  className = '',
}:{
  value: number | string;
  onChange:(v:string)=>void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <select
      className={`appearance-none ${className}`}
      value={value}
      onChange={(e)=>onChange(e.target.value)}
      disabled={disabled}
    >
      {children}
    </select>
  );
}

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
