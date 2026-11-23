import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Anel, CartaoFoto, Vazio } from '../../components/extras';
import { Recuperacao } from '../../components/Recuperacao';
import { Botao, Card, Kicker, Linha, T, Tela, toque } from '../../components/ui';
import { DIAS_CURTOS, DIAS_LONGOS, img } from '../../data/mock';
import { useApp } from '../../store/app';
import { cor, esp, fonte, raio } from '../../theme';

export default function Hoje() {
  const { nome, ofensiva, feitosHoje, marcarFeito, jaTreinouHoje, treinoDoDia, treinos, exercicios, seriesDe } = useApp();
  const hoje = new Date();
  const doDia = treinoDoDia();
  const treino = doDia ?? treinos[0];

  if (!treino) {
    return (
      <Tela>
        <Text style={s.ola}>Bora, <Text style={{ color: cor.limao }}>{nome || 'atleta'}!</Text></Text>
        <View style={{ marginTop: esp.xl }}>
          <Vazio icone="barbell" titulo="Seu treino tá chegando" texto="Seu personal ainda não montou seus treinos. Assim que ele enviar, aparece aqui." />
        </View>
      </Tela>
    );
  }

  const lista = treino.exercicios.filter((e) => exercicios[e]);
  const feitos = lista.filter((e) => feitosHoje.includes(e)).length;
  const progresso = lista.length ? feitos / lista.length : 0;
  const capa = exercicios[lista[0]]?.capa ?? img.halter;
  const proximos = [1, 2, 3].map((n) => (hoje.getDay() + n) % 7).map((d) => ({ d, t: treinoDoDia(d) }));

  return (
    <Tela>
      <Linha style={{ justifyContent: 'space-between' }}>
        <T fraco tam={15} style={{ flex: 1 }}>{DIAS_LONGOS[hoje.getDay()]}, {hoje.getDate()}</T>
        <Pressable onPress={() => { toque(); router.push({ pathname: '/chat/[id]', params: { id: 'eu' } }); }} style={[s.chama, { marginRight: 8, paddingHorizontal: 11 }]} accessibilityLabel="Falar com o personal">
          <Ionicons name="chatbubble-ellipses" size={18} color={cor.texto} />
        </Pressable>
        <Pressable onPress={() => { toque(); router.push('/aluno/ofensiva'); }} style={s.chama} accessibilityLabel={`Ofensiva de ${ofensiva} dias`}>
          <Ionicons name="flame" size={20} color={cor.limao} />
          <Text style={s.chamaTexto}>{ofensiva}</Text>
        </Pressable>
      </Linha>
      <Text style={[s.ola, { marginTop: 4, marginBottom: esp.l }]} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.7}>
        Bora, <Text style={{ color: cor.limao }}>{(nome || 'atleta').split(' ')[0]}!</Text>
      </Text>

      <CartaoFoto foto={capa} altura={300}>
        <View style={s.selo}><Text style={s.seloTexto}>{doDia ? `TREINO ${treino.letra} · HOJE` : 'HOJE É DESCANSO · TREINO LIVRE'}</Text></View>
        <Linha style={{ alignItems: 'flex-end', marginTop: esp.m }}>
          <View style={{ flex: 1 }}>
            <Text style={s.nomeTreino} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.7}>{treino.nome}</Text>
            <T tam={14} style={{ color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{lista.length} exercícios · ~{Math.round(lista.length * 9)} min</T>
          </View>
          <Anel valor={progresso} tam={70} grossura={8}>
            <Text style={s.anelTexto}>{Math.round(progresso * 100)}%</Text>
          </Anel>
        </Linha>
        <View style={{ marginTop: esp.l }}>
          {jaTreinouHoje ? (
            <View style={s.pago}><Ionicons name="checkmark-circle" size={22} color={cor.sobreLimao} /><Text style={s.pagoTexto}>Treino pago! Ofensiva de {ofensiva} dias</Text></View>
          ) : (
            <Botao titulo={feitos > 0 ? 'Continuar treino' : 'Começar treino'} icone={<Ionicons name="play" size={18} color={cor.sobreLimao} />} onPress={() => router.push('/treino-ao-vivo')} />
          )}
        </View>
      </CartaoFoto>

      <Recuperacao />

      <Linha style={{ justifyContent: 'space-between', marginTop: esp.xl, marginBottom: esp.s }}>
        <Kicker>Exercícios de hoje</Kicker>
        <T fraco tam={13} peso="negrito">{feitos}/{lista.length}</T>
      </Linha>
      <View style={{ gap: esp.s }}>
        {lista.map((id, i) => {
          const ex = exercicios[id];
          const sr = seriesDe(treino, id);
          const feito = feitosHoje.includes(id);
          return (
            <Card key={id} onPress={() => router.push({ pathname: '/exercicio/[id]', params: { id } })} style={{ padding: 10 }}>
              <Linha>
                <View style={s.capa}>
                  <Image source={ex.capa} style={StyleSheet.absoluteFill} contentFit="cover" />
                  <View style={s.play}><Ionicons name="play" size={14} color={cor.sobreLimao} /></View>
                </View>
                <View style={{ flex: 1 }}>
                  <T fraco tam={11} peso="negrito">{i + 1} · {ex.grupo.toUpperCase()}</T>
                  <T tam={16} peso="negrito" style={feito && { textDecorationLine: 'line-through', color: cor.textoSuave }}>{ex.nome}</T>
                  <T fraco tam={13}>{sr.series} × {sr.reps} · {ex.descanso}s</T>
                </View>
                <Pressable onPress={() => { toque(); marcarFeito(id); }} hitSlop={10} style={[s.check, feito && { backgroundColor: cor.limao, borderColor: cor.limao }]} accessibilityRole="checkbox" accessibilityState={{ checked: feito }} accessibilityLabel={`Marcar ${ex.nome} como feito`}>
                  {feito ? <Ionicons name="checkmark" size={20} color={cor.sobreLimao} /> : null}
                </Pressable>
              </Linha>
            </Card>
          );
        })}
      </View>

      <Kicker>{' '}</Kicker>
      <Kicker>Próximos dias</Kicker>
      <Linha style={{ gap: esp.s }}>
        {proximos.map(({ d, t }) => (
          <View key={d} style={s.proximo}>
            <Text style={s.proximoDia}>{DIAS_CURTOS[d]}</Text>
            <Text style={s.proximoNome} numberOfLines={2}>{t ? t.nome : 'Descanso'}</Text>
          </View>
        ))}
      </Linha>

      <View style={{ marginTop: esp.xl }}>
        <Botao titulo={jaTreinouHoje ? 'Refazer check-in' : 'Fazer check-in do dia'} tipo="escuro" icone={<Ionicons name="camera" size={20} color={cor.texto} />} onPress={() => router.push('/checkin')} />
      </View>
    </Tela>
  );
}

