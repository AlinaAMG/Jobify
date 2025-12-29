'use client';

import AiCoachForm from '@/components/AiCoachForm';
import AiCoachResult from '@/components/AiCoachResult';
import {
  AiAnalysisResult,
  AiCoachFormSchema,
  AiCoachFormValues,
} from '@/utils/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

const AiCoachPage = () => {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AiAnalysisResult | null>(null);
  const form = useForm<AiCoachFormValues>({
    resolver: zodResolver(AiCoachFormSchema),
    defaultValues: {
      description: '',
    },
  });

  const handleSubmit = () => {};
  return <></>;
};

export default AiCoachPage;
