import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Busca, Chips, Passos } from '../components/extras';
import { Botao, Campo, Kicker, Linha, T, toque, voltar } from '../components/ui';
import { DIAS_CURTOS, DIAS_LONGOS, GRUPOS } from '../data/mock';
import { useApp } from '../store/app';
import { cor, esp, fonte, LARGURA_MAX, raio } from '../theme';

const SUGESTOES = ['Peito & Tríceps', 'Costas & Bíceps', 'Pernas', 'Ombro & Abdômen', 'Full body', 'Glúteo & Posterior'];
const TITULOS = ['Nome e dias', 'Exercícios', 'Revisar e enviar'];

export default function NovoTreino() {
  const { id, aluno } = useLocalSearchParams<{ id?: string; aluno?: string }>();
  const { treinos, exercicios, salvarTreino, alunos } = useApp();
  const editando = treinos.find((t) => t.id === id);
  const comTreino = editando ? alunos.filter((a) => a.treinos.includes(editando.id)).map((a) => a.id) : [];
  const [paraTodos, setParaTodos] = useState(aluno ? false : editando ? comTreino.length === alunos.length : true);
  const [escolhidos, setEscolhidos] = useState<string[]>(aluno ? [aluno] : comTreino);

  const [passo, setPasso] = useState(0);
  const [nome, setNome] = useState(editando?.nome ?? '');
  const [dias, setDias] = useState<number[]>(editando?.dias ?? []);
  const [lista, setLista] = useState<string[]>(editando?.exercicios.filter((e) => exercicios[e]) ?? []);
  const [ajustes, setAjustes] = useState<Record<string, { series: number; reps: string }>>(editando?.ajustes ?? {});
  const [busca, setBusca] = useState('');
  const [grupo, setGrupo] = useState('Todos');
  const [salvo, setSalvo] = useState(false);

  const alternar = <V,>(arr: V[], v: V) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const serie = (exId: string) => ajustes[exId] ?? { series: exercicios[exId].series, reps: exercicios[exId].reps };
  const mudarSeries = (exId: string, delta: number) =>
    setAjustes((a) => ({ ...a, [exId]: { ...serie(exId), series: Math.max(1, Math.min(10, serie(exId).series + delta)) } }));
  const mudarReps = (exId: string, reps: string) => setAjustes((a) => ({ ...a, [exId]: { ...serie(exId), reps } }));
  const mover = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= lista.length) return;
    const n = [...lista];
    [n[i], n[j]] = [n[j], n[i]];
    setLista(n);
  };

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return Object.values(exercicios)
      .filter((e) => (grupo === 'Todos' || e.grupo === grupo) && (!q || e.nome.toLowerCase().includes(q) || e.grupo.toLowerCase().includes(q)))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [exercicios, busca, grupo]);
  const gruposComExercicio = ['Todos', ...GRUPOS.filter((g) => Object.values(exercicios).some((e) => e.grupo === g))];

  const podeAvancar = passo === 0 ? nome.trim().length > 0 && dias.length > 0 : passo === 1 ? lista.length > 0 : paraTodos || escolhidos.length > 0;
  const destino = paraTodos ? 'a turma toda' : escolhidos.length === 1 ? alunos.find((a) => a.id === escolhidos[0])?.nome ?? '1 aluno' : `${escolhidos.length} alunos`;
  const enviar = () => {
    const aj = Object.fromEntries(lista.filter((x) => ajustes[x]).map((x) => [x, ajustes[x]]));
    salvarTreino({ id: editando?.id, nome: nome.trim(), dias: [...dias].sort(), exercicios: lista, ajustes: aj }, paraTodos ? 'todos' : escolhidos);
    setSalvo(true);
  };

  if (salvo) {
    return (
      <SafeAreaView style={s.tela} edges={['left', 'right', 'bottom']}>
        <View style={[s.miolo, { alignItems: 'center', justifyContent: 'center', flex: 1, gap: esp.l }]}>
          <View style={s.ok}><Ionicons name="checkmark" size={56} color={cor.sobreLimao} /></View>
          <Text style={s.grande}>{editando ? 'Treino atualizado!' : 'Treino enviado!'}</Text>
          <T fraco tam={15} style={{ textAlign: 'center' }}>
            "{nome}" foi pra {destino} e aparece {dias.length === 7 ? 'todos os dias' : `toda ${dias.map((d) => DIAS_LONGOS[d].toLowerCase()).join(', ')}`}.
          </T>
          <View style={{ alignSelf: 'stretch', gap: esp.s, marginTop: esp.l }}>
            <Botao titulo="Pronto" onPress={() => voltar()} />
            <Botao titulo="Convidar alunos" tipo="escuro" onPress={() => router.replace('/convidar')} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.tela} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={s.miolo} keyboardShouldPersistTaps="handled">
        <Passos atual={passo} total={3} titulos={TITULOS} />

        {passo === 0 ? (
          <>
            <Campo rotulo="Nome do treino" value={nome} onChangeText={setNome} placeholder="Ex.: Peito & Tríceps" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: -6, marginBottom: esp.xl }}>
              {SUGESTOES.map((sug) => (
                <Pressable key={sug} onPress={() => { toque(); setNome(sug); }} style={[s.sugestao, nome === sug && { borderColor: cor.limao }]}>
                  <Text style={s.sugestaoTexto}>{sug}</Text>
                </Pressable>
              ))}
            </View>
            <Kicker>Em quais dias?</Kicker>
            <Linha style={{ gap: 8, marginBottom: esp.m }}>
              {DIAS_CURTOS.map((d, i) => {
                const on = dias.includes(i);
                return (
                  <Pressable key={i} onPress={() => { toque(); setDias(alternar(dias, i)); }} style={[s.dia, on && { backgroundColor: cor.limao, borderColor: cor.limao }]} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={DIAS_LONGOS[i]}>
                    <Text style={[s.diaTexto, on && { color: cor.sobreLimao }]}>{d}</Text>
                  </Pressable>
                );
              })}
            </Linha>
            <Linha style={{ gap: 8, flexWrap: 'wrap' }}>
              {[{ t: 'Seg/Qua/Sex', d: [1, 3, 5] }, { t: 'Ter/Qui', d: [2, 4] }, { t: 'Todo dia útil', d: [1, 2, 3, 4, 5] }].map((p) => (
                <Pressable key={p.t} onPress={() => { toque(); setDias(p.d); }} style={s.sugestao}>
                  <Text style={s.sugestaoTexto}>{p.t}</Text>
                </Pressable>
              ))}
            </Linha>
          </>
        ) : null}

        {passo === 1 ? (
          <>
            {lista.length > 0 ? (
              <View style={s.selecionados}>
                <Ionicons name="checkmark-circle" size={18} color={cor.sobreLimao} />
                <Text style={s.selecionadosTexto}>{lista.length} {lista.length === 1 ? 'exercício escolhido' : 'exercícios escolhidos'}</Text>
              </View>
            ) : null}
            <Busca valor={busca} onChange={setBusca} placeholder="Buscar exercício" />
            <View style={{ marginBottom: esp.l }}><Chips opcoes={gruposComExercicio} valor={grupo} onChange={setGrupo} /></View>
            <View style={{ gap: 8 }}>
              {filtrados.map((ex) => {
                const on = lista.includes(ex.id);
                return (
                  <Pressable key={ex.id} onPress={() => { toque(); setLista(alternar(lista, ex.id)); }} style={[s.ex, on && { borderColor: cor.limao, backgroundColor: 'rgba(212,255,58,0.06)' }]} accessibilityRole="checkbox" accessibilityState={{ checked: on }}>
                    <Image source={ex.capa} style={s.capa} contentFit="cover" />
                    <View style={{ flex: 1 }}>
                      <T tam={15} peso="negrito">{ex.nome}</T>
                      <T fraco tam={12}>{ex.grupo} · {ex.series}×{ex.reps}{ex.videoUri ? ' · 🎥' : ''}</T>
                    </View>
                    <View style={[s.marca, on && { backgroundColor: cor.limao, borderColor: cor.limao }]}>
                      {on ? <Text style={s.marcaNum}>{lista.indexOf(ex.id) + 1}</Text> : <Ionicons name="add" size={18} color={cor.textoSuave} />}
                    </View>
                  </Pressable>
                );
              })}
              {filtrados.length === 0 ? <T fraco style={{ textAlign: 'center', marginVertical: esp.l }}>Nenhum exercício com esse nome.</T> : null}
            </View>
            <Pressable onPress={() => router.push('/biblioteca')} style={s.bib}>
              <Ionicons name="library" size={20} color={cor.sobreLimao} />
              <Text style={s.bibTexto}>Buscar na biblioteca (873 com demonstração)</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/novo-exercicio')} style={{ paddingVertical: 12 }}>
              <T tam={14} peso="negrito" style={{ color: cor.limao, textAlign: 'center' }}>+ Cadastrar exercício com seu vídeo</T>
            </Pressable>
          </>
        ) : null}

        {passo === 2 ? (
          <>
            <View style={s.resumo}>
              <Text style={s.resumoNome}>{nome}</Text>
              <Linha style={{ gap: 6, marginTop: 8 }}>
                {DIAS_CURTOS.map((d, i) => (
                  <View key={i} style={[s.diaMini, dias.includes(i) && { backgroundColor: cor.limao }]}>
                    <Text style={[s.diaMiniTexto, dias.includes(i) && { color: cor.sobreLimao }]}>{d}</Text>
                  </View>
                ))}
              </Linha>
            </View>
            <Kicker>Pra quem é esse treino?</Kicker>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: esp.m }}>
              {[true, false].map((v) => (
                <Pressable key={String(v)} onPress={() => { toque(); setParaTodos(v); }} style={[s.pra, paraTodos === v && { backgroundColor: cor.limao, borderColor: cor.limao }]} accessibilityRole="radio" accessibilityState={{ selected: paraTodos === v }}>
                  <Ionicons name={v ? 'people' : 'person'} size={18} color={paraTodos === v ? cor.sobreLimao : cor.textoSuave} />
                  <Text style={[s.praTexto, paraTodos === v && { color: cor.sobreLimao }]}>{v ? 'Turma toda' : 'Alunos específicos'}</Text>
                </Pressable>
              ))}
            </View>
            {!paraTodos ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: esp.l }}>
                {alunos.map((a) => {
                  const on = escolhidos.includes(a.id);
                  return (
                    <Pressable key={a.id} onPress={() => { toque(); setEscolhidos(alternar(escolhidos, a.id)); }} style={[s.alunoChip, on && { borderColor: cor.limao, backgroundColor: 'rgba(212,255,58,0.08)' }]} accessibilityRole="checkbox" accessibilityState={{ checked: on }}>
                      <View style={[s.alunoAv, on && { backgroundColor: cor.limao }]}><Text style={[s.alunoAvTexto, on && { color: cor.sobreLimao }]}>{a.iniciais}</Text></View>
                      <Text style={s.alunoNome}>{a.nome}</Text>
                      {on ? <Ionicons name="checkmark" size={16} color={cor.limao} /> : null}
                    </Pressable>
                  );
                })}
              </View>
            ) : <View style={{ height: esp.m }} />}
            <Kicker>Ordem e séries · toque pra ajustar</Kicker>
            <View style={{ gap: 8 }}>
              {lista.map((exId, i) => {
                const sr = serie(exId);
                return (
                  <View key={exId} style={s.revisar}>
                    <Linha>
                      <View style={s.num}><Text style={{ color: cor.sobreLimao, fontFamily: fonte.extra }}>{i + 1}</Text></View>
                      <T tam={15} peso="negrito" style={{ flex: 1 }}>{exercicios[exId].nome}</T>
                      <Pressable onPress={() => mover(i, -1)} hitSlop={8} accessibilityLabel="Subir"><Ionicons name="chevron-up" size={22} color={i === 0 ? cor.borda : cor.texto} /></Pressable>
                      <Pressable onPress={() => mover(i, 1)} hitSlop={8} accessibilityLabel="Descer"><Ionicons name="chevron-down" size={22} color={i === lista.length - 1 ? cor.borda : cor.texto} /></Pressable>
                      <Pressable onPress={() => setLista(alternar(lista, exId))} hitSlop={8} accessibilityLabel="Tirar do treino"><Ionicons name="close" size={22} color={cor.perigo} /></Pressable>
                    </Linha>
                    <Linha style={{ marginTop: 10, gap: esp.l, flexWrap: 'wrap' }}>
                      <Linha style={{ gap: 8 }}>
                        <Pressable onPress={() => mudarSeries(exId, -1)} style={s.mini} accessibilityLabel="Menos séries"><Ionicons name="remove" size={16} color={cor.texto} /></Pressable>
                        <T tam={15} peso="extra">{sr.series} séries</T>
                        <Pressable onPress={() => mudarSeries(exId, 1)} style={s.mini} accessibilityLabel="Mais séries"><Ionicons name="add" size={16} color={cor.texto} /></Pressable>
                      </Linha>
                      <Linha style={{ gap: 6 }}>
                        {['8', '10', '12', '15'].map((r) => (
                          <Pressable key={r} onPress={() => { toque(); mudarReps(exId, r); }} style={[s.rep, sr.reps === r && { backgroundColor: cor.limao, borderColor: cor.limao }]} accessibilityLabel={`${r} repetições`}>
                            <Text style={[s.repTexto, sr.reps === r && { color: cor.sobreLimao }]}>{r}</Text>
                          </Pressable>
                        ))}
                      </Linha>
                    </Linha>
                  </View>
                );
              })}
            </View>
          </>
        ) : null}
      </ScrollView>

      <View style={s.rodape}>
        <View style={s.rodapeMiolo}>
          {passo > 0 ? (
            <Pressable onPress={() => { toque(); setPasso(passo - 1); }} style={s.voltar} accessibilityRole="button" accessibilityLabel="Passo anterior">
              <Ionicons name="arrow-back" size={22} color={cor.texto} />
            </Pressable>
          ) : null}
          <View style={{ flex: 1 }}>
            <Botao
              titulo={passo < 2 ? (passo === 1 && lista.length ? `Continuar com ${lista.length}` : 'Continuar') : editando ? 'Salvar alterações' : 'Enviar pros alunos'}
              onPress={() => (passo < 2 ? setPasso(passo + 1) : enviar())}
              desativado={!podeAvancar}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cor.fundo },
  miolo: { width: '100%', maxWidth: LARGURA_MAX, alignSelf: 'center', paddingHorizontal: esp.xl - 4, paddingTop: esp.l, paddingBottom: 120 },
  bib: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, borderRadius: 26, backgroundColor: cor.limao, marginTop: esp.l },
  bibTexto: { color: cor.sobreLimao, fontFamily: fonte.extra, fontSize: 14 },
  sugestao: { borderWidth: 1.5, borderColor: cor.borda, borderRadius: raio.pill, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: cor.card },
  sugestaoTexto: { color: cor.textoSuave, fontFamily: fonte.negrito, fontSize: 12 },
  dia: { flex: 1, aspectRatio: 1, maxWidth: 52, borderRadius: 26, borderWidth: 1.5, borderColor: cor.borda, alignItems: 'center', justifyContent: 'center' },
  diaTexto: { color: cor.textoSuave, fontFamily: fonte.extra, fontSize: 14 },
  selecionados: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', backgroundColor: cor.limao, borderRadius: raio.pill, paddingHorizontal: 14, paddingVertical: 8, marginBottom: esp.m },
  selecionadosTexto: { color: cor.sobreLimao, fontFamily: fonte.extra, fontSize: 13 },
  ex: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: cor.card, borderRadius: raio.m, borderWidth: 1.5, borderColor: cor.borda, padding: 10 },
  capa: { width: 52, height: 52, borderRadius: 12, backgroundColor: cor.cardAlto },
  marca: { width: 34, height: 34, borderRadius: 17, borderWidth: 1.5, borderColor: cor.borda, alignItems: 'center', justifyContent: 'center' },
  marcaNum: { color: cor.sobreLimao, fontFamily: fonte.extra, fontSize: 14 },
  resumo: { backgroundColor: cor.card, borderRadius: raio.g, borderWidth: 1, borderColor: cor.borda, padding: esp.l, marginBottom: esp.l },
  resumoNome: { color: cor.texto, fontFamily: fonte.display, fontSize: 24 },
  diaMini: { width: 28, height: 28, borderRadius: 14, backgroundColor: cor.cardAlto, alignItems: 'center', justifyContent: 'center' },
  diaMiniTexto: { color: cor.textoFraco, fontFamily: fonte.negrito, fontSize: 11 },
  revisar: { backgroundColor: cor.card, borderRadius: raio.m, borderWidth: 1, borderColor: cor.borda, padding: 12 },
  num: { width: 30, height: 30, borderRadius: 15, backgroundColor: cor.limao, alignItems: 'center', justifyContent: 'center' },
  mini: { width: 30, height: 30, borderRadius: 15, backgroundColor: cor.cardAlto, alignItems: 'center', justifyContent: 'center' },
  pra: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: 25, borderWidth: 1.5, borderColor: cor.borda },
  praTexto: { color: cor.textoSuave, fontFamily: fonte.extra, fontSize: 14 },
  alunoChip: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1.5, borderColor: cor.borda, borderRadius: 24, paddingLeft: 4, paddingRight: 12, height: 44 },
  alunoAv: { width: 34, height: 34, borderRadius: 17, backgroundColor: cor.cardAlto, alignItems: 'center', justifyContent: 'center' },
  alunoAvTexto: { color: cor.textoSuave, fontFamily: fonte.extra, fontSize: 12 },
  alunoNome: { color: cor.texto, fontFamily: fonte.negrito, fontSize: 14 },
  rep: { minWidth: 36, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: cor.borda, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  repTexto: { color: cor.textoSuave, fontFamily: fonte.extra, fontSize: 13 },
  rodape: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,10,10,0.96)', borderTopWidth: 1, borderTopColor: cor.borda, paddingTop: 12, paddingBottom: 18 },
  rodapeMiolo: { width: '100%', maxWidth: LARGURA_MAX, alignSelf: 'center', paddingHorizontal: esp.xl - 4, flexDirection: 'row', gap: esp.s, alignItems: 'center' },
  voltar: { width: 56, height: 56, borderRadius: 28, borderWidth: 1.5, borderColor: cor.borda, alignItems: 'center', justifyContent: 'center' },
  ok: { width: 110, height: 110, borderRadius: 55, backgroundColor: cor.limao, alignItems: 'center', justifyContent: 'center' },
  grande: { color: cor.texto, fontFamily: fonte.display, fontSize: 28, textAlign: 'center' },
});
