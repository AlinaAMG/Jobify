import { differenceInDays, differenceInHours } from "date-fns";

export type UrgencyLevel = {
  color: string;
  text: string;
  variant: "default" | "warning" | "destructive" | "success";
};

export const differenceDaysHours = (date: Date, time: string | null | undefined): UrgencyLevel => {
  const interviewDateTime = new Date(date);
  
  if (time) {
    const [hours, minutes] = time.split(':');
    interviewDateTime.setHours(parseInt(hours), parseInt(minutes));
  }

  const now = new Date();
  const diffInHours = differenceInHours(interviewDateTime, now);
  const diffInDays = differenceInDays(interviewDateTime, now);

  // 1. Al geweest
  if (diffInHours < 0) {
    return { color: "bg-slate-100 text-slate-500", text: "Geweest", variant: "default" };
  }
  
  // 2. Zeer urgent (minder dan 24 uur)
  if (diffInHours <= 24) {
    return { 
      color: "bg-red-100 text-red-700 border-red-200 animate-pulse", 
      text: diffInHours <= 1 ? "Laatste uur!" : `Nog ${diffInHours} uur`,
      variant: "destructive"
    };
  }
  
  // 3. Gemiddeld urgent (tussen 1 en 3 dagen)
  if (diffInDays <= 3) {
    const dayText = diffInDays === 1 ? 'dag' : 'dagen';
    return { 
      color: "bg-orange-100 text-orange-700 border-orange-200", 
      text: `Nog ${diffInDays} ${dayText}`,
      variant: "warning"
    };
  }
  
  // 4. Toekomst (meer dan 3 dagen)
  return { 
    color: "bg-green-100 text-green-700 border-green-200", 
    text: `Nog ${diffInDays} dagen`,
    variant: "success"
  };
};