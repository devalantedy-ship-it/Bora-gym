import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Demo, urlImg } from '../../components/Demo';
import { Botao, Card, Kicker, Linha, T, Tela, toque } from '../../components/ui';
import { POR_ID } from '../../data/biblioteca';
import { useApp } from '../../store/app';
import { cor, esp, fonte, raio } from '../../theme';

export default function ItemBiblioteca() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { papel, exercicios, salvarExercicio, favoritos, alternarFavorito } = useApp();
  const x = POR_ID[id ?? ''];
  const [series, setSeries] = useState(3);
  const [reps, setReps] = useState('12');
  if (!x) return <Tela><T>Exercício não encontrado.</T></Tela>;

  const meu = Object.values(exercicios).find((e) => e.fonteId === x.id);

  const adicionar = () => {
    const novoId = salvarExercicio({
      nome: x.n,
      grupo: x.g,
      series,
      reps,
      descanso: 60,
      dica: '',
      capa: { uri: urlImg(x.img[0]) },
      imagens: x.img.map(urlImg),
      fonteId: x.id,
    });
    router.replace({ pathname: '/exercicio/[id]', params: { id: novoId } });
  };

  return (
    <Tela semTopo>
      <Demo imagens={x.img} style={s.demo} />
      <Text style={s.legenda}>Demonstração: posição inicial e final</Text>

      <Linha style={{ alignItems: 'flex-start' }}>
        <Text style={[s.nome, { flex: 1 }]}>{x.n}</Text>
        <Pressable onPress={() => { toque(); alternarFavorito(x.id); }} style={[s.coracao, favoritos.includes(x.id) && { backgroundColor: cor.limao }]} accessibilityRole="button" accessibilityLabel="Favoritar">
          <Ionicons name={favoritos.includes(x.id) ? 'heart' : 'heart-outline'} size={22} color={favoritos.includes(x.id) ? cor.sobreLimao : cor.texto} />
        </Pressable>
      </Linha>
      {x.n !== x.en ? <T fraco tam={13}>{x.en}</T> : null}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: esp.l }}>
        {[x.g, ...x.g2.filter((g) => g !== x.g)].map((g, i) => (
          <View key={g} style={[s.tag, i === 0 && { backgroundColor: cor.limao }]}><Text style={[s.tagTexto, i === 0 && { color: cor.sobreLimao }]}>{g}</Text></View>
        ))}
        <View style={s.tag}><Text style={s.tagTexto}>{x.eq}</Text></View>
        <View style={s.tag}><Text style={s.tagTexto}>{x.nv}</Text></View>
        <View style={s.tag}><Text style={s.tagTexto}>{x.c}</Text></View>
      </View>

      {papel === 'personal' ? (
        meu ? (
          <Card style={{ marginTop: esp.xl }}>
            <Linha><Ionicons name="checkmark-circle" size={22} color={cor.limao} /><T tam={15} peso="negrito" style={{ flex: 1 }}>Já está nos seus exercícios</T></Linha>
            <View style={{ marginTop: esp.m }}><Botao titulo="Abrir exercício" tipo="escuro" onPress={() => router.push({ pathname: '/exercicio/[id]', params: { id: meu.id } })} /></View>
          </Card>
        ) : (
          <Card style={{ marginTop: esp.xl }}>
            <Kicker>Padrão pros seus alunos</Kicker>
            <Linha style={{ gap: esp.l, flexWrap: 'wrap' }}>
              <Linha style={{ gap: 8 }}>
                <Pressable onPress={() => setSeries(Math.max(1, series - 1))} style={s.mini} accessibilityLabel="Menos séries"><Ionicons name="remove" size={16} color={cor.texto} /></Pressable>
                <T tam={15} peso="extra">{series} séries</T>
                <Pressable onPress={() => setSeries(Math.min(10, series + 1))} style={s.mini} accessibilityLabel="Mais séries"><Ionicons name="add" size={16} color={cor.texto} /></Pressable>
              </Linha>
              <Linha style={{ gap: 6 }}>
                {['8', '10', '12', '15'].map((r) => (
                  <Pressable key={r} onPress={() => { toque(); setReps(r); }} style={[s.rep, reps === r && { backgroundColor: cor.limao, borderColor: cor.limao }]}>
                    <Text style={[s.repTexto, reps === r && { color: cor.sobreLimao }]}>{r}</Text>
                  </Pressable>
                ))}
              </Linha>
            </Linha>
            <View style={{ marginTop: esp.l }}>
              <Botao titulo="Adicionar aos meus exercícios" icone={<Ionicons name="add" size={20} color={cor.sobreLimao} />} onPress={adicionar} />
            </View>
            <T fraco tam={12} style={{ marginTop: 8 }}>Depois dá pra gravar seu próprio vídeo e escrever a dica pro aluno.</T>
          </Card>
        )
      ) : null}
    </Tela>
  );
}

const s = StyleSheet.create({
  demo: { width: '100%', aspectRatio: 1.35, borderRadius: raio.g, marginTop: esp.s },
  legenda: { color: cor.textoFraco, fontFamily: fonte.media, fontSize: 11, textAlign: 'center', marginTop: 6, marginBottom: esp.l },
  nome: { color: cor.texto, fontFamily: fonte.display, fontSize: 26, letterSpacing: -0.4 },
  tag: { borderRadius: raio.pill, borderWidth: 1.5, borderColor: cor.borda, paddingHorizontal: 12, paddingVertical: 6 },
  tagTexto: { color: cor.texto, fontFamily: fonte.negrito, fontSize: 12 },
  coracao: { width: 44, height: 44, borderRadius: 22, backgroundColor: cor.cardAlto, alignItems: 'center', justifyContent: 'center' },
  mini: { width: 30, height: 30, borderRadius: 15, backgroundColor: cor.cardAlto, alignItems: 'center', justifyContent: 'center' },
  rep: { minWidth: 36, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: cor.borda, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  repTexto: { color: cor.textoSuave, fontFamily: fonte.extra, fontSize: 13 },
});
