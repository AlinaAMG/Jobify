'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Button } from './ui/button';

type ButtonContainerProps = {
  currentPage: number;
  totalPages: number;
};

const ButtonContainer = ({ currentPage, totalPages }: ButtonContainerProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageButtons = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (page: number) => {
    const defaultParams = {
      search: searchParams.get('search') || '',
      jobStatus: searchParams.get('jobStatus') || '',
      page: String(page),
    };
      let params = new URLSearchParams(defaultParams);
      
      router.push(`${pathname}? ${params.toString()}`);
  };

  return (
    <div className="flex gap-x-2">
      {pageButtons &&
        pageButtons.map((page) => {
          return (
            <Button
              key={page}
              size="icon"
              variant={currentPage === page ? 'default' : 'outline'}
            >
              {page}
            </Button>
          );
        })}
    </div>
  );
};

export default ButtonContainer;
