import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, CircleHelp, Dumbbell, Pause, Play, Plus, RotateCcw, SkipForward, Timer, Trophy, Video } from 'lucide-react'
import { exercises } from './data/exercises'
import { generateRoutine } from './routineGenerator'
import type { Exercise, Profile, WorkoutExercise } from './types'

type Phase = 'demo' | 'prep' | 'exercise' | 'rest' | 'finished'
type PersistedSession = { profileId: string; exerciseIndex: number; setIndex: number; phase: Phase; endsAt?: number; pausedRemaining?: number; paused?: boolean; completedReps: number; avoidWrist: boolean; updatedAt: number }
const SESSION_KEY = 'homefit-active-session'

function readSession(profileId: string): PersistedSession | null {
  try { const value = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') as PersistedSession | null; return value?.profileId === profileId ? value : null } catch { return null }
}
function writeSession(value: PersistedSession | null) { if (value) localStorage.setItem(SESSION_KEY, JSON.stringify(value)); else localStorage.removeItem(SESSION_KEY) }
const youtubePlayerErrors = new Set([2, 5, 100, 101, 150, 153])
function embedUrl(url: string) { const value = new URL(url); value.searchParams.set('enablejsapi', '1'); value.searchParams.set('origin', window.location.origin); return value.toString() }

export default function InteractiveTraining({ profile, onFinish }: { profile: Profile; onFinish: (minutes: number, count: number) => void }) {
  const baseRoutine = useMemo(() => generateRoutine(profile, exercises), [profile])
  const defaultAvoidWrist = profile.avoidWristExercises ?? /muñec|munec/i.test(profile.limitations)
  const [avoidWrist, setAvoidWrist] = useState(defaultAvoidWrist)
  const [videoFailed, setVideoFailed] = useState(false)
  const videoReadyRef = useRef(false)
  const routine = useMemo(() => { const safe = baseRoutine.filter((e) => !avoidWrist || !e.wristSensitive); return safe.length >= 1 ? safe : baseRoutine.filter((e) => !e.wristSensitive) }, [avoidWrist, baseRoutine])
  const [session, setSession] = useState<PersistedSession>(() => readSession(profile.id) || { profileId: profile.id, exerciseIndex: 0, setIndex: 0, phase: 'demo', completedReps: 0, paused: false, avoidWrist: defaultAvoidWrist, updatedAt: Date.now() })
  const [now, setNow] = useState(Date.now())
  const current = routine[session.exerciseIndex] || routine[0]
  const remaining = session.endsAt ? Math.max(0, Math.ceil((session.endsAt - now) / 1000)) : session.pausedRemaining || 0

  const commit = (next: PersistedSession) => { const value = { ...next, updatedAt: Date.now() }; setSession(value); writeSession(value) }
  useEffect(() => { if (session.phase === 'finished') return; const id = window.setInterval(() => setNow(Date.now()), 250); return () => window.clearInterval(id) }, [session.phase, session.endsAt])
  useEffect(() => { setVideoFailed(false); videoReadyRef.current = false }, [current?.id])
  useEffect(() => {
    if (session.phase !== 'demo' || !current?.video) return
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return
      try {
        const message = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        if (message?.event === 'onReady') videoReadyRef.current = true
        if (message?.event === 'onError' && youtubePlayerErrors.has(Number(message.info))) setVideoFailed(true)
      } catch { /* Ignore unrelated postMessage payloads. */ }
    }
    window.addEventListener('message', onMessage)
    const timeout = window.setTimeout(() => { if (!videoReadyRef.current) setVideoFailed(true) }, 10000)
    return () => { window.removeEventListener('message', onMessage); window.clearTimeout(timeout) }
  }, [current?.id, session.phase])
  useEffect(() => { if (!session.endsAt || remaining > 0 || session.phase === 'demo' || session.phase === 'exercise') return; if (session.phase === 'prep') commit({ ...session, phase: 'exercise', endsAt: current.duration ? Date.now() + current.duration * 1000 : undefined, pausedRemaining: undefined }); if (session.phase === 'rest') nextSeries() }, [remaining, session.phase])
  useEffect(() => { if (session.phase === 'exercise' && current.duration && remaining === 0) finishSeries() }, [remaining, session.phase])

  const beginPreparation = () => commit({ ...session, avoidWrist, phase: 'prep', endsAt: Date.now() + 5000, pausedRemaining: undefined })
  const finishSeries = () => { if (session.phase !== 'exercise') return; const nextSet = session.setIndex + 1; if (nextSet < current.sets) commit({ ...session, phase: 'rest', setIndex: nextSet, endsAt: Date.now() + current.rest * 1000, pausedRemaining: undefined, completedReps: current.targetReps }); else if (session.exerciseIndex + 1 < routine.length) commit({ ...session, phase: 'demo', exerciseIndex: session.exerciseIndex + 1, setIndex: 0, endsAt: undefined, pausedRemaining: undefined, completedReps: current.targetReps }); else { commit({ ...session, phase: 'finished', endsAt: undefined, pausedRemaining: undefined, completedReps: current.targetReps }); writeSession(null); onFinish(Math.max(1, Math.round((Date.now() - session.updatedAt) / 60000)), routine.length) } }
  const nextSeries = () => { const next = { ...session, phase: 'exercise' as Phase, endsAt: current.duration ? Date.now() + current.duration * 1000 : undefined, pausedRemaining: undefined }; commit(next) }
  const pause = () => { if (session.paused) return; commit({ ...session, paused: true, endsAt: session.endsAt ? undefined : session.endsAt, pausedRemaining: session.endsAt ? remaining : undefined }) }
  const resume = () => { if (!session.paused) return; commit({ ...session, paused: false, endsAt: session.pausedRemaining ? Date.now() + session.pausedRemaining * 1000 : undefined, pausedRemaining: undefined }) }
  const skipRest = () => { if (session.phase === 'rest') nextSeries() }
  const addRest = () => { if (session.phase !== 'rest') return; commit({ ...session, endsAt: (session.endsAt || Date.now()) + 15000 }) }
  const skipExercise = () => { if (session.exerciseIndex + 1 < routine.length) commit({ ...session, phase: 'demo', exerciseIndex: session.exerciseIndex + 1, setIndex: 0, endsAt: undefined, pausedRemaining: undefined }); else finishSession() }
  const finishSession = () => { commit({ ...session, phase: 'finished', endsAt: undefined, pausedRemaining: undefined }); writeSession(null); onFinish(20, routine.length) }
  const openExternalVideo = () => { const url = current?.video?.externalUrl; if (url) void window.homefit?.openExternalVideo(url) }

  if (!current && session.phase !== 'finished') return <div className="complete-screen"><h2>No hay ejercicios compatibles</h2><p className="muted">Revisá el equipamiento o las limitaciones de tu perfil.</p></div>
  if (session.phase === 'finished') return <div className="complete-screen"><div className="ready-icon"><Trophy size={38} /></div><p className="eyebrow mint">ENTRENAMIENTO COMPLETADO</p><h2>¡Excelente trabajo!</h2><p className="muted">Rutina guardada en tu historial: {routine.length} ejercicios, 3 series por ejercicio.</p><button className="primary" onClick={() => commit({ ...session, phase: 'demo', exerciseIndex: 0, setIndex: 0, completedReps: 0 })}><RotateCcw size={17} /> Repetir rutina</button></div>
  const isPaused = Boolean(session.paused)
  const title = session.phase === 'demo' ? 'Demostración' : session.phase === 'prep' ? 'Preparación' : session.phase === 'rest' ? 'Descanso' : 'Ejercicio'
  // La guard clause anterior garantiza que current existe en tiempo de ejecución.
  // @ts-ignore — TypeScript no estrecha la propiedad opcional dentro del JSX de una sola línea.
  return <div className="training-layout"><section className="training-main"><div className="training-top"><div><p className="eyebrow mint">RUTINA PERSONALIZADA · {profile.goal.toUpperCase()}</p><h2>Full body esencial</h2></div><span className="tag"><Timer size={15} /> Ejercicio {session.exerciseIndex + 1}/{routine.length}</span></div><div className="demo-card"><div className="demo-placeholder">{session.phase === 'demo' && current.video?.status === 'verified' && !videoFailed ? <iframe src={embedUrl(current.video.url)} title={current.name} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onError={() => setVideoFailed(true)} /> : session.phase === 'demo' ? <><Video size={42} /><span>{videoFailed ? 'No se pudo cargar la demostración' : 'Demostración pendiente de verificación'}</span><small>Seguí las instrucciones escritas debajo</small>{current.video?.externalUrl && <button className="secondary" onClick={openExternalVideo}>Ver demostración en YouTube</button>}</> : <div className="phase-timer"><small>{title.toUpperCase()}</small><strong>{session.phase === 'exercise' && !current.duration ? current.targetReps : remaining}</strong><span>{session.phase === 'exercise' && !current.duration ? 'repeticiones objetivo' : 'segundos'}</span></div>}</div><div className="demo-info"><div><p className="eyebrow">{title.toUpperCase()} · SERIE {session.setIndex + 1} DE {current.sets}</p><h3>{current.name}</h3><p className="muted">{current.muscles.join(' · ')}</p></div>{session.phase === 'demo' && <button className="secondary" onClick={beginPreparation}>Entendí — Empezar <Play size={15} fill="currentColor" /></button>}{session.phase === 'prep' && <strong className="countdown">Preparáte: {remaining}s</strong>}{session.phase === 'exercise' && <div className="control-row">{isPaused ? <button className="secondary" onClick={resume}><Play size={15} /> Reanudar</button> : <button className="secondary" onClick={pause}><Pause size={15} /> Pausar</button>}{current.duration ? <span className="timer-pill">{remaining}s</span> : <button className="primary" onClick={finishSeries}>Terminé la serie <Check size={15} /></button>}</div>}{session.phase === 'rest' && <div className="control-row">{isPaused ? <button className="secondary" onClick={resume}><Play size={15} /> Reanudar</button> : <button className="secondary" onClick={pause}><Pause size={15} /> Pausar</button>}<button className="secondary" onClick={skipRest}><SkipForward size={15} /> Saltar</button><button className="secondary" onClick={addRest}><Plus size={15} /> 15s</button></div>}</div></div><div className="instruction-box"><div className="instruction-title"><CircleHelp size={18} /><strong>Cómo hacerlo</strong></div><ol>{current.instructions.map((x) => <li key={x}>{x}</li>)}</ol></div></section><aside className="workout-side"><div className="panel"><div className="panel-heading"><h3>Tu rutina</h3><label className="wrist-setting"><input type="checkbox" checked={avoidWrist} onChange={(e) => { setAvoidWrist(e.target.checked); commit({ ...session, avoidWrist: e.target.checked }) }} /> Evitar muñecas</label></div>{routine.map((e, i) => <button key={e.id} className={i === session.exerciseIndex ? 'workout-row current' : i < session.exerciseIndex ? 'workout-row finished' : 'workout-row'} onClick={() => commit({ ...session, phase: 'demo', exerciseIndex: i, setIndex: 0, endsAt: undefined, pausedRemaining: undefined })}><span className="row-number">{i < session.exerciseIndex ? <Check size={14} /> : i + 1}</span><span><strong>{e.name}</strong><small>{e.duration || e.targetReps} {e.duration ? 'seg' : 'reps'} · {e.sets} series</small></span></button>)}</div><button className="secondary wide" onClick={skipExercise}>Saltar ejercicio <SkipForward size={16} /></button></aside></div>
}




