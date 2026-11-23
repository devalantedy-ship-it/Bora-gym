// Modo treino: um exercício por vez, carga e reps por série (com o que fez da última vez),
// descanso automático, aviso de recorde na hora e resumo no final.
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Demo } from '../components/Demo';
import { Anel } from '../components/extras';
import { Botao, Card, confirmar, Linha, T, toque } from '../components/ui';
import { TIPOS_SERIE, umRM, type Registro, type TipoSerie } from '../data/mock';
import { useApp } from '../store/app';
import { cor, esp, fonte, LARGURA_MAX, raio } from '../theme';

type LinhaSerie = { kg: string; reps: string; tipo: TipoSerie; feito: boolean };
const ORDEM_TIPO: TipoSerie[] = ['N', 'A', 'F', 'D'];
const num = (v: string) => parseFloat(v.replace(',', '.')) || 0;
const fmtKg = (kg: number) => (Number.isInteger(kg) ? String(kg) : kg.toFixed(1).replace('.', ','));

function Video({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => { p.loop = true; p.muted = true; p.play(); });
  return <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />;
}

export default function TreinoAoVivo() {
  const { treinoDoDia, treinos, exercicios, seriesDe, ultimoDe, recordeDe, salvarRegistro } = useApp();
  const treino = treinoDoDia() ?? treinos[0];
  const lista = (treino?.exercicios ?? []).filter((e) => exercicios[e]);
  const inicio = useRef(Date.now()).current;

  const [i, setI] = useState(0);
  const [planilha, setPlanilha] = useState<Record<string, LinhaSerie[]>>({});
  const [descanso, setDescanso] = useState(0);
  const [descansoTotal, setDescansoTotal] = useState(60);
  const [aviso, setAviso] = useState<string | null>(null);
  const [resumo, setResumo] = useState<Registro | null>(null);
  const avisoAnim = useRef(new Animated.Value(0)).current;
  const recordeSessao = useRef<Record<string, number>>({});

  useEffect(() => {
    if (descanso <= 0) return;
    const t = setTimeout(() => setDescanso((d) => d - 1), 1000);
    return () => clearTimeout(t);
  }, [descanso]);

  useEffect(() => {
    if (!aviso) return;
    Animated.sequence([
      Animated.spring(avisoAnim, { toValue: 1, useNativeDriver: Platform.OS !== 'web' }),
      Animated.delay(2600),
      Animated.timing(avisoAnim, { toValue: 0, duration: 250, useNativeDriver: Platform.OS !== 'web' }),
    ]).start(() => setAviso(null));
  }, [aviso, avisoAnim]);

  if (!treino || lista.length === 0) {
    return (
      <SafeAreaView style={s.tela}>
        <View style={[s.miolo, { flex: 1, justifyContent: 'center', gap: esp.l }]}>
          <T tam={18} peso="negrito" style={{ textAlign: 'center' }}>Nenhum treino pra hoje.</T>
          <Botao titulo="Voltar" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  // progressão: bateu todas as reps na última vez → sugere subir a carga
  const sugestaoDe = (id: string) => {
    const ant = ultimoDe(id).filter((x) => x.tipo !== 'A');
    const alvo = parseInt(seriesDe(treino, id).reps, 10) || 10;
    if (!ant.length || ant.some((x) => x.reps < alvo) || ant[0].kg <= 0) return 0;
    return ant[0].kg >= 20 ? 2.5 : 1;
  };
  // linhas do exercício: começa com o que fez da última vez (ou o alvo do personal)
  const linhasDe = (exId: string): LinhaSerie[] => {
    if (planilha[exId]) return planilha[exId];
    const sr = seriesDe(treino, exId);
    const ant = ultimoDe(exId);
    const inc = sugestaoDe(exId);
    return Array.from({ length: sr.series }, (_, k) => ({
      kg: ant[k] ? fmtKg(ant[k].kg + inc) : ant.length ? fmtKg(ant[ant.length - 1].kg + inc) : '',
      reps: String(parseInt(sr.reps, 10) || 10),
      tipo: 'N' as TipoSerie,
      feito: false,
    }));
  };
  const mudarLinhas = (exId: string, f: (l: LinhaSerie[]) => LinhaSerie[]) => setPlanilha((p) => ({ ...p, [exId]: f(linhasDe(exId)) }));

  const exId = lista[i];
  const ex = exercicios[exId];
  const sr = seriesDe(treino, exId);
  const anterior = ultimoDe(exId);
  const linhas = linhasDe(exId);
  const ultimo = i === lista.length - 1;
  const totalFeitas = lista.reduce((n, id) => n + (planilha[id] ?? []).filter((l) => l.feito).length, 0);

  const concluirSerie = (k: number) => {
    toque();
    const l = linhas[k];
    const marcando = !l.feito;
    mudarLinhas(exId, (ls) => ls.map((x, j) => (j === k ? { ...x, feito: marcando } : x)));
    if (!marcando) return;
    // recorde?
    const rm = umRM(num(l.kg), num(l.reps));
    const antes = Math.max(recordeDe(exId).rm, recordeSessao.current[exId] ?? 0);
    if (l.tipo !== 'A' && rm > 0 && rm > antes) {
      recordeSessao.current[exId] = rm;
      setAviso(`${ex.nome} · ${fmtKg(num(l.kg))} kg × ${num(l.reps)}`);
    }
    if (k < linhas.length - 1) {
      setDescansoTotal(ex.descanso);
      setDescanso(ex.descanso);
    }
  };

  const terminar = () => {
    const series = lista.flatMap((id) =>
      (planilha[id] ?? []).filter((l) => l.feito).map((l) => ({ exId: id, kg: num(l.kg), reps: num(l.reps), tipo: l.tipo })),
    );
    if (series.length === 0) {
      router.back();
      return;
    }
    const reg = salvarRegistro({ data: new Date().toISOString(), treinoId: treino.id, treinoNome: treino.nome, duracao: Math.round((Date.now() - inicio) / 1000), series });
    setResumo(reg);
  };

  const sair = async () => {
    if (totalFeitas === 0) return router.back();
    if (await confirmar('Terminar o treino?', 'As séries que você marcou vão ser salvas no seu histórico.', 'Terminar e salvar')) terminar();
  };

  // ---------- Resumo ----------
  if (resumo) {
    const volume = Math.round(resumo.series.reduce((v, x) => v + x.kg * x.reps, 0));
    const min = Math.max(1, Math.round(resumo.duracao / 60));
    return (
      <SafeAreaView style={s.tela}>
        <ScrollView contentContainerStyle={[s.miolo, { paddingTop: esp.xl }]}>
          <View style={{ alignItems: 'center', gap: esp.m }}>
            <View style={s.trofeu}><Ionicons name="trophy" size={52} color={cor.sobreLimao} /></View>
            <Text style={s.fimTitulo}>Treino <Text style={{ color: cor.limao }}>pago!</Text></Text>
            <T fraco tam={15}>{resumo.treinoNome}</T>
          </View>
          <Linha style={{ gap: esp.s, marginTop: esp.xl }}>
            {[
              { v: `${min}`, l: 'minutos' },
              { v: volume >= 1000 ? `${(volume / 1000).toFixed(1).replace('.', ',')}t` : `${volume}`, l: volume >= 1000 ? 'toneladas' : 'kg de volume' },
              { v: String(resumo.series.length), l: 'séries' },
            ].map((x) => (
              <Card key={x.l} style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}>
                <Text style={s.resumoValor}>{x.v}</Text>
                <T fraco tam={12}>{x.l}</T>
              </Card>
            ))}
          </Linha>
          {resumo.prs.length > 0 ? (
            <Card destaque style={{ marginTop: esp.l }}>
              <Linha><Ionicons name="medal" size={24} color={cor.sobreLimao} /><Text style={s.prTitulo}>{resumo.prs.length === 1 ? 'Novo recorde pessoal!' : `${resumo.prs.length} recordes pessoais!`}</Text></Linha>
              {resumo.prs.map((id) => {
                const melhor = Math.max(...resumo.series.filter((x) => x.exId === id && x.tipo !== 'A').map((x) => umRM(x.kg, x.reps)));
                return <Text key={id} style={s.prLinha}>• {exercicios[id]?.nome} — 1RM estimado {Math.round(melhor)} kg</Text>;
              })}
            </Card>
          ) : (
            <Card style={{ marginTop: esp.l }}>
              <T fraco tam={14}>Sem recorde hoje. Constância é o que faz o recorde chegar 💪</T>
            </Card>
          )}
          <View style={{ gap: esp.s, marginTop: esp.xl }}>
            <Botao titulo="Fazer check-in com foto" icone={<Ionicons name="camera" size={20} color={cor.sobreLimao} />} onPress={() => router.replace('/checkin')} />
            <Botao titulo="Ver meu histórico" tipo="escuro" onPress={() => router.replace('/historico')} />
            <Botao titulo="Fechar" tipo="contorno" onPress={() => router.back()} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ---------- Treino ----------
  return (
    <View style={s.tela}>
      <View style={s.midia}>
        {ex.videoUri ? <Video uri={ex.videoUri} /> : ex.imagens?.length ? <Demo imagens={ex.imagens} style={StyleSheet.absoluteFill} /> : <Image source={ex.capa} style={StyleSheet.absoluteFill} contentFit="cover" />}
        <LinearGradient colors={['rgba(10,10,10,0.65)', 'rgba(10,10,10,0)', 'rgba(10,10,10,0.25)', '#0A0A0A']} locations={[0, 0.3, 0.7, 1]} style={StyleSheet.absoluteFill} />
        <SafeAreaView edges={['top']} style={s.topo}>
          <Pressable onPress={sair} style={s.fechar} accessibilityRole="button" accessibilityLabel="Terminar treino">
            <Ionicons name="close" size={22} color="#fff" />
          </Pressable>
          <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
            {lista.map((id, k) => {
              const ok = (planilha[id] ?? []).some((l) => l.feito);
              return <View key={id} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: k === i ? '#fff' : ok ? cor.limao : 'rgba(255,255,255,0.3)' }} />;
            })}
          </View>
          <Text style={s.contador}>{i + 1}/{lista.length}</Text>
        </SafeAreaView>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.miolo} keyboardShouldPersistTaps="handled">
          <Text style={s.grupo}>{ex.grupo}</Text>
          <Text style={s.nome} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.75}>{ex.nome}</Text>
          {sugestaoDe(exId) > 0 && !planilha[exId]?.some((l) => l.feito) ? (
            <View style={s.sugestao}>
              <Ionicons name="trending-up" size={16} color={cor.sobreLimao} />
              <Text style={s.sugestaoTexto}>Subi +{fmtKg(sugestaoDe(exId))} kg: você bateu todas as reps da última vez</Text>
            </View>
          ) : null}
          {ex.dica ? (
            <Linha style={{ marginTop: 6, alignItems: 'flex-start' }}>
              <Ionicons name="chatbubble-ellipses" size={16} color={cor.limao} />
              <T fraco tam={14} style={{ flex: 1, lineHeight: 20 }}>{ex.dica}</T>
            </Linha>
          ) : null}

          {descanso > 0 ? (
            <Card style={{ marginTop: esp.l, flexDirection: 'row', alignItems: 'center', gap: esp.l }}>
              <Anel valor={descanso / Math.max(1, descansoTotal)} tam={74} grossura={7}>
                <Text style={s.descansoNum}>{descanso}</Text>
              </Anel>
              <View style={{ flex: 1, gap: 8 }}>
                <T tam={15} peso="negrito">Descansando…</T>
                <Linha style={{ gap: 8 }}>
                  <Pressable onPress={() => { setDescanso((d) => d + 15); setDescansoTotal((t) => t + 15); }} style={s.pilula}><Text style={s.pilulaTexto}>+15s</Text></Pressable>
                  <Pressable onPress={() => setDescanso(0)} style={s.pilula}><Text style={s.pilulaTexto}>Pular</Text></Pressable>
                </Linha>
              </View>
            </Card>
          ) : null}

          <View style={s.tabela}>
            <View style={s.cabecalho}>
              <Text style={[s.th, { width: 44 }]}>SÉRIE</Text>
              <Text style={[s.th, { flex: 1 }]}>ANTERIOR</Text>
              <Text style={[s.th, { width: 70, textAlign: 'center' }]}>KG</Text>
              <Text style={[s.th, { width: 60, textAlign: 'center' }]}>REPS</Text>
              <View style={{ width: 44 }} />
            </View>
            {linhas.map((l, k) => {
              const ant = anterior[k];
              return (
                <View key={k} style={[s.linha, l.feito && s.linhaFeita]}>
                  <Pressable
                    onPress={() => { toque(); mudarLinhas(exId, (ls) => ls.map((x, j) => (j === k ? { ...x, tipo: ORDEM_TIPO[(ORDEM_TIPO.indexOf(x.tipo) + 1) % 4] } : x))); }}
                    style={[s.tipo, l.tipo !== 'N' && { backgroundColor: l.tipo === 'A' ? '#3D3A1E' : l.tipo === 'F' ? '#3D1E1E' : '#1E2E3D' }]}
                    accessibilityRole="button"
                    accessibilityLabel={`Série ${k + 1}, ${TIPOS_SERIE[l.tipo].nome}. Toque pra trocar o tipo`}
                  >
                    <Text style={[s.tipoTexto, l.tipo === 'A' && { color: '#FFD54A' }, l.tipo === 'F' && { color: cor.perigo }, l.tipo === 'D' && { color: '#7FD3FF' }]}>
                      {l.tipo === 'N' ? k + 1 : TIPOS_SERIE[l.tipo].curto}
                    </Text>
                  </Pressable>
                  <Text style={s.anterior} numberOfLines={1}>{ant ? `${fmtKg(ant.kg)}×${ant.reps}` : '—'}</Text>
                  <TextInput
                    value={l.kg}
                    onChangeText={(v) => mudarLinhas(exId, (ls) => ls.map((x, j) => (j === k ? { ...x, kg: v } : x)))}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor={cor.textoFraco}
                    style={[s.campo, { width: 62 }]}
                    selectTextOnFocus
                    accessibilityLabel={`Carga da série ${k + 1}`}
                  />
                  <TextInput
                    value={l.reps}
                    onChangeText={(v) => mudarLinhas(exId, (ls) => ls.map((x, j) => (j === k ? { ...x, reps: v } : x)))}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={cor.textoFraco}
                    style={[s.campo, { width: 52 }]}
                    selectTextOnFocus
                    accessibilityLabel={`Repetições da série ${k + 1}`}
                  />
                  <Pressable onPress={() => concluirSerie(k)} style={[s.ok, l.feito && { backgroundColor: cor.limao, borderColor: cor.limao }]} accessibilityRole="checkbox" accessibilityState={{ checked: l.feito }} accessibilityLabel={`Concluir série ${k + 1}`}>
                    <Ionicons name="checkmark" size={20} color={l.feito ? cor.sobreLimao : cor.textoFraco} />
                  </Pressable>
                </View>
              );
            })}
            <Linha style={{ gap: esp.s, marginTop: 6 }}>
              <Pressable onPress={() => { toque(); mudarLinhas(exId, (ls) => [...ls, { ...(ls[ls.length - 1] ?? { kg: '', reps: sr.reps, tipo: 'N' as TipoSerie }), tipo: 'N', feito: false }]); }} style={[s.addSerie, { flex: 1 }]}>
                <Ionicons name="add" size={18} color={cor.texto} /><Text style={s.addTexto}>Adicionar série</Text>
              </Pressable>
              {linhas.length > 1 ? (
                <Pressable onPress={() => { toque(); mudarLinhas(exId, (ls) => ls.slice(0, -1)); }} style={s.addSerie} accessibilityLabel="Remover última série">
                  <Ionicons name="remove" size={18} color={cor.texto} />
                </Pressable>
              ) : null}
            </Linha>
            <T fraco tam={12} style={{ marginTop: 10 }}>Toque no número da série pra marcar Aquecimento (A), Falha (F) ou Drop (D).</T>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SafeAreaView edges={['bottom']} style={s.rodape}>
        <View style={[s.miolo, { paddingTop: 12, paddingBottom: 6, flexDirection: 'row', gap: esp.s }]}>
          <Pressable onPress={() => i > 0 && setI(i - 1)} style={[s.seta, i === 0 && { opacity: 0.35 }]} accessibilityRole="button" accessibilityLabel="Exercício anterior">
            <Ionicons name="chevron-back" size={22} color={cor.texto} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Botao
              titulo={ultimo ? 'Terminar treino' : 'Próximo exercício'}
              icone={<Ionicons name={ultimo ? 'flag' : 'arrow-forward'} size={18} color={cor.sobreLimao} />}
              onPress={() => { setDescanso(0); if (ultimo) terminar(); else setI(i + 1); }}
            />
          </View>
        </View>
      </SafeAreaView>

      {aviso ? (
        <Animated.View
          pointerEvents="none"
          style={[s.aviso, { opacity: avisoAnim, transform: [{ translateY: avisoAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }, { scale: avisoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }] }]}
        >
          <Ionicons name="medal" size={26} color={cor.sobreLimao} />
          <View style={{ flex: 1 }}>
            <Text style={s.avisoTitulo}>Novo recorde pessoal!</Text>
            <Text style={s.avisoTexto}>{aviso}</Text>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cor.fundo },
  miolo: { width: '100%', maxWidth: LARGURA_MAX, alignSelf: 'center', paddingHorizontal: esp.l, paddingBottom: esp.xl },
  midia: { height: 230, backgroundColor: cor.card },
  topo: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: esp.l, paddingTop: 8 },
  fechar: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  contador: { color: '#fff', fontFamily: fonte.extra, fontSize: 14 },
  grupo: { color: cor.limao, fontFamily: fonte.extra, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  nome: { color: cor.texto, fontFamily: fonte.display, fontSize: 26, letterSpacing: -0.5, marginTop: 2 },
  sugestao: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', backgroundColor: cor.limao, borderRadius: raio.pill, paddingHorizontal: 12, paddingVertical: 6, marginTop: 8 },
  sugestaoTexto: { color: cor.sobreLimao, fontFamily: fonte.extra, fontSize: 12, flexShrink: 1 },
  descansoNum: { color: cor.texto, fontFamily: fonte.display, fontSize: 24 },
  pilula: { borderWidth: 1.5, borderColor: cor.borda, borderRadius: raio.pill, paddingHorizontal: 14, paddingVertical: 8 },
  pilulaTexto: { color: cor.texto, fontFamily: fonte.negrito, fontSize: 13 },
  tabela: { marginTop: esp.l },
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4, marginBottom: 6 },
  th: { color: cor.textoFraco, fontFamily: fonte.negrito, fontSize: 11, letterSpacing: 0.8 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, paddingHorizontal: 4, borderRadius: 14 },
  linhaFeita: { backgroundColor: 'rgba(212,255,58,0.08)' },
  tipo: { width: 44, height: 40, borderRadius: 12, backgroundColor: cor.card, alignItems: 'center', justifyContent: 'center' },
  tipoTexto: { color: cor.texto, fontFamily: fonte.extra, fontSize: 15 },
  anterior: { flex: 1, color: cor.textoSuave, fontFamily: fonte.media, fontSize: 13 },
  campo: { height: 40, borderRadius: 12, backgroundColor: cor.card, borderWidth: 1, borderColor: cor.borda, color: cor.texto, fontFamily: fonte.extra, fontSize: 16, textAlign: 'center' },
  ok: { width: 44, height: 40, borderRadius: 12, borderWidth: 1.5, borderColor: cor.borda, alignItems: 'center', justifyContent: 'center' },
  addSerie: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 44, paddingHorizontal: 16, borderRadius: 14, backgroundColor: cor.card, borderWidth: 1, borderColor: cor.borda },
  addTexto: { color: cor.texto, fontFamily: fonte.negrito, fontSize: 14 },
  rodape: { backgroundColor: 'rgba(10,10,10,0.96)', borderTopWidth: 1, borderTopColor: cor.borda },
  seta: { width: 56, height: 56, borderRadius: 28, borderWidth: 1.5, borderColor: cor.borda, alignItems: 'center', justifyContent: 'center' },
  aviso: { position: 'absolute', top: 60, left: 16, right: 16, maxWidth: LARGURA_MAX - 32, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: cor.limao, borderRadius: raio.g, padding: 16, shadowColor: cor.limao, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  avisoTitulo: { color: cor.sobreLimao, fontFamily: fonte.display, fontSize: 18 },
  avisoTexto: { color: cor.sobreLimao, fontFamily: fonte.negrito, fontSize: 14, opacity: 0.8 },
  trofeu: { width: 110, height: 110, borderRadius: 55, backgroundColor: cor.limao, alignItems: 'center', justifyContent: 'center' },
  fimTitulo: { color: cor.texto, fontFamily: fonte.display, fontSize: 36 },
  resumoValor: { color: cor.texto, fontFamily: fonte.display, fontSize: 26 },
  prTitulo: { color: cor.sobreLimao, fontFamily: fonte.display, fontSize: 18, flex: 1 },
  prLinha: { color: cor.sobreLimao, fontFamily: fonte.negrito, fontSize: 14, marginTop: 6 },
});
