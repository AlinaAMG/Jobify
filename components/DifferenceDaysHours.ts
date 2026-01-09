
import { differenceInDays, differenceInHours } from "date-fns";

export const differenceDaysHours = (date: Date, time: string) => {
  // Combineer datum en tijd voor een nauwkeurige berekening
  const interviewDateTime = new Date(date);
  if (time) {
    const [hours, minutes] = time.split(':');
    interviewDateTime.setHours(parseInt(hours), parseInt(minutes));
  }

  const now = new Date();
  const diffInHours = differenceInHours(interviewDateTime, now);
  const diffInDays = differenceInDays(interviewDateTime, now);

  if (diffInHours < 0) {
    return { color: "bg-gray-100 text-gray-500", text: "Geweest" };
  }
  if (diffInHours <= 24) {
    return { 
      color: "bg-red-100 text-red-700 border-red-200 animate-pulse", 
      text: diffInHours <= 1 ? "Laatste uur!" : `Nog ${diffInHours} uur over` 
    };
  }
  if (diffInDays <= 3) {
    return { 
      color: "bg-orange-100 text-orange-700 border-orange-200", 
      text: `Nog ${diffInDays} ${diffInDays === 1 ? 'dag' : 'dagen'}` 
    };
  }
  return { 
    color: "bg-green-100 text-green-700 border-green-200", 
    text: `Nog ${diffInDays} dagen` 
  };
};