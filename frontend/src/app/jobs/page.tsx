'use client';

import React, { useState, useEffect, FormEvent } from 'react';

import RoleSwitcher from '../components/jobs/RoleSwitcher'; 
import UserCard from "../components/userCard";
import Image from "next/image";
import { toast } from 'react-hot-toast';

type UserRole = 'TALENT' | 'HUNTER' | 'BOTH';
type ActiveView = 'TALENT' | 'HUNTER';

interface User {
  id: string;
  role: UserRole;
  level_id?: string;
  first_name: string;
  last_name: string;
  job_title?: string;
  company_name?: string;
}

interface Job {
  id: string;
  meta_data: {
    title?: string;
    description?: string;
    level_name?: string;
    employment_type?: string;
  };
  applicantsCount?: number;
  userSaved?: boolean;
  userApplied?:boolean
}

interface SavedItem { 
  id: string;
  job_id: string;
  user_id: string;
  job: Job;
}


interface Applicant {
  talent: {
    id: string;
    first_name: string;
    last_name: string;
    profil_picture?: string | null;
  }
}

interface Level { 
  id: string; 
  name: string; 
} 


interface JobCardProps {
  job: Job;
  onApply: (id: string) => void; 
  onSave: (id: string) => void;
  onDetails: (id: string) => void; 
  onViewApplicants: (id: string) => void;
  onEdit?: (job: Job) => void; 
  onDelete?: (id: string) => void; 
  isHunter: boolean;
  openDropdownId: string | null;
  toggleDropdown: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onApply, 
  onSave, 
  onDetails, 
  onViewApplicants, 
  onEdit, 
  onDelete, 
  isHunter,
  openDropdownId,
  toggleDropdown
}) => {
  const title = job.meta_data.title?.trim() || 'Job Title N/A';
  const level = job.meta_data.level_name?.trim() || 'N/A';
  const employmentType = job.meta_data.employment_type?.replace('_', ' ') || 'N/A';
  const isSaved = job.userSaved;

  const handleActionClick = (handler: (id: string) => void, id: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    handler(id);
    if (isHunter) toggleDropdown(job.id); 
  };

  return (
    <div className="p-4 mt-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition duration-200">
      <div className="flex items-center space-x-4 flex-grow">
        <div>
        </div>
        <div className="flex-grow min-w-0">
          <h4 className="font-bold text-lg text-gray-900 truncate">{title}</h4>
          <p className="text-sm text-gray-500 flex items-center space-x-1">

            {isHunter && job.applicantsCount !== undefined && (
              <span className="ml-2 text-xs text-purple-600 font-medium">
                ({job.applicantsCount} Applicants)
              </span>
              
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 flex-shrink-0">
        <div className="hidden sm:flex flex-col items-end space-y-1">
          <span className="text-xs font-semibold bg-purple-100 text-purple-800 px-3 py-1 rounded-full whitespace-nowrap">
            {level}
          </span>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {employmentType}
          </span>
        </div>

        {!isHunter ? (
          <>
            <button 
              onClick={handleActionClick(onSave, job.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition border rounded-full hidden sm:block"
              title={isSaved ? "Unsave Job" : "Save Job"}
            >
               <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000">
               {isSaved ? (
                  <path d="M240-144v-600q0-29.7 21.15-50.85Q282.3-816 312-816h336q29.7 0 50.85 21.15Q720-773.7 720-744v600l-240-96-240 96Zm72-107 168-67 168 67v-493H312v493Zm0-493h336-336Z"/>
                   ) : (
                 <path d="M240-144v-600q0-29.7 21.15-50.85Q282.3-816 312-816h336q29.7 0 50.85 21.15Q720-773.7 720-744v600l-240-96-240 96Zm72-107 168-67 168 67v-493H312v493Zm0-493h336-336Z"/>

                 )}
                </svg>
            </button> 
            <button 
              onClick={handleActionClick(onApply, job.id)}
              className="text-xs text-purple-500"
            >
              Apply
            </button>
            <button 
              onClick={handleActionClick(onDetails, job.id)}
               className="px-3 py-1 text-xs rounded-full border bg-gradient-to-r from-[#9333EA] to-[#2563EB] text-white rounded"
            >
              Details
            </button>
          </>
        ) : (
          <div className="relative ">
            <button 
              onClick={(e) => { e.stopPropagation(); toggleDropdown(job.id); }}
              className="p-1 text-gray-400 hover:text-gray-700 transition"
            >
               <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#000000"
                  >
          <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
        </svg>
            </button>
            {openDropdownId === job.id && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                <button
              onClick={() => {
                onViewApplicants(job.id)
              }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              View Applicants
            </button>
                <button 
                  onClick={handleActionClick(onDetails, job.id)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Details
                </button>
                <button 
                  onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(job);
                      toggleDropdown(job.id);
                    }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                
                <button 
                  onClick={handleActionClick(onDelete!, job.id)}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface SavedJob extends Job {
  jobSaveId: string; 
}

interface SavedJobsModalProps {
  jobs: Job[];
  onClose: () => void;
  onDetails: (id: string) => void;
  onUnsave: (job: string) => void;
}

const SavedJobsModal: React.FC<SavedJobsModalProps> = ({ jobs, onClose, onDetails, onUnsave }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity"
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose} 
    >
      <div 
        className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full transform transition-all"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-bold text-gray-800">Saved Jobs ({jobs.length})</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <ul className="space-y-3 max-h-96 overflow-y-auto pr-1"> 
          {jobs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">You haven&apos;t saved any jobs yet.</p>
          ) : (
            jobs.map(job => (
              <li 
                key={job.id} 
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-medium text-gray-900 leading-tight">{job.meta_data?.title || 'No Title'}</p>
                    <span className="text-xs text-gray-500">{job.meta_data?.level_name || 'Level N/A'}</span>
                  </div>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                  <button 
                    onClick={() => onDetails(job.id)} 
                    className="px-3 py-1 text-xs text-purple-600 font-medium rounded-full hover:bg-purple-50 transition"
                  >
                    Details
                  </button>
                  <button 
                    onClick={() => onUnsave(job.id)} 
                    className="p-1 text-red-400 hover:text-red-600 transition"
                    title="Unsave Job"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height="20px" width="20px"><path d="M192 64C156.7 64 128 92.7 128 128L128 544C128 555.5 134.2 566.2 144.2 571.8C154.2 577.4 166.5 577.3 176.4 571.4L320 485.3L463.5 571.4C473.4 577.3 485.7 577.5 495.7 571.8C505.7 566.1 512 555.5 512 544L512 128C512 92.7 483.3 64 448 64L192 64z"/></svg>

                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

interface AppliedJob extends Job {
  jobApplicationId: string; 
}
interface appliedItem { 
  id: string;
  job_id: string;
  user_id: string;
  job: Job;
}
interface AppliedJobsModalProps {
  jobs: Job[];
  onClose: () => void;
  onUnapply: (job: string) => void;
}

const AppliedJobsModal: React.FC<AppliedJobsModalProps> = ({ jobs, onClose, onUnapply }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
         style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
         onClick={onClose}>
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full transform transition-all"
           onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-bold text-gray-800">Applied Jobs ({jobs.length})</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center py-4">You haven&apos;t applied to any jobs yet.</p>
        ) : (
          <ul className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {jobs.map(job => (
              <li key={job.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                <div>
                  <p className="font-medium text-gray-900">{job.meta_data?.title || 'No Title'}</p>
                </div>
                <button
                  onClick={() => onUnapply(job.id)}
                  className="px-3 py-1 text-xs text-purple-600 font-medium rounded-full hover:bg-purple-50 transition"
                  name='Unapply'
                >
                  Un apply
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default function JobsPage() {
  const [showAll, setShowAll] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>('TALENT');
  const [talentJobs, setTalentJobs] = useState<{ recommended: Job[]; available: Job[] }>({ recommended: [], available: [] });
  const [hunterJobs, setHunterJobs] = useState<Job[]>([]);

  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [isSavedJobsModalOpen, setIsSavedJobsModalOpen] = useState(false);

  const [selectedApplicants, setSelectedApplicants] = useState<Applicant[]>([]);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);

  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [newJobData, setNewJobData] = useState({
    title: '',
    description: '',
    level: '',
    employment_type: ''
  });

  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false)
  const [editJobData, setEditJobData] = useState({
    id: '',
    title: '',
    description: '',
    level_name: '',
    employment_type: ''
  })
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [levels, setLevels] = useState<Level[]>([]);

  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [isAppliedJobsModalOpen, setIsAppliedJobsModalOpen] = useState(false);
 
   useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/levels/`, { credentials: 'include' })
      .then(res => res.json())
      .then(data =>{
        setLevels(data)
      }) 
      .catch(
        err => {
          console.error(err)
        });
  },[]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, 
          { credentials: 'include' });
        const userData: User = await res.json();
        setUser(userData);

        if (userData.role === 'HUNTER') setActiveView('HUNTER');
        else setActiveView('TALENT');
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!user) return;

    if (activeView === 'TALENT') {
      const fetchTalentJobs = async () => {
        try {
          const recRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/recommended`,
               { credentials: 'include' });
          const recommended = await recRes.json();

          const availRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/available`,
               { credentials: 'include' });
          const available = await availRes.json();

          setTalentJobs({ recommended, available });
        } catch (err) {
          console.error(err);
        }
      };
      fetchTalentJobs();
    }

    if (activeView === 'HUNTER') {
      const fetchHunterJobs = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/my`, 
             { credentials: 'include' });
          const data = await res.json();
          setHunterJobs(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error(err);
          setHunterJobs([]);
        }
      };
      fetchHunterJobs();
    }
  }, [user, activeView]);

  if (isLoading || !user) return <div className="text-center p-10">... Loading User Data ...</div>;

  const isSwitchable = user.role === 'BOTH';
  const handleSwitchView = (view: ActiveView) => setActiveView(view);
  const toggleDropdown = (id: string) => {
    setOpenDropdownId(prev => (prev === id ? null : id));
  };
  
  const handleApply = async (jobId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/apply/${jobId}`, 
        { method: 'POST', credentials: 'include' });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to apply");
      }
      toast.success("Applied successfully!");
      
      setTalentJobs(prev => ({
        ...prev,
        recommended: Array.isArray(prev.recommended)
          ? prev.recommended.map(job => job.id === jobId ? { ...job, applicantsCount: (job.applicantsCount ?? 0) + 1 } : job)
          : [],
        available: Array.isArray(prev.available)
          ? prev.available.map(job => job.id === jobId ? { ...job, applicantsCount: (job.applicantsCount ?? 0) + 1 } : job)
          : [],
      }));

    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else if (typeof err === "string") {
        toast.error( err);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const handleUnapply = async (jobId: string) =>{
    console.log('🔹 jobId sent to API:', jobId);
    try {
    
    const jobExists = appliedJobs.find(j => j.id === jobId);
    if (!jobExists) {
      toast('Job not applied yet ⚠️');
      return;
    }


    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/unapply/${jobId}`, {
      method: 'DELETE',
       credentials: 'include'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to unapply job');
    }

    setAppliedJobs(prev => prev.filter(j => j.id !== jobId)); 
    setTalentJobs(prev => ({
      recommended: prev.recommended.map(j => j.id === jobId ? { ...j, userSaved: false } : j),
      available: prev.available.map(j => j.id === jobId ? { ...j, userSaved: false } : j),
    }));
    toast.success('Job removed successfully 🗑️');
  } catch (err) {
    console.error(err);
    toast.error('Failed to remove job ❌');
  }
  }


const fetchAppliedJobs = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/applied`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch applied jobs');
    const data: appliedItem[] = await res.json();
    const actualJob: AppliedJob[] = Array.isArray(data)
    ? data.map(item => ({
      ...item.job,
      userApplied: true,
      jobApplicationId: item.id 
    }))
  : [];
    console.log(actualJob)
    setAppliedJobs(actualJob);
    setIsAppliedJobsModalOpen(true);
  } catch (err) {
    toast.error('Failed to load applied jobs.'+err);
  }
};

const handleCloseAppliedJobsModal = () => {
  setIsAppliedJobsModalOpen(false);
};

  // const updateJobState = (jobId: string, isSaved: boolean) => {
  //   setTalentJobs(prev => ({
  //     ...prev,
  //     recommended: prev.recommended.map(j => j.id === jobId ? { ...j, userSaved: isSaved } : j),
  //     available: prev.available.map(j => j.id === jobId ? { ...j, userSaved: isSaved } : j),
  //   }));
  // };
  
  const fetchSavedJobs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/saved`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch saved jobs');
    const data: SavedItem[] = await res.json(); 
    const actualJobs: SavedJob[] = Array.isArray(data)
  ? data.map(item => ({
      ...item.job,
      userSaved: true,
      jobSaveId: item.id 
    }))
  : [];
      setSavedJobs(actualJobs);

       setIsSavedJobsModalOpen(true);
    } catch (err) {
      console.error(err);
     toast.error('Failed to load saved jobs.');
    }
  };

  const saveJob = async (jobId: string) => {
    if (savedJobs.find(j => j.id === jobId)) {
    toast('Already saved', { icon: '⚠️' });
    return;
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/save/${jobId}`, {
      method: 'POST',
       credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to save job');

    const savedJob = await res.json();
    setSavedJobs(prev => [...prev, savedJob]); 
    setTalentJobs(prev => ({
      recommended: prev.recommended.map(j => j.id === jobId ? { ...j, userSaved: true } : j),
      available: prev.available.map(j => j.id === jobId ? { ...j, userSaved: true } : j),
    }));
    toast.success('Job saved successfully ✅');
  } catch (err) {
    console.error(err);
    toast.error('Already saved');
  }
};


const unsaveJob = async (jobId: string) => {
  if (!savedJobs.find(j => j.id === jobId)) {
    toast('Job not saved yet', { icon: '⚠️' });
    return;
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/unsave/${jobId}`, {
      method: 'DELETE',
       credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to unsave job');

    setSavedJobs(prev => prev.filter(j => j.id !== jobId));
    setTalentJobs(prev => ({
      recommended: prev.recommended.map(j => j.id === jobId ? { ...j, userSaved: false } : j),
      available: prev.available.map(j => j.id === jobId ? { ...j, userSaved: false } : j),
    }));
    toast.success('Job removed successfully 🗑️');
  } catch (err) {
    console.error(err);
    toast.error('Failed to remove job ❌');
  }
};
  const handleCloseSavedJobsModal = () => {
    setIsSavedJobsModalOpen(false);
  };
  
  const openDetails = async (jobId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/${jobId}/details`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to fetch job details');
      const data = await res.json();

      setSelectedJob(data);
      setIsDetailsOpen(true);
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error('Unknown error');
    }
  };

  const closeDetails = () => {
    setIsDetailsOpen(false)
    setSelectedJob(null)
  }

  const handleAddJobClick = () => setIsAddJobModalOpen(true);

  const handleViewApplicants = async (jobId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/${jobId}/applicants`, 
        { credentials: 'include' });
      const data = await res.json();
      setSelectedApplicants(data);
      setIsApplicantsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewJobChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewJobData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitNewJob = async (e: FormEvent) => {
    e.preventDefault();
    if (!newJobData.title.trim()) return toast.error("Job Title is required");
    if (!newJobData.description.trim()) return toast.error("Description is required");
    if (!newJobData.level.trim()) return toast.error("Level is required");
    if (!newJobData.employment_type.trim()) return toast.error("Employment Type is required");

    const selectedLevel = levels.find(lvl => lvl.id === newJobData.level)?.name || '';
    if (!selectedLevel) {
      return toast.error("Please select a valid level")
    }
    const formattedJobData = {
      hunter_id: user?.id,
      meta_data: {
        title: newJobData.title,
        description: newJobData.description,
        level_name: selectedLevel,
        employment_type: newJobData.employment_type,
      }
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedJobData)
      });

      if (!res.ok) {
        const errorText = await res.text(); 
        return toast.error(errorText || "Failed to add job");
      }

      const createdJob = await res.json();
      setHunterJobs(prev => [...prev, createdJob]);

      setNewJobData({ title: '', description: '', level: '', employment_type: '' });
      setIsAddJobModalOpen(false);
      toast.success("Job added successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) toast.error("Error adding job: " + err.message)
      else toast.error("An unknown error occurred");
    }
  };

  const handleEditJobClick = (job: Job) => { 
    setEditJobData({ 
      id: job.id,
        title: job.meta_data.title || '',
        description: job.meta_data.description || '',
        level_name: job.meta_data.level_name || '', 
        employment_type: job.meta_data.employment_type || ''
        }) 
    setIsEditJobModalOpen(true)
  }

  const handleEditJobChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { 
    setEditJobData(prev => ({ ...prev, [e.target.name]: e.target.value })) 
  }

  const handleSubmitEditJob = async (e: FormEvent) => { 
    e.preventDefault(); 
    if (!editJobData.title.trim()) return toast.error("Job title is required") 

    const selectedLevelName = levels.find(lvl => lvl.id === editJobData.level_name)?.name || editJobData.level_name;

    if (!selectedLevelName) {
      return toast.error("Please select a valid level")
    }

    const formattedJobData = {
      meta_data: {
        title: editJobData.title,
        description: editJobData.description,
        level_name: selectedLevelName,
        employment_type: editJobData.employment_type
      }
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/edit/${editJobData.id}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formattedJobData) 
      }) 

      if (!res.ok) {
        const errorText = await res.text() 
        throw new Error(errorText || "Failed to update job") 
      } 

      const updatedJob = await res.json()
      setHunterJobs(prev => prev.map(job => job.id === updatedJob.id ? updatedJob : job)) 
      setIsEditJobModalOpen(false)
      toast.success("Job updated successfully!")
    } catch (err: unknown) {
      if (err instanceof Error) toast.error("Error updating job: " + err.message) 
      else toast.error("An unknown error occurred") 
  } 
}
  const handleDeleteJob = async (jobId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/${jobId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to delete job');
      }

      setHunterJobs(prev => prev.filter(job => job.id !== jobId));
      toast.success('Job deleted successfully');
    } catch (err: unknown) {
      if (err instanceof Error) toast.error('Error deleting job: ' + err.message);
      else toast.error('An unknown error occurred');
    }
  };


const availableJobs = Array.isArray(talentJobs.available) ? talentJobs.available : [];
const recommendedJobs = Array.isArray(talentJobs.recommended) ? talentJobs.recommended : [];

const filteredAvailable = availableJobs.filter(
  availJob => !recommendedJobs.some(recJob => recJob.id === availJob.id)
);


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      {isSwitchable && <RoleSwitcher activeView={activeView} onSwitch={handleSwitchView} />}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-[40px] mt-7 mb-7">
        <div className="w-1/4 min-w-[250px] space-y-4 "> 
          <UserCard />

          {activeView === 'TALENT' && (
            <div 
            className="bg-white p-4 rounded-xl  space-y-2 sm:w-[280px] md:w-[294px] h-auto sm:h-[208px] mx-auto sm:ml-[100px] "
            >
              <button
                onClick={fetchSavedJobs} 
                className="w-full flex items-center space-x-3 mt-4 text-left p-3 rounded-xl transition bg-gray-50 hover:bg-gray-100"
              >

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height="20px" width="20px"><path d="M192 64C156.7 64 128 92.7 128 128L128 544C128 555.5 134.2 566.2 144.2 571.8C154.2 577.4 166.5 577.3 176.4 571.4L320 485.3L463.5 571.4C473.4 577.3 485.7 577.5 495.7 571.8C505.7 566.1 512 555.5 512 544L512 128C512 92.7 483.3 64 448 64L192 64z"/></svg>
                <span className="text-base font-semibold text-gray-700">Saved Jobs</span>
              </button>
              <button
                 onClick={fetchAppliedJobs} 
                 className="w-full flex items-center space-x-3 mt-4 text-left p-3 rounded-xl transition bg-gray-50 hover:bg-gray-100"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M263.79-192Q234-192 213-213.21t-21-51Q192-294 213.21-315t51-21Q294-336 315-314.79t21 51Q336-234 314.79-213t-51 21Zm0-216Q234-408 213-429.21t-21-51Q192-510 213.21-531t51-21Q294-552 315-530.79t21 51Q336-450 314.79-429t-51 21Zm0-216Q234-624 213-645.21t-21-51Q192-726 213.21-747t51-21Q294-768 315-746.79t21 51Q336-666 314.79-645t-51 21Zm216 0Q450-624 429-645.21t-21-51Q408-726 429.21-747t51-21Q510-768 531-746.79t21 51Q552-666 530.79-645t-51 21Zm216 0Q666-624 645-645.21t-21-51Q624-726 645.21-747t51-21Q726-768 747-746.79t21 51Q768-666 746.79-645t-51 21Zm-216 216Q450-408 429-429.21t-21-51Q408-510 429.21-531t51-21Q510-552 531-530.79t21 51Q552-450 530.79-429t-51 21ZM528-192v-113l210-209q7.26-7.41 16.13-10.71Q763-528 771.76-528q9.55 0 18.31 3.5Q798.83-521 806-514l44 45q6.59 7.26 10.29 16.13Q864-444 864-435.24t-3.29 17.92q-3.3 9.15-10.71 16.32L641-192H528Zm288-243-45-45 45 45ZM576-240h45l115-115-22-23-22-22-116 115v45Zm138-138-22-22 44 45-22-23Z"/></svg>
                 <span className="text-base font-semibold text-gray-700">Applied Jobs</span>
               </button>

            </div>
          )}
        </div>
        
        <div className="w-3/4 pl-4 space-y-6">

          {activeView === 'TALENT' && (
            <>
              <section className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold ">Your Skills, Your Next Job</h2>
                <span className="text-sm text-gray-500 mb-4">Discover roles that metch your abilties and career goals</span>
                 {Array.isArray(talentJobs?.recommended) ? (
                  talentJobs.recommended.map((job) => (
                    <JobCard
                        key={job.id}
                        job={job}
                        onApply={handleApply}
                        onSave={saveJob}
                        onDetails={openDetails}
                        onViewApplicants={handleViewApplicants}
                        isHunter={false}
                        openDropdownId={openDropdownId} 
                        toggleDropdown={toggleDropdown}
                      />
                  ))
                ) : (
                  <p>No recommended jobs found</p>
                )}
              </section>
              <section className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4">Available Jobs</h2> 
                {filteredAvailable.slice(0, showAll ? talentJobs.available.length : 6).map(job => (
                  <JobCard
                      key={job.id}
                      job={job}
                      onApply={handleApply}
                      onSave={saveJob}
                      onDetails={openDetails}
                      onViewApplicants={handleViewApplicants}
                      isHunter={false}
                      openDropdownId={openDropdownId} 
                      toggleDropdown={toggleDropdown}
                    />
                ))}
                {filteredAvailable.length > 6 && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] to-[#2563EB] font-semibold hover:opacity-80 transition"
                    >
                      {showAll ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            className="fill-gradient"
                          >
                            <defs>
                              <linearGradient id="arrowGradient" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#9333EA" />
                                <stop offset="100%" stopColor="#2563EB" />
                              </linearGradient>
                            </defs>
                            <path fill="url(#arrowGradient)" d="M384-288 192-480l192-192 51 51-105 105h438v72H330l105 105-51 51Z"/>
                          </svg>
                          <span>Show Less</span>
                        </>
                      ) : (
                        <>
                         <span>Show More</span>
                         <svg
                           xmlns="http://www.w3.org/2000/svg"
                           height="20px"
                           viewBox="0 -960 960 960"
                           width="20px"
                         >
                           <defs>
                             <linearGradient id="arrowGradient" x1="0" y1="0" x2="1" y2="1">
                               <stop offset="0%" stopColor="#9333EA" />
                               <stop offset="100%" stopColor="#2563EB" />
                             </linearGradient>
                           </defs>
                           <path fill="url(#arrowGradient)" d="M630-444H192v-72h438L429-717l51-51 288 288-288 288-51-51 201-201Z"/>
                         </svg>
                       </>
                     )}
                   </button>

                  </div>
                )}
              </section>
            </>
          )}

          {activeView === 'HUNTER' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">My Jobs</h2>
                <button onClick={handleAddJobClick} className="text-purple-600 hover:text-purple-800 text-xl font-bold">+</button>
              </div>
              {Array.isArray(hunterJobs) && hunterJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={handleApply}
                  onSave={saveJob}
                  onDetails={openDetails}
                  onViewApplicants={handleViewApplicants}
                  onEdit={handleEditJobClick}
                  onDelete={handleDeleteJob}
                  isHunter={true}
                  openDropdownId={openDropdownId}
                  toggleDropdown={toggleDropdown}
                />
              ))}
            </>
          )}
        </div>
      </div>


      {isSavedJobsModalOpen && (
        <SavedJobsModal
          jobs={savedJobs}
          onClose={handleCloseSavedJobsModal}
          onDetails={openDetails}
          onUnsave={unsaveJob}
        />
      )}

      {isApplicantsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white p-4 rounded-xl shadow max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-2 border-b border-gray-300 flex justify-between items-center">
              <h3 className="p-2 text-xl font-bold mb-3">Applicants</h3>
              <button 
                onClick={() => setIsApplicantsModalOpen(false)} 
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {selectedApplicants.map(app => (
                <li key={app.talent.id} className="ml-3 flex items-center space-x-3">
                  {app.talent.profil_picture && (
                    <Image 
                        src={app.talent.profil_picture} 
                        alt={`${app.talent.first_name} ${app.talent.last_name}`} 
                        width={32} 
                        height={32} 
                        className="rounded-full"
                      />
                    )}
                  <span>{app.talent.first_name} {app.talent.last_name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {isAddJobModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <form onSubmit={handleSubmitNewJob} className="bg-white p-4 rounded-xl shadow max-w-md w-full space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="p-2 border-b border-gray-300 flex justify-between items-center">
              <h3 className="p-2 text-xl font-bold mb-3">Add New Job</h3>
              <button 
                type="button"
                onClick={() => setIsAddJobModalOpen(false)} 
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <input type="text" name="title" placeholder="Job Title" value={newJobData.title} onChange={handleNewJobChange} className="w-full border px-2 py-1 rounded" />
            <textarea name="description" placeholder="Description" value={newJobData.description} onChange={handleNewJobChange} className="w-full border px-2 py-1 rounded" />
           <select name="level" value={newJobData.level} onChange={handleNewJobChange} className="w-full border px-2 py-1 rounded">
              <option value="">Select Level</option>
                {levels.map(lvl => <option key={lvl.id} value={lvl.id}>{lvl.name}</option>)}
            </select>
            <select name="employment_type" value={newJobData.employment_type} onChange={handleNewJobChange} className="w-full border px-2 py-1 rounded">
              <option value="">Select Employment Type</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
            </select>
            <div className="flex justify-end space-x-2 mt-2">
              <button type="submit" className={`px-6 py-2 rounded-full text-white font-semibold transition bg-gradient-to-r from-[#9333EA] to-[#2563EB]`}>Add Job</button>
            </div>
          </form>
        </div>
      )}

      {isDetailsOpen && selectedJob && (
        <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={closeDetails}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 transform transition-all duration-300 scale-100 " onClick={(e) => e.stopPropagation()}>
            <div className="p-2 border-b border-gray-300 flex justify-between items-center">
              <h3 className="p-2 text-xl font-bold mb-3">{selectedJob.meta_data.title}</h3>
              <button 
                onClick={closeDetails} 
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <p className="ml-4 mb-4 break-words whitespace-pre-wrap mr-4"><strong>Description:</strong> {selectedJob.meta_data?.description}</p>
            <p className="mt-4 ml-4 mb-4"><strong>Level:</strong> {selectedJob.meta_data?.level_name}</p>
            <p className="ml-4 mb-4"><strong>Employment Type:</strong> {selectedJob.meta_data?.employment_type}</p>
          </div>
        </div>
      )}

      {isEditJobModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        > 
          <form onSubmit={handleSubmitEditJob} className="bg-white p-4 rounded-xl shadow max-w-md w-full space-y-3" onClick={(e) => e.stopPropagation()}> 
            <div className="p-2 border-b border-gray-300 flex justify-between items-center">
              <h3 className="p-2 text-xl font-bold mb-3">Edit Job</h3>
              <button type="button" onClick={() => setIsEditJobModalOpen(false)} className="text-gray-500 hover:text-gray-700"> 
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <input type="text" name="title" placeholder="Job Title" value={editJobData.title} onChange={handleEditJobChange} className="w-full border px-2 py-1 rounded" /> 
            <textarea name="description" placeholder="Description" value={editJobData.description} onChange={handleEditJobChange} className="w-full border px-2 py-1 rounded" /> 
            <select name="level_name" value={editJobData.level_name} onChange={handleEditJobChange} className="w-full border px-2 py-1 rounded">
              <option value="">Select Level</option>
             {levels.map(lvl => <option key={lvl.id} value={lvl.id}>{lvl.name}</option>)}  
            </select>
            <select name="employment_type" value={editJobData.employment_type} onChange={handleEditJobChange} className="w-full border px-2 py-1 rounded"> 
              <option value="">Select Employment Type</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option> 
              <option value="CONTRACT">Contract</option> 
            </select>
            <div className="flex justify-end space-x-2 mt-2">
              <button type="submit" className="px-6 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-[#9333EA] to-[#2563EB]">Save</button> 
            </div>
          </form> 
        </div> 
      )} 
      {isAppliedJobsModalOpen && (
        <AppliedJobsModal
          jobs={appliedJobs}
          onClose={handleCloseAppliedJobsModal}
          onUnapply={handleUnapply}
        />
      )}


    </div>
  );
  }
