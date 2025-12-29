'use client';

import AiCoachForm from '@/components/AiCoachForm';
import AiCoachResult from '@/components/AiCoachResult';
import AiCoachSkeleton from '@/components/AiCoachSkeleton';
import { analyzeWithGemini } from '@/utils/actions';
import {
  AiAnalysisResult,
  AiCoachFormSchema,
  AiCoachFormValues,
} from '@/utils/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const AiCoachPage = () => {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AiAnalysisResult | null>(null);

  const form = useForm<AiCoachFormValues>({
    resolver: zodResolver(AiCoachFormSchema),
    defaultValues: {
      description: '',
    },
  });
  const handleSubmit = (values: AiCoachFormValues) => {
    setResult(null);
    startTransition(async () => {
      try {
        const data = await analyzeWithGemini(values.description);
        setResult(data);
        toast.success('Analyse voltooid!');
      } catch (error) {
        toast.error('Analyse mislukt. Probeer het later opnieuw.');
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-10">
      {/* Header sectie */}
      <section>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
          AI Carrière Coach
        </h1>
        <p className="text-lg text-slate-500">
          Plak een vacaturetekst en laat de AI de belangrijkste vaardigheden en 
          gespreksstrategieën voor je vinden.
        </p>
      </section>

      {/* Formulier sectie */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-1">
        <AiCoachForm
          form={form}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </section>

      {/* Resultaat of Loading sectie */}
      <section className="min-h-[400px]">
        {isPending && <AiCoachSkeleton />}
        {!isPending && result && <AiCoachResult data={result} />}

        {!isPending && !result && (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
            <p>Jouw analyseresultaten verschijnen hier...</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AiCoachPage;
