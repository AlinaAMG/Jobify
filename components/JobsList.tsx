'use client';

import { useSearchParams } from 'next/navigation';
import JobCard from './JobCard';
import { getAllJobsAction } from '@/utils/actions';
import { useQuery } from '@tanstack/react-query';

const JobsList = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const jobStatus = searchParams.get('jobStatus') || 'all';

  const pageNumber = +(searchParams.get('page') || '1');

  const { data, isPending } = useQuery({
    queryKey: ['jobs', search, jobStatus, pageNumber],
    queryFn: () => getAllJobsAction({ search, jobStatus, page: pageNumber }),
  });

  const jobs = data?.jobs || [];

  if (isPending)
    return <h2 className="text-xl font-medium capitalize">Loading...</h2>;
  if (jobs.length === 0)
    return <h2 className="text-xl font-medium capitalize">No jobs found...</h2>;

  return (
    <>
      {/* BUTTON CONTAINER */}
      <div className="grid md:grid-cols-2 gap-8">
        {jobs.map((job) => {
          return <JobCard key={job.id} job={job} />;
        })}
      </div>
      {/* PAGINATION CONTAINER */}
    </>
  );
};

export default JobsList;
