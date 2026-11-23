// Gera src/data/biblioteca.json a partir do free-exercise-db (domínio público, Unlicense):
// https://github.com/yuhonas/free-exercise-db
// Uso: node scripts/importar-biblioteca.js caminho/para/exercises.json
const fs = require('fs');
const path = require('path');

const origem = process.argv[2];
if (!origem) throw new Error('passe o caminho do exercises.json');
const dados = JSON.parse(fs.readFileSync(origem, 'utf8'));

const GRUPO = {
  abdominals: 'Abdômen', hamstrings: 'Posterior', adductors: 'Pernas', quadriceps: 'Pernas', biceps: 'Bíceps',
  shoulders: 'Ombro', chest: 'Peito', 'middle back': 'Costas', calves: 'Panturrilha', glutes: 'Glúteo',
  'lower back': 'Lombar', lats: 'Costas', triceps: 'Tríceps', traps: 'Trapézio', forearms: 'Antebraço',
  neck: 'Pescoço', abductors: 'Glúteo',
};
const EQUIP = {
  'body only': 'Peso do corpo', machine: 'Máquina', other: 'Outros', 'foam roll': 'Rolo', kettlebells: 'Kettlebell',
  dumbbell: 'Halter', cable: 'Cabo/Polia', barbell: 'Barra', bands: 'Elástico', 'medicine ball': 'Medicine ball',
  'exercise ball': 'Bola suíça', 'e-z curl bar': 'Barra W', null: 'Livre',
};
const NIVEL = { beginner: 'Iniciante', intermediate: 'Intermediário', expert: 'Avançado' };
const CATEGORIA = {
  strength: 'Musculação', stretching: 'Alongamento', plyometrics: 'Pliometria', strongman: 'Strongman',
  powerlifting: 'Powerlifting', cardio: 'Cardio', 'olympic weightlifting': 'Olímpico',
};

