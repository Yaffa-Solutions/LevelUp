import React, { useState, useEffect, type ReactNode } from 'react';

type MonthYear = { month: number; year: number; label: string };

type ExperienceItem = {
  company: string;
  position: string;
  description?: string;
  careerBreak?: boolean;
  start?: MonthYear;
  end?: MonthYear | null;
  employmentType?: string;
};
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const YEARS = Array.from(
  { length: 60 },
  (_, i) => new Date().getFullYear() - i
);
const makeMonthYear = (m: number, y: number): MonthYear => ({
  month: m,
  year: y,
  label: `${MONTHS[m - 1]} ${y}`,
});
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
function Input(props: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const { label, placeholder, value, onChange, required } = props;
  return (
    <label className="block">
      <div className="mb-1.5 text-[13px] font-semibold text-[#5b5b5b]">
        {label}
        {required && <span className="ml-0.5 text-[#7c3aed]">*</span>}
      </div>
      <input
        className="w-full h-12 rounded-xl border border-[#e7e7e7] px-4 text-[15px] text-[#222] outline-none transition focus:border-[#c4b5fd] focus:ring-2 focus:ring-[#e9d5ff]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
function TextArea(props: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const { label, placeholder, value, onChange, required } = props;
  return (
    <label className="block">
      <div className="mb-1.5 text-[13px] font-semibold text-[#5b5b5b]">
        {label}
        {required && <span className="ml-0.5 text-[#7c3aed]">*</span>}
      </div>
      <textarea
        className="w-full rounded-xl border border-[#e7e7e7] px-4 py-3 text-[15px] text-[#222] outline-none transition focus:border-[#c4b5fd] focus:ring-2 focus:ring-[#e9d5ff]"
        placeholder={placeholder}
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
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
  const [description, setDescription] = useState(
    defaultValue?.description ?? ''
  );
  const [careerBreak, setCareerBreak] = useState(!!defaultValue?.careerBreak);
  const [startMonth, setStartMonth] = useState<number>(
    defaultValue?.start?.month ?? 1
  );
  const [startYear, setStartYear] = useState<number>(
    defaultValue?.start?.year ?? new Date().getFullYear()
  );
  const [endMonth, setEndMonth] = useState<number>(
    defaultValue?.end?.month ?? 1
  );
  const [endYear, setEndYear] = useState<number>(
    defaultValue?.end?.year ?? new Date().getFullYear()
  );
  const [noEndDate, setNoEndDate] = useState<boolean>(
    defaultValue?.end == null
  );
  const [employmentType, setEmploymentType] = useState(
    defaultValue?.employmentType ?? 'Full Time'
  );

  useEffect(() => {
    if (!open) return;
    setCompany(defaultValue?.company ?? '');
    setPosition(defaultValue?.position ?? '');
    setDescription(defaultValue?.description ?? '');
    setCareerBreak(!!defaultValue?.careerBreak);
    setStartMonth(defaultValue?.start?.month ?? 1);
    setStartYear(defaultValue?.start?.year ?? new Date().getFullYear());
    setEndMonth(defaultValue?.end?.month ?? 1);
    setEndYear(defaultValue?.end?.year ?? new Date().getFullYear());
    setNoEndDate(defaultValue?.end == null);
    setEmploymentType(defaultValue?.employmentType ?? 'Full Time');
  }, [open, defaultValue]);

  const startObj = makeMonthYear(startMonth, startYear);
  const endObj = noEndDate ? null : makeMonthYear(endMonth, endYear);

  const handleSave = () =>
    onSave({
      company,
      position,
      description,
      careerBreak,
      start: startObj,
      end: endObj,
      employmentType,
    });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-[min(760px,92vw)] max-w-[760px] rounded-[24px] bg-white p-7 shadow-xl">
        <h2 className="mb-5 text-[20px] font-[800] text-[#1f1f1f]">
          Add Experiences
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Company Name"
            placeholder="e.g. Tech Corp"
            value={company}
            onChange={setCompany}
          />
          <Input
            label="Position"
            placeholder="e.g. Software Engineer"
            value={position}
            onChange={setPosition}
          />
        </div>

        <div className="mt-3">
          <TextArea
            label="Description"
            placeholder="e.g. I led a team to develop a new mobile app feature..."
            value={description}
            onChange={setDescription}
          />
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
              <div className="mb-2 text-[13px] font-medium text-gray-700">
                Start Date
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Select
                  value={startMonth}
                  onChange={(v) => setStartMonth(Number(v))}
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-[15px] shadow-sm focus:border-gray-900 focus:ring-4 focus:ring-gray-200"
                >
                  <option value="" disabled>
                    Month
                  </option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </Select>

                <Select
                  value={startYear}
                  onChange={(v) => setStartYear(Number(v))}
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-[15px] shadow-sm focus:border-gray-900 focus:ring-4 focus:ring-gray-200"
                >
                  <option value="" disabled>
                    Year
                  </option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* End Date */}
            <div>
              <div className="mb-2 text-[13px] font-medium text-gray-700">
                End Date
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Select
                  value={noEndDate ? '' : endMonth}
                  onChange={(v) => setEndMonth(Number(v))}
                  disabled={noEndDate}
                  className="h-12 w-full rounded-xl border px-4 text-[15px] shadow-sm bg-white border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>
                    Month
                  </option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </Select>

                <Select
                  value={noEndDate ? '' : endYear}
                  onChange={(v) => setEndYear(Number(v))}
                  disabled={noEndDate}
                  className="h-12 w-full rounded-xl border px-4 text-[15px] shadow-sm bg-white border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>
                    Year
                  </option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 text-[13px] font-medium text-gray-700">
            Employment type
          </div>
          <div className="relative">
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="appearance-none h-12 w-full rounded-xl border border-[#e7e7e7] bg-white px-4 text-[15px] text-[#222] outline-none transition focus:border-[#c4b5fd] focus:ring-2 focus:ring-[#e9d5ff]"
            >
              <option value="" disabled hidden>
                Please Select
              </option>
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
          <button
            onClick={onClose}
            className="rounded-xl bg-gray-100 px-5 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-full bg-gradient-to-r from-[#9333EA] to-[#2563EB] px-6 py-2 text-[13px] font-[800] text-white shadow"
          >
            {defaultValue ? 'Update' : 'Add'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          title="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default ExperiencePopup;