export type Goal = 'Fuerza' | 'Pérdida de peso' | 'Movilidad' | 'Bienestar general'
export type Level = 'Inicial' | 'Intermedio' | 'Avanzado'
export type Equipment = 'Sin equipamiento' | 'Mancuernas' | 'Bandas' | 'Colchoneta'
export type Tab = 'Inicio' | 'Entrenamiento' | 'Ejercicios' | 'Progreso' | 'Calendario' | 'Configuración'
export interface Exercise { id: string; name: string; category: string; muscles: string[]; equipment: Equipment[]; level: Level; instructions: string[]; duration?: number; reps?: number; wristSensitive?: boolean; video?: VideoAsset }
export interface VideoAsset { kind: 'local' | 'youtube'; url: string; externalUrl?: string; source: string; license: string; status: 'verified' | 'pending'; checkedAt?: string }
export interface Profile { id: string; name: string; age: number; height: number; weight: number; goal: Goal; level: Level; equipment: Equipment[]; limitations: string; daysPerWeek?: number; trainingDays?: number[]; sessionMinutes?: number; startDate?: string; targetDate?: string; hydration: boolean; avoidWristExercises?: boolean; createdAt: string }
export interface WorkoutExercise extends Exercise { sets: number; targetReps: number; rest: number; completed: boolean }
export interface Workout { id: string; profileId: string; date: string; duration: number; exercises: WorkoutExercise[]; completed: boolean }
