import { Button } from '@/components/ui/button';
import Link from 'next/link';

const NotFound = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold mt-4 mb-2">Page not found</h2> 
        <p className="text-muted-foreground mb-8">
          Oops! De page wat you are looking for does not exist...
        </p>
        <Button asChild>
          <Link href="/"> Back to Home Page</Link>
        </Button>
      </div>
    </main>
  );
};

export default NotFound;