// movimento principal (frases mais longas primeiro)
const MOV = [
  ['incline dumbbell press', 'Supino inclinado com halter'], ['decline dumbbell press', 'Supino declinado com halter'],
  ['lying triceps press', 'Tríceps testa'], ['skullcrusher', 'Tríceps testa'], ['leg extensions', 'Cadeira extensora'],
  ['lying leg curls', 'Mesa flexora'], ['leg curls', 'Mesa flexora'], ['hammer curls', 'Rosca martelo'],
  ['stiff-legged', 'Stiff'], ['stiff legged', 'Stiff'], ['swings', 'Swing'], ['lat pulldown', 'Puxada'],
  ['romanian deadlift', 'Levantamento terra romeno'], ['stiff-legged deadlift', 'Stiff'], ['stiff leg deadlift', 'Stiff'],
  ['sumo deadlift', 'Levantamento terra sumô'], ['deadlift', 'Levantamento terra'],
  ['bench press', 'Supino'], ['floor press', 'Supino no chão'], ['leg press', 'Leg press'], ['calf press', 'Panturrilha no leg press'],
  ['military press', 'Desenvolvimento militar'], ['shoulder press', 'Desenvolvimento'], ['push press', 'Push press'],
  ['arnold press', 'Desenvolvimento Arnold'], ['chest press', 'Supino na máquina'], ['press', 'Desenvolvimento'],
  ['leg extension', 'Cadeira extensora'], ['leg curl', 'Mesa flexora'], ['hamstring curl', 'Mesa flexora'],
  ['preacher curl', 'Rosca Scott'], ['hammer curl', 'Rosca martelo'], ['concentration curl', 'Rosca concentrada'],
  ['wrist curl', 'Rosca de punho'], ['curls', 'Rosca'], ['curl', 'Rosca'],
  ['upright row', 'Remada alta'], ['rows', 'Remada'], ['row', 'Remada'],
  ['front squat', 'Agachamento frontal'], ['split squat', 'Agachamento búlgaro'], ['goblet squat', 'Agachamento goblet'],
  ['hack squat', 'Agachamento hack'], ['jump squat', 'Agachamento com salto'], ['squats', 'Agachamento'], ['squat', 'Agachamento'],
  ['lunges', 'Avanço'], ['lunge', 'Avanço'], ['step-up', 'Subida no banco'], ['step up', 'Subida no banco'],
  ['calf raises', 'Elevação de panturrilha'], ['calf raise', 'Elevação de panturrilha'],
  ['lateral raises', 'Elevação lateral'], ['lateral raise', 'Elevação lateral'], ['front raise', 'Elevação frontal'],
  ['delt raise', 'Elevação frontal'], ['leg raises', 'Elevação de pernas'], ['leg raise', 'Elevação de pernas'],
  ['knee raise', 'Elevação de joelhos'], ['raises', 'Elevação'], ['raise', 'Elevação'],
  ['triceps extension', 'Extensão de tríceps'], ['tricep extension', 'Extensão de tríceps'], ['extensions', 'Extensão'], ['extension', 'Extensão'],
  ['pushdown', 'Tríceps pulley'], ['push-down', 'Tríceps pulley'], ['kickbacks', 'Coice'], ['kickback', 'Coice'],
  ['flyes', 'Crucifixo'], ['flys', 'Crucifixo'], ['fly', 'Crucifixo'], ['crossover', 'Crossover'], ['butterfly', 'Voador'],
  ['pulldown', 'Puxada'], ['pull-down', 'Puxada'], ['pullups', 'Barra fixa'], ['pull-ups', 'Barra fixa'], ['pullup', 'Barra fixa'],
  ['pull-up', 'Barra fixa'], ['chin-up', 'Barra supinada'], ['chinup', 'Barra supinada'], ['face pull', 'Face pull'],
  ['pullover', 'Pullover'], ['push-ups', 'Flexão'], ['push-up', 'Flexão'], ['pushups', 'Flexão'], ['pushup', 'Flexão'],
  ['dips', 'Mergulho'], ['dip', 'Mergulho'], ['crunches', 'Abdominal'], ['crunch', 'Abdominal'], ['sit-up', 'Abdominal'],
  ['situp', 'Abdominal'], ['plank', 'Prancha'], ['shrugs', 'Encolhimento'], ['shrug', 'Encolhimento'],
  ['hip thrust', 'Elevação de quadril'], ['glute bridge', 'Ponte de glúteo'], ['good morning', 'Bom dia'],
  ['swing', 'Swing'], ['snatch', 'Arranco'], ['clean and jerk', 'Arremesso'], ['clean', 'Clean'], ['jerk', 'Jerk'],
  ['stretch', 'Alongamento'], ['rotation', 'Rotação'], ['twist', 'Rotação de tronco'], ['side bend', 'Flexão lateral'],
  ['rollout', 'Roda abdominal'], ['jumping jacks', 'Polichinelo'], ['burpee', 'Burpee'], ['mountain climbers', 'Escalador'],
  ['bridge', 'Ponte'], ['get-up', 'Levantada turca'], ['farmer', 'Caminhada do fazendeiro'], ['box jump', 'Salto na caixa'],
];
const MOD = [
  ['bent over', 'curvado'], ['bent-over', 'curvado'], ['close-grip', 'pegada fechada'], ['close grip', 'pegada fechada'],
  ['wide-grip', 'pegada aberta'], ['wide grip', 'pegada aberta'], ['reverse grip', 'pegada invertida'], ['one-arm', 'unilateral'],
  ['one arm', 'unilateral'], ['single-arm', 'unilateral'], ['single arm', 'unilateral'], ['one-legged', 'unilateral'],
  ['single-leg', 'unilateral'], ['single leg', 'unilateral'], ['incline', 'inclinado'], ['decline', 'declinado'],
  ['seated', 'sentado'], ['standing', 'em pé'], ['lying', 'deitado'], ['kneeling', 'ajoelhado'], ['alternating', 'alternado'],
  ['alternate', 'alternado'], ['reverse', 'invertido'], ['overhead', 'acima da cabeça'], ['rear delt', 'posterior'],
  ['rear', 'posterior'], ['front', 'frontal'], ['weighted', 'com carga'], ['jumping', 'com salto'], ['sumo', 'sumô'],
];
const EQ_NOME = [
  ['smith machine', 'no smith'], ['e-z bar', 'com barra W'], ['ez bar', 'com barra W'], ['ez-bar', 'com barra W'],
  ['barbell', 'com barra'], ['dumbbells', 'com halteres'], ['dumbbell', 'com halter'], ['kettlebells', 'com kettlebells'],
  ['kettlebell', 'com kettlebell'], ['cable', 'no cabo'], ['machine', 'na máquina'], ['bands', 'com elástico'],
  ['band', 'com elástico'], ['medicine ball', 'com medicine ball'], ['exercise ball', 'na bola suíça'], ['rope', 'com corda'],
];

