import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Separator } from "./ui/separator"
import { Skeleton } from "./ui/skeleton"


export const JobCardSkeleton = () => {
  return (
      <Card className="bg-muted">
        <CardHeader>
          {/* Titel Skeleton */}
          <Skeleton className="h-5 w-[60%] mb-2 " />
          {/* Company Skeleton */}
          <Skeleton className="h-4 w-[40%]" />
        </CardHeader>

        <Separator />

        <CardContent className="mt-4 grid grid-cols-2 gap-4">
          {/* We bootsen de 4 JobInfo items na */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" /> {/* Icon */}
            <Skeleton className="h-4 w-20" /> {/* Text */}
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          {/* De Badge met status */}
          <Skeleton className="h-7 w-32 rounded-full" />
        </CardContent>

        <CardFooter className="flex gap-4">
          <Skeleton className="h-9 w-[70px]" /> {/* Edit button */}
          <Skeleton className="h-9 w-[80px]" /> {/* Delete button */}
        </CardFooter>
      </Card>
  )
}
