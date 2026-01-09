export type UrgencyLevel = {
  color: string;
  text: string;
};

export const getDifferenceDaysHours = (
  date: any,
  time?: string
): UrgencyLevel | null => {
  if (!date) return null;

  try {
    const nu = new Date();
    // 1. Zet 'nu' op het begin van de dag (00:00:00)
    const vandaag = new Date(nu.getFullYear(), nu.getMonth(), nu.getDate());

    // 2. Zet de interviewdatum op het begin van de dag
    const d = new Date(date);
    const interviewDag = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    // 3. Bereken het verschil in DAGEN (kalenderdagen)
    const diffInMs = interviewDag.getTime() - vandaag.getTime();
    const dagVerschil = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    // 4. Maak de exacte tijd voor de "Verstreken" check
    const [uren, minuten] = (time || '23:59').split(':').map(Number);
    const exacteTijd = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      uren,
      minuten
    );

    // --- DE LOGICA ---

    // A. VERSTREKEN (Nu is later dan de afspraaktijd)
    if (nu.getTime() > exacteTijd.getTime()) {
      return {
        color: 'bg-slate-800 text-white border-slate-900',
        text: 'Verstreken',
      };
    }

    // B. VANDAAG (Zelfde kalenderdag)
    if (dagVerschil === 0) {
      const msOver = exacteTijd.getTime() - nu.getTime();
      const minutenOver = Math.floor(msOver / (1000 * 60));
      const urenOver = Math.floor(msOver / (1000 * 60 * 60));
      let tijdTekst = '';
      if (minutenOver < 0) {
        tijdTekst = 'Nu bezig!';
      } else if (minutenOver < 60) {
        tijdTekst = `Nog ${minutenOver} min`;
      } else {
        tijdTekst = `Nog ${urenOver} uur`;
      }

      return {
        color: 'bg-red-600 text-white animate-pulse border-red-700',
        text: tijdTekst,
      };
    }

    // C. MORGEN (1 dag verschil)
    if (dagVerschil === 1) {
      return {
        color: 'bg-orange-700 text-white border-orange-700',
        text: 'Morgen',
      };
    }

    // D. OVER 2 OF 3 DAGEN (Amber kleur)
    if (dagVerschil === 2 || dagVerschil === 3) {
      return {
        color: 'bg-amber-500 text-white border-amber-500',
        text: `Over ${dagVerschil} dagen`,
      };
    }

    // E. OVER 4 DAGEN OF MEER (Groen)
    return {
      color: 'bg-emerald-500 text-white border-emerald-600',
      text: `Over ${dagVerschil} dagen`,
    };
  } catch (error) {
    return null;
  }
};
export const getStatusColor = (status: string) => {
  const s = status?.toLowerCase();

  switch (s) {
    case 'interview':
      // Groen: Er is actie en vooruitgang
      return 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100';

    case 'pending':
      // Oranje/Amber: Wachten op reactie
      return 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100';

    case 'declined':
      // Rood: Afgewezen
      return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100';

    default:
      // Grijs: Overig
      return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100';
  }
};
