import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Job, ScrapedJob, Company, Agency, NetworkContact } from './types';

interface JobTrackerDB extends DBSchema {
  jobs: {
    key: string;
    value: Job;
    indexes: { 'by-date': number };
  };
  scraped_jobs: {
    key: string;
    value: ScrapedJob;
    indexes: { 'by-date': number };
  };
  companies: {
    key: string;
    value: Company;
    indexes: { 'by-date': number };
  };
  agencies: {
    key: string;
    value: Agency;
    indexes: { 'by-date': number };
  };
  network_contacts: {
    key: string;
    value: NetworkContact;
    indexes: { 'by-date': number };
  };
}

let dbPromise: Promise<IDBPDatabase<JobTrackerDB>>;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<JobTrackerDB>('job-tracker-db', 2, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('jobs')) {
          const store = db.createObjectStore('jobs', { keyPath: 'id' });
          store.createIndex('by-date', 'dateApplied');
        }
        if (!db.objectStoreNames.contains('scraped_jobs')) {
          const store = db.createObjectStore('scraped_jobs', { keyPath: 'id' });
          store.createIndex('by-date', 'datePosted');
        }
        if (!db.objectStoreNames.contains('companies')) {
          const store = db.createObjectStore('companies', { keyPath: 'id' });
          store.createIndex('by-date', 'dateAdded');
        }
        if (!db.objectStoreNames.contains('agencies')) {
          const store = db.createObjectStore('agencies', { keyPath: 'id' });
          store.createIndex('by-date', 'dateAdded');
        }
        if (!db.objectStoreNames.contains('network_contacts')) {
          const store = db.createObjectStore('network_contacts', { keyPath: 'id' });
          store.createIndex('by-date', 'dateAdded');
        }
      },
    });
  }
  return dbPromise;
}

// ─── Jobs (My Jobs Kanban) ───
export async function addJob(job: Job) { return (await getDB()).add('jobs', job); }
export async function updateJob(job: Job) { return (await getDB()).put('jobs', job); }
export async function deleteJob(id: string) { return (await getDB()).delete('jobs', id); }
export async function getAllJobs() { return (await getDB()).getAll('jobs'); }
export async function clearAllJobs() { return (await getDB()).clear('jobs'); }

// ─── Scraped Jobs (Job Board) ───
export async function addScrapedJob(job: ScrapedJob) { return (await getDB()).add('scraped_jobs', job); }
export async function updateScrapedJob(job: ScrapedJob) { return (await getDB()).put('scraped_jobs', job); }
export async function deleteScrapedJob(id: string) { return (await getDB()).delete('scraped_jobs', id); }
export async function getAllScrapedJobs() { return (await getDB()).getAll('scraped_jobs'); }

// ─── Target Companies ───
export async function addCompany(company: Company) { return (await getDB()).add('companies', company); }
export async function updateCompany(company: Company) { return (await getDB()).put('companies', company); }
export async function deleteCompany(id: string) { return (await getDB()).delete('companies', id); }
export async function getAllCompanies() { return (await getDB()).getAll('companies'); }

// ─── Recruitment Agencies ───
export async function addAgency(agency: Agency) { return (await getDB()).add('agencies', agency); }
export async function updateAgency(agency: Agency) { return (await getDB()).put('agencies', agency); }
export async function deleteAgency(id: string) { return (await getDB()).delete('agencies', id); }
export async function getAllAgencies() { return (await getDB()).getAll('agencies'); }

// ─── Network Contacts ───
export async function addNetworkContact(contact: NetworkContact) { return (await getDB()).add('network_contacts', contact); }
export async function updateNetworkContact(contact: NetworkContact) { return (await getDB()).put('network_contacts', contact); }
export async function deleteNetworkContact(id: string) { return (await getDB()).delete('network_contacts', id); }
export async function getAllNetworkContacts() { return (await getDB()).getAll('network_contacts'); }
