import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Vazio } from '../components/extras';
import { Card, Kicker, Linha, T, Tela, toque } from '../components/ui';
import { useApp } from '../store/app';
import { cor, esp, fonte } from '../theme';

export default function Historico() {
  const { historico, exercicios } = useApp();
  const [aberto, setAberto] = useState<string | null>(null);
  const lista = [...historico].reverse();

  // agrupa por mês
  const grupos: { mes: string; itens: typeof lista }[] = [];
  for (const h of lista) {
    const mes = new Date(h.data).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const g = grupos.find((x) => x.mes === mes);
    if (g) g.itens.push(h);
    else grupos.push({ mes, itens: [h] });
  }

  if (!lista.length) {
    return (
      <Tela semTopo>
        <View style={{ marginTop: esp.xl }}>
          <Vazio icone="time" titulo="Nenhum treino ainda" texto="Quando você terminar um treino no modo treino, ele aparece aqui com as cargas de cada série." />
        </View>
      </Tela>
    );
  }

  return (
    <Tela semTopo>
      {grupos.map((g) => (
        <View key={g.mes} style={{ marginBottom: esp.l }}>
          <Kicker>{g.mes} · {g.itens.length} treinos</Kicker>
          <View style={{ gap: esp.s }}>
            {g.itens.map((h) => {
              const volume = Math.round(h.series.reduce((v, x) => v + x.kg * x.reps, 0));
              const exs = [...new Set(h.series.map((x) => x.exId))];
              const open = aberto === h.id;
              return (
                <Card key={h.id} onPress={() => { toque(); setAberto(open ? null : h.id); }} style={{ paddingVertical: 14 }}>
                  <Linha>
                    <View style={s.data}>
                      <Text style={s.dia}>{new Date(h.data).getDate()}</Text>
                      <Text style={s.semana}>{new Date(h.data).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <T tam={16} peso="negrito">{h.treinoNome}</T>
                      <T fraco tam={13}>{Math.round(h.duracao / 60)} min · {volume.toLocaleString('pt-BR')} kg · {h.series.length} séries</T>
                    </View>
                    {h.prs.length ? <View style={s.pr}><Ionicons name="medal" size={14} color={cor.sobreLimao} /><Text style={s.prTexto}>{h.prs.length}</Text></View> : null}
                    <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={cor.textoFraco} />
                  </Linha>
                  {open ? (
                    <View style={{ marginTop: esp.m, gap: 8 }}>
                      {exs.map((id) => (
                        <View key={id} style={s.ex}>
                          <T tam={14} peso="negrito">{exercicios[id]?.nome ?? 'Exercício'}{h.prs.includes(id) ? '  🏅' : ''}</T>
                          <T fraco tam={13} style={{ marginTop: 2 }}>{h.series.filter((x) => x.exId === id).map((x) => `${String(x.kg).replace('.', ',')}kg×${x.reps}${x.tipo !== 'N' ? ` (${x.tipo})` : ''}`).join('  ·  ')}</T>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </Card>
              );
            })}
          </View>
        </View>
      ))}
    </Tela>
  );
}

const s = StyleSheet.create({
  data: { width: 48, height: 52, borderRadius: 14, backgroundColor: cor.cardAlto, alignItems: 'center', justifyContent: 'center' },
  dia: { color: cor.texto, fontFamily: fonte.display, fontSize: 18 },
  semana: { color: cor.textoSuave, fontFamily: fonte.negrito, fontSize: 10, textTransform: 'uppercase' },
  pr: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: cor.limao, borderRadius: 12, paddingHorizontal: 8, height: 24 },
  prTexto: { color: cor.sobreLimao, fontFamily: fonte.extra, fontSize: 12 },
  ex: { borderTopWidth: 1, borderTopColor: cor.borda, paddingTop: 8 },
});
