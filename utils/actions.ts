'use server';

import { prisma } from './db';
import { auth } from '@clerk/nextjs/server';
import {
  JobType,
  CreateAndEditJobType,
  createAndEditJobSchema,
  GetAllJobsActionTypes,
  AiAnalysisResult,
} from './types';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

// import { GoogleGenerativeAI } from '@google/generative-ai';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// export const analyzeWithGemini = async (
//   jobDescription: string
// ): Promise<AiAnalysisResult> => {
//   if (!jobDescription) throw new Error('Geen vacaturetekst ontvangen');
//   try {
//     const model = genAI.getGenerativeModel(
//       { model: 'gemini-1.5-flash' },
//       { apiVersion: 'v1' }
//     );

//     // Gebruik hier ook jobDescription
//     const prompt = `
//     Jij bent een ervaren Career Coach. Analyseer de volgende vacaturetekst en geef een strategisch advies in het Nederlands.
    
//     Vacaturetekst: ${jobDescription} 

//     Reageer ALTIJD in het volgende JSON formaat:
//     {
//       "skills": ["skill 1", "skill 2", "skill 3", "skill 4", "skill 5"],
//       "summary": "Een krachtige samenvatting van de kernmissie van de rol in 1 of 2 zinnen.",
//       "interviewTip": "Een concreet, strategisch advies voor het sollicitatiegesprek."
//     }

//     Belangrijk: 
//     - De taal MOET Nederlands zijn.
//     - Geen markdown-opmaak, alleen pure JSON.
//   `;

//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     const text = response.text();

//     console.log('RAW AI RESPONSE:', text);

//     const cleanJson = text.replace(/```json|```/gi, '').trim();

//     try {
//       return JSON.parse(cleanJson);
//     } catch (parseError) {
//       console.error('JSON PARSE FOUT:', cleanJson);
//       throw new Error('De AI stuurde geen geldig overzicht terug.');
//     }
//   } catch (error: any) {
//     console.error('VOLLEDIGE GOOGLE ERROR:', error);
//     if (error.message?.includes('429'))
//       throw new Error('Te veel aanvragen. Wacht even.');
//     if (error.message?.includes('403'))
//       throw new Error('API Key rechten probleem (check AI Studio).');

//     throw new Error('Er ging iets mis bij de AI: ' + error.message);
//   }
// };
export const analyzeWithGemini = async (jobDescription: string) => {
  // 1. Simuleer AI-verwerkingstijd van 2.5 seconden
 
  await new Promise((resolve) => setTimeout(resolve, 2500));

  if (!jobDescription || jobDescription.length < 10) {
    throw new Error("Voer een geldige vacaturetekst in.");
  }

  return {
    skills: [
      "React & Next.js", 
      "TypeScript", 
      "Tailwind CSS", 
      "Zod",
      "Clerk",
      "API Integratie", 
      "UI/UX Design"
    ],
    summary: "Deze rol bij een innovatieve startup focust op het bouwen van schaalbare dashboards. Je bent verantwoordelijk voor de volledige frontend lifecycle en werkt nauw samen met backend engineers.",
    interviewTip: "Bereid je voor op vragen over 'Server Components' en laat zien hoe je de performance van grote datasets in een grid optimaliseert."
  };
};

function authenticateAndRedirect(): string {
  const { userId } = auth();

  if (!userId) redirect('/');
  return userId;
}

export async function createJobAction(
  values: CreateAndEditJobType
): Promise<JobType | null> {
  // await new Promise(resolve=>setTimeout(resolve,3000))
  const userId = authenticateAndRedirect();
  try {
    createAndEditJobSchema.parse(values);
    const job: JobType = await prisma.job.create({
      data: {
        ...values,
        clerkId: userId,
      },
    });

    return job;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const getAllJobsAction = async ({
  search,
  jobStatus,
  page = 1,
  limit = 10,
}: GetAllJobsActionTypes): Promise<{
  jobs: JobType[];
  count: number;
  page: number;
  totalPages: number;
}> => {
  const userId = authenticateAndRedirect();
  try {
    let whereClause: Prisma.JobWhereInput = {
      clerkId: userId,
    };

    if (search) {
      whereClause = {
        ...whereClause,
        OR: [
          {
            position: {
              contains: search,
            },
          },
          {
            company: {
              contains: search,
            },
          },
        ],
      };
    }

    if (jobStatus && jobStatus !== 'all') {
      whereClause = {
        ...whereClause,
        status: jobStatus,
      };
    }

    const skip = (page - 1) * limit;

    const jobs: JobType[] = await prisma.job.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
    const count: number = await prisma.job.count({
      where: whereClause,
    });
    const totalPages = Math.ceil(count / limit);
    return { jobs, count, page, totalPages };
  } catch (error) {
    return { jobs: [], count: 0, page: 1, totalPages: 0 };
  }
};

export const deleteJobAction = async (id: string): Promise<JobType | null> => {
  const userId = authenticateAndRedirect();

  try {
    const job: JobType = await prisma.job.delete({
      where: {
        id,
        clerkId: userId,
      },
    });
    return job;
  } catch (error) {
    return null;
  }
};

export const getSingleJobAction = async (
  id: string
): Promise<JobType | null> => {
  let job: JobType | null = null;
  const userId = authenticateAndRedirect();
  try {
    job = await prisma.job.findUnique({
      where: {
        id,
        clerkId: userId,
      },
    });
  } catch (error) {
    job = null;
  }
  if (!job) {
    redirect('/jobs');
  }
  return job;
};

export const updateJobAction = async (
  id: string,
  values: CreateAndEditJobType
): Promise<JobType | null> => {
  const userId = authenticateAndRedirect();
  try {
    const job: JobType = await prisma.job.update({
      where: {
        id,
        clerkId: userId,
      },
      data: {
        ...values,
      },
    });
    return job;
  } catch (error) {
    return null;
  }
};
export const getStatsAction = async (): Promise<{
  pending: number;
  interview: number;
  declined: number;
}> => {
  const userId = authenticateAndRedirect();
  try {
    const stats = await prisma.job.groupBy({
      where: {
        clerkId: userId,
      },
      by: ['status'],
      _count: {
        status: true,
      },
    });
    const statsObject = stats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);

    return {
      pending: 0,
      declined: 0,
      interview: 0,
      ...statsObject,
    };
  } catch (error) {
    redirect('/jobs');
  }
};

export const getChartsDataAction = async (): Promise<
  Array<{ date: string; count: number }>
> => {
  const userId = authenticateAndRedirect();
  const sixMonthsAgo = dayjs().subtract(6, 'month').toDate();
  try {
    const jobs = await prisma.job.findMany({
      where: {
        clerkId: userId,
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    let applicationsPerMonth = jobs.reduce((acc, job) => {
      const date = dayjs(job.createdAt).format('MMM YY');

      const existingEntry = acc.find((entry) => entry.date === date);
      if (existingEntry) {
        existingEntry.count += 1;
      } else {
        acc.push({ date, count: 1 });
      }
      return acc;
    }, [] as Array<{ date: string; count: number }>);
    return applicationsPerMonth;
  } catch (error) {
    redirect('/jobs');
  }
};
