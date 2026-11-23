// Tipos do BORA e dados iniciais (seed). Os tipos espelham as tabelas que vão pro Supabase.

export type Midia = number | { uri: string };

export type Exercicio = {
  id: string;
  nome: string;
  grupo: string;
  series: number;
  reps: string;
  descanso: number; // segundos
  dica: string;
  capa: Midia;
  videoUri?: string;
  imagens?: string[]; // demonstração (biblioteca pronta)
  fonteId?: string; // id no free-exercise-db
};

export type Treino = {
  id: string;
  letra: string;
  nome: string;
  dias: number[]; // 0 = domingo
  exercicios: string[];
  ajustes?: Record<string, { series: number; reps: string }>; // séries/reps só neste treino
};

export type Aluno = {
  id: string;
  nome: string;
  iniciais: string;
  ofensiva: number;
  pontosSemana: number;
  ultimoTreino: number; // dias atrás
  frequencia: number; // % do mês
  treinos: string[];
};

export type Post = {
  id: string;
  autor: string;
  iniciais: string;
  quando: string; // ISO
  treino: string;
  foto?: Midia;
  reacoes: number;
  reagi: boolean;
};

export type Desafio = { nome: string; dias: number; premio: string; inicio: string };

export const img = {
  halter: require('../../assets/img/pb_halter.jpg') as number,
  agacho: require('../../assets/img/pb_agacho.jpg') as number,
  terra: require('../../assets/img/pb_terra.jpg') as number,
  barra: require('../../assets/img/pb_barra.jpg') as number,
  kettle: require('../../assets/img/pb_atleta2.jpg') as number,
  sentado: require('../../assets/img/pb_sentado.jpg') as number,
  descanso: require('../../assets/img/pb_descanso.jpg') as number,
};

export const SEED_EXERCICIOS: Record<string, Exercicio> = {
  supino: { id: 'supino', nome: 'Supino inclinado', grupo: 'Peito', series: 4, reps: '12', descanso: 60, dica: 'Desce controlando, sobe explosivo. Escápulas encaixadas no banco.', capa: img.halter },
  crucifixo: { id: 'crucifixo', nome: 'Crucifixo com halter', grupo: 'Peito', series: 3, reps: '15', descanso: 45, dica: 'Cotovelos levemente flexionados o tempo todo.', capa: img.halter },
  corda: { id: 'corda', nome: 'Tríceps corda', grupo: 'Tríceps', series: 4, reps: '12', descanso: 45, dica: 'Abre a corda no final do movimento.', capa: img.halter },
  mergulho: { id: 'mergulho', nome: 'Mergulho no banco', grupo: 'Tríceps', series: 3, reps: '10', descanso: 60, dica: 'Ombros longe das orelhas.', capa: img.barra },
  puxada: { id: 'puxada', nome: 'Puxada frontal', grupo: 'Costas', series: 4, reps: '10', descanso: 60, dica: 'Puxa com o cotovelo, não com a mão.', capa: img.barra },
  remada: { id: 'remada', nome: 'Remada curvada', grupo: 'Costas', series: 4, reps: '10', descanso: 60, dica: 'Coluna neutra, tronco firme.', capa: img.terra },
  rosca: { id: 'rosca', nome: 'Rosca direta', grupo: 'Bíceps', series: 3, reps: '12', descanso: 45, dica: 'Sem balançar o tronco.', capa: img.halter },
  agachamento: { id: 'agachamento', nome: 'Agachamento livre', grupo: 'Pernas', series: 4, reps: '8', descanso: 90, dica: 'Joelho acompanha a ponta do pé.', capa: img.agacho },
  legpress: { id: 'legpress', nome: 'Leg press', grupo: 'Pernas', series: 4, reps: '12', descanso: 60, dica: 'Não trava o joelho em cima.', capa: img.agacho },
  stiff: { id: 'stiff', nome: 'Stiff', grupo: 'Posterior', series: 3, reps: '10', descanso: 60, dica: 'Quadril vai pra trás, barra rente à perna.', capa: img.terra },
  kettlebell: { id: 'kettlebell', nome: 'Swing com kettlebell', grupo: 'Full body', series: 3, reps: '20', descanso: 45, dica: 'A força vem do quadril.', capa: img.kettle },
};

