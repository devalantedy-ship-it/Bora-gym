// IMC e % de gordura estimada (fórmula de Deurenberg: usa IMC, idade e sexo).
// É uma estimativa; avaliação de verdade é com o personal (adipômetro/bioimpedância).
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../store/app';
import { cor, esp, fonte, raio } from '../theme';
import { Botao, Campo, Card, Kicker, Linha, T, toque } from './ui';

function faixaIMC(imc: number) {
  if (imc < 18.5) return { t: 'Abaixo do peso', c: '#7FD3FF' };
  if (imc < 25) return { t: 'Peso adequado', c: cor.limao };
  if (imc < 30) return { t: 'Sobrepeso', c: '#FFD54A' };
  return { t: 'Obesidade', c: cor.perigo };
}
function faixaGordura(g: number, sexo: 'M' | 'F') {
  const [atleta, fit, media] = sexo === 'M' ? [13, 17, 24] : [20, 24, 31];
  if (g < atleta) return { t: 'Atlético', c: cor.limao };
  if (g < fit) return { t: 'Em forma', c: cor.limao };
  if (g < media) return { t: 'Na média', c: '#FFD54A' };
  return { t: 'Acima da média', c: cor.perigo };
}
const fmt = (n: number) => n.toFixed(1).replace('.', ',');

export function Composicao({ peso }: { peso?: number }) {
  const { corpo, salvarCorpo } = useApp();
  const [editando, setEditando] = useState(!corpo.altura);
  const [altura, setAltura] = useState(corpo.altura ? String(corpo.altura) : '');
  const [idade, setIdade] = useState(corpo.idade ? String(corpo.idade) : '');
  const [sexo, setSexo] = useState<'M' | 'F'>(corpo.sexo ?? 'M');

  if (editando || !corpo.altura || !corpo.idade || !corpo.sexo) {
    return (
      <Card style={{ marginBottom: esp.l }}>
        <Kicker>Composição corporal</Kicker>
        <T fraco tam={14} style={{ marginBottom: esp.m }}>Coloca sua altura e idade pra calcular o IMC e estimar o % de gordura.</T>
        <Linha style={{ gap: esp.s }}>
          <View style={{ flex: 1 }}><Campo rotulo="Altura (cm)" value={altura} onChangeText={setAltura} keyboardType="number-pad" placeholder="175" /></View>
          <View style={{ flex: 1 }}><Campo rotulo="Idade" value={idade} onChangeText={setIdade} keyboardType="number-pad" placeholder="28" /></View>
        </Linha>
        <Linha style={{ gap: 8, marginBottom: esp.l }}>
          {(['M', 'F'] as const).map((x) => (
            <Pressable key={x} onPress={() => { toque(); setSexo(x); }} style={[s.chip, sexo === x && { backgroundColor: cor.limao, borderColor: cor.limao }]}>
              <Text style={[s.chipTexto, sexo === x && { color: cor.sobreLimao }]}>{x === 'M' ? 'Masculino' : 'Feminino'}</Text>
            </Pressable>
          ))}
        </Linha>
        <Botao
          titulo="Calcular"
          onPress={() => { salvarCorpo({ altura: parseFloat(altura.replace(',', '.')), idade: parseInt(idade, 10), sexo }); setEditando(false); }}
          desativado={!(parseFloat(altura) > 100 && parseFloat(altura) < 250 && parseInt(idade, 10) > 10 && parseInt(idade, 10) < 100)}
        />
      </Card>
    );
  }

  if (!peso) return null;
  const m = corpo.altura / 100;
  const imc = peso / (m * m);
  const gordura = Math.max(3, 1.2 * imc + 0.23 * corpo.idade - 10.8 * (corpo.sexo === 'M' ? 1 : 0) - 5.4);
  const fi = faixaIMC(imc);
  const fg = faixaGordura(gordura, corpo.sexo);
  const magra = peso * (1 - gordura / 100);

  return (
    <Card style={{ marginBottom: esp.l }}>
      <Linha style={{ justifyContent: 'space-between' }}>
        <Kicker>Composição corporal</Kicker>
        <Pressable onPress={() => setEditando(true)} hitSlop={8}><Text style={s.editar}>Editar dados</Text></Pressable>
      </Linha>
      <Linha style={{ gap: esp.s }}>
        <View style={s.bloco}>
          <Text style={s.rotulo}>IMC</Text>
          <Text style={s.valor}>{fmt(imc)}</Text>
          <Text style={[s.faixa, { color: fi.c }]}>{fi.t}</Text>
        </View>
        <View style={s.bloco}>
          <Text style={s.rotulo}>% GORDURA</Text>
          <Text style={s.valor}>{fmt(gordura)}%</Text>
          <Text style={[s.faixa, { color: fg.c }]}>{fg.t}</Text>
        </View>
        <View style={s.bloco}>
          <Text style={s.rotulo}>MASSA MAGRA</Text>
          <Text style={s.valor}>{fmt(magra)}</Text>
          <Text style={[s.faixa, { color: cor.textoSuave }]}>kg</Text>
        </View>
      </Linha>
      <T fraco tam={11} style={{ marginTop: esp.m }}>% de gordura é uma estimativa pela altura, peso, idade e sexo. Pra um número exato, faz a avaliação física com seu personal.</T>
    </Card>
  );
}

const s = StyleSheet.create({
  chip: { borderWidth: 1.5, borderColor: cor.borda, borderRadius: raio.pill, paddingHorizontal: 16, paddingVertical: 10 },
  chipTexto: { color: cor.textoSuave, fontFamily: fonte.negrito, fontSize: 14 },
  editar: { color: cor.limao, fontFamily: fonte.negrito, fontSize: 13 },
  bloco: { flex: 1, backgroundColor: cor.cardAlto, borderRadius: raio.m, padding: 12 },
  rotulo: { color: cor.textoFraco, fontFamily: fonte.negrito, fontSize: 10, letterSpacing: 0.8 },
  valor: { color: cor.texto, fontFamily: fonte.display, fontSize: 22, marginTop: 4 },
  faixa: { fontFamily: fonte.extra, fontSize: 12, marginTop: 2 },
});
