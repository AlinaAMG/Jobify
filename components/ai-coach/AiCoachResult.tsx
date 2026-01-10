import { AiAnalysisResult } from '@/utils/types';
import CoverLetter from '@/components/ai-coach/CoverLetter';
import MatchScore from './MatchScore';
import SkillsJob from './SkillsJob';
import MatchingSkills from './MatchingSkills';
import MissingSkills from './MissingSkills';
import Strategy from './Strategy';

export type AiCoachResultProps = {
  data: AiAnalysisResult | null;
  onGenerate: () => void;
  isPending: boolean;
};

const AiCoachResult = ({ data, onGenerate, isPending }: AiCoachResultProps) => {
  if (!data) return null;

  // Debug om te zien wat er nu echt in die arrays zit
  console.log('Skills check:', {
    skills: data.skills,
    matching: data.matchingSkills,
  });

  return (
    <div className="grid  gap-6 mt-8 animate-in fade-in">
      {/* 1. Key Skills / Keywords Section */}
      <SkillsJob skills={data.skills && data.skills.length > 0 ? data.skills : data.matchingSkills} />
      {/*2. Match Score sectie */}
      <div className="md:col-span-1">
        <MatchScore score={data.matchScore || 85} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {/*3. Matching Skills */}
        <MatchingSkills matchingSkills={data.matchingSkills} />

        {/*4. Missing Skills */}
        <MissingSkills missingSkills={data.missingSkills} />
      </div>

      {/* 5. De kernmissie en strategie sectie */}
      <Strategy summary={data.mission} interviewTip={data.strategy} />

      <CoverLetter
        content={data.coverLetter}
        onGenerate={onGenerate}
        isPending={isPending}
      />
    </div>
  );
};

export default AiCoachResult;
