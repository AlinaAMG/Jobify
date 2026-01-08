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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJobAction } from '@/utils/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const CreateJobForm = () => {
  const form = useForm<CreateAndEditJobType>({
    resolver: zodResolver(createAndEditJobSchema),
    mode: 'onChange',
    defaultValues: {
      position: '',
      company: '',
      location: '',
      status: JobStatus.Pending,
      mode: JobMode.FullTime,
      description: '',
    },
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateAndEditJobType) => createJobAction(values),
    onSuccess: (data) => {
      if (!data) {
        toast('There was an error');
        return;
      }
      toast('Job Created');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['charts'] });

      router.push('/jobs');
    },
  });

  const onSubmit = (values: CreateAndEditJobType) => {
    console.log('Formulier succesvol gevalideerd:', values);
    mutate(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-8 rounded bg-muted"
      >
        <h2 className="mb-6 text-4xl font-semibold capitalize">
          Vacature Toevoegen
        </h2>
        <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* POSITION */}
          <CustomFormField name="position" control={form.control} />
          {/* COMPANY */}
          <CustomFormField name="company" control={form.control} />
          {/* LOCATION */}
          <CustomFormField name="location" control={form.control} />
          {/* JOB STATUS  */}
          <CustomFormSelect
            name="status"
            control={form.control}
            labelText="Status"
            items={Object.values(JobStatus)}
          />
          {/* JOB MODE */}

          <CustomFormSelect
            name="mode"
            control={form.control}
            labelText="Dienstverband"
            items={Object.values(JobMode)}
          />
          <div className="grid  md:col-span-2 lg:col-span-3">
            <CustomFormTextarea
              name="description"
              control={form.control}
              labelText="Omschrijving"
            />
          </div>
          <Button
            type="submit"
            className="self-end capitalize "
            disabled={isPending}
          >
            {isPending ? 'opslaan' : 'vacature toevoegen'}
          </Button>
        </div>
        <div className="text-red-500 font-bold">
          {form.formState.errors.description?.message}
          {form.formState.errors.position?.message}
        </div>
      </form>
    </Form>
  );
};

export default CreateJobForm;
