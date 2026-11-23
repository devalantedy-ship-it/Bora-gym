// Recuperação muscular: estima, pelo histórico, quanto cada grupo já se recuperou do último treino.
// Grupos grandes ~48h, pequenos ~36h. É uma estimativa simples, não substitui o personal.
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../store/app';
import { cor, esp, fonte, raio } from '../theme';
import { Card, Kicker, Linha, T } from './ui';

const GRANDES = new Set(['Pernas', 'Costas', 'Peito', 'Posterior', 'Glúteo', 'Lombar', 'Full body']);

export function Recuperacao() {
  const { historico, exercicios } = useApp();
  const agora = Date.now();
  const ultimo: Record<string, number> = {};
  for (const h of historico) {
    const t = new Date(h.data).getTime();
    if (agora - t > 4 * 86400000) continue;
    for (const s of h.series) {
      const g = exercicios[s.exId]?.grupo;
      if (g) ultimo[g] = Math.max(ultimo[g] ?? 0, t);
    }
  }
  const grupos = Object.entries(ultimo)
    .map(([g, t]) => {
      const horas = (agora - t) / 3600000;
      const total = GRANDES.has(g) ? 48 : 36;
      return { g, pct: Math.min(1, horas / total), falta: Math.max(0, Math.ceil(total - horas)) };
    })
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 6);

  if (!grupos.length) return null;

  return (
    <Card style={{ marginTop: esp.l }}>
      <Linha style={{ justifyContent: 'space-between' }}>
        <Kicker>Recuperação muscular</Kicker>
        <T fraco tam={11}>últimos 4 dias</T>
      </Linha>
      <View style={{ gap: 10 }}>
        {grupos.map(({ g, pct, falta }) => {
          const pronto = pct >= 1;
          const corBarra = pronto ? cor.limao : pct > 0.6 ? '#FFD54A' : cor.perigo;
          return (
            <View key={g}>
              <Linha style={{ justifyContent: 'space-between' }}>
                <Text style={s.grupo}>{g}</Text>
                <Text style={[s.status, { color: corBarra }]}>{pronto ? 'Pronto ✓' : `${Math.round(pct * 100)}% · ~${falta}h`}</Text>
              </Linha>
              <View style={s.fundo}><View style={[s.barra, { width: `${pct * 100}%`, backgroundColor: corBarra }]} /></View>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  grupo: { color: cor.texto, fontFamily: fonte.negrito, fontSize: 14 },
  status: { fontFamily: fonte.extra, fontSize: 12 },
  fundo: { height: 7, borderRadius: 4, backgroundColor: cor.cardAlto, marginTop: 5, overflow: 'hidden' },
  barra: { height: '100%', borderRadius: raio.pill },
});
