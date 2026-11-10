import type { Exercise } from '../types'
import { verifiedVideos } from './videoManifest'

const bodyData: Array<[string, string, string, string[], Exercise['equipment'], Exercise['level'], string[], number?]> = [
  ['sentadilla', 'Sentadilla', 'Piernas', ['Cuádriceps', 'Glúteos'], ['Sin equipamiento', 'Mancuernas'], 'Inicial', ['Separá los pies al ancho de caderas.', 'Llevá la cadera atrás y flexioná las rodillas.', 'Subí empujando el suelo, manteniendo el pecho abierto.']],
  ['zancada', 'Zancada alterna', 'Piernas', ['Glúteos', 'Cuádriceps'], ['Sin equipamiento', 'Mancuernas'], 'Inicial', ['Da un paso largo hacia adelante.', 'Bajá la rodilla trasera con control.', 'Volvé al centro y alterná.']],
  ['puente-gluteo', 'Puente de glúteos', 'Glúteos', ['Glúteos', 'Isquiotibiales'], ['Sin equipamiento', 'Colchoneta'], 'Inicial', ['Acostate boca arriba con rodillas flexionadas.', 'Elevá la cadera apretando glúteos.', 'Pausá arriba y bajá lentamente.']],
  ['peso-muerto', 'Peso muerto rumano', 'Piernas', ['Isquiotibiales', 'Glúteos'], ['Mancuernas'], 'Intermedio', ['Mantené la espalda neutra.', 'Deslizá las mancuernas cerca de las piernas.', 'Extendé la cadera sin hiperextender.']],
  ['elevacion-talones', 'Elevación de talones', 'Piernas', ['Pantorrillas'], ['Sin equipamiento', 'Mancuernas'], 'Inicial', ['Parate estable.', 'Subí los talones hasta quedar en puntas.', 'Bajá con control.']],
  ['flexiones', 'Flexiones de brazos', 'Tren superior', ['Pecho', 'Tríceps', 'Core'], ['Sin equipamiento'], 'Inicial', ['Alineá hombros, cadera y tobillos.', 'Flexioná codos cerca del cuerpo.', 'Empujá el suelo para volver.']],
  ['press-hombros', 'Press de hombros', 'Tren superior', ['Hombros', 'Tríceps'], ['Mancuernas'], 'Intermedio', ['Sostené las mancuernas a la altura de los hombros.', 'Empujá arriba sin arquear la espalda.', 'Bajá con control.']],
  ['remo', 'Remo con mancuerna', 'Espalda', ['Dorsales', 'Bíceps'], ['Mancuernas'], 'Intermedio', ['Apoyá una mano y mantené la espalda neutra.', 'Llevá el codo hacia la cadera.', 'Bajá lentamente.']],
  ['plancha', 'Plancha frontal', 'Core', ['Abdominales', 'Hombros'], ['Sin equipamiento', 'Colchoneta'], 'Inicial', ['Apoyá antebrazos y puntas de pies.', 'Contraé abdomen y glúteos.', 'Respirá sin dejar caer la cadera.'], 30],
  ['dead-bug', 'Dead bug', 'Core', ['Abdominales'], ['Sin equipamiento', 'Colchoneta'], 'Inicial', ['Acostate con brazos arriba y rodillas a 90°.', 'Extendé brazo y pierna contrarios.', 'Volvé sin despegar la zona lumbar.']],
  ['bird-dog', 'Bird dog', 'Movilidad', ['Core', 'Espalda'], ['Sin equipamiento', 'Colchoneta'], 'Inicial', ['En cuatro apoyos, activá el abdomen.', 'Extendé brazo y pierna opuestos.', 'Volvé y alterná sin rotar.']],
  ['mountain-climber', 'Mountain climbers', 'Cardio', ['Core', 'Hombros'], ['Sin equipamiento'], 'Intermedio', ['Partí de una plancha alta.', 'Llevá una rodilla al pecho.', 'Alterná a ritmo constante.']],
  ['jumping-jacks', 'Jumping jacks', 'Cardio', ['Cuerpo completo'], ['Sin equipamiento'], 'Inicial', ['Comenzá de pie con brazos a los lados.', 'Abrí pies y brazos al saltar.', 'Volvé al centro suavemente.']],
  ['burpee', 'Burpee', 'Cardio', ['Cuerpo completo'], ['Sin equipamiento'], 'Avanzado', ['Bajá a posición de sentadilla.', 'Llevá los pies atrás y adelante.', 'Subí con un salto opcional.']],
  ['abduccion-cadera', 'Abducción de cadera', 'Glúteos', ['Glúteos medios'], ['Bandas', 'Colchoneta'], 'Inicial', ['Acostate de lado con piernas alineadas.', 'Elevá la pierna superior sin rotar.', 'Bajá despacio.']],
  ['estiramiento-gato-vaca', 'Gato-vaca', 'Movilidad', ['Espalda', 'Core'], ['Sin equipamiento', 'Colchoneta'], 'Inicial', ['En cuatro apoyos, inhalá y abrí el pecho.', 'Exhalá redondeando la espalda.', 'Movete sin forzar el rango.']],
  ['rotacion-toracica', 'Rotación torácica', 'Movilidad', ['Espalda', 'Hombros'], ['Colchoneta'], 'Inicial', ['Partí de cuatro apoyos.', 'Llevá una mano detrás de la cabeza.', 'Rotá el codo hacia el techo.']],
  ['curl-biceps', 'Curl de bíceps', 'Brazos', ['Bíceps'], ['Mancuernas'], 'Inicial', ['Pegá los codos al torso.', 'Flexioná los brazos sin balancearte.', 'Bajá lentamente.']],
  ['extension-triceps', 'Extensión de tríceps', 'Brazos', ['Tríceps'], ['Mancuernas'], 'Inicial', ['Elevá una mancuerna sobre la cabeza.', 'Flexioná los codos manteniéndolos apuntando arriba.', 'Extendé sin bloquear.']],
  ['superman', 'Superman', 'Espalda', ['Espalda', 'Glúteos'], ['Sin equipamiento', 'Colchoneta'], 'Inicial', ['Acostate boca abajo.', 'Elevá brazos y piernas suavemente.', 'Sostené y bajá con control.']],
]
const wristSensitive = new Set(['flexiones', 'plancha', 'mountain-climber', 'bird-dog', 'estiramiento-gato-vaca', 'rotacion-toracica', 'burpee'])
const body: Exercise[] = bodyData.map(([id, name, category, muscles, equipment, level, instructions, duration]) => ({ id, name, category, muscles, equipment, level, instructions, wristSensitive: wristSensitive.has(id), video: verifiedVideos[id], ...(duration ? { duration } : {}) }))

export const exercises = body
export const exerciseMap = Object.fromEntries(exercises.map((exercise) => [exercise.id, exercise]))
