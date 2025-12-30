import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const AiCoachSkeleton = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/*Skills Skeleton */}
      <Card className="border-none shadow-none bg-slate-50/50">
        <CardHeader>
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* missie Skeleton */}
        <Card className="h-full min-h-[250px]">
          <CardHeader>
            <Skeleton className="h-4 w-32 " />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-4/6" />
          </CardContent>
        </Card>

        {/* Coach Strategie Skeleton */}
        <Card className="h-full min-h-[250px]">
          <CardHeader>
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full " />
            <Skeleton className="h-4 w-5/6 " />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-4/6" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AiCoachSkeleton;
