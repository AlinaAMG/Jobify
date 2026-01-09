'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  JobStatus,
  JobMode,
  createAndEditJobSchema,
  CreateAndEditJobType,
} from '@/utils/types';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import {
  CustomFormField,
  CustomFormSelect,
  CustomFormTextarea,
} from './FormComponents';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { getSingleJobAction, updateJobAction } from '@/utils/actions';
toast;
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Calendar24 } from './Calendar';

function EditJobForm({ jobId }: { jobId: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => getSingleJobAction(jobId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateAndEditJobType) =>
      updateJobAction(jobId, values),
    onSuccess: (data, values) => {
      if (!data) {
        toast.error('Er is iets misgegaan');
        return;
      }

      // 1. Controleer of de cruciale AI-velden zijn aangepast
      // We vergelijken de nieuwe waarden (values) met de originele (job)
      const isAiContentChanged =
        values.position !== data?.position ||
        values.company !== data?.company ||
        values.description !== data?.description;

      toast.success('Wijzigingen opgeslagen!', { duration: 3000 });

      // 2.Refresh de data
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });

      // 3. De juiste routering
      if (isAiContentChanged) {
        // Alleen naar AI-coach als de omschrijving veld, functietitel of bedrijfsnaam echt veranderd is
        toast.success(
          'Start nu een nieuwe AI-analyse voor de aangepaste tekst.',
          { icon: '✨' }
        );
        router.push(`/ai-coach/${jobId}`);
      } else {
        // Als alleen de status/tijd is aangepast, gaan we gewoon terug naar de vacatures pagina
        router.push('/jobs');
      }
    },
  });

  // 1. Define your form.
  const form = useForm<CreateAndEditJobType>({
    resolver: zodResolver(createAndEditJobSchema),
    defaultValues: {
      position: data?.position || '',
      company: data?.company || '',
      location: data?.location || '',
      status: (data?.status as JobStatus) || JobStatus.Pending,
      interviewDate: data?.interviewDate
        ? new Date(data.interviewDate)
        : undefined,
      interviewTime: data?.interviewTime || '',
      mode: (data?.mode as JobMode) || JobMode.FullTime,
      description: data?.description || '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: CreateAndEditJobType) {
    mutate(values);
  }

  const currentStatus = form.watch('status');

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-muted p-8 rounded"
      >
        <h2 className="capitalize font-semibold text-4xl mb-6">
          Vacature Bijwerken
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
          {/* position */}
          <CustomFormField name="position" control={form.control} />
          {/* company */}
          <CustomFormField name="company" control={form.control} />
          {/* location */}
          <CustomFormField name="location" control={form.control} />

          {/* job status */}
          <CustomFormSelect
            name="status"
            control={form.control}
            labelText="job status"
            items={Object.values(JobStatus)}
          />

          {/* job  type */}
          <CustomFormSelect
            name="mode"
            control={form.control}
            labelText="job mode"
            items={Object.values(JobMode)}
          />
          {currentStatus === 'interview' && (
            <div className="p-4 border rounded-lg bg-slate-50/50 my-4 animate-in fade-in zoom-in-95 grid col-span-2">
              <Calendar24
                dateValue={form.getValues('interviewDate')}
                onDateChange={(date) => form.setValue('interviewDate', date)}
                timeValue={form.watch('interviewTime')}
                onTimeChange={(time) => form.setValue('interviewTime', time)}
              />
            </div>
          )}

          <div className=" grid col-span-2 lg:col-span-3">
            <CustomFormTextarea
              name="description"
              control={form.control}
              labelText="Omschrijving"
            />
          </div>

          <Button
            type="submit"
            className="self-end capitalize"
            disabled={isPending}
          >
            {isPending ? 'bijwerken...' : 'bewerken '}
          </Button>
        </div>
      </form>
    </Form>
  );
}
export default EditJobForm;
