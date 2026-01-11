'use client';

import AiCoachForm from '@/components/ai-coach/AiCoachForm';
import AiCoachResult from '@/components/ai-coach/AiCoachResult';
import AiCoachSkeleton from '@/components/ai-coach/AiCoachSkeleton';
import {
  generateCoverLetterWithGemini,
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
  const [isLetterPending, startLetterTransition] = useTransition();
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
        //  Sla het CV direct op in de database
        await updateProfileAction(values.resume);
        console.log('CV succesvol bijgewerkt in de database');

        const data = await startAiAnalysisAction(
          jobId || null,
          values.resume,
          values.description
        );

        if (data) {
          if (jobId) {
            // Met ID: Stuur door naar de database-pagina
            router.push(`/ai-coach/${jobId}`);
          } else {
            console.log('RAUWE DATA VAN ACTION:', data);
            // ZONDER ID: Update de state die je al hebt!
            const cleanData = (data as any).data ? (data as any).data : data;
            // setResult(data as AiAnalysisResult);
            setResult({
              ...cleanData,
              // Forceer deze velden naar boven als ze diep in een object zitten
              strategy: cleanData.strategy || cleanData.aiCoach?.strategy,
              mission: cleanData.mission || cleanData.aiCoach?.mission,
            } as AiAnalysisResult);
            toast.success('Analyse voltooid!');
          }
        }
      } catch (error) {
        toast.error('Er ging iets mis tijdens de analyse.');
      }
    });
  };

  const handleGenerateLetter = () => {
    const currentDescription = form.getValues('description');

    if (!currentDescription || currentDescription.trim() === '') {
      toast.error('Voer eerst een vacature tekst in');
      return; // Stop de functie hier!
    }

    // Gebruik de SPECIFIEKE transition voor de brief
    startLetterTransition(async () => {
      try {
        const response = await generateCoverLetterWithGemini(
          currentDescription,
          result?.skills || []
        );

        // Zorg dat we ALTIJD een string opslaan, ook als 'response' een object is
        const briefText =
          typeof response === 'object' ? response.coverLetter : response;

        setResult((prev) =>
          prev ? { ...prev, coverLetter: briefText } : null
        );
        toast.success('Brief succesvol geschreven!');
      } catch (error) {
        toast.error('Er ging iets mis bij het schrijven van de brief.');
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
        {!isPending && result && (
          <AiCoachResult
            data={result}
            onGenerate={handleGenerateLetter}
            isPending={isLetterPending}
          />
        )}
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