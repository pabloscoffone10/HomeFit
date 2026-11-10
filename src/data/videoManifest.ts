import type { VideoAsset } from '../types'

type VideoEntry = [id: string, youtubeId: string, source: string]

const entries: VideoEntry[] = [
  ['sentadilla', 'OOsb9DNs8dI', 'NASM — Trainer Tip: Proper Squat Form'],
  ['zancada', 'g8-Ge9S0aUw', 'How To Do A Forward Lunge'],
  ['puente-gluteo', 'SKOMwg1JLrU', 'How to do a Glute Bridge'],
  ['peso-muerto', 'aa57T45iFSE', 'NASM — Dumbbell Romanian Deadlift | Proper Form & Technique'],
  ['elevacion-talones', 'Km0QS46bTEA', 'Standing Calf Raises'],
  ['flexiones', 'WDIpL0pjun0', 'NASM — How to do a Push-Up | Proper Form & Technique'],
  ['press-hombros', 'MMjBnEBnZKM', 'How to do a Dumbbell Overhead Press'],
  ['remo', 'DmUX88nWClo', 'How to do a Supported Bent-Over Dumbbell Row'],
  ['plancha', 'mwlp75MS6Rg', 'NASM — How to do a Plank | Proper Form & Technique'],
  ['dead-bug', 'bxn9FBrt4-A', 'NASM — How to do a Dead Bug | Proper Form & Technique'],
  ['bird-dog', 'ZdAHe9_HeEw', 'NASM — How to do a Bird Dog | Proper Form & Technique'],
  ['mountain-climber', 'ZhiCSdOVJp0', 'How to Do Mountain Climbers Properly'],
  ['jumping-jacks', 'uLVt6u15L98', 'NASM — How to do a Jumping Jack | Proper Form & Technique'],
  ['burpee', 'Ny8JWqh4lNg', 'NASM — How to Do a Squat Thrust (Burpees) | Proper Form & Technique'],
  ['abduccion-cadera', 'g9FtnmsIYgI', 'Side Lying Hip Abduction'],
  ['estiramiento-gato-vaca', '1Y0YjXS9sKI', 'Physical Therapists — Cat Cow Stretch'],
  ['rotacion-toracica', 'C8wzQhlXPx8', 'How to do a Thoracic Rotation Stretch'],
  ['curl-biceps', 'XE_pHwbst04', 'Bicep Curls — Dumbbell Form & Technique'],
  ['extension-triceps', 'nRiJVZDpdL0', 'How to Do Triceps Dumbbell Extensions'],
  ['superman', 'J9zXkxUAfUA', 'Core Exercise: Superman']
]

const checkedAt = '2026-11-09'

export const verifiedVideos: Record<string, VideoAsset> = Object.fromEntries(
  entries.map(([exerciseId, youtubeId, source]) => [exerciseId, {
    kind: 'youtube',
    url: `https://www.youtube.com/embed/${youtubeId}?controls=1&rel=0&loop=1&playlist=${youtubeId}`,
    externalUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
    source,
    license: 'Reproducción mediante el reproductor oficial incrustado de YouTube; no se descarga ni redistribuye.',
    status: 'verified',
    checkedAt
  }])
)

export const videoReport = {
  totalExercises: 20,
  functionalVideos: entries.length,
  pending: 20 - entries.length,
  note: 'Todos los videos verificados se reproducen mediante el reproductor oficial incrustado; no se descargan.'
}