function traduzir(nome) {
  let s = ' ' + nome.toLowerCase().replace(/[()]/g, ' ').replace(/\s+/g, ' ') + ' ';
  const achar = (lista) => {
    for (const [en, pt] of lista) {
      const re = new RegExp(`[\\s-]${en.replace(/[-/]/g, '[-\\s]?')}[\\s-]`);
      if (re.test(s)) {
        s = s.replace(re, ' ');
        return pt;
      }
    }
    return null;
  };
  const mov = achar(MOV);
  if (!mov) return null;
  const mods = [];
  let m;
  while ((m = achar(MOD))) if (!mods.includes(m)) mods.push(m);
  const eqs = [];
  let e;
  while ((e = achar(EQ_NOME))) if (!eqs.includes(e)) eqs.push(e);
  // concordância: adjetivos no feminino quando o movimento é feminino (Rosca, Remada, Elevação...)
  const FEM = /^(Rosca|Remada|Elevação|Extensão|Flexão|Puxada|Barra|Prancha|Ponte|Mesa|Cadeira|Subida|Rotação|Caminhada|Levantada|Roda)/;
  const ajusta = (m) => (FEM.test(mov) ? m.replace(/(inclinad|declinad|sentad|deitad|ajoelhad|alternad|invertid|curvad)o\b/, '$1a') : m);
  let pt = [mov, ...mods.map(ajusta), ...eqs].join(' ');
  pt = pt.charAt(0).toUpperCase() + pt.slice(1);
  return pt;
}

const usados = new Set();
const saida = [];
let traduzidos = 0;
for (const ex of dados) {
  if (!ex.images || !ex.images.length) continue;
  const pt = traduzir(ex.name);
  if (pt) traduzidos++;
  const nome = pt ?? ex.name; // o nome original aparece pequeno embaixo no app
  usados.add(nome);
  saida.push({
    id: ex.id,
    n: nome,
    en: ex.name,
    g: GRUPO[ex.primaryMuscles?.[0]] ?? 'Outros',
    g2: (ex.secondaryMuscles ?? []).map((x) => GRUPO[x]).filter(Boolean),
    eq: EQUIP[String(ex.equipment)] ?? 'Outros',
    nv: NIVEL[ex.level] ?? 'Intermediário',
    c: CATEGORIA[ex.category] ?? 'Musculação',
    img: ex.images,
  });
}
saida.sort((a, b) => a.n.localeCompare(b.n, 'pt-BR'));
const destino = path.join(__dirname, '..', 'src', 'data', 'biblioteca.json');
fs.writeFileSync(destino, JSON.stringify(saida));
console.log(`${saida.length} exercícios · ${traduzidos} com nome em português · ${(fs.statSync(destino).size / 1024).toFixed(0)} KB`);
console.log(saida.filter((_, i) => i % 40 === 0).map((x) => `${x.n}  ←  ${x.en}`).join('\n'));
