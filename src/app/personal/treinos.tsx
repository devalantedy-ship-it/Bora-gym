import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Botao, Card, confirmar, Kicker, Linha, T, Tela, Titulo, toque } from '../../components/ui';
import { DIAS_CURTOS } from '../../data/mock';
import { useApp } from '../../store/app';
import { cor, esp, fonte, raio } from '../../theme';

export default function Treinos() {
  const { treinos, exercicios, excluirTreino } = useApp();
  const params = useLocalSearchParams<{ aba?: string }>();
  const [aba, setAba] = useState<'treinos' | 'exercicios'>(params.aba === 'exercicios' ? 'exercicios' : 'treinos');
  const lista = Object.values(exercicios).sort((a, b) => a.grupo.localeCompare(b.grupo) || a.nome.localeCompare(b.nome));

  return (
    <Tela>
      <Titulo branco="Seus" limao="Treinos" sub="Monte uma vez, a turma inteira recebe" />

      <View style={s.alternar}>
        {(['treinos', 'exercicios'] as const).map((k) => (
          <Pressable key={k} onPress={() => { toque(); setAba(k); }} style={[s.opcao, aba === k && { backgroundColor: cor.limao }]} accessibilityRole="tab" accessibilityState={{ selected: aba === k }}>
            <Text style={[s.opcaoTexto, aba === k && { color: cor.sobreLimao }]}>{k === 'treinos' ? `Treinos (${treinos.length})` : `Exercícios (${lista.length})`}</Text>
          </Pressable>
        ))}
      </View>

      {aba === 'treinos' ? (
        <>
          <View style={{ gap: esp.m }}>
            {treinos.length === 0 ? <T fraco>Nenhum treino ainda. Monta o primeiro aí embaixo.</T> : null}
            {treinos.map((t) => (
              <Card key={t.id}>
                <Linha style={{ alignItems: 'flex-start' }}>
                  <View style={s.letra}><Text style={s.letraTexto}>{t.letra}</Text></View>
                  <View style={{ flex: 1 }}>
                    <T tam={19} peso="extra">{t.nome}</T>
                    <Linha style={{ gap: 5, marginTop: 6, flexWrap: 'wrap' }}>
                      {DIAS_CURTOS.map((d, i) => (
                        <View key={i} style={[s.dia, t.dias.includes(i) && { backgroundColor: cor.limao }]}>
                          <Text style={[s.diaTexto, t.dias.includes(i) && { color: cor.sobreLimao }]}>{d}</Text>
                        </View>
                      ))}
                    </Linha>
                  </View>
                </Linha>
                <View style={{ marginTop: esp.m, gap: 6 }}>
                  {t.exercicios.filter((id) => exercicios[id]).map((id) => (
                    <Linha key={id} style={{ gap: 8 }}>
                      <Ionicons name={exercicios[id].videoUri ? 'play-circle' : 'play-circle-outline'} size={18} color={exercicios[id].videoUri ? cor.limao : cor.textoFraco} />
                      <T tam={14} style={{ flex: 1 }}>{exercicios[id].nome}</T>
                      <T fraco tam={13}>{exercicios[id].series}×{exercicios[id].reps}</T>
                    </Linha>
                  ))}
                </View>
                <Linha style={{ marginTop: esp.m, gap: esp.s }}>
                  <View style={{ flex: 1 }}>
                    <Botao titulo="Editar" tipo="escuro" onPress={() => router.push({ pathname: '/novo-treino', params: { id: t.id } })} />
                  </View>
                  <Pressable
                    onPress={async () => { if (await confirmar('Excluir treino?', `"${t.nome}" some pra todos os alunos.`, 'Excluir')) excluirTreino(t.id); }}
                    style={s.lixo}
                    accessibilityRole="button"
                    accessibilityLabel={`Excluir ${t.nome}`}
                  >
                    <Ionicons name="trash-outline" size={20} color={cor.perigo} />
                  </Pressable>
                </Linha>
              </Card>
            ))}
          </View>
          <View style={{ marginTop: esp.xl }}>
            <Botao titulo="Montar novo treino" icone={<Ionicons name="add" size={22} color={cor.sobreLimao} />} onPress={() => router.push('/novo-treino')} />
            <View style={{ height: 8 }} />
            <Botao titulo="Usar um plano pronto" tipo="escuro" icone={<Ionicons name="flash" size={18} color={cor.texto} />} onPress={() => router.push('/planos')} />
          </View>
        </>
      ) : (
        <>
          <T fraco tam={14} style={{ marginBottom: esp.m }}>Ícone verde = já tem vídeo de execução. Toque pra editar e enviar o vídeo.</T>
          <View style={{ gap: esp.s }}>
            {lista.map((ex) => (
              <Card key={ex.id} onPress={() => router.push({ pathname: '/novo-exercicio', params: { id: ex.id } })} style={{ padding: esp.m }}>
                <Linha>
                  <Image source={ex.capa} style={s.capa} contentFit="cover" />
                  <View style={{ flex: 1 }}>
                    <T tam={15} peso="negrito">{ex.nome}</T>
                    <T fraco tam={12}>{ex.grupo} · {ex.series}×{ex.reps}</T>
                  </View>
                  <Ionicons name="videocam" size={20} color={ex.videoUri ? cor.limao : cor.textoFraco} />
                </Linha>
              </Card>
            ))}
          </View>
          <View style={{ marginTop: esp.xl }}>
            <Botao titulo="Buscar na biblioteca (873)" icone={<Ionicons name="library" size={20} color={cor.sobreLimao} />} onPress={() => router.push('/biblioteca')} />
            <View style={{ height: 8 }} />
            <Botao titulo="Cadastrar com meu vídeo" tipo="escuro" icone={<Ionicons name="videocam" size={20} color={cor.texto} />} onPress={() => router.push('/novo-exercicio')} />
          </View>
        </>
      )}

      <Card style={{ marginTop: esp.xl, flexDirection: 'row', alignItems: 'center', gap: esp.m }} onPress={() => router.push('/desafio')}>
        <Ionicons name="trophy" size={24} color={cor.limao} />
        <View style={{ flex: 1 }}>
          <T tam={15} peso="negrito">Desafio da turma</T>
          <T fraco tam={13}>Crie um desafio com prêmio pra engajar a galera</T>
        </View>
        <Ionicons name="chevron-forward" size={18} color={cor.textoFraco} />
      </Card>
      <Kicker>{' '}</Kicker>
    </Tela>
  );
}

const s = StyleSheet.create({
  alternar: { flexDirection: 'row', backgroundColor: cor.card, borderRadius: raio.pill, padding: 5, borderWidth: 1, borderColor: cor.borda, marginBottom: esp.l },
  opcao: { flex: 1, height: 42, borderRadius: raio.pill, alignItems: 'center', justifyContent: 'center' },
  opcaoTexto: { color: cor.textoSuave, fontFamily: fonte.negrito, fontSize: 14 },
  letra: { width: 52, height: 52, borderRadius: 16, backgroundColor: cor.limao, alignItems: 'center', justifyContent: 'center', marginRight: 4 },
  letraTexto: { color: cor.sobreLimao, fontFamily: fonte.display, fontSize: 24 },
  dia: { width: 26, height: 26, borderRadius: 13, backgroundColor: cor.cardAlto, alignItems: 'center', justifyContent: 'center' },
  diaTexto: { color: cor.textoFraco, fontFamily: fonte.negrito, fontSize: 11 },
  lixo: { width: 56, height: 56, borderRadius: 28, borderWidth: 1.5, borderColor: cor.borda, alignItems: 'center', justifyContent: 'center' },
  capa: { width: 56, height: 56, borderRadius: 14, backgroundColor: cor.cardAlto },
});
