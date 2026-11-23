import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Demo } from '../../components/Demo';
import { GraficoLinha } from '../../components/Grafico';
import { Botao, Card, Kicker, Linha, T, Tela } from '../../components/ui';
import { useApp } from '../../store/app';
import { cor, esp, fonte, raio } from '../../theme';

function Player({ url }: { url: string }) {
  const player = useVideoPlayer(url, (p) => { p.loop = true; });
  return <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" fullscreenOptions={{ enable: true }} nativeControls />;
}

export default function Exercicio() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { feitosHoje, marcarFeito, exercicios, papel, evolucaoDe, recordeDe, historico } = useApp();
  const [verCarga, setVerCarga] = useState(false);
  const ex = exercicios[id ?? ''];
  const [serie, setSerie] = useState(0);
  const [descanso, setDescanso] = useState(0);

  useEffect(() => {
    if (descanso <= 0) return;
    const t = setTimeout(() => setDescanso((d) => d - 1), 1000);
    return () => clearTimeout(t);
  }, [descanso]);

  if (!ex) return <Tela><T>Exercício não encontrado.</T></Tela>;
  const feito = feitosHoje.includes(ex.id);

  const concluirSerie = () => {
    const prox = serie + 1;
    setSerie(prox);
    if (prox >= ex.series) {
      if (!feito) marcarFeito(ex.id);
      router.back();
    } else {
      setDescanso(ex.descanso);
    }
  };

  return (
    <Tela semTopo>
      {papel === 'personal' ? (
        <Stack.Screen options={{ headerRight: () => <Text onPress={() => router.push({ pathname: '/novo-exercicio', params: { id: ex.id } })} style={s.editar}>Editar</Text> }} />
      ) : null}
      <View style={s.video}>
        {ex.videoUri ? (
          <Player url={ex.videoUri} />
        ) : ex.imagens?.length ? (
          <Demo imagens={ex.imagens} style={StyleSheet.absoluteFill} />
        ) : (
          <>
            <Image source={ex.capa} style={StyleSheet.absoluteFill} contentFit="cover" />
            <View style={s.veu} />
            <View style={s.play}><Ionicons name="play" size={34} color={cor.sobreLimao} /></View>
            <Text style={s.aviso}>{papel === 'personal' ? 'Toque em Editar pra enviar o vídeo de execução' : 'O personal ainda não enviou o vídeo deste exercício'}</Text>
          </>
        )}
      </View>

      <Kicker>{ex.grupo}</Kicker>
      <Text style={s.nome}>{ex.nome}</Text>

      <Linha style={{ marginTop: esp.l, gap: esp.s }}>
        {[
          { v: `${ex.series}`, l: 'séries' },
          { v: ex.reps, l: 'repetições' },
          { v: `${ex.descanso}s`, l: 'descanso' },
        ].map((x) => (
          <View key={x.l} style={s.info}>
            <Text style={s.infoValor}>{x.v}</Text>
            <Text style={s.infoRotulo}>{x.l}</Text>
          </View>
        ))}
      </Linha>

      {ex.dica ? (
        <Card style={{ marginTop: esp.l, flexDirection: 'row', gap: esp.m }}>
          <Ionicons name="chatbubble-ellipses" size={22} color={cor.limao} />
          <View style={{ flex: 1 }}>
            <T tam={13} peso="negrito" fraco>DICA DO PERSONAL</T>
            <T tam={16} style={{ marginTop: 4, lineHeight: 22 }}>{ex.dica}</T>
          </View>
        </Card>
      ) : null}

      <Linha style={{ justifyContent: 'space-between', marginTop: esp.l }}>
        <Kicker>Sua evolução</Kicker>
        <Pressable onPress={() => setVerCarga(!verCarga)} hitSlop={8}>
          <Text style={s.alternar}>{verCarga ? 'Carga máx. ▾' : '1RM estimado ▾'}</Text>
        </Pressable>
      </Linha>
      <Card style={{ marginBottom: esp.m }}>
        <GraficoLinha pontos={evolucaoDe(ex.id).slice(-12).map((p) => ({ data: p.data, valor: verCarga ? p.kg : p.rm }))} />
      </Card>
      {(() => {
        const r = recordeDe(ex.id);
        if (!r.kg && !r.reps) return null;
        return (
          <Linha style={{ gap: esp.s, marginBottom: esp.l }}>
            {[
              { v: String(r.kg).replace('.', ','), l: 'maior carga (kg)' },
              { v: `${r.rm}`, l: '1RM estimado' },
              { v: r.volume >= 1000 ? `${(r.volume / 1000).toFixed(1).replace('.', ',')}t` : `${r.volume}`, l: 'maior volume' },
            ].map((x) => (
              <View key={x.l} style={s.recorde}>
                <Ionicons name="medal" size={16} color={cor.limao} />
                <Text style={s.recordeValor}>{x.v}</Text>
                <Text style={s.recordeRotulo}>{x.l}</Text>
              </View>
            ))}
          </Linha>
        );
      })()}
      {(() => {
        const sessoes = historico.filter((h) => h.series.some((x) => x.exId === ex.id)).slice(-3).reverse();
        if (!sessoes.length) return null;
        return (
          <>
            <Kicker>Últimas vezes</Kicker>
            <View style={{ gap: 8, marginBottom: esp.l }}>
              {sessoes.map((h) => (
                <Card key={h.id} style={{ paddingVertical: 12 }}>
                  <T fraco tam={12} peso="negrito">{new Date(h.data).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}</T>
                  <T tam={14} style={{ marginTop: 4 }}>{h.series.filter((x) => x.exId === ex.id).map((x) => `${String(x.kg).replace('.', ',')}kg×${x.reps}`).join('  ·  ')}</T>
                </Card>
              ))}
            </View>
          </>
        );
      })()}

      <Kicker>Séries</Kicker>
      <Linha style={{ gap: esp.s, marginBottom: esp.l }}>
        {Array.from({ length: ex.series }, (_, i) => (
          <View key={i} style={[s.serie, i < serie && { backgroundColor: cor.limao, borderColor: cor.limao }]}>
            <Text style={[s.serieTexto, i < serie && { color: cor.sobreLimao }]}>{i + 1}</Text>
          </View>
        ))}
      </Linha>

      {descanso > 0 ? (
        <Card destaque style={{ alignItems: 'center', marginBottom: esp.m }}>
          <Text style={{ fontFamily: fonte.black, fontSize: 48, color: cor.sobreLimao }}>{descanso}s</Text>
          <Text style={{ fontFamily: fonte.negrito, color: cor.sobreLimao }}>Descansando… próxima série já já</Text>
        </Card>
      ) : null}

      <Botao
        titulo={feito ? 'Exercício concluído ✓' : serie + 1 >= ex.series ? 'Concluir exercício' : `Concluí a série ${serie + 1}`}
        onPress={concluirSerie}
        desativado={feito || descanso > 0}
      />
    </Tela>
  );
}