export const SEED_TREINOS: Treino[] = [
  { id: 'a', letra: 'A', nome: 'Peito & Tríceps', dias: [1, 4], exercicios: ['supino', 'crucifixo', 'corda', 'mergulho'] },
  { id: 'b', letra: 'B', nome: 'Costas & Bíceps', dias: [2, 5], exercicios: ['puxada', 'remada', 'rosca', 'kettlebell'] },
  { id: 'c', letra: 'C', nome: 'Pernas', dias: [3, 6], exercicios: ['agachamento', 'legpress', 'stiff'] },
];

export const SEED_ALUNOS: Aluno[] = [
  { id: 'rafa', nome: 'Rafa', iniciais: 'RA', ofensiva: 21, pontosSemana: 540, ultimoTreino: 0, frequencia: 96, treinos: ['a', 'b', 'c'] },
  { id: 'ju', nome: 'Ju', iniciais: 'JU', ofensiva: 15, pontosSemana: 515, ultimoTreino: 0, frequencia: 90, treinos: ['a', 'b', 'c'] },
  { id: 'gabi', nome: 'Gabi', iniciais: 'GA', ofensiva: 9, pontosSemana: 490, ultimoTreino: 1, frequencia: 84, treinos: ['a', 'b', 'c'] },
  { id: 'lucas', nome: 'Lucas', iniciais: 'LU', ofensiva: 0, pontosSemana: 430, ultimoTreino: 3, frequencia: 62, treinos: ['a', 'b', 'c'] },
  { id: 'bia', nome: 'Bia', iniciais: 'BI', ofensiva: 0, pontosSemana: 210, ultimoTreino: 5, frequencia: 40, treinos: ['a', 'c'] },
];

const horasAtras = (h: number) => new Date(Date.now() - h * 3600000).toISOString();

export const SEED_FEED: Post[] = [
  { id: 'p1', autor: 'Rafa', iniciais: 'RA', quando: horasAtras(1), treino: 'Pernas', foto: img.agacho, reacoes: 8, reagi: false },
  { id: 'p2', autor: 'Ju', iniciais: 'JU', quando: horasAtras(3), treino: 'Costas & Bíceps', foto: img.kettle, reacoes: 5, reagi: false },
  { id: 'p3', autor: 'Gabi', iniciais: 'GA', quando: horasAtras(20), treino: 'Peito & Tríceps', foto: img.barra, reacoes: 11, reagi: true },
  { id: 'p4', autor: 'Rafa', iniciais: 'RA', quando: horasAtras(26), treino: 'Costas & Bíceps', reacoes: 4, reagi: false },
];

export const SEED_DESAFIO: Desafio = {
  nome: 'Desafio 30 dias sem faltar',
  dias: 30,
  premio: 'Camiseta do BORA',
  inicio: new Date(Date.now() - 21 * 86400000).toISOString(),
};

export const DIAS_CURTOS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
export const DIAS_LONGOS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
export const GRUPOS = ['Peito', 'Costas', 'Ombro', 'Bíceps', 'Tríceps', 'Pernas', 'Posterior', 'Glúteo', 'Panturrilha', 'Abdômen', 'Lombar', 'Trapézio', 'Antebraço', 'Cardio', 'Full body'];

// Pontos: treino feito = 10, com foto = +5.
export const PONTOS = { treino: 10, foto: 5 };

export const iniciaisDe = (nome: string) =>
  (nome.trim().split(/\s+/).map((p) => p[0]).join('').slice(0, 2) || 'BO').toUpperCase();

export const novoId = () => Math.random().toString(36).slice(2, 10);

export function quandoTexto(iso: string) {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? 'ontem' : `há ${d} dias`;
}

