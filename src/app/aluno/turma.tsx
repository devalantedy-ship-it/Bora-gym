import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar, Botao, Card, Linha, T, Tela, Titulo, toque } from '../../components/ui';
import { quandoTexto } from '../../data/mock';
import { useApp } from '../../store/app';
import { cor, esp, fonte, raio } from '../../theme';

export default function Turma() {
  const { feed, reagir, jaTreinouHoje } = useApp();

  return (
    <Tela>
      <Titulo branco="Sua" limao="Turma" sub="Quem já pagou o treino hoje. Manda um 💪 pra galera." />

      {!jaTreinouHoje ? (
        <Card style={{ marginBottom: esp.l }}>
          <T tam={16} peso="negrito">Ainda não postou hoje</T>
          <T fraco tam={14} style={{ marginTop: 4, marginBottom: esp.m }}>Faz o check-in com foto e aparece aqui pra turma.</T>
          <Botao titulo="Fazer check-in" icone={<Ionicons name="camera" size={18} color={cor.sobreLimao} />} onPress={() => router.push('/checkin')} />
        </Card>
      ) : null}

      <View style={{ gap: esp.l }}>
        {feed.map((p) => (
          <View key={p.id} style={s.post}>
            <Linha style={{ padding: esp.m }}>
              <Avatar iniciais={p.iniciais} tam={40} />
              <View style={{ flex: 1 }}>
                <T tam={15} peso="negrito">{p.autor}</T>
                <T fraco tam={12}>{p.treino} · {quandoTexto(p.quando)}</T>
              </View>
              <View style={s.selo}><Text style={s.seloTexto}>Tá pago ✓</Text></View>
            </Linha>
            {p.foto ? (
              <Image source={p.foto} style={s.foto} contentFit="cover" />
            ) : (
              <View style={[s.foto, s.semFoto]}>
                <Ionicons name="barbell" size={42} color={cor.limao} />
                <T fraco tam={13} style={{ marginTop: 8 }}>Check-in sem foto</T>
              </View>
            )}
            <Linha style={{ padding: esp.m }}>
              <Pressable
                onPress={() => { toque(); reagir(p.id); }}
                style={[s.reagir, p.reagi && { backgroundColor: cor.limao, borderColor: cor.limao }]}
                accessibilityRole="button"
                accessibilityLabel={p.reagi ? 'Tirar reação' : 'Mandar força'}
              >
                <Text style={{ fontSize: 16 }}>💪</Text>
                <Text style={[s.reagirTexto, p.reagi && { color: cor.sobreLimao }]}>{p.reacoes}</Text>
              </Pressable>
              <T fraco tam={13} style={{ flex: 1 }}>{p.reagi ? 'Você mandou força' : 'Manda força'}</T>
            </Linha>
          </View>
        ))}
      </View>
    </Tela>
  );
}

const s = StyleSheet.create({
  post: { backgroundColor: cor.card, borderRadius: raio.g, borderWidth: 1, borderColor: cor.borda, overflow: 'hidden' },
  selo: { backgroundColor: cor.limao, borderRadius: raio.pill, paddingHorizontal: 10, paddingVertical: 5 },
  seloTexto: { color: cor.sobreLimao, fontFamily: fonte.extra, fontSize: 12 },
  foto: { width: '100%', aspectRatio: 4 / 5, maxHeight: 520, backgroundColor: cor.cardAlto },
  semFoto: { alignItems: 'center', justifyContent: 'center', aspectRatio: 2 },
  reagir: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: cor.borda, borderRadius: raio.pill, paddingHorizontal: 14, height: 40 },
  reagirTexto: { color: cor.texto, fontFamily: fonte.extra, fontSize: 15 },
});
