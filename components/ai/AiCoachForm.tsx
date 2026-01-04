import { UseFormReturn } from 'react-hook-form';
import { Button } from '../ui/button';
import { CustomFormTextarea } from '../FormComponents';
import { AiCoachFormValues } from '@/utils/types';
import { Form } from '../ui/form';

type AiCoachFormProps = {
  form: UseFormReturn<AiCoachFormValues>;
  onSubmit: (values: AiCoachFormValues) => void;
  isPending: boolean;
};

const AiCoachForm = ({ onSubmit, form, isPending }: AiCoachFormProps) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 "
      >
        {/* Vacatureveld */}
        <CustomFormTextarea
          name="description"
          control={form.control}
          labelText="Vacaturetext"
          placeholder="Plak hier een vacaturetext die je wilt..."
        />
        {/* CV Veld */}
        <CustomFormTextarea
          name="resume"
          control={form.control}
          labelText="Jouw CV"
          placeholder="Plak hier je eigen werkervaring of CV text..."
        />
        <Button
          type="submit"
          className="capitalize justify-self-center md:col-span-2 mt-4 dark:text-slate-200"
          disabled={isPending}
          size="lg"
        >
          {isPending ? (
            <span className="flex items-center gap-2 ">Analyseren...</span>
          ) : (
            'Start Persoonlijke Ai Analyse & Match'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AiCoachForm;
