'use client';

import { generateCoverLetterWithGemini } from '@/utils/actions';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { AiAnalysisResult } from '@/utils/types';
import { Copy, FileText, Loader, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type CoverLetterProps = {
  description: string;
  skills: string[];
};

const CoverLetter = ({ description, skills }: CoverLetterProps) => {
  const [showLetter, setShowLetter] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [aiResult, setAiResult] = useState<AiAnalysisResult | null>(null);

  const handleAnalyze = (description: string) => {
    if (!description) {
      toast.error('Voer eerst een vacature text in');
    }
    startTransition(async () => {
      try {
        const result = await generateCoverLetterWithGemini(description, skills);

        setAiResult(result);
        toast.success('Brief succesvol geschreven!');
      } catch (error) {
        toast.error('Ai error tijdens  het ophalen van data....');
      }
    });
  };
  return (
    <div className="w-full mt-8">
      {!showLetter || !aiResult ? (
        <div className="flex justify-center">
          <Button
            onClick={() => {
              handleAnalyze(description);
              setShowLetter(true);
            }}
            className=" text-white px-8 py-6 rounded-xl shadow-lg transition-all"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Brief wordt geschreven...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 mr-2" />
                Genereer Brief
              </>
            )}
          </Button>
        </div>
      ) : (
        <Card className="w-full border-indigo-200 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="flex flex-row items-center justify-between border-b border-indigo-50 bg-indigo-50/30">
            <div>
              <CardTitle className="text-xl font-bold text-indigo-800">
                Jouw Sollicitatiebrief
              </CardTitle>
              <p className="text-sm text-slate-500 italic dark:text-slate-100">
                Gegenereerd door AI Coach
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(aiResult.coverLetter);
                  toast.success('Brief Gekopieerd!');
                }}
                className=" h-9 bg-indigo-50 text-indigo-700 dark:hover:bg-primary"
              >
                <Copy className="w-4 h-4 mr-2" /> Kopiëren
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLetter(false)}
                className="h-9 bg-indigo-50 text-indigo-700 dark:hover:bg-primary flex items-center gap-2 "
              >
                <X className="w-4 h-4 " />
                Verbergen
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8 bg-white">
            <div className="max-w-2xl mx-auto border-l-4 border-indigo-100 pl-8 py-2">
              <p className="whitespace-pre-wrap text-slate-800 leading-relaxed font-serif text-lg">
                {aiResult.coverLetter}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoverLetter;