const s = StyleSheet.create({
  ola: { color: cor.texto, fontFamily: fonte.display, fontSize: 26, letterSpacing: -0.4 },
  chama: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: cor.card, borderWidth: 1, borderColor: cor.borda, borderRadius: raio.pill, paddingHorizontal: 14, height: 40 },
  chamaTexto: { color: cor.texto, fontFamily: fonte.extra, fontSize: 16 },
  selo: { alignSelf: 'flex-start', backgroundColor: cor.limao, borderRadius: raio.pill, paddingHorizontal: 12, paddingVertical: 6 },
  seloTexto: { color: cor.sobreLimao, fontFamily: fonte.extra, fontSize: 11, letterSpacing: 0.6 },
  nomeTreino: { color: cor.texto, fontFamily: fonte.display, fontSize: 32, letterSpacing: -0.6, lineHeight: 36 },
  anelTexto: { color: cor.texto, fontFamily: fonte.extra, fontSize: 15 },
  pago: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: cor.limao, borderRadius: raio.pill, height: 56, paddingHorizontal: 20 },
  pagoTexto: { color: cor.sobreLimao, fontFamily: fonte.extra, fontSize: 16 },
  capa: { width: 64, height: 64, borderRadius: 16, overflow: 'hidden', backgroundColor: cor.cardAlto, alignItems: 'center', justifyContent: 'center' },
  play: { width: 28, height: 28, borderRadius: 14, backgroundColor: cor.limao, alignItems: 'center', justifyContent: 'center', paddingLeft: 2 },
  check: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: cor.borda, alignItems: 'center', justifyContent: 'center' },
  proximo: { flex: 1, backgroundColor: cor.card, borderRadius: raio.m, borderWidth: 1, borderColor: cor.borda, padding: 12, minHeight: 84 },
  proximoDia: { color: cor.limao, fontFamily: fonte.extra, fontSize: 14 },
  proximoNome: { color: cor.texto, fontFamily: fonte.negrito, fontSize: 13, marginTop: 6 },
});
