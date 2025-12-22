import React, { createContext, useContext, useState, useCallback } from 'react';

export type CandidateStatus = 'sourced' | 'shortlisted' | 'test_sent' | 'interview_scheduled' | 'completed' | 'rejected';
export type CandidateSource = 'LinkedIn' | 'Naukri' | 'Internal' | 'Indeed';
export type RejectionReason = 'Denied college' | 'Denied company' | 'Low AIScore' | 'Not interested' | 'No response';
export type CallOutcome = 'Answered – Interested' | 'Answered – Not Interested' | 'No Answer' | 'Invalid Number';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  source: CandidateSource;
  status: CandidateStatus;
  aiScore: number;
  resumeMatchScore: number;
  testScore?: number;
  interviewScore?: number;
  rejectionReason?: RejectionReason;
  callOutcome?: CallOutcome;
  college?: string;
  company?: string;
  experience: number;
  skills: string[];
  interviewSlot?: string;
  aiRecommendation?: 'Strong Fit' | 'Medium Fit' | 'Weak Fit';
  interviewSummary?: string;
}

export interface Job {
  id: string;
  title: string;
  experienceRange: string;
  skills: string[];
  hiresRequired: number;
  targetShortlist: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  candidates: Candidate[];
}

interface JobContextType {
  jobs: Job[];
  createJob: (job: Omit<Job, 'id' | 'createdAt' | 'candidates' | 'targetShortlist' | 'status'>) => Job;
  getJob: (id: string) => Job | undefined;
  updateCandidate: (jobId: string, candidateId: string, updates: Partial<Candidate>) => void;
  addCandidates: (jobId: string, candidates: Candidate[]) => void;
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

interface Settings {
  aiScoreThreshold: number;
  enableCallingAgent: boolean;
  maxCallAttempts: number;
  filteringCriteria: {
    deniedColleges: string[];
    deniedCompanies: string[];
  };
}

const JobContext = createContext<JobContextType | undefined>(undefined);

// Mock candidate names
const mockNames = [
  'Priya Sharma', 'Rahul Verma', 'Ananya Patel', 'Vikram Singh', 'Neha Gupta',
  'Arjun Kumar', 'Sneha Reddy', 'Aditya Joshi', 'Kavitha Nair', 'Rohan Mehta',
  'Divya Iyer', 'Karan Malhotra', 'Pooja Desai', 'Amit Saxena', 'Shreya Bhatt',
  'Rajesh Pillai', 'Meera Krishnan', 'Sanjay Rao', 'Lakshmi Venkat', 'Varun Kapoor'
];

const colleges = ['IIT Delhi', 'IIT Bombay', 'BITS Pilani', 'NIT Trichy', 'VIT', 'SRM', 'DTU', 'NSUT'];
const companies = ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Accenture', 'Cognizant', 'Capgemini'];
const sources: CandidateSource[] = ['LinkedIn', 'Naukri', 'Internal', 'Indeed'];

const generateCandidate = (index: number, jobSkills: string[]): Candidate => {
  const name = mockNames[index % mockNames.length];
  const source = sources[Math.floor(Math.random() * sources.length)];
  const resumeMatchScore = Math.floor(Math.random() * 40) + 60;
  
  // Distribute candidates across different statuses for demo
  const statuses: CandidateStatus[] = ['sourced', 'shortlisted', 'test_sent', 'interview_scheduled', 'completed', 'rejected'];
  const statusWeights = [0.3, 0.2, 0.15, 0.15, 0.1, 0.1]; // Distribution percentages
  
  let status: CandidateStatus = 'sourced';
  const rand = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < statusWeights.length; i++) {
    cumulative += statusWeights[i];
    if (rand <= cumulative) {
      status = statuses[i];
      break;
    }
  }
  
  const candidate: Candidate = {
    id: `cand-${Date.now()}-${index}`,
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
    source,
    status,
    aiScore: resumeMatchScore,
    resumeMatchScore,
    college: colleges[Math.floor(Math.random() * colleges.length)],
    company: companies[Math.floor(Math.random() * companies.length)],
    experience: Math.floor(Math.random() * 8) + 1,
    skills: jobSkills.slice(0, Math.floor(Math.random() * 3) + 2),
  };
  
  // Add additional fields based on status
  if (status === 'test_sent' || status === 'interview_scheduled' || status === 'completed') {
    candidate.testScore = Math.floor(Math.random() * 30) + 70;
  }
  
  if (status === 'interview_scheduled' || status === 'completed') {
    candidate.interviewSlot = `${Math.floor(Math.random() * 12) + 1}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`;
  }
  
  if (status === 'completed') {
    candidate.interviewScore = Math.floor(Math.random() * 30) + 70;
    candidate.aiRecommendation = resumeMatchScore > 80 ? 'Strong Fit' : resumeMatchScore > 65 ? 'Medium Fit' : 'Weak Fit';
  }
  
  if (status === 'rejected') {
    const rejectionReasons: RejectionReason[] = ['Denied college', 'Denied company', 'Low AIScore', 'Not interested', 'No response'];
    candidate.rejectionReason = rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)];
  }
  
  return candidate;
};

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('irecruit_jobs');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('irecruit_settings');
    return saved ? JSON.parse(saved) : {
      aiScoreThreshold: 65,
      enableCallingAgent: true,
      maxCallAttempts: 2,
      filteringCriteria: {
        deniedColleges: [],
        deniedCompanies: [],
      },
    };
  });

  const saveJobs = (newJobs: Job[]) => {
    setJobs(newJobs);
    localStorage.setItem('irecruit_jobs', JSON.stringify(newJobs));
  };

  const createJob = useCallback((jobData: Omit<Job, 'id' | 'createdAt' | 'candidates' | 'targetShortlist' | 'status'>) => {
    const targetShortlist = jobData.hiresRequired * 3;
    const candidateCount = targetShortlist + Math.floor(Math.random() * 10) + 5;
    
    const candidates = Array.from({ length: candidateCount }, (_, i) => 
      generateCandidate(i, jobData.skills)
    );

    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString(),
      targetShortlist,
      status: 'active',
      candidates,
    };

    const updatedJobs = [...jobs, newJob];
    saveJobs(updatedJobs);
    return newJob;
  }, [jobs]);

  const getJob = useCallback((id: string) => {
    return jobs.find(job => job.id === id);
  }, [jobs]);

  const updateCandidate = useCallback((jobId: string, candidateId: string, updates: Partial<Candidate>) => {
    setJobs(prev => {
      const updated = prev.map(job => {
        if (job.id !== jobId) return job;
        return {
          ...job,
          candidates: job.candidates.map(c => 
            c.id === candidateId ? { ...c, ...updates } : c
          ),
        };
      });
      localStorage.setItem('irecruit_jobs', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addCandidates = useCallback((jobId: string, newCandidates: Candidate[]) => {
    setJobs(prev => {
      const updated = prev.map(job => {
        if (job.id !== jobId) return job;
        return {
          ...job,
          candidates: [...job.candidates, ...newCandidates],
        };
      });
      localStorage.setItem('irecruit_jobs', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('irecruit_settings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <JobContext.Provider value={{ jobs, createJob, getJob, updateCandidate, addCandidates, settings, updateSettings }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
