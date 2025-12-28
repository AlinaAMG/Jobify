import { Skeleton } from "./ui/skeleton";

const PaginationSkeleton = () => {
    return (
        <div className="flex gap-x-2 mt-8 justify-end mb-8">
            {/* PREV button skeleton */}
            <Skeleton className="h-10 w-24" />
  
            {/* Gesimuleerde Page Buttons inclusief de DOTS */}
            <div className="flex gap-x-2">
                {/* Eerste pagina */}
                <Skeleton className="h-10 w-10" />
          
                {/* De DOTS (...) skeleton */}
                <Skeleton className="h-10 w-10 opacity-50" />
          
                {/* Huidige pagina + omringende pagina's */}
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
          
                {/* Tweede set DOTS (...) skeleton */}
                <Skeleton className="h-10 w-10 opacity-50" />
  
                {/* Laatste pagina */}
                <Skeleton className="h-10 w-10" />
            </div>
  
            {/* NEXT button skeleton */}
            <Skeleton className="h-10 w-24" />
        </div>
    );
}
export default PaginationSkeleton;