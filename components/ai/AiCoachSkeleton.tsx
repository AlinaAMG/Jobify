import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const AiCoachSkeleton = () => {
  return (
    <div className="grid gap-6 mt-8">
      {/* 1. Skills Skeleton */}
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-7 w-24 rounded-full" />
          ))}
        </CardContent>
      </Card>

      {/* 2. Match Score Skeleton */}
      <Card className="flex flex-col items-center justify-center p-6 h-48">
        <Skeleton className="h-32 w-32 rounded-full" />
        <Skeleton className="h-4 w-24 mt-4" />
      </Card>

      {/* 3 & 4. Kernmissie & Strategie Grid */}
      <div className="grid md:grid-cols-2 gap-3">
        {/* Kernmissie */}
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>

        {/* Coach Strategie */}
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>

      {/* Cover Letter Button/Section Skeleton */}
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
  
};

export default AiCoachSkeleton;