// ---------- Registro de treino (séries com carga), medidas e chat ----------
export type TipoSerie = 'N' | 'A' | 'F' | 'D'; // normal, aquecimento, falha, drop
export const TIPOS_SERIE: Record<TipoSerie, { curto: string; nome: string }> = {
  N: { curto: '', nome: 'Normal' },
  A: { curto: 'A', nome: 'Aquecimento' },
  F: { curto: 'F', nome: 'Até a falha' },
  D: { curto: 'D', nome: 'Drop set' },
};
export type SerieReg = { exId: string; kg: number; reps: number; tipo: TipoSerie };
export type Registro = { id: string; data: string; treinoId: string; treinoNome: string; duracao: number; series: SerieReg[]; prs: string[] };
export type Medida = { id: string; data: string; peso?: number; cintura?: number; braco?: number; peito?: number; coxa?: number; fotoUri?: string };
export type Mensagem = { id: string; de: 'personal' | 'aluno'; texto: string; quando: string };

// 1RM estimado (fórmula de Epley)
export const umRM = (kg: number, reps: number) => (kg <= 0 ? 0 : reps <= 1 ? kg : kg * (1 + reps / 30));

// carga inicial e final (kg) de cada exercício no histórico de exemplo
const CARGAS: Record<string, [number, number]> = {
  supino: [30, 40], crucifixo: [10, 14], corda: [20, 27.5], mergulho: [0, 0], puxada: [40, 52.5], remada: [30, 40],
  rosca: [10, 14], kettlebell: [12, 16], agachamento: [40, 60], legpress: [100, 140], stiff: [30, 42.5],
};
const arred = (kg: number) => Math.round(kg / 2.5) * 2.5;

// Gera ~6 semanas de treinos de exemplo com carga subindo aos poucos.
export function historicoExemplo(treinos: Treino[], exercicios: Record<string, Exercicio>): Registro[] {
  const lista: Registro[] = [];
  const total = 42;
  for (let i = total; i >= 1; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(18, 30, 0, 0);
    const t = treinos.find((x) => x.dias.includes(d.getDay()));
    if (!t || i % 9 === 4) continue; // um ou outro dia faltou
    const prog = (total - i) / total;
    const series: SerieReg[] = [];
    for (const exId of t.exercicios) {
      const ex = exercicios[exId];
      if (!ex) continue;
      const [a, b] = CARGAS[exId] ?? [10, 12];
      const kg = arred(a + (b - a) * prog);
      const reps = parseInt(ex.reps, 10) || 10;
      for (let s = 0; s < ex.series; s++) series.push({ exId, kg, reps: Math.max(1, reps - (s === ex.series - 1 ? 2 : 0)), tipo: 'N' });
    }
    lista.push({ id: `h${i}`, data: d.toISOString(), treinoId: t.id, treinoNome: t.nome, duracao: 2400 + (i % 5) * 300, series, prs: [] });
  }
  return lista;
}

// Evolução de exemplo de um aluno (pro personal), proporcional à frequência dele.
export function evolucaoAlunoExemplo(aluno: Aluno, exId: string) {
  const [a, b] = CARGAS[exId] ?? [10, 12];
  const ganho = (b - a) * (aluno.frequencia / 100) * 1.2;
  return Array.from({ length: 8 }, (_, k) => {
    const d = new Date();
    d.setDate(d.getDate() - (7 - k) * 5);
    const kg = arred(a * (0.8 + aluno.nome.length * 0.04) + (ganho * k) / 7);
    return { data: d.toISOString(), valor: Math.round(umRM(kg, 10)) };
  });
}

export const SEED_MENSAGENS: Record<string, Mensagem[]> = {
  eu: [
    { id: 'm1', de: 'personal', texto: 'Fala! Montei teu treino A com supino inclinado. Capricha na descida 💪', quando: new Date(Date.now() - 26 * 3600000).toISOString() },
    { id: 'm2', de: 'aluno', texto: 'Valeu! Hoje subi pra 40kg 🔥', quando: new Date(Date.now() - 20 * 3600000).toISOString() },
  ],
  lucas: [{ id: 'm3', de: 'personal', texto: 'Lucas, tudo certo? Faz 3 dias que você não aparece.', quando: new Date(Date.now() - 5 * 3600000).toISOString() }],
};
