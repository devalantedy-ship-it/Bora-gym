// Estado do BORA, salvo no aparelho (AsyncStorage).
// Quando o Supabase entrar, só a parte de "carregar/salvar" muda: as ações e telas continuam iguais.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { urlImg } from '../components/Demo';
import { POR_ID } from '../data/biblioteca';
import { PLANOS, SEED_NA_BIBLIOTECA } from '../data/planos';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  type Aluno, type Desafio, type Exercicio, type Midia, type Post, type Treino,
  PONTOS, SEED_ALUNOS, SEED_DESAFIO, SEED_EXERCICIOS, SEED_FEED, SEED_MENSAGENS, SEED_TREINOS, iniciaisDe, novoId,
  historicoExemplo, umRM, type Medida, type Mensagem, type Registro, type SerieReg,
} from '../data/mock';

export type Papel = 'aluno' | 'personal';

export type Checkin = { dia: string; treinoId: string; fotoUri?: string; feitos: string[] };

export type Perfil = { nome: string; email: string; papel: Papel; codigoTurma: string };

type Dados = {
  perfil: Perfil | null;
  exercicios: Record<string, Exercicio>;
  treinos: Treino[];
  alunos: Aluno[];
  checkins: Checkin[];
  feitos: { dia: string; ids: string[] };
  feed: Post[];
  desafio: Desafio | null;
  salvaOfensiva: { disponivel: number; usadoEm: string[]; mes: string };
  marcos: { treinoCriado: boolean; videoEnviado: boolean; convidou: boolean; desafioCriado: boolean };
  historico: Registro[];
  medidas: Medida[];
  mensagens: Record<string, Mensagem[]>;
  favoritos: string[]; // ids da biblioteca
  corpo: { altura?: number; idade?: number; sexo?: 'M' | 'F' };
};

const CHAVE = 'bora:dados:v1';

export const hojeISO = (d = new Date()) => {
  const z = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
};
const mesAtual = () => hojeISO().slice(0, 7);

function historicoInicial(): Checkin[] {
  return Array.from({ length: 11 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (i + 1));
    return { dia: hojeISO(d), treinoId: 'a', feitos: [] };
  });
}

function comDemonstracao(exs: Record<string, Exercicio>): Record<string, Exercicio> {
  const out = { ...exs };
  for (const [id, bib] of Object.entries(SEED_NA_BIBLIOTECA)) {
    const item = POR_ID[bib];
    if (out[id] && item && !out[id].imagens?.length) out[id] = { ...out[id], imagens: item.img.map(urlImg), fonteId: bib };
  }
  return out;
}

function dadosIniciais(): Dados {
  return {
    perfil: null,
    exercicios: comDemonstracao(SEED_EXERCICIOS),
    treinos: SEED_TREINOS,
    alunos: SEED_ALUNOS,
    checkins: historicoInicial(),
    feitos: { dia: hojeISO(), ids: [] },
    feed: SEED_FEED,
    desafio: SEED_DESAFIO,
    salvaOfensiva: { disponivel: 1, usadoEm: [], mes: mesAtual() },
    marcos: { treinoCriado: false, videoEnviado: false, convidou: false, desafioCriado: false },
    historico: historicoExemplo(SEED_TREINOS, SEED_EXERCICIOS),
    medidas: [
      { id: 'md1', data: new Date(Date.now() - 35 * 86400000).toISOString(), peso: 82.4, cintura: 88, braco: 35, peito: 101, coxa: 57 },
      { id: 'md2', data: new Date(Date.now() - 14 * 86400000).toISOString(), peso: 81.1, cintura: 86, braco: 35.5, peito: 102, coxa: 57.5 },
    ],
    mensagens: SEED_MENSAGENS,
    favoritos: [],
    corpo: {},
  };
}

