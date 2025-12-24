import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

type StatsCardProps = {
  title: string;
  value: number;
};

const StatsCard = ({ title, value }: StatsCardProps) => {
  return (
    <Card className="bg-muted">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="capitalize">{title}</CardTitle>
        <CardDescription className="text-4xl font-extrabold text-primary mt-[0px!important]">
          {value}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default StatsCard;

export const StatsLoadingCard = () => {
  return (
    <Card className="w-[330px] h-[88px]">
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
