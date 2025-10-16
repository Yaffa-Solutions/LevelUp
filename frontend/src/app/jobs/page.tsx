// 1
'use client';

import React, { useState, useEffect } from 'react';
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
  id: string
  meta_data: {
    job_title?: string
    requirement?: {
      levels?: string
      nice_to_have?: string[]
      description?: string
    }
    employment_type?: string
  }
  applicantsCount?: number
}

interface Applicant {
  talent: {
    id: string;
    first_name: string;
    last_name: string;
    profil_picture?: string | null;
  }
}


export default function JobsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>('TALENT');
  const [talentJobs, setTalentJobs] = useState<{ recommended: Job[]; available: Job[] }>({ recommended: [], available: [] });
  const [hunterJobs, setHunterJobs] = useState<Job[]>([]);

  const [selectedApplicants, setSelectedApplicants] = useState<Applicant[]>([]);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);

  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [newJobData, setNewJobData] = useState({
    title: '',
    requirements: '',
    nice_to_have: '',
    level: '',
    description: '',
    employment_type: ''
  });

  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('http://localhost:5000/user/me', 
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
          const recRes = await fetch(`http://localhost:5000/jobs/recommended`,
             { credentials: 'include' });
          const recommended = await recRes.json();

          const availRes = await fetch('http://localhost:5000/jobs/available',
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
          const res = await fetch('http://localhost:5000/jobs/my', 
            { credentials: 'include' });
          const data = await res.json();
          setHunterJobs(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchHunterJobs();
    }
  }, [user, activeView]);

  if (isLoading || !user) return <div className="text-center p-10">... Loading User Data ...</div>;

  const isSwitchable = user.role === 'BOTH';

  const handleSwitchView = (view: ActiveView) => setActiveView(view);

  const handleApply = async (jobId: string) => {
  try {
    const res = await fetch(`http://localhost:5000/jobs/apply/${jobId}`, {
      method: 'POST',
      credentials: 'include'
    });

    // const data = await res.json();
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to apply");
    }
    // if (!res.ok) throw new Error(data.message || 'Failed to apply');
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
    // console.error("Error applying:", err);
    // toast.error("Error applying: " + err.message);

    if (err instanceof Error) {
    toast.error("Error applying: " + err.message);
  } else if (typeof err === "string") {
    toast.error("Error applying: " + err);
  } else {
    toast.error("An unknown error occurred");
  }
  }
};

