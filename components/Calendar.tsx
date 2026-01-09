"use client"

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type Calendar24Props = {
  dateValue: Date | undefined | null;
  onDateChange: (date: Date | undefined) => void;
  timeValue: string | undefined | null;
  onTimeChange: (time: string | undefined) => void;
};

export function Calendar24({
  dateValue,
  onDateChange,
  timeValue,
  onTimeChange,
}: Calendar24Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-wrap gap-4 items-end">
      {/* DATUM PICKER */}
      <div className="flex flex-col gap-3">
        <Label
          htmlFor="date-picker"
          className="px-1 text-xs font-semibold uppercase text-muted-foreground"
        >
          Datum
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className={cn(
                'w-[160px] justify-between text-left font-normal',
                !dateValue && 'text-muted-foreground'
              )}
            >
              {dateValue ? format(dateValue, 'dd-MM-yyyy') : 'Kies datum'}
              <CalendarIcon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateValue ?? undefined}
              onSelect={(date) => {
                onDateChange(date);
                setOpen(false);
              }}
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* TIJD PICKER */}
      <div className="flex flex-col gap-3">
        <Label
          htmlFor="time-picker"
          className="px-1 text-xs font-semibold uppercase text-muted-foreground"
        >
          Tijdstip
        </Label>
        <Input
          type="time"
          id="time-picker"
          value={timeValue || ''}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-[120px] bg-background"
        />
      </div>
    </div>
  );
}