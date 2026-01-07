import { FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import GenerateLetterBtn from "./GenerateLetterBtn"
import { AiCoachType } from "@/utils/types"

export type CoverLetterProps = {
    analysis: AiCoachType;
 }

const CoverLetter = ({analysis}:CoverLetterProps) => {
  return (
    <Card className="border-t-4 border-t-blue-500 shadow-md">
    <CardHeader>
      <div className="flex items-center gap-2">
        <FileText className="text-blue-500 w-5 h-5" />
        <CardTitle>Gegenereerde Sollicitatiebrief</CardTitle>
      </div>
    </CardHeader>
    <Separator />
    <CardContent className="pt-6">
      {analysis.coverLetter ? (
        // Als de brief bestaat: Toon de brief
        <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
          {analysis.coverLetter}
        </div>
      ) : (
        // Als er GEEN brief is: Toon de knop om hem te genereren
        <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-200 rounded-lg">
          <p className="text-muted-foreground mb-4">
            Klaar om te solliciteren? Laat de AI een brief op maat
            schrijven.
          </p>
          {/* Hier komt de GenerateLetterButton component die we eerder bespraken */}
          <GenerateLetterBtn jobId={analysis.id} />
        </div>
      )}
    </CardContent>
  </Card>
  )
}

export default CoverLetter