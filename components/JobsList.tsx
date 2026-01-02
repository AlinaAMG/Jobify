'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import JobCard from './JobCard';
import { getAllJobsAction } from '@/utils/actions';
import { useQuery } from '@tanstack/react-query';

import { ComplexButtonContainer } from './ComplexButtonContainer';
import { JobCardSkeleton } from './JobCardSkeleton';
import PaginationSkeleton from './PaginationSkeleton';
import { Skeleton } from './ui/skeleton';
import { SearchX } from 'lucide-react';
import { Button } from './ui/button';

const JobsList = () => {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const jobStatus = searchParams.get('jobStatus') || 'all';

  const pageNumber = +(searchParams.get('page') || '1');

  const { data, isPending } = useQuery({
    queryKey: ['jobs', search, jobStatus, pageNumber],
    queryFn: () => getAllJobsAction({ search, jobStatus, page: pageNumber }),
  });

  const jobs = data?.jobs || [];

  const count = data?.count || [];
  const page = data?.page || 0;
  const totalPages = data?.totalPages || 0;

  if (isPending)
    return (
      <>
        <div className="flex flex-col md:flex-row  items-center justify-between ">
          <div className="flex items-center gap-x-2">
            {/* Count Skeleton */}
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-32" />
          </div>
          {/* Pagination skeleton */}
          <PaginationSkeleton />
        </div>
        {/* grid met 10 kaarten skeleton */}
        <div className="grid sm:grid-cols-2 gap-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      </>
    );

  const handleReset = () => {
    router.push(pathname);
  };

  if (jobs.length === 0) {
    return (
      <>
        {/* De Header blijft staan voor de structuur */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold capitalize">
            Geen vacatures gevonden
          </h2>
        </div>

        {/* We tonen de skeletons om de layout te vullen */}
        <div className="relative">
          <div className="grid sm:grid-cols-2 gap-5 opacity-40 grayscale">
            {Array.from({ length: 4 }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/95 p-8 rounded-xl border shadow-lg flex flex-col items-center text-center">
              {/* Maak van het icoon een knop */}
              <Button
                variant="ghost"
                size="icon"
                className="w-16 h-16 rounded-full mb-4 hover:bg-destructive/10 hover:text-destructive transition-colors"
                onClick={handleReset}
              >
                <SearchX className="w-10 h-10" />
              </Button>

              <h2 className="text-xl font-semibold">
                Geen vacatures gevonden ...
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Klik op het icoon om alle filters te wissen
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row  items-center justify-between mb-8">
        <h2 className="text-xl mb-3  md:mb-0 font-semibold capitalize">
          {count} vacatures gevonden
        </h2>
        {totalPages > 2 && (
          <ComplexButtonContainer currentPage={page} totalPages={totalPages} />
        )}
      </div>
      {/* BUTTON CONTAINER */}
      <div className="grid md:grid-cols-2 gap-8">
        {jobs.map((job) => {
          return <JobCard key={job.id} job={job} />;
        })}
      </div>
    </>
  );
};

export default JobsList;
