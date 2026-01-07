import * as z from 'zod';


export type JobType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  clerkId: string;
  position: string;
  description: string;
  company: string;
  location: string;
  status: string;
  mode: string;
  aiCoach?: AiCoachType | null;
};

export type AiCoachType = {
  id: string;
  matchingScore: number;
  mission: string;
  company?: string;
  strategy: string;
  missingSkills: string;
  matchingSkills: string;
  coverLetter?: string | null;
};

export enum JobStatus {
  Pending = 'pending',
  Interview = 'interview',
  Declined = 'declined',
}

export enum JobMode {
  FullTime = 'full-time',
  PartTime = 'part-time',
  Internship = 'internship',
}

export const createAndEditJobSchema = z.object({
  position: z.string().min(2, {
    message: 'position must be at least 2 characters.',
  }),
  company: z.string().min(2, {
    message: 'company must be at least 2 characters.',
  }),
  location: z.string().min(2, {
    message: 'location must be at least 2 characters.',
  }),
  status: z.nativeEnum(JobStatus),
  mode: z.nativeEnum(JobMode),
  description: z.string(),
});

export type CreateAndEditJobType = z.infer<typeof createAndEditJobSchema>;

export type GetAllJobsActionTypes = {
  search?: string;
  jobStatus?: string;
  page?: number;
  limit?: number;
};

export type AiAnalysisResult = {
  skills: string[];
  summary: string;
  interviewTip: string;
  coverLetter: string;
  matchScore: number;
  resume: string;
  matchingSkills: string[];
  missingSkills: string[];
};

export const AiCoachFormSchema = z.object({
  description: z.string().min(50, {
    message: 'De vacatureomschrijving is te kort. Voeg minimaal 50 tekens toe.',
  }),
  resume: z.string().min(20, {
    message: 'De cv text is te kort.Voeg minimaal 20 tekens toe.',
  }),
});
export type AiCoachFormValues = z.infer<typeof AiCoachFormSchema>;