function calcularOfensiva(dias: Set<string>) {
  let n = 0;
  const d = new Date();
  if (!dias.has(hojeISO(d))) d.setDate(d.getDate() - 1); // hoje ainda dá tempo
  while (dias.has(hojeISO(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

const gerarCodigo = () => `BORA-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

type Estado = Dados & {
  pronto: boolean;
  papel: Papel | null;
  nome: string;
  // conta
  entrar: (p: { nome: string; email: string; papel: Papel; codigo?: string }) => void;
  sair: () => void;
  excluirConta: () => Promise<void>;
  atualizarNome: (nome: string) => void;
  // aluno
  feitosHoje: string[];
  marcarFeito: (id: string) => void;
  fazerCheckin: (c: Omit<Checkin, 'dia'>) => void;
  usarSalvaOfensiva: () => boolean;
  reagir: (postId: string) => void;
  treinoDoDia: (dia?: number) => Treino | undefined;
  ofensiva: number;
  diasComTreino: Set<string>;
  pontosSemana: number;
  jaTreinouHoje: boolean;
  podeSalvarOntem: boolean;
  // personal
  salvarTreino: (t: Omit<Treino, 'id' | 'letra'> & { id?: string }, paraAlunos?: string[] | 'todos') => string;
  alternarTreinoDoAluno: (alunoId: string, treinoId: string) => void;
  // registro de séries
  salvarRegistro: (r: Omit<Registro, 'id' | 'prs'>) => Registro;
  ultimoDe: (exId: string) => SerieReg[];
  recordeDe: (exId: string) => { kg: number; rm: number; reps: number; volume: number };
  evolucaoDe: (exId: string) => { data: string; rm: number; kg: number }[];
  adicionarMedida: (m: Omit<Medida, 'id' | 'data'>) => void;
  enviarMensagem: (thread: string, de: 'personal' | 'aluno', texto: string) => void;
  alternarFavorito: (bibId: string) => void;
  salvarCorpo: (c: Dados['corpo']) => void;
  aplicarPlano: (planoId: string, paraAlunos: string[] | 'todos') => number;
  marcarConvite: () => void;
  seriesDe: (treino: Treino | undefined, exId: string) => { series: number; reps: string };
  excluirTreino: (id: string) => void;
  salvarExercicio: (e: Omit<Exercicio, 'id' | 'capa'> & { id?: string; capa?: Midia }) => string;
  salvarDesafio: (d: Omit<Desafio, 'inicio'> | null) => void;
};

const Ctx = createContext<Estado | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [dados, setDados] = useState<Dados>(dadosIniciais);
  const [pronto, setPronto] = useState(false);
  const carregou = useRef(false);

  // carregar do aparelho
  useEffect(() => {
    AsyncStorage.getItem(CHAVE)
      .then((txt) => {
        if (txt) {
          const salvo = JSON.parse(txt) as Partial<Dados>;
          setDados((atual) => {
            const d = { ...atual, ...salvo, marcos: { ...atual.marcos, ...(salvo.marcos ?? {}) } };
            d.exercicios = comDemonstracao(d.exercicios);
            if (d.feitos.dia !== hojeISO()) d.feitos = { dia: hojeISO(), ids: [] };
            if (d.salvaOfensiva.mes !== mesAtual()) d.salvaOfensiva = { disponivel: 1, usadoEm: d.salvaOfensiva.usadoEm, mes: mesAtual() };
            return d;
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        carregou.current = true;
        setPronto(true);
      });
  }, []);

  // salvar a cada mudança (depois de carregar)
  useEffect(() => {
    if (!carregou.current) return;
    AsyncStorage.setItem(CHAVE, JSON.stringify(dados)).catch(() => {});
  }, [dados]);

  const mudar = useCallback((f: (d: Dados) => Dados) => setDados((d) => f(d)), []);

  const valor = useMemo<Estado>(() => {
    const hoje = hojeISO();
    const diasComTreino = new Set([...dados.checkins.map((c) => c.dia), ...dados.salvaOfensiva.usadoEm]);
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    const anteontem = new Date();
    anteontem.setDate(anteontem.getDate() - 2);
    const semana = dados.checkins.filter((c) => (Date.now() - new Date(c.dia + 'T12:00:00').getTime()) / 86400000 < 7);
    const treinoDoDia = (dia = new Date().getDay()) => dados.treinos.find((t) => t.dias.includes(dia));

    return {
      ...dados,
      pronto,
      papel: dados.perfil?.papel ?? null,
      nome: dados.perfil?.nome ?? '',

      entrar: ({ nome, email, papel }) =>
        mudar((d) => ({ ...d, perfil: { nome, email, papel, codigoTurma: d.perfil?.codigoTurma ?? gerarCodigo() } })),
      sair: () => mudar((d) => ({ ...d, perfil: null })),
      excluirConta: async () => {
        await AsyncStorage.removeItem(CHAVE).catch(() => {});
        setDados(dadosIniciais());
      },
      atualizarNome: (nome) => mudar((d) => (d.perfil ? { ...d, perfil: { ...d.perfil, nome } } : d)),

      feitosHoje: dados.feitos.dia === hoje ? dados.feitos.ids : [],
      marcarFeito: (id) =>
        mudar((d) => {
          const ids = d.feitos.dia === hoje ? d.feitos.ids : [];
          return { ...d, feitos: { dia: hoje, ids: ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id] } };
        }),
      fazerCheckin: (c) =>
        mudar((d) => {
          const nome = d.perfil?.nome || 'Você';
          const treino = d.treinos.find((t) => t.id === c.treinoId)?.nome ?? 'Treino livre';
          const post: Post = { id: novoId(), autor: nome, iniciais: iniciaisDe(nome), quando: new Date().toISOString(), treino, foto: c.fotoUri ? { uri: c.fotoUri } : undefined, reacoes: 0, reagi: false };
          return {
            ...d,
            checkins: [...d.checkins.filter((x) => x.dia !== hoje), { ...c, dia: hoje }],
            feed: [post, ...d.feed.filter((p) => !(p.autor === nome && p.quando.slice(0, 10) === new Date().toISOString().slice(0, 10)))],
          };
        }),
      usarSalvaOfensiva: () => {
        if (dados.salvaOfensiva.disponivel < 1) return false;
        mudar((d) => ({ ...d, salvaOfensiva: { ...d.salvaOfensiva, disponivel: d.salvaOfensiva.disponivel - 1, usadoEm: [...d.salvaOfensiva.usadoEm, hojeISO(ontem)] } }));
        return true;
      },
      reagir: (id) =>
        mudar((d) => ({ ...d, feed: d.feed.map((p) => (p.id === id ? { ...p, reagi: !p.reagi, reacoes: p.reacoes + (p.reagi ? -1 : 1) } : p)) })),
      treinoDoDia,
      ofensiva: calcularOfensiva(diasComTreino),
      diasComTreino,
      pontosSemana: 410 + semana.reduce((s, c) => s + PONTOS.treino + (c.fotoUri ? PONTOS.foto : 0), 0),
      jaTreinouHoje: dados.checkins.some((c) => c.dia === hoje),
      // dá pra salvar ontem se ontem ficou vazio e anteontem tinha treino (a sequência ia quebrar)
      podeSalvarOntem: dados.salvaOfensiva.disponivel > 0 && !diasComTreino.has(hojeISO(ontem)) && diasComTreino.has(hojeISO(anteontem)),

      salvarTreino: (t, paraAlunos = 'todos') => {
        const id = t.id ?? novoId();
        mudar((d) => {
          const marcos = { ...d.marcos, treinoCriado: true };
          const treinos = t.id
            ? d.treinos.map((x) => (x.id === t.id ? { ...x, ...t, id: x.id } : x))
            : [...d.treinos, { ...t, id, letra: String.fromCharCode(65 + d.treinos.length) }];
          const alunos = d.alunos.map((a) => {
            const recebe = paraAlunos === 'todos' || paraAlunos.includes(a.id);
            const tem = a.treinos.includes(id);
            if (recebe && !tem) return { ...a, treinos: [...a.treinos, id] };
            if (!recebe && tem) return { ...a, treinos: a.treinos.filter((x) => x !== id) };
            return a;
          });
          return { ...d, marcos, treinos, alunos };
        });
        return id;
      },
      salvarRegistro: (r) => {
        // recorde: melhor 1RM estimado do exercício maior que tudo que veio antes
        const prs = [...new Set(r.series.map((x) => x.exId))].filter((exId) => {
          const antes = dados.historico.flatMap((h) => h.series).filter((x) => x.exId === exId);
          const melhorAntes = Math.max(0, ...antes.map((x) => umRM(x.kg, x.reps)));
          const agora = Math.max(0, ...r.series.filter((x) => x.exId === exId && x.tipo !== 'A').map((x) => umRM(x.kg, x.reps)));
          return agora > 0 && agora > melhorAntes;
        });
        const reg: Registro = { ...r, id: novoId(), prs };
        mudar((d) => ({
          ...d,
          historico: [...d.historico, reg],
          feitos: { dia: hoje, ids: [...new Set([...(d.feitos.dia === hoje ? d.feitos.ids : []), ...r.series.map((x) => x.exId)])] },
        }));
        return reg;
      },
      ultimoDe: (exId) => {
        for (let k = dados.historico.length - 1; k >= 0; k--) {
          const ss = dados.historico[k].series.filter((x) => x.exId === exId);
          if (ss.length) return ss;
        }
        return [];
      },
      recordeDe: (exId) => {
        const ss = dados.historico.flatMap((h) => h.series).filter((x) => x.exId === exId && x.tipo !== 'A');
        const porTreino = dados.historico.map((h) => h.series.filter((x) => x.exId === exId).reduce((v, x) => v + x.kg * x.reps, 0));
        return {
          kg: Math.max(0, ...ss.map((x) => x.kg)),
          rm: Math.round(Math.max(0, ...ss.map((x) => umRM(x.kg, x.reps)))),
          reps: Math.max(0, ...ss.map((x) => x.reps)),
          volume: Math.round(Math.max(0, ...porTreino)),
        };
      },
      evolucaoDe: (exId) =>
        dados.historico
          .map((h) => {
            const ss = h.series.filter((x) => x.exId === exId && x.tipo !== 'A');
            return ss.length ? { data: h.data, rm: Math.round(Math.max(...ss.map((x) => umRM(x.kg, x.reps)))), kg: Math.max(...ss.map((x) => x.kg)) } : null;
          })
          .filter((x): x is { data: string; rm: number; kg: number } => !!x),
      adicionarMedida: (m) => mudar((d) => ({ ...d, medidas: [...d.medidas, { ...m, id: novoId(), data: new Date().toISOString() }] })),
      enviarMensagem: (thread, de, texto) =>
        mudar((d) => ({ ...d, mensagens: { ...d.mensagens, [thread]: [...(d.mensagens[thread] ?? []), { id: novoId(), de, texto, quando: new Date().toISOString() }] } })),
      alternarFavorito: (bibId) =>
        mudar((d) => ({ ...d, favoritos: d.favoritos.includes(bibId) ? d.favoritos.filter((x) => x !== bibId) : [...d.favoritos, bibId] })),
      salvarCorpo: (c) => mudar((d) => ({ ...d, corpo: { ...d.corpo, ...c } })),
      aplicarPlano: (planoId, paraAlunos) => {
        const plano = PLANOS.find((p) => p.id === planoId);
        if (!plano) return 0;
        mudar((d) => {
          const exercicios = { ...d.exercicios };
          const porFonte: Record<string, string> = {};
          Object.values(exercicios).forEach((e) => { if (e.fonteId) porFonte[e.fonteId] = e.id; });
          const garantir = (bibId: string, series: number, reps: string) => {
            if (porFonte[bibId]) return porFonte[bibId];
            const item = POR_ID[bibId];
            const id = novoId();
            exercicios[id] = { id, nome: item.n, grupo: item.g, series, reps, descanso: 60, dica: '', capa: { uri: urlImg(item.img[0]) }, imagens: item.img.map(urlImg), fonteId: bibId };
            porFonte[bibId] = id;
            return id;
          };
          const treinos = [...d.treinos];
          const novos: string[] = [];
          for (const t of plano.treinos) {
            const lista = t.exercicios.filter((x) => POR_ID[x.id]);
            const ids = lista.map((x) => garantir(x.id, x.series, x.reps));
            const ajustes = Object.fromEntries(lista.map((x, i) => [ids[i], { series: x.series, reps: x.reps }]));
            const id = novoId();
            treinos.push({ id, letra: String.fromCharCode(65 + treinos.length), nome: t.nome, dias: t.dias, exercicios: ids, ajustes });
            novos.push(id);
          }
          const alunos = d.alunos.map((a) => (paraAlunos === 'todos' || paraAlunos.includes(a.id) ? { ...a, treinos: [...a.treinos, ...novos] } : a));
          return { ...d, exercicios, treinos, alunos, marcos: { ...d.marcos, treinoCriado: true } };
        });
        return plano.treinos.length;
      },
      alternarTreinoDoAluno: (alunoId, treinoId) =>
        mudar((d) => ({
          ...d,
          alunos: d.alunos.map((a) => (a.id !== alunoId ? a : { ...a, treinos: a.treinos.includes(treinoId) ? a.treinos.filter((x) => x !== treinoId) : [...a.treinos, treinoId] })),
        })),
      marcarConvite: () => mudar((d) => ({ ...d, marcos: { ...d.marcos, convidou: true } })),
      seriesDe: (treino, exId) => {
        const ex = dados.exercicios[exId];
        const aj = treino?.ajustes?.[exId];
        return { series: aj?.series ?? ex?.series ?? 3, reps: aj?.reps ?? ex?.reps ?? '10' };
      },
      excluirTreino: (id) =>
        mudar((d) => ({ ...d, treinos: d.treinos.filter((t) => t.id !== id).map((t, i) => ({ ...t, letra: String.fromCharCode(65 + i) })) })),
      salvarExercicio: (e) => {
        const id = e.id ?? novoId();
        mudar((d) => ({ ...d, marcos: { ...d.marcos, videoEnviado: d.marcos.videoEnviado || !!e.videoUri }, exercicios: { ...d.exercicios, [id]: { ...d.exercicios[id], ...e, id, capa: e.capa ?? d.exercicios[id]?.capa ?? SEED_EXERCICIOS.supino.capa } as Exercicio } }));
        return id;
      },
      salvarDesafio: (des) => mudar((d) => ({ ...d, marcos: { ...d.marcos, desafioCriado: d.marcos.desafioCriado || !!des }, desafio: des ? { ...des, inicio: new Date().toISOString() } : null })),
    };
  }, [dados, pronto, mudar]);

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp fora do AppProvider');
  return v;
}
