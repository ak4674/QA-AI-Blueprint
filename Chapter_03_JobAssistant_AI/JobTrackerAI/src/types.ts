// ─── My Jobs (Kanban) ────────────────────────────────────────────────────────
export type JobStatus =
  | 'Saved'
  | 'Applied'
  | 'Screening'
  | 'Interviewing'
  | 'Offer'
  | 'Rejected'
  | 'Archived';

export interface Job {
  id: string;
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  resumeUsed?: string;
  dateApplied: number;
  salaryRange?: string;
  location?: string;
  notes?: string;
  status: JobStatus;
  matchScore?: number;
}

// ─── Job Board (Scraped Jobs) ─────────────────────────────────────────────────
export type JobSource = 'LinkedIn' | 'Naukri' | 'Career Pages' | 'Other';

export interface ScrapedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  source: JobSource;
  datePosted: number;
  url: string;
  saved: boolean;
  logoColor: string;
  experience?: string;
}

// ─── Target Companies ─────────────────────────────────────────────────────────
export interface Company {
  id: string;
  name: string;
  industry?: string;
  location: string;
  website?: string;
  jobCount: number;
  networkCount: number;
  logoColor: string;
  logoText: string;
  dateAdded: number;
  notes?: string;
}

// ─── Recruitment Agencies ─────────────────────────────────────────────────────
export interface Agency {
  id: string;
  name: string;
  location: string;
  website?: string;
  jobCount: number;
  networkCount: number;
  logoColor: string;
  logoText: string;
  dateAdded: number;
  notes?: string;
}

// ─── My Network ───────────────────────────────────────────────────────────────
export type NetworkStatus =
  | 'Sent'
  | 'Accepted'
  | 'Engagement'
  | 'Converted'
  | 'Rejected';

export type ContactTag =
  | 'Open Job'
  | 'Target Company'
  | 'Potential Referrer'
  | 'Hiring Manager'
  | 'Recruiter';

export interface NetworkContact {
  id: string;
  name: string;
  title: string;
  company: string;
  linkedinUrl?: string;
  avatarColor: string;
  status: NetworkStatus;
  tags: ContactTag[];
  dateAdded: number;
  notes?: string;
}
