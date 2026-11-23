import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { avisar, Botao, Campo, Kicker, Linha, T, Tela, toque, voltar } from '../components/ui';
import { GRUPOS, type Midia } from '../data/mock';
import { useApp } from '../store/app';
import { cor, esp, fonte, raio } from '../theme';

function Previa({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => { p.loop = true; p.muted = true; p.play(); });
  return <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />;
}

export default function NovoExercicio() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { exercicios, salvarExercicio } = useApp();
  const ex = id ? exercicios[id] : undefined;

  const [nome, setNome] = useState(ex?.nome ?? '');
  const [grupo, setGrupo] = useState(ex?.grupo ?? 'Peito');
  const [series, setSeries] = useState(String(ex?.series ?? 3));
  const [reps, setReps] = useState(ex?.reps ?? '12');
  const [descanso, setDescanso] = useState(String(ex?.descanso ?? 60));
  const [dica, setDica] = useState(ex?.dica ?? '');
  const [video, setVideo] = useState<string | undefined>(ex?.videoUri);
  const [capa, setCapa] = useState<Midia | undefined>(ex?.capa);

  const escolherVideo = async (camera: boolean) => {
    const opcoes: ImagePicker.ImagePickerOptions = { mediaTypes: ['videos'], videoMaxDuration: 90, quality: 0.8 };
    if (camera) {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return avisar('Câmera bloqueada', 'Libera a câmera nas configurações pra gravar o vídeo.');
    }
    const r = camera ? await ImagePicker.launchCameraAsync(opcoes) : await ImagePicker.launchImageLibraryAsync(opcoes);
    if (!r.canceled) setVideo(r.assets[0].uri);
  };

  const escolherCapa = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    if (!r.canceled) setCapa({ uri: r.assets[0].uri });
  };

  const salvar = () => {
    salvarExercicio({
      id: ex?.id,
      nome: nome.trim(),
      grupo,
      series: Math.max(1, parseInt(series, 10) || 1),
      reps: reps.trim() || '10',
      descanso: Math.max(0, parseInt(descanso, 10) || 0),
      dica: dica.trim(),
      videoUri: video,
      capa,
    });
    voltar();
  };

  return (
    <Tela semTopo>
      <Kicker>Vídeo de execução</Kicker>
      <View style={s.video}>
        {video ? (
          <Previa uri={video} />
        ) : (
          <View style={{ alignItems: 'center', gap: 8 }}>
            <Ionicons name="videocam" size={40} color={cor.limao} />
            <T tam={15} peso="negrito">Grava mostrando o movimento</T>
            <T fraco tam={13}>Até 90 segundos. Todos os alunos vão ver.</T>
          </View>
        )}
      </View>
      <Linha style={{ gap: esp.s, marginBottom: esp.xl }}>
        <View style={{ flex: 1 }}><Botao titulo="Gravar" tipo="escuro" icone={<Ionicons name="radio-button-on" size={18} color={cor.perigo} />} onPress={() => escolherVideo(true)} /></View>
        <View style={{ flex: 1 }}><Botao titulo="Da galeria" tipo="escuro" icone={<Ionicons name="film-outline" size={18} color={cor.texto} />} onPress={() => escolherVideo(false)} /></View>
      </Linha>

      <Campo rotulo="Nome do exercício" value={nome} onChangeText={setNome} placeholder="Ex.: Supino inclinado" />

      <Kicker>Grupo muscular</Kicker>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: esp.l }}>
        {GRUPOS.map((g) => (
          <Pressable key={g} onPress={() => { toque(); setGrupo(g); }} style={[s.chip, grupo === g && { backgroundColor: cor.limao, borderColor: cor.limao }]}>
            <Text style={[s.chipTexto, grupo === g && { color: cor.sobreLimao }]}>{g}</Text>
          </Pressable>
        ))}
      </View>

      <Linha style={{ gap: esp.s }}>
        <View style={{ flex: 1 }}><Campo rotulo="Séries" value={series} onChangeText={setSeries} keyboardType="number-pad" /></View>
        <View style={{ flex: 1 }}><Campo rotulo="Repetições" value={reps} onChangeText={setReps} placeholder="12 ou 8-10" /></View>
        <View style={{ flex: 1 }}><Campo rotulo="Descanso (s)" value={descanso} onChangeText={setDescanso} keyboardType="number-pad" /></View>
      </Linha>

      <Campo rotulo="Dica pro aluno" value={dica} onChangeText={setDica} placeholder="Ex.: Desce controlando, sobe explosivo." multilinha />

      <Kicker>Capa (opcional)</Kicker>
      <Pressable onPress={escolherCapa} style={s.capa} accessibilityRole="button" accessibilityLabel="Escolher capa">
        {capa ? <Image source={capa} style={StyleSheet.absoluteFill} contentFit="cover" /> : <Ionicons name="image-outline" size={28} color={cor.textoSuave} />}
      </Pressable>

      <Botao titulo={ex ? 'Salvar exercício' : 'Cadastrar exercício'} onPress={salvar} desativado={!nome.trim()} />
    </Tela>
  );
}

const s = StyleSheet.create({
  video: { height: 220, borderRadius: raio.g, backgroundColor: cor.card, borderWidth: 1, borderColor: cor.borda, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', marginBottom: esp.m },
  chip: { borderWidth: 1.5, borderColor: cor.borda, borderRadius: raio.pill, paddingHorizontal: 14, paddingVertical: 8 },
  chipTexto: { color: cor.textoSuave, fontFamily: fonte.negrito, fontSize: 13 },
  capa: { width: 96, height: 96, borderRadius: raio.m, backgroundColor: cor.card, borderWidth: 1, borderColor: cor.borda, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', marginBottom: esp.xl },
});
