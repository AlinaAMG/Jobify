'use server';

import { prisma } from './db';
import { auth } from '@clerk/nextjs/server';
import {
  JobType,
  CreateAndEditJobType,
  createAndEditJobSchema,
  GetAllJobsActionTypes,
} from './types';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';


export const analyzeWithGemini = async (jobDescription: string) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OpenRouter API Key ontbreekt in .env.local');
  }

  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [
            {
              role: 'system',
              content:
                'Je bent een behulpzame carrièrecoach. Antwoord uitsluitend in valide JSON.',
            },
            {
              role: 'user',
              content: `Analyseer deze vacature: "${jobDescription.replace(
                /"/g,
                "'"
              )}". 
              
              Geef een JSON object terug met exact deze structuur: 
              {
                "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"],
                "summary": "Een krachtige samenvatting van max 5 zinnen.",
                "interviewTip": "Een psychologische tip zonder clichés.",
                "coverLetter": "Een brief van 4 paragrafen."
              }

              Instructies:
              - De 'skills' array moet exact 6 items bevatten.
              - De 'interviewTip' moet een concrete actie of vraag zijn die de kandidaat kan stellen.
              - De 'coverLetter' moet gebaseerd zijn op de gevonden skills en de vacature-inhoud.
              - Alles moet in het Nederlands.`,
            },
          ],

          response_format: { type: 'json_object' },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter Error:', data);
      throw new Error(data.error?.message || 'OpenRouter weigert toegang');
    }

    const content = data.choices[0].message.content;

    const cleanJsonString = content.replace(/```json|```/g, '').trim();

    return JSON.parse(cleanJsonString);
  } catch (error: any) {
    console.error('Analyse Error:', error.message);
    throw new Error('AI Analyse mislukt: ' + error.message);
  }
};

export async function ChatAssistantWithGeminiAction(
  history: { role: string; content: string }[],
  userInput: string
) {
  if (!userInput) return { success: false, content: 'Geen input ontvangen' };

  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [
            {
              role: 'system',
              content:
                'Jij bent de Jobify AI Coach. Je helpt ingelogde gebruikers op hun dashboard met vragen over de Jobify app, sollicitatietips en carrière-advies.',
            },
            ...history.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            { role: 'user', content: userInput },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) throw new Error('OpenRouter API fout');

    return {
      success: true,
      content: data.choices[0].message.content,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      content: 'Er is een verbindingsfout. Probeer het over een momentje weer.',
    };
  }
}


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
