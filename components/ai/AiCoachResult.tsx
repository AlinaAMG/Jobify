import { AiAnalysisResult } from '@/utils/types';
import CoverLetter from '@/components/ai/CoverLetter';
import MatchScore from './MatchScore';
import SkillsJob from './SkillsJob';
import MatchingSkills from './MatchingSkills';
import MissingSkills from './MissingSkills';
import Strategy from './Strategy';

export type AiCoachResultProps = {
  data: AiAnalysisResult | null;
};

const AiCoachResult = ({ data }: AiCoachResultProps) => {
  if (!data) return null;

  return (
    <div className="grid  gap-6 mt-8 animate-in fade-in">
      {/* 1. Key Skills / Keywords Section */}
      <SkillsJob skills={data?.skills} />
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
      <Strategy summary={data.summary} interviewTip={data.interviewTip} />

      <CoverLetter description={data.summary} skills={data.skills} />
    </div>
  );
};

export default AiCoachResult;
