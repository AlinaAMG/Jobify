'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { startGenerateLetterAction } from '@/utils/actions'; 
import { toast } from 'sonner';


 const GenerateLetterBtn = ({ jobId }: { jobId: string }) => {
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      try {
        const result = await startGenerateLetterAction(jobId);
        if (result) {
          toast.success('Brief succesvol gegenereerd!');
        } else {
          toast.error('Er ging iets mis bij het opslaan.');
        }
      } catch (error) {
        console.error(error);
        toast.error('AI kon de brief niet genereren.');
      }
    });
  };

  return (
    <Button 
      onClick={handleGenerate} 
      disabled={isPending}
      size="lg"
      className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg transition-all"
    >
      {isPending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          AI schrijft je brief...
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5" />
          Genereer Sollicitatiebrief
        </>
      )}
    </Button>
  );
};

export default GenerateLetterBtn;