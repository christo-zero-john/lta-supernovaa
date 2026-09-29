import type { ShortlistedCourse } from "@/lib/services/course.service";

/** What a recommendation card shows, taken from a shortlisted course. */
export interface UniversityCardProps {
  chance: string;
  badge: string;
  name: string;
  location: string;
  course: string;
  intake: string;
  cost: string;
}

export function universityCardProps(item: ShortlistedCourse): UniversityCardProps {
  return {
    chance: `${item.admission_percentage}%`,
    badge: `Rank #${item.rank}`,
    name: item.course.university.name,
    location: item.course.university.address,
    course: item.course.name,
    intake: `${item.course.start_semesters?.[0] || "Multiple"} Intake`,
    cost: `Starting: ${item.course.cost_of_living || "N/A"}`,
  };
}