const openDetails = (job: Job) => {
    setSelectedJob(job)
    setIsDetailsOpen(true)
  }

  const closeDetails = () => {
    setIsDetailsOpen(false)
    setSelectedJob(null)
  }


  const handleSave = async (jobId: string) => {
    await fetch(`http://localhost:5000/jobs/save/${jobId}`, { method: 'POST', credentials: 'include' });
    toast.success('Job saved!');
  };

  const handleAddJobClick = () => setIsAddJobModalOpen(true);

  const handleViewApplicants = async (jobId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/jobs/${jobId}/applicants`, 
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


  const handleSubmitNewJob = async () => {
  if (!newJobData.title.trim()) return alert("Job title is required");
  if (!newJobData.employment_type.trim()) return alert("Employment type is required");

  try {
    const res = await fetch("http://localhost:5000/jobs/create", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meta_data: newJobData })
    });

    if (!res.ok) {
      const errorText = await res.text(); 
      throw new Error(errorText || "Failed to add job");
    }

    const createdJob = await res.json();
    setHunterJobs(prev => [...prev, createdJob]);
    setIsAddJobModalOpen(false);
    setNewJobData({ title: '', requirements: '', nice_to_have: '', level: '', description: '', employment_type: '' });
    toast.success("Job added successfully!");
  } catch (err: unknown) {
    if (err instanceof Error) {
    console.error("Error adding job:", err);
    toast.error("Error adding job: " + err.message);
  } else if (typeof err === "string") {
    toast.error("Error adding job: " + err);
  } else {
    toast.error("An unknown error occurred");
  }
  }
};


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      {isSwitchable && <RoleSwitcher activeView={activeView} onSwitch={handleSwitchView} />}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-[40px] mt-7 mb-7">
        <div className="w-1/4 min-w-[250px]">
          <UserCard />
        </div>
        <div className="w-3/4 pl-4 space-y-6">
          {activeView === 'TALENT' && (
            <>
              <section>
                <h2 className="text-xl font-bold mb-4">Recommended Jobs</h2>
                 {Array.isArray(talentJobs?.recommended) ? (
                  talentJobs.recommended.map((job) => (
                    <JobCard
                        key={job.id}
                        job={job}
                        onApply={handleApply}
                        onSave={handleSave}
                        onDetails={openDetails}
                        onViewApplicants={handleViewApplicants}
                        isHunter={false}
                      />

                  ))
                ) : (
                  <p>No recommended jobs found</p>
                )}
              </section>
              <section>
                <h2 className="text-xl font-bold mb-4">Available Jobs</h2>
                {talentJobs.available.map(job => (
                  // <JobCard 
                  // key={job.id} 
                  // job={job} 
                  // onApply={handleApply} 
                  // onSave={handleSave}
                  // onDetails={openDetails} 
                  // isHunter={false} />
                  <JobCard
                      key={job.id}
                      job={job}
                      onApply={handleApply}
                      onSave={handleSave}
                      onDetails={openDetails}
                      onViewApplicants={handleViewApplicants}
                      isHunter={false}
                    />

                ))}
              </section>
            </>
          )}

          {activeView === 'HUNTER' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">My Jobs</h2>
                <button onClick={handleAddJobClick} className="text-purple-600 hover:text-purple-800 text-xl font-bold">+</button>
              </div>
              {hunterJobs.map(job => (
                // <JobCard key={job.id} job={job} onApply={handleApply} onSave={handleSave} isHunter={true} onViewApplicants={handleViewApplicants} />
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={handleApply}
                  onSave={handleSave}
                  onDetails={openDetails}
                  onViewApplicants={handleViewApplicants}
                  isHunter={true}
                />

              ))}
            </>
          )}
        </div>
      </div>

      {isApplicantsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Applicants</h3>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {selectedApplicants.map(app => (
                <li key={app.talent.id} className="flex items-center space-x-3">
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
            <button onClick={() => setIsApplicantsModalOpen(false)} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Close</button>
          </div>
        </div>
      )}

      {isAddJobModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white p-6 rounded shadow max-w-md w-full space-y-3">
            <h3 className="text-lg font-bold mb-2">Add New Job</h3>
            <input type="text" name="title" placeholder="Job Title" value={newJobData.title} onChange={handleNewJobChange} className="w-full border px-2 py-1 rounded" />
            <textarea name="requirements" placeholder="Requirements" value={newJobData.requirements} onChange={handleNewJobChange} className="w-full border px-2 py-1 rounded" />
            <textarea name="nice_to_have" placeholder="Nice to have" value={newJobData.nice_to_have} onChange={handleNewJobChange} className="w-full border px-2 py-1 rounded" />
            <input type="text" name="level" placeholder="Level" value={newJobData.level} onChange={handleNewJobChange} className="w-full border px-2 py-1 rounded" />
            <textarea name="description" placeholder="Description" value={newJobData.description} onChange={handleNewJobChange} className="w-full border px-2 py-1 rounded" />
            <select name="employment_type" value={newJobData.employment_type} onChange={handleNewJobChange} className="w-full border px-2 py-1 rounded">
              <option value="">Select Employment Type</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
            </select>
            <div className="flex justify-end space-x-2 mt-2">
              <button onClick={() => setIsAddJobModalOpen(false)} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handleSubmitNewJob} className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700">Add Job</button>
            </div>
          </div>
        </div>
      )}

      {isDetailsOpen && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[500px]">
            <h3 className="text-xl font-bold mb-3">{selectedJob.meta_data.job_title}</h3>
            <p className="mb-2"><strong>Level:</strong> {selectedJob.meta_data.requirement?.levels}</p>
            <p className="mb-2"><strong>Employment Type:</strong> {selectedJob.meta_data.employment_type}</p>
            <p className="mb-2"><strong>Description:</strong> {selectedJob.meta_data.requirement?.description}</p>
            <p className="mb-2"><strong>Nice to have:</strong> {selectedJob.meta_data.requirement?.nice_to_have?.join(', ')}</p>

            <div className="flex justify-end mt-4">
              <button
                onClick={closeDetails}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const JobCard: React.FC<{
  job: Job;
  onApply: (id: string) => void;
  onSave: (id: string) => void;
  onViewApplicants: (id: string) => void;
  onDetails: (job: Job) => void;
  isHunter: boolean;
}> = ({ job, onApply, onSave, onViewApplicants, onDetails, isHunter }) => {
  const meta = job.meta_data as { title?: string; job_title?: string };
  // const title =
  //   job.meta_data.job_title?.trim() ||
  //   (job.meta_data as any).title?.trim() ||  // بعض الجوبز عندها title بدل job_title
  //   'No Title';
  const title = meta.job_title?.trim() || meta.title?.trim() || 'No Title';
  const level = job.meta_data.requirement?.levels|| '';
  const applicantsCount = job.applicantsCount ?? 0;

  return (
    <div className="p-4 mb-3 bg-white shadow rounded-lg flex justify-between items-center cursor-pointer">
      <div>
        <h4 className="font-semibold">{title}</h4>
        {isHunter ? (
          <p className="text-sm text-gray-500">{applicantsCount} Applicants</p>
        ) : (
          <>
            {/* <p className="text-sm text-gray-500">{company}</p> */}
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{level}</span>
          </>
        )}
      </div>
      <div className="flex space-x-2">
        {!isHunter && onApply && (
          <>
            <button className="text-xs text-purple-500" onClick={() => onApply(job.id)}>Apply</button>
            {/* <button className="text-xs text-red-500" onClick={() => onSave(job.id)}>Save</button> */}
            <button onClick={() => onDetails(job)} className="px-3 py-1 text-xs bg-gradient-to-r from-[#9333EA] to-[#2563EB] text-white rounded hover:bg-blue-700">Details</button> 

          </>
        )}
        {isHunter && onViewApplicants && (
          <button className="text-gray-500 hover:text-gray-700" onClick={() => onViewApplicants(job.id)}>...</button>
        )}
      </div>
    </div>
  );
};