const s = StyleSheet.create({
  video: { height: 260, borderRadius: raio.g, overflow: 'hidden', backgroundColor: cor.card, marginTop: esp.s, marginBottom: esp.xl, alignItems: 'center', justifyContent: 'center' },
  veu: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)' },
  play: { width: 76, height: 76, borderRadius: 38, backgroundColor: cor.limao, alignItems: 'center', justifyContent: 'center', paddingLeft: 4 },
  aviso: { position: 'absolute', bottom: 14, color: '#fff', fontFamily: fonte.media, fontSize: 13, opacity: 0.85 },
  nome: { color: cor.texto, fontFamily: fonte.display, fontSize: 28, letterSpacing: -0.5 },
  info: { flex: 1, backgroundColor: cor.card, borderRadius: raio.m, borderWidth: 1, borderColor: cor.borda, paddingVertical: 14, alignItems: 'center' },
  infoValor: { color: cor.texto, fontFamily: fonte.extra, fontSize: 24 },
  infoRotulo: { color: cor.textoSuave, fontFamily: fonte.media, fontSize: 12, marginTop: 2 },
  serie: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: cor.borda, alignItems: 'center', justifyContent: 'center' },
  alternar: { color: cor.limao, fontFamily: fonte.negrito, fontSize: 13 },
  recorde: { flex: 1, backgroundColor: cor.card, borderRadius: raio.m, borderWidth: 1, borderColor: cor.borda, padding: 12, gap: 2 },
  recordeValor: { color: cor.texto, fontFamily: fonte.display, fontSize: 22, marginTop: 4 },
  recordeRotulo: { color: cor.textoSuave, fontFamily: fonte.media, fontSize: 11 },
  editar: { color: cor.limao, fontFamily: fonte.negrito, fontSize: 16, paddingHorizontal: 12 },
  serieTexto: { color: cor.texto, fontFamily: fonte.extra, fontSize: 16 },
});
