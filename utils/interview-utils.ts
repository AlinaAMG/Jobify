export type UrgencyLevel = {
  color: string;
  text: string;
  variant: 'default' | 'warning' | 'destructive' | 'success';
};
export const getDifferenceDaysHours = (date: any, time?: string) => {
  if (!date) return null;

  // 1. Maak de datums aan
  const nu = new Date();

  // Maak een schone datum van de input (bijv. "2024-05-20")
  const dateStr = new Date(date).toISOString().split('T')[0];
  const timeStr = time || '23:59';

  // Combineer ze naar een lokaal leesbare string
  const interviewDate = new Date(`${dateStr}T${timeStr}:00`);

  // 2. Bereken het verschil
  const diffInMs = interviewDate.getTime() - nu.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  console.log(`FIXED DEBUG: Uren: ${diffInHours}, Dagen: ${diffInDays}`);

  // --- LOGICA ---

  if (diffInMs < 0) {
    return {
      color: 'bg-slate-800 text-white border-slate-900 px-2',
      text: 'Verstreken',
    };
  }

  if (diffInHours < 24) {
    return {
      color: 'bg-red-600 text-white animate-pulse',
      text: diffInHours < 1 ? 'Nu bezig!' : `Nog ${diffInHours} uur`,
    };
  }

  // Hier zat de fout voor de witte background (we dekken nu alles af)
  if (diffInDays === 1) {
    return { color: 'bg-orange-500 text-white', text: 'Morgen' };
  }

  if (diffInDays <= 3) {
    return {
      color: 'bg-amber-500 text-white',
      text: `Over ${diffInDays} dagen`,
    };
  }

  return {
    color: 'bg-emerald-500 text-white',
    text: `Over ${diffInDays} dagen`,
  };
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
