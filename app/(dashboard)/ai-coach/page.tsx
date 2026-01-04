'use client';

import AiCoachForm from '@/components/ai/AiCoachForm';
import AiCoachResult from '@/components/ai/AiCoachResult';
import AiCoachSkeleton from '@/components/ai/AiCoachSkeleton';
import { analyzeJobAndCvWithGemini } from '@/utils/actions';
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
      resume: '',
    },
  });
  const handleSubmit = (values: AiCoachFormValues) => {
    setResult(null);
    startTransition(async () => {
      try {
        const data = await analyzeJobAndCvWithGemini(
          values.description,
          values.resume
        );
        setResult(data);
        toast.success('Analyse voltooid!');
        form.setValue('description', '');
      } catch (error) {
        toast.error('Analyse mislukt. Probeer het later opnieuw.');
      }
    });
  };

  return (
    <div className=" mx-auto p-4 sm:p-8 space-y-10 bg-muted rounded">
      {/* Header sectie */}
      <section>
        <h1 className="text-4xl font-extrabold tracking-tight  mb-2">
          AI Carrière Coach
        </h1>
        <p className="text-lg">
          Plak een vacaturetekst en laat de AI de belangrijkste vaardigheden en
          gespreksstrategieën voor je vinden.
        </p>
      </section>

      {/* Formulier sectie */}
      <section className=" rounded-xl shadow-sm border border-slate-100 p-1">
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
          <div className="h-full min-h-[250px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center ">
            <p>Jouw analyse resultaten verschijnen hier...</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AiCoachPage;
