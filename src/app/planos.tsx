import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { urlImg } from '../components/Demo';
import { CartaoFoto } from '../components/extras';
import { avisar, Botao, Kicker, Linha, T, Tela, toque } from '../components/ui';
import { POR_ID } from '../data/biblioteca';
import { DIAS_CURTOS } from '../data/mock';
import { PLANOS } from '../data/planos';
import { useApp } from '../store/app';
import { cor, esp, fonte, raio } from '../theme';

export default function Planos() {
  const { aplicarPlano, alunos } = useApp();
  const [aberto, setAberto] = useState<string | null>(null);
  const [todos, setTodos] = useState(true);
  const [escolhidos, setEscolhidos] = useState<string[]>([]);

  const usar = (id: string) => {
    const n = aplicarPlano(id, todos ? 'todos' : escolhidos);
    avisar('Plano aplicado!', `${n} ${n === 1 ? 'treino criado' : 'treinos criados'} ${todos ? 'pra turma toda' : `pra ${escolhidos.length} ${escolhidos.length === 1 ? 'aluno' : 'alunos'}`}. Dá pra editar tudo em Treinos.`);
    router.replace('/personal/treinos');
  };

  return (
    <Tela semTopo>
      <T fraco tam={15} style={{ marginTop: esp.s, marginBottom: esp.l }}>Escolha um objetivo e os treinos são criados na hora, com exercícios da biblioteca e demonstração. Depois você ajusta do seu jeito.</T>
      <View style={{ gap: esp.l }}>
        {PLANOS.map((p) => {
          const capa = POR_ID[p.treinos[0].exercicios[0].id]?.img[0];
          const open = aberto === p.id;
          const totalEx = new Set(p.treinos.flatMap((t) => t.exercicios.map((x) => x.id))).size;
          return (
            <View key={p.id}>
              <CartaoFoto foto={{ uri: urlImg(capa ?? '') }} altura={200} onPress={() => { toque(); setAberto(open ? null : p.id); }}>
                <View style={s.selo}><Text style={s.seloTexto}>{p.objetivo.toUpperCase()}</Text></View>
                <Text style={s.nome}>{p.nome}</Text>
                <Text style={s.meta}>{p.frequencia} · {p.treinos.length} {p.treinos.length === 1 ? 'treino' : 'treinos'} · {totalEx} exercícios · {p.nivel}</Text>
              </CartaoFoto>
              {open ? (
                <View style={s.detalhe}>
                  <T fraco tam={14} style={{ lineHeight: 20, marginBottom: esp.m }}>{p.descricao}</T>
                  {p.treinos.map((t) => (
                    <View key={t.nome} style={{ marginBottom: esp.m }}>
                      <Linha style={{ justifyContent: 'space-between' }}>
                        <T tam={15} peso="extra">{t.nome}</T>
                        <Text style={s.dias}>{t.dias.map((d) => DIAS_CURTOS[d]).join(' · ')}</Text>
                      </Linha>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginTop: 8 }}>
                        {t.exercicios.map((x) => {
                          const it = POR_ID[x.id];
                          if (!it) return null;
                          return (
                            <Pressable key={x.id} onPress={() => router.push({ pathname: '/biblioteca/[id]', params: { id: x.id } })} style={s.ex}>
                              <Image source={{ uri: urlImg(it.img[0]) }} style={s.exImg} />
                              <Text style={s.exNome} numberOfLines={2}>{it.n}</Text>
                              <Text style={s.exSeries}>{x.series}×{x.reps}</Text>
                            </Pressable>
                          );
                        })}
                      </ScrollView>
                    </View>
                  ))}
                  <Kicker>Pra quem?</Kicker>
                  <Linha style={{ gap: 8, marginBottom: esp.m, flexWrap: 'wrap' }}>
                    <Pressable onPress={() => setTodos(true)} style={[s.chip, todos && s.chipOn]}><Text style={[s.chipTexto, todos && s.chipTextoOn]}>Turma toda</Text></Pressable>
                    {alunos.map((a) => {
                      const on = !todos && escolhidos.includes(a.id);
                      return (
                        <Pressable key={a.id} onPress={() => { setTodos(false); setEscolhidos(on ? escolhidos.filter((x) => x !== a.id) : [...escolhidos, a.id]); }} style={[s.chip, on && s.chipOn]}>
                          <Text style={[s.chipTexto, on && s.chipTextoOn]}>{a.nome}</Text>
                        </Pressable>
                      );
                    })}
                  </Linha>
                  <Botao titulo="Usar este plano" icone={<Ionicons name="flash" size={18} color={cor.sobreLimao} />} onPress={() => usar(p.id)} desativado={!todos && escolhidos.length === 0} />
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </Tela>
  );
}

const s = StyleSheet.create({
  selo: { alignSelf: 'flex-start', backgroundColor: cor.limao, borderRadius: raio.pill, paddingHorizontal: 10, paddingVertical: 5 },
  seloTexto: { color: cor.sobreLimao, fontFamily: fonte.extra, fontSize: 10, letterSpacing: 0.8 },
  nome: { color: cor.texto, fontFamily: fonte.display, fontSize: 26, marginTop: 8, letterSpacing: -0.4 },
  meta: { color: 'rgba(255,255,255,0.8)', fontFamily: fonte.media, fontSize: 13, marginTop: 2 },
  detalhe: { backgroundColor: cor.card, borderWidth: 1, borderColor: cor.borda, borderTopWidth: 0, borderBottomLeftRadius: raio.g, borderBottomRightRadius: raio.g, padding: esp.l, marginTop: -16, paddingTop: esp.l + 16 },
  dias: { color: cor.limao, fontFamily: fonte.extra, fontSize: 12 },
  ex: { width: 108 },
  exImg: { width: 108, height: 80, borderRadius: 12, backgroundColor: '#E9E9E9' },
  exNome: { color: cor.texto, fontFamily: fonte.negrito, fontSize: 12, marginTop: 4 },
  exSeries: { color: cor.textoSuave, fontFamily: fonte.media, fontSize: 11 },
  chip: { borderWidth: 1.5, borderColor: cor.borda, borderRadius: raio.pill, paddingHorizontal: 14, paddingVertical: 8 },
  chipOn: { backgroundColor: cor.limao, borderColor: cor.limao },
  chipTexto: { color: cor.textoSuave, fontFamily: fonte.negrito, fontSize: 13 },
  chipTextoOn: { color: cor.sobreLimao },
});
