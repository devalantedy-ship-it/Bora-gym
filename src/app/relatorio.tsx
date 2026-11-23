// Relatório do mês: o "retrospectiva" do aluno, pronto pra print e stories.
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Share, StyleSheet, Text, View } from 'react-native';
import { Marca } from '../components/Logo';
import { Botao, Card, Kicker, Linha, T, Tela } from '../components/ui';
import { useApp } from '../store/app';
import { cor, esp, fonte, raio } from '../theme';

export default function Relatorio() {
  const { historico, exercicios, ofensiva, nome } = useApp();
  const agora = new Date();
  const doMes = historico.filter((h) => {
    const d = new Date(h.data);
    return d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear();
  });
  const volume = Math.round(doMes.reduce((v, h) => v + h.series.reduce((a, x) => a + x.kg * x.reps, 0), 0));
  const minutos = Math.round(doMes.reduce((v, h) => v + h.duracao, 0) / 60);
  const prs = doMes.reduce((v, h) => v + h.prs.length, 0);
  const contagem: Record<string, number> = {};
  doMes.forEach((h) => h.series.forEach((x) => { const g = exercicios[x.exId]?.grupo ?? 'Outros'; contagem[g] = (contagem[g] ?? 0) + 1; }));
  const grupos = Object.entries(contagem).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxG = Math.max(1, ...grupos.map((g) => g[1]));
  const mes = agora.toLocaleDateString('pt-BR', { month: 'long' });

  return (
    <Tela semTopo>
      <LinearGradient colors={['#1E2A05', '#0F0F10']} style={s.cartao}>
        <Linha style={{ justifyContent: 'space-between' }}>
          <Marca tam={22} />
          <Text style={s.mes}>{mes.toUpperCase()}</Text>
        </Linha>
        <Text style={s.titulo}>Seu mês, <Text style={{ color: cor.limao }}>{nome || 'atleta'}</Text></Text>
        <View style={s.grade}>
          {[
            { v: String(doMes.length), l: 'treinos' },
            { v: `${Math.round(minutos / 60)}h${String(minutos % 60).padStart(2, '0')}`, l: 'treinando' },
            { v: volume >= 1000 ? `${(volume / 1000).toFixed(1).replace('.', ',')}t` : `${volume}kg`, l: 'levantados' },
            { v: `${prs}`, l: 'recordes' },
          ].map((x) => (
            <View key={x.l} style={s.item}>
              <Text style={s.valor}>{x.v}</Text>
              <Text style={s.rotulo}>{x.l}</Text>
            </View>
          ))}
        </View>
        <Linha style={{ marginTop: esp.m }}>
          <Ionicons name="flame" size={20} color={cor.limao} />
          <Text style={s.ofensiva}>Ofensiva de {ofensiva} dias</Text>
        </Linha>
      </LinearGradient>

      {grupos.length ? (
        <Card style={{ marginTop: esp.l }}>
          <Kicker>Séries por grupo muscular</Kicker>
          <View style={{ gap: 10, marginTop: 4 }}>
            {grupos.map(([g, n]) => (
              <View key={g}>
                <Linha style={{ justifyContent: 'space-between' }}>
                  <T tam={14} peso="negrito">{g}</T>
                  <T fraco tam={13}>{n} séries</T>
                </Linha>
                <View style={s.barraFundo}><View style={[s.barra, { width: `${(n / maxG) * 100}%` }]} /></View>
              </View>
            ))}
          </View>
        </Card>
      ) : null}

      <View style={{ marginTop: esp.xl }}>
        <Botao
          titulo="Compartilhar meu mês"
          icone={<Ionicons name="share-social" size={20} color={cor.sobreLimao} />}
          onPress={() => Share.share({ message: `Meu ${mes} no BORA 💪 ${doMes.length} treinos, ${volume.toLocaleString('pt-BR')} kg levantados, ${prs} recordes e ofensiva de ${ofensiva} dias. Bora treinar!` }).catch(() => {})}
        />
        <T fraco tam={12} style={{ textAlign: 'center', marginTop: 8 }}>Dica: tira print do cartão e posta nos stories.</T>
      </View>
    </Tela>
  );
}

const s = StyleSheet.create({
  cartao: { borderRadius: raio.g + 4, padding: esp.xl, marginTop: esp.s, borderWidth: 1, borderColor: '#2E3D0A' },
  mes: { color: cor.limao, fontFamily: fonte.extra, fontSize: 13, letterSpacing: 1.5 },
  titulo: { color: cor.texto, fontFamily: fonte.display, fontSize: 28, marginTop: esp.l, letterSpacing: -0.5 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', marginTop: esp.l, rowGap: esp.l },
  item: { width: '50%' },
  valor: { color: cor.texto, fontFamily: fonte.display, fontSize: 34, letterSpacing: -1 },
  rotulo: { color: cor.textoSuave, fontFamily: fonte.negrito, fontSize: 13 },
  ofensiva: { color: cor.texto, fontFamily: fonte.extra, fontSize: 15 },
  barraFundo: { height: 8, borderRadius: 4, backgroundColor: cor.cardAlto, marginTop: 6, overflow: 'hidden' },
  barra: { height: '100%', borderRadius: 4, backgroundColor: cor.limao },
});
