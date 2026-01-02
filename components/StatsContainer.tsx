'use client';

import { getStatsAction } from '@/utils/actions';
import { useQuery } from '@tanstack/react-query';
import StatsCard from './StatsCard';

const StatsContainer = () => {
  const { data } = useQuery({
    queryKey: ['stats'],
    queryFn: () => getStatsAction(),
  });

  return (
    <div className="grid md:grid-cols-2 gap-4 lg:grid-cols-3">
      <StatsCard title="Lopende vacatures" value={data?.pending || 0} />
      <StatsCard title="Gesprekken gepland" value={data?.interview || 0} />
      <StatsCard title="Afgewezen" value={data?.declined || 0} />
    </div>
  );
};

export default StatsContainer;
