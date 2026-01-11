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
import { useEffect, useRef, useState } from 'react';

function EditJobForm({ jobId }: { jobId: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const hasLoadedData = useRef(false);

  const { data } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => getSingleJobAction(jobId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateAndEditJobType) =>
      updateJobAction(jobId, values),
    onSuccess: (updatedData, values) => {
      if (!updatedData) {
        toast.error('Er is iets misgegaan');
        return;
      }

      // 1. Controleer wijziging (vergelijk values met de data van de query)
      const isAiContentChanged =
        values.position !== data?.position ||
        values.company !== data?.company ||
        values.description !== data?.description;

      // 2. Cache direct updaten (voorkomt flikkering)
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });

      // 3. Routering + Gecombineerde Toast
      if (isAiContentChanged) {
        // We sturen ze direct door met een specifieke boodschap
        toast.success('Inhoud aangepast! Start een nieuwe AI-analyse.', {
          icon: '✨',
          duration: 4000,
        });
        router.push(`/ai-coach/${jobId}`);
      } else {
        // Alleen status/locatie etc. aangepast
        toast.success('Wijzigingen succesvol opgeslagen');
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

  useEffect(() => {
    if (data && isFirstLoad) {
      form.reset({
        ...data,
        status: data.status as JobStatus,
        mode: data.mode as JobMode,
        interviewDate: data.interviewDate
          ? new Date(data.interviewDate)
          : undefined,
      });
      setIsFirstLoad(false); // Zorg dat dit niet meer opnieuw gebeurt
    }
  }, [data, form, isFirstLoad]);

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
