'use server';

import { prisma } from './db';
import { auth } from '@clerk/nextjs/server';
import {
  JobType,
  CreateAndEditJobType,
  createAndEditJobSchema,
  GetAllJobsActionTypes,
  AiAnalysisResult,
  JobWithAiCoach,
} from './types';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { callAI } from './ai-service';
import { revalidatePath } from 'next/cache';

export const analyzeJobAndCvWithGemini = async (
  description: string,
  resume: string
) => {
  const prompt = `
  Context:
Ik ben een sollicitant. Hieronder vind je twee teksten:
1. De VACATURETEKST waar ik op wil solliciteren.
2. Mijn eigen CV (ERVARING).

VACATURE: "${description}"
MIJN CV: "${resume}" 
  Opdracht:

Voer een diepe analyse uit. Vergelijk mijn skills met de eisen van de vacature. 
Geef een JSON object terug met:
- "matchScore": een getal tussen 0-100 (wees eerlijk!).
- "skills": de 6 belangrijkste keywords uit de vacature.
- "summary": een korte conclusie over de match.
- "interviewTip": waar moet ik op letten in het gesprek gezien mijn CV?
- "matchingSkills": welke skills uit mijn CV sluiten aan?
- "missingSkills": welke belangrijke skills uit de vacature heb ik nog niet?

    
    BELANGRIJK: Alles moet in het Nederlands geschreven zijn.`;

  return await callAI('google/gemini-2.0-flash-001', [
    { role: 'system', content: 'Je bent een carrièrecoach. Antwoord in JSON.' },
    { role: 'user', content: prompt },
  ]);
};
export const generateCoverLetterWithGemini = async (
  description: string,
  skills: string[]
) => {
  const prompt = `Schrijf een professionele en overtuigende sollicitatiebrief voor de volgende vacature: "${description}". 
    Focus specifiek op deze vaardigheden: ${skills.join(', ')}. 

    GEEF UITSLUITEND JSON TERUG: 
    { 
      "coverLetter": "De volledige tekst van de brief. Gebruik \\n voor nieuwe regels." 
    }

    RICHTLIJNEN:
    - Gebruik een professionele maar enthousiaste toon.
    - Zorg dat de brief in foutloos Nederlands is.
    - Ontwijk het gebruik van echte enters in de JSON-waarde; gebruik alleen \\n.`;

  try {
    const result = await callAI('google/gemini-2.0-flash-001', [
      {
        role: 'system',
        content:
          'Je bent een professionele AI-carrièrecoach die uitsluitend valide JSON objecten genereert. Gebruik NOOIT markdown code blocks of gewone tekst.',
      },
      { role: 'user', content: prompt },
    ]);

    // Extra veiligheid: Controleer of het veld bestaat
    if (!result || !result.coverLetter) {
      throw new Error('Geen brief ontvangen van AI');
    }

    return result;
  } catch (error) {
    console.error('Fout in generateCoverLetter:', error);
    // Geef een fallback terug zodat de UI niet crasht
    return {
      coverLetter:
        'Er is een fout opgetreden bij het genereren van de brief. Probeer het opnieuw.',
    };
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
              content: `Jij bent de Jobify AI Coach,een expert in de Nederlandse aardbeidsmarkt,gefocused op snelheid en efficiëntie. Houd je antwoorden kort en kractig en to-the-point.'
                
                RICHTLIJNEN:
                - Geef direct antwoord zonder inleidende beleefdheden (geen "Wat leuk dat je...", geen "Ik help je graag"), op basis van de skills die de gebruiker heeft gevraagd.
                -Gebruik de skills die de gebruiker heeft gevraagd om
                antwoord te geven.
                
                - Gebruik maximaal 2-3 korte alinea's of een compacte bullet-lijst.
                - Gebruik actieve taal en vermijd herhaling.
                - Als een vraag onduidelijk is, stel dan één korte verhelderende vraag.
                - Focus op direct resultaat voor de gebruiker.`,
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
export const startAiAnalysisAction = async (
  jobId: string | null,
  resumeText: string,
  manualJobDescription?: string
) => {
  const userId = authenticateAndRedirect();
  try {
    let descriptionToAnalyze = '';

    // STAP 1: Bepaal welke vacaturetekst we gebruiken
    if (jobId) {
      const job = await prisma.job.findFirst({
        where: {
          id: jobId,
          clerkId: userId,
        },
      });

      if (!job) throw new Error('Job niet gevonden');
      descriptionToAnalyze = job.description;
    } else if (manualJobDescription) {
      descriptionToAnalyze = manualJobDescription;
    } else {
      throw new Error('Geen vacaturetekst beschikbaar voor analyse');
    }

    // STAP 2: Voer de AI analyse uit
    const analysis = await analyzeJobAndCvWithGemini(
      descriptionToAnalyze,
      resumeText
    );
    const data = typeof analysis === 'string' ? JSON.parse(analysis) : analysis;

    if (jobId) {
      const aiRecord = await prisma.aiCoach.upsert({
        where: { jobId },
        update: {
          matchingScore: data.matchScore,
          strategy: data.summary, // DB naam is strategy
          mission: data.interviewTip, // DB naam is mission
          matchingSkills: Array.isArray(data.matchingSkills)
            ? data.matchingSkills.join(', ')
            : data.matchingSkills,
          missingSkills: Array.isArray(data.missingSkills)
            ? data.missingSkills.join(', ')
            : data.missingSkills,
        },
        create: {
          jobId,
          matchingScore: data.matchScore,
          strategy: data.summary,
          mission: data.interviewTip,
          matchingSkills: Array.isArray(data.matchingSkills)
            ? data.matchingSkills.join(', ')
            : data.matchingSkills,
          missingSkills: Array.isArray(data.missingSkills)
            ? data.missingSkills.join(', ')
            : data.missingSkills,
        },
      });
      revalidatePath('/jobs');
      revalidatePath(`/ai-coach/${jobId}`);
      revalidatePath('/ai-coach');

      // BELANGRIJK: Map de database namen naar jouw AiAnalysisResult namen
      return {
        matchingScore: aiRecord.matchingScore,
        strategy: aiRecord.strategy,
        mission: aiRecord.mission,
        // FIX: Zet de string uit de DB altijd om naar een Array voor de UI
        matchingSkills:
          typeof aiRecord.matchingSkills === 'string'
            ? aiRecord.matchingSkills.split(', ').filter(Boolean)
            : [],
        missingSkills:
          typeof aiRecord.missingSkills === 'string'
            ? aiRecord.missingSkills.split(', ').filter(Boolean)
            : [],
        skills:
          typeof aiRecord.matchingSkills === 'string'
            ? aiRecord.matchingSkills.split(', ').filter(Boolean)
            : [],
        coverLetter: aiRecord.coverLetter || '',
        resume: resumeText,
      } as AiAnalysisResult;
    }

    // STAP 4: Geen jobId? (Handmatige versie)

    return {
      matchingScore: data.matchingScore,
      strategy: data.summary || data.strategy,
      mission: data.interviewTip || data.mission,
      matchingSkills: data.matchingSkills || [],
      missingSkills: data.missingSkills || [],
      skills: data.matchingSkills || [], // Zorg dat skills gevuld is
      coverLetter: data.coverLetter || '',
      resume: resumeText,
    } as AiAnalysisResult;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const startGenerateLetterAction = async (jobId: string) => {
  const { userId } = auth(); // Of je authenticateAndRedirect()
  if (!userId) throw new Error('Niet geautoriseerd');

  try {
    // 1. Haal de job en de bestaande analyse op
    const job = await prisma.job.findUnique({
      where: { id: jobId, clerkId: userId },
      include: { aiCoach: true },
    });

    if (!job || !job.aiCoach) {
      throw new Error('Voer eerst de AI-analyse uit.');
    }

    // 2. Roep je Gemini brief-functie aan
    // We splitsen de skills-string weer even op naar een array
    const skillsArray = job.aiCoach.matchingSkills.split(', ');

    const letterResponse = await generateCoverLetterWithGemini(
      job.description,
      skillsArray
    );

    // 3. JSON check (om [object Object] errors te voorkomen)
    const cleanJson =
      typeof letterResponse === 'string'
        ? JSON.parse(
            letterResponse
              .replace(/```json/g, '')
              .replace(/```/g, '')
              .trim()
          )
        : letterResponse;

    // 4. Update de AiCoach record in de database
    const updatedRecord = await prisma.aiCoach.update({
      where: { jobId: jobId },
      data: {
        coverLetter: cleanJson.coverLetter,
      },
    });

    // 5. Ververs de pagina zodat de brief direct verschijnt
    revalidatePath(`/ai-coach/${jobId}`);

    return updatedRecord;
  } catch (error) {
    console.error('Fout bij genereren brief:', error);
    throw error;
  }
};

function authenticateAndRedirect(): string {
  const { userId } = auth();

  if (!userId) redirect('/');
  return userId;
}

export const getProfileAction = async () => {
  const { userId } = auth();

  if (!userId) return null;

  try {
    const profile = await prisma.profile.findUnique({
      where: {
        clerkId: userId,
      },
    });
    return profile;
  } catch (error) {
    console.error('Fout bij ophalen profiel:', error);
    return null;
  }
};

export const updateProfileAction = async (resumeText: string) => {
  const { userId } = auth();
  if (!userId) throw new Error('Niet ingelogd');

  const profile = await prisma.profile.upsert({
    where: { clerkId: userId },
    update: { resume: resumeText },
    create: { clerkId: userId, resume: resumeText },
  });

  revalidatePath('/ai-coach');
  return profile;
};

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
  jobs: JobWithAiCoach[];
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

    const jobs = await prisma.job.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        aiCoach: true,
      },
      orderBy: [
        {
          status: 'desc',
        },

        {
          aiCoach: {
            matchingScore: 'asc',
          },
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    const count: number = await prisma.job.count({
      where: whereClause,
    });
    const totalPages = Math.ceil(count / limit);
    return {
      jobs: jobs as JobWithAiCoach[],
      count,
      page,
      totalPages,
    };
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
): Promise<JobWithAiCoach | null> => {
  const userId = authenticateAndRedirect();
  try {
    const job = await prisma.job.findUnique({
      where: {
        id,
        clerkId: userId,
      },
      include: {
        aiCoach: true,
      },
    });
    if (!job) {
      redirect('/jobs');
    }

    return job as JobWithAiCoach;
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT')
      throw error;

    redirect('/jobs');
    return null;
  }
};

export const updateJobAction = async (
  id: string,
  values: CreateAndEditJobType
): Promise<JobType | null> => {
  const userId = authenticateAndRedirect();
  try {
    // 1. Update de Job data (titel, omschrijving, etc.)
    const job: JobType = await prisma.job.update({
      where: {
        id,
        clerkId: userId,
      },
      data: {
        ...values,
      },
    });
    // 2. Verwijder de AiCoach record die bij deze Job hoort

    await prisma.aiCoach.deleteMany({
      where: {
        jobId: id,
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
