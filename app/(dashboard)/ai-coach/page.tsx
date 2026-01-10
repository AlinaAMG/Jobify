'use client';

import AiCoachForm from '@/components/ai-coach/AiCoachForm';
import AiCoachResult from '@/components/ai-coach/AiCoachResult';
import AiCoachSkeleton from '@/components/ai-coach/AiCoachSkeleton';
import {
  getProfileAction,
  getSingleJobAction,
  startAiAnalysisAction,
  updateProfileAction,
} from '@/utils/actions';
import {
  AiAnalysisResult,
  AiCoachFormSchema,
  AiCoachFormValues,
} from '@/utils/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const AiCoachPage = () => {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AiAnalysisResult | null>(null);
  const searchParams = useSearchParams();
  const jobId = searchParams.get('id');
  const router = useRouter();

  const form = useForm<AiCoachFormValues>({
    resolver: zodResolver(AiCoachFormSchema),
    defaultValues: {
      description: '',
      resume: '',
    },
  });

  useEffect(() => {
    const loadData = async () => {
      // Haal beide tegelijk op voor snelheid
      const [job, profile] = await Promise.all([
        jobId ? getSingleJobAction(jobId) : Promise.resolve(null),
        getProfileAction(),
      ]);

      if (job || profile) {
        form.reset({
          description: job?.description || '',
          resume: profile?.resume || '',
        });
      }
    };

    loadData();
  }, [jobId]);
  
  const handleSubmit = (values: AiCoachFormValues) => {
    startTransition(async () => {
      try {
        // Roep de actie aan met de handmatige jobDescription
        const data = await startAiAnalysisAction(
          jobId || null,
          values.resume,
          values.description
        );

        if (data) {
          if (jobId) {
            // Met ID: Stuur door naar de database-pagina
            router.push(`/ai-coach/${jobId}`);
            form.reset({
              resume: '',
              description: '',
            });
          } else {
            // ZONDER ID: Update de state die je al hebt!
            setResult(data as AiAnalysisResult);
            toast.success('Analyse voltooid!');
            form.reset({
              resume: '',
              description: '',
            });
          }
        }
      } catch (error) {
        toast.error('Er ging iets mis tijdens de analyse.');
      }
    });
  };
  return (
    <div className="mx-auto p-4 sm:p-8 space-y-10 bg-muted rounded">
      <section>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          AI Carrière Coach {jobId ? 'voor Vacature' : ''}
        </h1>
        <p className="text-lg text-muted-foreground">
          {jobId
            ? 'De vacaturetekst is ingeladen. Controleer je CV en start de analyse.'
            : 'Plak een vacaturetekst en laat de AI je helpen.'}
        </p>
      </section>

      <section className="bg-background rounded-xl shadow-sm border p-4">
        <AiCoachForm
          form={form}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </section>

      <section className="min-h-[400px]">
        {isPending && <AiCoachSkeleton />}
        {!isPending && result && <AiCoachResult data={result} />}
        {!isPending && !result && (
          <div className="h-full min-h-[250px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-muted-foreground">
            <p>Klik op de knop om de analyse te starten...</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AiCoachPage;