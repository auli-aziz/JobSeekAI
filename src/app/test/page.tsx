'use client';

import { useState } from 'react';

type Job = {
  id: number;
  job_id: number;
  title: string;
  company_name: string;
  company_logo?: string;
  location: string;
  job_type: string;
  category: string;
  description: string;
  similarityScore?: number;
};

type JobsResponse = {
  jobs: Job[];
};

export default function JobSearchPage() {
  const [category, setCategory] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');
  const [userId, setUserId] = useState('402c091e-db8c-45f4-9b31-a5f13260ef96');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (jobType) params.append('jobType', jobType);
    if (location) params.append('location', location);
    if (userId) params.append('userId', userId);

    const res = await fetch(`/api/jobs?${params.toString()}`);
    const data = await res.json() as JobsResponse;
    setJobs(data.jobs ?? []);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Job Search</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Category (e.g., Backend)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Job Type (e.g., Full-Time)"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Location (e.g., Remote)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="User ID (optional for resume matching)"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>

      <div className="mt-6">
        {jobs.length === 0 && !loading && <p>No jobs found.</p>}
        {jobs.map((job) => (
          <div
            key={job.id}
            className="border rounded p-4 mb-4 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-sm text-gray-600">{job.company_name} — {job.location}</p>
            <p className="text-sm italic text-gray-500">{job.job_type} | {job.category}</p>
            {job.similarityScore !== undefined && (
              <p className="text-green-600 font-medium mt-2">
                Similarity Score: {(job.similarityScore * 100).toFixed(2)}%
              </p>
            )}
            <p className="mt-2 text-gray-700 line-clamp-4">{job.description}</p>
          </div>
        ))}

        <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
          {JSON.stringify(jobs, null, 2)}
        </pre>

      </div>
    </div>
  );
}

