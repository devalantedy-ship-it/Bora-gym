// Biblioteca pronta de exercícios (free-exercise-db, domínio público), com nomes em português.
// Gerada por scripts/importar-biblioteca.js.
import dados from './biblioteca.json';

export type ItemBiblioteca = {
  id: string;
  n: string; // nome em português (ou original quando não deu pra traduzir)
  en: string; // nome original em inglês
  g: string; // grupo muscular principal
  g2: string[]; // secundários
  eq: string; // equipamento
  nv: string; // nível
  c: string; // categoria
  img: string[];
};

export const BIBLIOTECA = dados as ItemBiblioteca[];
export const POR_ID: Record<string, ItemBiblioteca> = Object.fromEntries(BIBLIOTECA.map((x) => [x.id, x]));
export const GRUPOS_BIB = ['Todos', ...Array.from(new Set(BIBLIOTECA.map((x) => x.g))).sort((a, b) => a.localeCompare(b, 'pt-BR'))];
export const EQUIP_BIB = ['Todos', 'Halter', 'Barra', 'Cabo/Polia', 'Máquina', 'Peso do corpo', 'Kettlebell', 'Elástico', 'Barra W'];

const tirarAcento = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function buscar(texto: string, grupo: string, equip: string) {
  const q = tirarAcento(texto.trim());
  return BIBLIOTECA.filter(
    (x) =>
      (grupo === 'Todos' || x.g === grupo) &&
      (equip === 'Todos' || x.eq === equip) &&
      (!q || tirarAcento(x.n).includes(q) || tirarAcento(x.en).includes(q)),
  );
}
