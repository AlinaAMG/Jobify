'use client';

import { getChartsDataAction } from '@/utils/actions';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ChartsContainer = () => {
  const { data } = useQuery({
    queryKey: ['charts'],
    queryFn: () => getChartsDataAction(),
  });
  if (!data || data.length === 0) return null;
  return (
    <div className="mt-16">
      <h1 className="text-4xl font-semibold text-center">
        Maandelijkse sollicitaties
      </h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#7c3aed" barSize={75} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartsContainer;
