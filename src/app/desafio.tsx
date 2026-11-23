import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Botao, Campo, confirmar, Kicker, T, Tela, toque, voltar } from '../components/ui';
import { useApp } from '../store/app';
import { cor, esp, fonte, raio } from '../theme';

const DURACOES = [7, 14, 21, 30, 60];

export default function Desafio() {
  const { desafio, salvarDesafio } = useApp();
  const [nome, setNome] = useState(desafio?.nome ?? '');
  const [dias, setDias] = useState(desafio?.dias ?? 30);
  const [premio, setPremio] = useState(desafio?.premio ?? '');

  return (
    <Tela semTopo>
      <T fraco tam={15} style={{ marginBottom: esp.xl, marginTop: esp.s }}>
        A turma inteira vê no ranking. Quem completar os dias seguidos ganha o prêmio. Prêmio de verdade engaja muito mais.
      </T>

      <Campo rotulo="Nome do desafio" value={nome} onChangeText={setNome} placeholder="Ex.: Desafio Verão" />

      <Kicker>Duração</Kicker>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: esp.l, flexWrap: 'wrap' }}>
        {DURACOES.map((d) => (
          <Pressable key={d} onPress={() => { toque(); setDias(d); }} style={[s.chip, dias === d && { backgroundColor: cor.limao, borderColor: cor.limao }]}>
            <Text style={[s.chipTexto, dias === d && { color: cor.sobreLimao }]}>{d} dias</Text>
          </Pressable>
        ))}
      </View>

      <Campo rotulo="Prêmio" value={premio} onChangeText={setPremio} placeholder="Ex.: camiseta, aula grátis, desconto" />

      <View style={{ gap: esp.s, marginTop: esp.s }}>
        <Botao
          titulo={desafio ? 'Reiniciar desafio com esses dados' : 'Lançar desafio'}
          onPress={() => { salvarDesafio({ nome: nome.trim(), dias, premio: premio.trim() }); voltar(); }}
          desativado={!nome.trim() || !premio.trim()}
        />
        {desafio ? (
          <Botao
            titulo="Encerrar desafio atual"
            tipo="contorno"
            onPress={async () => { if (await confirmar('Encerrar desafio?', 'Ele some do ranking da turma.', 'Encerrar')) { salvarDesafio(null); voltar(); } }}
          />
        ) : null}
      </View>
    </Tela>
  );
}

const s = StyleSheet.create({
  chip: { borderWidth: 1.5, borderColor: cor.borda, borderRadius: raio.pill, paddingHorizontal: 16, paddingVertical: 10 },
  chipTexto: { color: cor.textoSuave, fontFamily: fonte.negrito, fontSize: 14 },
});
