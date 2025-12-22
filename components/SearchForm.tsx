'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { JobStatus } from '@/utils/types';

const SearchForm = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const jobStatus = searchParams.get('jobStatus') || 'all';
  const router = useRouter();
  const pathname = usePathname();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    const jobStatus = formData.get('jobStatus') as string;
    let params = new URLSearchParams();
    params.set('search', search);
    params.set('jobStatus', jobStatus);

    router.push(`${pathname}? ${params.toString()}`);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 p-8 mb-16 rounded-lg bg-muted sm:grid-cols-2 md:grid-cols-3"
    >
      <Input type="text" placeholder="Search Jobs" defaultValue={search} name="search" />
      <Select name="jobStatus" defaultValue={jobStatus}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {['all', ...Object.values(JobStatus)].map((jobStatus) => {
            return (
              <SelectItem key={jobStatus} value={jobStatus}>
                {jobStatus}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Button type="submit">Search</Button>
    </form>
  );
};

export default SearchForm;
