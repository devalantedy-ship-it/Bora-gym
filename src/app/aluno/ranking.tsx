import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar, Card, Kicker, Linha, Pill, T, Tela, Titulo, toque } from '../../components/ui';
import { iniciaisDe } from '../../data/mock';
import { useApp } from '../../store/app';
import { cor, esp, fonte, raio } from '../../theme';

const LIGAS = ['Ferro', 'Bronze', 'Prata', 'Ouro', 'Diamante'];

export default function Ranking() {
  const { pontosSemana, alunos, nome, ofensiva, desafio } = useApp();
  const [aba, setAba] = useState<'semana' | 'desafio'>('semana');
  const lista = [...alunos, { id: 'voce', nome: nome ? `${nome} (você)` : 'Você', iniciais: iniciaisDe(nome || 'VC'), ofensiva, pontosSemana, ultimoTreino: 0, frequencia: 0, treinos: [] }].sort((a, b) => b.pontosSemana - a.pontosSemana);
  const diasDesafio = desafio ? Math.min(desafio.dias, Math.floor((Date.now() - new Date(desafio.inicio).getTime()) / 86400000)) : 0;
  const minhaPos = lista.findIndex((a) => a.id === 'voce') + 1;

  return (
    <Tela>
      <Titulo branco="Suba no" limao="Ranking" sub="Zera toda segunda. Todo mundo tem chance." />

      <View style={s.alternar}>
        {(['semana', 'desafio'] as const).map((k) => (
          <Pressable key={k} onPress={() => { toque(); setAba(k); }} style={[s.opcao, aba === k && { backgroundColor: cor.limao }]} accessibilityRole="tab" accessibilityState={{ selected: aba === k }}>
            <Text style={[s.opcaoTexto, aba === k && { color: cor.sobreLimao }]}>{k === 'semana' ? 'Top da semana' : 'Desafio'}</Text>
          </Pressable>
        ))}
      </View>

      {aba === 'semana' ? (
        <>
          <Card style={{ marginBottom: esp.l }}>
            <Linha style={{ justifyContent: 'space-between' }}>
              <View>
                <Kicker>Sua liga</Kicker>
                <T tam={24} peso="extra">Liga Prata</T>
                <T fraco tam={13}>Top 3 sobe pra Ouro no domingo</T>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <T tam={34} peso="black" style={{ color: cor.limao }}>{minhaPos}º</T>
                <T fraco tam={13}>{pontosSemana} pts</T>
              </View>
            </Linha>
            <Linha style={{ marginTop: esp.l, gap: 6 }}>
              {LIGAS.map((l, i) => (
                <View key={l} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: i <= 2 ? cor.limao : cor.cardAlto }} />
              ))}
            </Linha>
          </Card>

          <View style={{ gap: 8 }}>
            {lista.map((a, i) => {
              const eu = a.id === 'voce';
              return (
                <View key={a.id} style={[s.linha, eu && { backgroundColor: cor.limao, borderColor: cor.limao }]}>
                  <Text style={[s.pos, eu && { color: cor.sobreLimao }]}>{i + 1}</Text>
                  <Avatar iniciais={a.iniciais} destaque={eu} />
                  <View style={{ flex: 1 }}>
                    <Text style={[s.nome, eu && { color: cor.sobreLimao }]}>{a.nome}</Text>
                    <Text style={[s.detalhe, eu && { color: cor.sobreLimao, opacity: 0.7 }]}>🔥 {a.ofensiva} dias</Text>
                  </View>
                  <Text style={[s.pontos, eu && { color: cor.sobreLimao }]}>{a.pontosSemana}</Text>
                  {i < 3 ? <Ionicons name="trophy" size={18} color={eu ? cor.sobreLimao : ['#FFD54A', '#C9CDD2', '#D08A4E'][i]} /> : <View style={{ width: 18 }} />}
                </View>
              );
            })}
          </View>
          <T fraco tam={13} style={{ marginTop: esp.l, textAlign: 'center' }}>Treino feito = 10 pts · com foto = +5 pts</T>
        </>
      ) : desafio ? (
        <Card>
          <Pill>{desafio.dias - diasDesafio > 0 ? `Faltam ${desafio.dias - diasDesafio} dias` : 'Encerrado'}</Pill>
          <Text style={s.desafioNome}>{desafio.nome}</Text>
          <T fraco tam={15} style={{ marginTop: 6 }}>Criado pelo seu personal. Prêmio: {desafio.premio}.</T>
          <Linha style={{ marginTop: esp.l }}>
            <View style={{ flex: 1, height: 10, borderRadius: 5, backgroundColor: cor.cardAlto, overflow: 'hidden' }}>
              <View style={{ width: `${(Math.min(ofensiva, desafio.dias) / desafio.dias) * 100}%`, height: '100%', backgroundColor: cor.limao }} />
            </View>
            <T peso="negrito" tam={14}>{Math.min(ofensiva, desafio.dias)}/{desafio.dias}</T>
          </Linha>
          <T fraco tam={13} style={{ marginTop: esp.l }}>Seu progresso conta pelos dias seguidos de treino.</T>
        </Card>
      ) : (
        <Card>
          <T fraco>Nenhum desafio ativo no momento. Seu personal pode criar um a qualquer hora.</T>
        </Card>
      )}
    </Tela>
  );
}

const s = StyleSheet.create({
  alternar: { flexDirection: 'row', backgroundColor: cor.card, borderRadius: raio.pill, padding: 5, borderWidth: 1, borderColor: cor.borda, marginBottom: esp.l },
  opcao: { flex: 1, height: 42, borderRadius: raio.pill, alignItems: 'center', justifyContent: 'center' },
  opcaoTexto: { color: cor.textoSuave, fontFamily: fonte.negrito, fontSize: 14 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: cor.card, borderRadius: raio.m, borderWidth: 1, borderColor: cor.borda, paddingHorizontal: 14, paddingVertical: 10 },
  pos: { width: 22, color: cor.textoSuave, fontFamily: fonte.extra, fontSize: 16 },
  nome: { color: cor.texto, fontFamily: fonte.negrito, fontSize: 16 },
  detalhe: { color: cor.textoSuave, fontFamily: fonte.regular, fontSize: 12 },
  pontos: { color: cor.texto, fontFamily: fonte.extra, fontSize: 16 },
  desafioNome: { color: cor.texto, fontFamily: fonte.display, fontSize: 24, marginTop: esp.m, letterSpacing: -0.4 },
});
