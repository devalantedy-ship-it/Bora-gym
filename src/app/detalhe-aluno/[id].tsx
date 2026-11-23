import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar, Botao, Card, Kicker, Linha, T, Tela, toque } from '../../components/ui';
import { useState } from 'react';
import { GraficoLinha } from '../../components/Grafico';
import { Chips } from '../../components/extras';
import { DIAS_CURTOS, evolucaoAlunoExemplo } from '../../data/mock';
import { useApp } from '../../store/app';
import { cor, esp, fonte, raio } from '../../theme';

export default function DetalheAluno() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { alunos, treinos, alternarTreinoDoAluno, exercicios } = useApp();
  const [lift, setLift] = useState('Supino');
  const a = alunos.find((x) => x.id === id);
  if (!a) return <Tela><T>Aluno não encontrado.</T></Tela>;

  // 28 dias de exemplo a partir da frequência
  const dias = Array.from({ length: 28 }, (_, i) => ((i * 37 + a.nome.length * 11) % 100) < a.frequencia && i < 28 - a.ultimoTreino);
  const dele = treinos.filter((t) => a.treinos.includes(t.id));

  return (
    <Tela semTopo>
      <View style={{ alignItems: 'center', gap: 8, marginBottom: esp.xl }}>
        <Avatar iniciais={a.iniciais} tam={84} />
        <T tam={28} peso="extra">{a.nome}</T>
        <T fraco tam={14}>{a.ultimoTreino === 0 ? 'Treinou hoje' : `Último treino há ${a.ultimoTreino} ${a.ultimoTreino === 1 ? 'dia' : 'dias'}`}</T>
      </View>

      <Linha style={{ gap: esp.s, marginBottom: esp.l }}>
        {[{ v: `🔥 ${a.ofensiva}`, l: 'ofensiva' }, { v: `${a.frequencia}%`, l: 'no mês' }, { v: String(a.pontosSemana), l: 'pts semana' }].map((x) => (
          <Card key={x.l} style={{ flex: 1, alignItems: 'center', paddingVertical: 14 }}>
            <Text style={s.valor}>{x.v}</Text>
            <T fraco tam={12}>{x.l}</T>
          </Card>
        ))}
      </Linha>

      <Linha style={{ justifyContent: 'space-between' }}>
        <Kicker>Treinos do {a.nome} ({dele.length})</Kicker>
      </Linha>
      <T fraco tam={13} style={{ marginBottom: esp.m }}>Toque no botão pra ligar ou tirar um treino da ficha dele.</T>
      <View style={{ gap: esp.s, marginBottom: esp.m }}>
        {treinos.map((t) => {
          const on = a.treinos.includes(t.id);
          return (
            <Pressable key={t.id} onPress={() => { toque(); alternarTreinoDoAluno(a.id, t.id); }} style={[s.treino, on && { borderColor: cor.limao }]} accessibilityRole="switch" accessibilityState={{ checked: on }} accessibilityLabel={`Treino ${t.letra} ${t.nome}`}>
              <View style={[s.letra, on && { backgroundColor: cor.limao }]}><Text style={[s.letraTexto, on && { color: cor.sobreLimao }]}>{t.letra}</Text></View>
              <View style={{ flex: 1 }}>
                <T tam={15} peso="negrito" style={!on && { color: cor.textoSuave }}>{t.nome}</T>
                <T fraco tam={12}>{t.dias.map((d) => DIAS_CURTOS[d]).join(' · ')} · {t.exercicios.length} exercícios</T>
              </View>
              <View style={[s.chave, on && { backgroundColor: cor.limao }]}>
                <View style={[s.bolinha, on && { alignSelf: 'flex-end', backgroundColor: cor.sobreLimao }]} />
              </View>
            </Pressable>
          );
        })}
      </View>
      <View style={{ gap: esp.s, marginBottom: esp.xl }}>
        <Botao titulo={`Montar treino só pro ${a.nome}`} icone={<Ionicons name="add" size={22} color={cor.sobreLimao} />} onPress={() => router.push({ pathname: '/novo-treino', params: { aluno: a.id } })} />
      </View>

      <Card style={{ marginBottom: esp.l }}>
        <Kicker>Evolução de carga (1RM estimado)</Kicker>
        <View style={{ marginBottom: esp.m }}><Chips opcoes={['Supino', 'Agachamento', 'Puxada']} valor={lift} onChange={setLift} /></View>
        <GraficoLinha pontos={evolucaoAlunoExemplo(a, lift === 'Supino' ? 'supino' : lift === 'Agachamento' ? 'agachamento' : 'puxada')} />
      </Card>

      <Card style={{ marginBottom: esp.l }}>
        <Kicker>Últimos 28 dias</Kicker>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
          {dias.map((ok, i) => (
            <View key={i} style={{ width: '12%', aspectRatio: 1, borderRadius: 8, backgroundColor: ok ? cor.limao : cor.cardAlto }} />
          ))}
        </View>
      </Card>

      <View style={{ marginBottom: esp.s }}>
        <Botao titulo="Conversar no app" icone={<Ionicons name="chatbubbles" size={20} color={cor.sobreLimao} />} onPress={() => router.push({ pathname: '/chat/[id]', params: { id: a.id } })} />
      </View>
      <Botao
        titulo="Mandar mensagem no WhatsApp"
        tipo="escuro"
        icone={<Ionicons name="logo-whatsapp" size={20} color={cor.texto} />}
        onPress={() => Linking.openURL(`https://wa.me/?text=${encodeURIComponent(`Fala ${a.nome}! Bora treinar hoje? 💪`)}`)}
      />
    </Tela>
  );
}

const s = StyleSheet.create({
  valor: { color: cor.texto, fontFamily: fonte.display, fontSize: 20 },
  treino: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: cor.card, borderRadius: raio.m, borderWidth: 1.5, borderColor: cor.borda, padding: 12 },
  letra: { width: 40, height: 40, borderRadius: 12, backgroundColor: cor.cardAlto, alignItems: 'center', justifyContent: 'center' },
  letraTexto: { color: cor.textoSuave, fontFamily: fonte.display, fontSize: 18 },
  chave: { width: 50, height: 30, borderRadius: 15, backgroundColor: cor.cardAlto, padding: 4, justifyContent: 'center' },
  bolinha: { width: 22, height: 22, borderRadius: 11, backgroundColor: cor.textoFraco },
});
