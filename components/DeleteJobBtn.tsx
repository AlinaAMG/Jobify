import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { deleteJobAction } from '@/utils/actions';
import { toast } from 'sonner';

const DeleteJobBtn = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteJobAction(id),
    onSuccess: (data) => {
      if (!data) {
        toast('there was an error');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['charts'] });
      toast('Job Removed');
    },
  });
  return (
    <Button size="sm" disabled={isPending} onClick={() => mutate(id)}>
      {isPending ? 'deleting...' : 'delete'}
    </Button>
  );
};

export default DeleteJobBtn;
