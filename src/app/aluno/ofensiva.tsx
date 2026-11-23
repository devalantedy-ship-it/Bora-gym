import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { avisar, Botao, Card, Kicker, Linha, T, Tela, Titulo } from '../../components/ui';
import { DIAS_CURTOS } from '../../data/mock';
import { hojeISO, useApp } from '../../store/app';
import { cor, esp, fonte, LARGURA_MAX, raio } from '../../theme';

const CONQUISTAS = [
  { dias: 7, nome: '1 semana', icone: 'flash' as const },
  { dias: 30, nome: '30 dias', icone: 'medal' as const },
  { dias: 100, nome: '100 dias', icone: 'trophy' as const },
  { dias: 365, nome: '1 ano', icone: 'diamond' as const },
];

export default function Ofensiva() {
  const { ofensiva, diasComTreino, jaTreinouHoje, salvaOfensiva, podeSalvarOntem, usarSalvaOfensiva } = useApp();
  const { width } = useWindowDimensions();
  const dias = diasComTreino;
  const salvos = new Set(salvaOfensiva.usadoEm);

  // últimas 5 semanas, começando no domingo
  const inicio = new Date();
  inicio.setDate(inicio.getDate() - inicio.getDay() - 28);
  const grade = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(inicio);
    d.setDate(inicio.getDate() + i);
    return d;
  });
  const hoje = hojeISO();
  const largura = Math.min(width, LARGURA_MAX) - 40 - 36;
  const cel = Math.floor((largura - 6 * 8) / 7);

  return (
    <Tela>
      <Titulo branco="Sua" limao="Ofensiva" sub="Dias seguidos treinando. Não deixa a chama apagar." />

      <Card style={{ marginBottom: esp.l }}>
        <Linha style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Kicker>Sequência atual</Kicker>
            <Linha style={{ alignItems: 'flex-end', gap: 8 }}>
              <Text style={s.numero}>{ofensiva}</Text>
              <Text style={s.dias}>dias</Text>
            </Linha>
          </View>
          <View style={s.chama}><Ionicons name="flame" size={40} color={cor.limao} /></View>
        </Linha>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: esp.l }}>
          {DIAS_CURTOS.map((d, i) => (
            <Text key={i} style={[s.diaLetra, { width: cel }]}>{d}</Text>
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
          {grade.map((d) => {
            const iso = hojeISO(d);
            const ehHoje = iso === hoje;
            const futuro = d.getTime() > Date.now() && !ehHoje;
            const fez = dias.has(iso);
            return (
              <View
                key={iso}
                style={{
                  width: cel,
                  height: cel,
                  borderRadius: Math.min(14, cel / 3),
                  backgroundColor: fez ? (ehHoje ? cor.limao : salvos.has(iso) ? '#7FD3FF' : '#F2F2F2') : futuro ? 'transparent' : cor.cardAlto,
                  borderWidth: ehHoje && !fez ? 2 : futuro ? 1 : 0,
                  borderColor: ehHoje ? cor.limao : cor.borda,
                }}
              />
            );
          })}
        </View>
        <T fraco tam={14} style={{ marginTop: esp.l }}>
          {jaTreinouHoje ? 'Hoje tá pago. A chama continua acesa 🔥' : 'Treina hoje pra manter a sequência viva.'}
        </T>
      </Card>

      <Kicker>Conquistas</Kicker>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: esp.m }}>
        {CONQUISTAS.map((c) => {
          const ok = ofensiva >= c.dias;
          return (
            <View key={c.dias} style={[s.conquista, ok && { borderColor: cor.limao }]}>
              <Ionicons name={c.icone} size={26} color={ok ? cor.limao : cor.textoFraco} />
              <T tam={14} peso="negrito" style={{ marginTop: 8 }}>{c.nome}</T>
              <T fraco tam={12}>{ok ? 'Conquistado' : `faltam ${c.dias - ofensiva}`}</T>
            </View>
          );
        })}
      </View>

      <Card style={{ marginTop: esp.l }}>
        <Linha style={{ alignItems: 'flex-start' }}>
          <Ionicons name="snow" size={26} color="#7FD3FF" />
          <View style={{ flex: 1 }}>
            <T tam={15} peso="negrito">{salvaOfensiva.disponivel} salva-ofensiva {salvaOfensiva.disponivel === 1 ? 'disponível' : 'disponíveis'}</T>
            <T fraco tam={13}>Ficou doente ou viajou ontem? Usa e a sequência não quebra. Renova todo mês.</T>
          </View>
        </Linha>
        {podeSalvarOntem ? (
          <View style={{ marginTop: esp.m }}>
            <Botao titulo="Usar pra salvar ontem" tipo="escuro" onPress={() => { if (usarSalvaOfensiva()) avisar('Ofensiva salva!', 'Ontem foi coberto. Agora é treinar hoje pra continuar.'); }} />
          </View>
        ) : null}
      </Card>
    </Tela>
  );
}

const s = StyleSheet.create({
  numero: { color: cor.texto, fontFamily: fonte.display, fontSize: 80, letterSpacing: -3, lineHeight: 92 },
  dias: { color: cor.texto, fontFamily: fonte.negrito, fontSize: 22, marginBottom: 14 },
  chama: { width: 72, height: 72, borderRadius: 22, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  diaLetra: { color: cor.textoFraco, fontFamily: fonte.negrito, fontSize: 12, textAlign: 'center' },
  conquista: { flexGrow: 1, flexBasis: '45%', backgroundColor: cor.card, borderRadius: raio.g, borderWidth: 1, borderColor: cor.borda, padding: esp.l },
});
