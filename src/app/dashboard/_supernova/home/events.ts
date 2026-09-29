import type { BookedSlot } from "@/lib/services/calendar.service";

export interface CalendarEvent {
  day: number;
  month: number;
  year: number;
  title: string;
  time: string;
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** A booked mentor session, placed on the calendar by its start time. */
export function toCalendarEvent(slot: BookedSlot): CalendarEvent {
  const date = new Date(slot.availability_slot.start_time);
  return {
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
    title: `Session with ${slot.name}`, // Uses the 'name' field from model
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}
