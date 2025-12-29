import { Form, UseFormReturn } from 'react-hook-form';
import { Button } from './ui/button';

import { CustomFormTextarea } from './FormComponents';
import { AiCoachFormValues } from '@/utils/types';

type AiCoachFormProps = {
  form: UseFormReturn<AiCoachFormValues>;
  onSubmit: (values: AiCoachFormValues) => void;
  isPending: boolean;
};

const AiCoachForm = ({ onSubmit, form, isPending }: AiCoachFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormTextarea
          name="description"
          control={form.control}
          labelText="Job Description"
          placeholder="Paste the job requirements or description here..."
        />
        <Button
          type="submit"
          className="self-end capitalize min-w-[140px]"
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">Analyzing...</span>
          ) : (
            'Analyze Job'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AiCoachForm;
