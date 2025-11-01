'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface ExperienceItem {
  company: string
  position: string
  description: string
  employmentType: string
  startDate: string
  endDate?: string
  isCurrent?: boolean
}

interface AddExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: ExperienceItem) => void
  defaultValue?: ExperienceItem
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const YEARS = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i)

const AddExperienceModal: React.FC<AddExperienceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultValue,
}) => {
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [description, setDescription] = useState('')
  const [employmentType, setEmploymentType] = useState('')
  const [noEndDate, setNoEndDate] = useState(false)
  const [startMonth, setStartMonth] = useState<number>(1)
  const [startYear, setStartYear] = useState<number>(new Date().getFullYear())
  const [endMonth, setEndMonth] = useState<number>(1)
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear())

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setCompany(defaultValue?.company ?? '')
    setPosition(defaultValue?.position ?? '')
    setDescription(defaultValue?.description ?? '')
    setEmploymentType(defaultValue?.employmentType ?? 'Full Time')
    setNoEndDate(!!defaultValue?.isCurrent)
    setStartMonth(defaultValue?.startDate ? new Date(defaultValue.startDate).getMonth() + 1 : 1)
    setStartYear(defaultValue?.startDate ? new Date(defaultValue.startDate).getFullYear() : new Date().getFullYear())
    setEndMonth(defaultValue?.endDate ? new Date(defaultValue.endDate).getMonth() + 1 : 1)
    setEndYear(defaultValue?.endDate ? new Date(defaultValue.endDate).getFullYear() : new Date().getFullYear())
  }, [isOpen, defaultValue])

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!company.trim()) newErrors.company = 'Company name is required'
    if (!position.trim()) newErrors.position = 'Position is required'
    if (!description.trim()) newErrors.description = 'Description is required'
    if (!startMonth || !startYear) newErrors.startDate = 'Start date is required'
    if (!noEndDate && (!endMonth || !endYear)) newErrors.endDate = 'End date is required'
    return newErrors
  }

  const handleSubmit = async () => {
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fill all required fields')
      return
    }

    const startDate = `${startYear}-${String(startMonth).padStart(2, '0')}-01`
    const endDate = noEndDate ? undefined : `${endYear}-${String(endMonth).padStart(2, '0')}-01`

    setLoading(true)
    try {
      const payload: ExperienceItem = {
        company,
        position,
        description,
        employmentType,
        startDate,
        endDate,
        isCurrent: noEndDate,
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/experiences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to save experience')

      toast.success(defaultValue ? 'Experience updated!' : 'Experience added!')
      onSave(payload)
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Error saving experience')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[min(760px,92vw)] max-w-[760px] rounded-[24px] bg-white p-7 shadow-xl animate-fade-in">
        <h2 className="mb-5 text-[20px] font-[800] text-[#1f1f1f]">Add Experience</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={`w-full rounded-xl border px-4 py-2 text-[15px] ${errors.company ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-400`}
              placeholder="e.g. Tech Corp"
            />
            {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Position</label>
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className={`w-full rounded-xl border px-4 py-2 text-[15px] ${errors.position ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-400`}
              placeholder="e.g. Software Engineer"
            />
            {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
          </div>
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full rounded-xl border px-4 py-2 text-[15px] h-24 ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-400`}
            placeholder="Describe your role and impact..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="mt-5">
          <label className="flex items-center gap-2 text-[14px] text-gray-800">
            <input
              type="checkbox"
              className="h-5 w-5 accent-indigo-600"
              checked={noEndDate}
              onChange={(e) => setNoEndDate(e.target.checked)}
            />
            I am currently working here
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-[13px] font-medium text-gray-700 mb-1">Start Date</div>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={startMonth}
                onChange={(e) => setStartMonth(Number(e.target.value))}
                className="rounded-xl border px-3 py-2 text-[14px]"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
              <select
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
                className="rounded-xl border px-3 py-2 text-[14px]"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
          </div>

          <div>
            <div className="text-[13px] font-medium text-gray-700 mb-1">End Date</div>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={noEndDate ? '' : endMonth}
                onChange={(e) => setEndMonth(Number(e.target.value))}
                disabled={noEndDate}
                className="rounded-xl border px-3 py-2 text-[14px] disabled:bg-gray-200"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
              <select
                value={noEndDate ? '' : endYear}
                onChange={(e) => setEndYear(Number(e.target.value))}
                disabled={noEndDate}
                className="rounded-xl border px-3 py-2 text-[14px] disabled:bg-gray-200"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Employment Type</label>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="w-full rounded-xl border px-4 py-2 text-[15px] text-gray-700"
          >
            <option value="" disabled hidden>
              Select employment type...
           </option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Freelance">Freelance</option>
            <option value="Internship">Internship</option>
          </select> 
        </div>

        <div className="mt-7 flex items-center justify-end gap-3">
          <button onClick={onClose} className="rounded-xl bg-gray-100 px-5 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-200">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-full bg-gradient-to-r from-[#9333EA] to-[#2563EB] px-6 py-2 text-[13px] font-[800] text-white shadow disabled:opacity-50"
          >
            {loading ? 'Saving...' : defaultValue ? 'Update' : 'Add'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default AddExperienceModal
