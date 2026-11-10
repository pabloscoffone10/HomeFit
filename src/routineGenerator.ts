import type { Exercise, Profile, WorkoutExercise } from './types'

export const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
export const getTrainingDays = (profile: Profile) => {
  const count = Math.max(2, Math.min(6, profile.daysPerWeek ?? 3))
  const days = profile.trainingDays?.filter((day) => Number.isInteger(day) && day >= 0 && day <= 6) ?? [1, 3, 5]
  return [...new Set(days)].sort((a, b) => a - b).slice(0, count)
}

const goalOrder: Record<Profile['goal'], string[]> = {
  Fuerza: ['Piernas', 'Tren superior', 'Espalda', 'Brazos', 'Glúteos', 'Core'],
  'Pérdida de peso': ['Cardio', 'Piernas', 'Core', 'Tren superior', 'Glúteos'],
  Movilidad: ['Movilidad', 'Core', 'Glúteos'],
  'Bienestar general': ['Piernas', 'Tren superior', 'Core', 'Movilidad', 'Cardio', 'Glúteos']
}

export function generateRoutineForDay(profile: Profile, catalog: Exercise[], dayIndex = 0): WorkoutExercise[] {
  const avoidWrist = profile.avoidWristExercises ?? /muñec|munec/i.test(profile.limitations)
  const equipment = profile.equipment?.length ? profile.equipment : ['Sin equipamiento']
  const allowed = catalog.filter((exercise) => exercise.equipment.some((item) => equipment.includes(item)) && (!avoidWrist || !exercise.wristSensitive))
  const order = goalOrder[profile.goal]
  const ranked = [...allowed].sort((a, b) => (order.indexOf(a.category) + (a.level === profile.level ? 0 : 2)) - (order.indexOf(b.category) + (b.level === profile.level ? 0 : 2)))
  const sets = profile.level === 'Inicial' ? 2 : profile.level === 'Intermedio' ? 3 : 4
  const maxExercises = Math.max(3, Math.min(8, Math.floor((profile.sessionMinutes ?? 20) / 5)))
  const rotated = ranked.length ? ranked.map((_, index) => ranked[(index + dayIndex * 2) % ranked.length]) : ranked
  return rotated.slice(0, maxExercises).map((exercise) => ({ ...exercise, sets, targetReps: exercise.duration || (profile.goal === 'Fuerza' ? 8 : 12), rest: profile.level === 'Avanzado' ? 75 : 60, completed: false }))
}

export function generateRoutine(profile: Profile, catalog: Exercise[]): WorkoutExercise[] {
  return generateRoutineForDay(profile, catalog, 0)
}

export function generateWeeklyPlan(profile: Profile, catalog: Exercise[]) {
  return getTrainingDays(profile).map((day, index) => ({ day, label: weekDays[day], exercises: generateRoutineForDay(profile, catalog, index) }))
}
