export interface WorkoutParameters {
  exerciseTypes?: ("cardio" | "strength" | "both")[];
  muscleGroups?: string[];
  equipment?: string;
  duration?: number; // minutes
  workoutsPerWeek?: number;
  fitnessLevel?: "beginner" | "intermediate" | "advanced";
  specificDays?: string[];
  additionalInfo?: string;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}
