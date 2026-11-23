// Planos prontos por objetivo, montados com exercícios da biblioteca.
export type PlanoTreino = { nome: string; dias: number[]; exercicios: { id: string; series: number; reps: string }[] };
export type Plano = { id: string; nome: string; objetivo: string; nivel: string; frequencia: string; descricao: string; treinos: PlanoTreino[] };

const ex = (id: string, series = 3, reps = '12') => ({ id, series, reps });

export const PLANOS: Plano[] = [
  {
    id: 'hipertrofia-abc',
    nome: 'Hipertrofia ABC',
    objetivo: 'Ganhar massa',
    nivel: 'Intermediário',
    frequencia: '6x por semana',
    descricao: 'Divisão clássica: peito e tríceps, costas e bíceps, pernas e ombro. Cada grupo duas vezes na semana.',
    treinos: [
      { nome: 'Peito & Tríceps', dias: [1, 4], exercicios: [ex('Barbell_Bench_Press_-_Medium_Grip', 4, '10'), ex('Incline_Dumbbell_Press', 4, '10'), ex('Dumbbell_Flyes', 3, '12'), ex('Triceps_Pushdown_-_Rope_Attachment', 3, '12'), ex('Lying_Triceps_Press', 3, '10')] },
      { nome: 'Costas & Bíceps', dias: [2, 5], exercicios: [ex('Wide-Grip_Lat_Pulldown', 4, '10'), ex('Bent_Over_Barbell_Row', 4, '10'), ex('Seated_Cable_Rows', 3, '12'), ex('Barbell_Curl', 3, '10'), ex('Hammer_Curls', 3, '12')] },
      { nome: 'Pernas & Ombro', dias: [3, 6], exercicios: [ex('Barbell_Squat', 4, '8'), ex('Leg_Press', 4, '12'), ex('Leg_Extensions', 3, '15'), ex('Lying_Leg_Curls', 3, '12'), ex('Standing_Calf_Raises', 4, '15'), ex('Dumbbell_Shoulder_Press', 3, '10'), ex('Side_Lateral_Raise', 3, '15')] },
    ],
  },
  {
    id: 'emagrecimento',
    nome: 'Emagrecimento Full Body',
    objetivo: 'Perder gordura',
    nivel: 'Todos',
    frequencia: '3x por semana',
    descricao: 'Corpo inteiro com ritmo alto e descanso curto. Gasta bastante energia e mantém a massa magra.',
    treinos: [
      { nome: 'Full Body Queima', dias: [1, 3, 5], exercicios: [ex('Goblet_Squat', 3, '15'), ex('Pushups', 3, '12'), ex('Seated_Cable_Rows', 3, '15'), ex('Dumbbell_Lunges', 3, '12'), ex('One-Arm_Kettlebell_Swings', 3, '20'), ex('Mountain_Climbers', 3, '30'), ex('Plank', 3, '40')] },
    ],
  },
  {
    id: 'forca-5x5',
    nome: 'Força 5x5',
    objetivo: 'Ficar mais forte',
    nivel: 'Intermediário',
    frequencia: '3x por semana',
    descricao: 'Poucos exercícios, carga alta, 5 séries de 5. Alterna os treinos A e B ao longo da semana.',
    treinos: [
      { nome: 'Força A', dias: [1, 5], exercicios: [ex('Barbell_Squat', 5, '5'), ex('Barbell_Bench_Press_-_Medium_Grip', 5, '5'), ex('Bent_Over_Barbell_Row', 5, '5')] },
      { nome: 'Força B', dias: [3], exercicios: [ex('Barbell_Squat', 5, '5'), ex('Barbell_Shoulder_Press', 5, '5'), ex('Barbell_Deadlift', 3, '5')] },
    ],
  },
  {
    id: 'iniciante',
    nome: 'Primeiros Passos',
    objetivo: 'Começar na academia',
    nivel: 'Iniciante',
    frequencia: '2x por semana',
    descricao: 'Máquinas e movimentos simples pra aprender a técnica e criar o hábito sem se machucar.',
    treinos: [
      { nome: 'Iniciante Full Body', dias: [2, 4], exercicios: [ex('Leg_Press', 3, '12'), ex('Machine_Bench_Press', 3, '12'), ex('Wide-Grip_Lat_Pulldown', 3, '12'), ex('Dumbbell_Shoulder_Press', 3, '12'), ex('Plank', 3, '30'), ex('Crunches', 3, '15')] },
    ],
  },
];

// liga os exercícios de exemplo do app às demonstrações da biblioteca
export const SEED_NA_BIBLIOTECA: Record<string, string> = {
  supino: 'Incline_Dumbbell_Press',
  crucifixo: 'Dumbbell_Flyes',
  corda: 'Triceps_Pushdown_-_Rope_Attachment',
  mergulho: 'Bench_Dips',
  puxada: 'Wide-Grip_Lat_Pulldown',
  remada: 'Bent_Over_Barbell_Row',
  rosca: 'Barbell_Curl',
  agachamento: 'Barbell_Squat',
  legpress: 'Leg_Press',
  stiff: 'Stiff-Legged_Barbell_Deadlift',
  kettlebell: 'One-Arm_Kettlebell_Swings',
};
