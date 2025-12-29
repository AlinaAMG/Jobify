import { UseFormReturn } from 'react-hook-form';
import { Button } from './ui/button';
import { CustomFormTextarea } from './FormComponents';
import { AiCoachFormValues } from '@/utils/types';
import { Form } from './ui/form';

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
          placeholder="Plak een vacaturetext hier..."
        />
        <Button
          type="submit"
          className="self-end capitalize min-w-[140px]"
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">Analyseren...</span>
          ) : (
            'Analyseer Vacature'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AiCoachForm;
