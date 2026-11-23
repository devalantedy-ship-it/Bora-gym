import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Barra, Card, Kicker, Linha, T, Tela, Titulo } from '../../components/ui';
import { DIAS_CURTOS } from '../../data/mock';
import { useApp } from '../../store/app';
import { cor, esp, fonte } from '../../theme';

const SEMANA = [78, 92, 70, 88, 95, 60, 34]; // % da turma por dia (seg..dom)

export default function Frequencia() {
  const { alunos: todos } = useApp();
  const alunos = [...todos].sort((a, b) => b.frequencia - a.frequencia);
  const media = alunos.length ? Math.round(alunos.reduce((s, a) => s + a.frequencia, 0) / alunos.length) : 0;
  const dias = [1, 2, 3, 4, 5, 6, 0];

  return (
    <Tela>
      <Titulo branco="Visão do" limao="Personal" sub="Como a turma tá treinando" />

      <Card style={{ marginBottom: esp.l }}>
        <Kicker>Frequência da semana</Kicker>
        <Linha style={{ alignItems: 'flex-end', gap: 8 }}>
          <Text style={s.big}>87%</Text>
          <T fraco tam={14} style={{ marginBottom: 10 }}>da turma treinou</T>
        </Linha>
        <View style={s.grafico}>
          {SEMANA.map((v, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
              <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end' }}>
                <View style={{ height: `${v}%`, borderRadius: 10, backgroundColor: i === new Date().getDay() - 1 ? cor.limao : '#F2F2F2' }} />
              </View>
              <Text style={s.dia}>{DIAS_CURTOS[dias[i]]}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Kicker>Ranking de frequência do mês · média {media}%</Kicker>
      <View style={{ gap: esp.s }}>
        {alunos.map((a) => (
          <Card key={a.id} style={{ paddingVertical: 12 }}>
            <Linha>
              <Avatar iniciais={a.iniciais} tam={38} />
              <View style={{ flex: 1, gap: 6 }}>
                <Linha style={{ justifyContent: 'space-between' }}>
                  <T tam={15} peso="negrito">{a.nome}</T>
                  <T tam={14} peso="extra" style={{ color: a.frequencia < 60 ? cor.perigo : cor.texto }}>{a.frequencia}%</T>
                </Linha>
                <Barra valor={a.frequencia / 100} altura={6} />
              </View>
            </Linha>
          </Card>
        ))}
      </View>
    </Tela>
  );
}

const s = StyleSheet.create({
  big: { color: cor.texto, fontFamily: fonte.display, fontSize: 60, letterSpacing: -2 },
  grafico: { height: 170, flexDirection: 'row', gap: 10, marginTop: esp.l },
  dia: { color: cor.textoFraco, fontFamily: fonte.negrito, fontSize: 12 },
});
