import { Button } from '../ui/button';
import { Copy, FileText, Loader, X, Sparkles } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../ui/card';
import { useState } from 'react';
import { toast } from 'sonner';

type CoverLetterProps = {
  // We accepteren string of object om errors te voorkomen
  content?: string | { coverLetter: string };
  isPending: boolean;
  onGenerate: () => void;
};

const CoverLetter = ({ content, isPending, onGenerate }: CoverLetterProps) => {
  const [showLetter, setShowLetter] = useState(false);

  // Helper om altijd een string te krijgen, ook als de AI een object teruggeeft
  const displayContent =
    typeof content === 'object' && content !== null
      ? content.coverLetter
      : content;

  return (
    <div className="w-full mt-10">
      {/* 1. DE KNOP (Alleen tonen als er geen brief is of als hij verborgen is) */}
      {(!displayContent || !showLetter) && (
        <div className=" flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl bg-slate-50/50">
          <div className="bg-white p-3 rounded-full shadow-sm mb-4">
            <Sparkles className="w-6 h-6 text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Persoonlijke Sollicitatiebrief
          </h3>
          <p className="text-sm dark:text-slate-700 text-muted-foreground mb-6 text-center max-w-xs">
            Laat AI een brief schrijven op basis van de vacature en jouw skills.
          </p>
          <Button
            onClick={() => {
              onGenerate();
              setShowLetter(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-6 rounded-xl shadow-lg transition-all"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                AI Schrijft je brief...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 mr-2" />
                {displayContent
                  ? 'Toon Gegenereerde Brief'
                  : 'Genereer Brief met AI'}
              </>
            )}
          </Button>
        </div>
      )}

      {/* 2. DE BRIEF KAART (Alleen tonen als er content is en showLetter true is) */}
      {displayContent && showLetter && !isPending && (
        <Card className="w-full border-indigo-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
          <CardHeader className="flex flex-row items-center justify-between border-b border-indigo-50 bg-indigo-50/40 p-6">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Sollicitatiebrief
              </CardTitle>
              <CardDescription className="text-indigo-800/70">
                Op maat gemaakt voor deze vacature
              </CardDescription>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(displayContent);
                  toast.success('Gekopieerd naar klembord!');
                }}
                className="bg-white border-indigo-100 text-indigo-700 hover:bg-indigo-50"
              >
                <Copy className="w-4 h-4 mr-2" /> Kopiëren
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLetter(false)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-10 ">
            <div className="max-w-3xl mx-auto">
              {/* De brief styling */}
              <div className="prose prose-slate max-w-none">
                <p className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg font-serif dark:text-slate-300">
                  {displayContent}
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-400 italic">
                  Gegenereerd door jouw AI Carrière Coach
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoverLetter;
