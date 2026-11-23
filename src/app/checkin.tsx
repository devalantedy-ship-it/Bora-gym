import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Botao, Card, Linha, T, Tela, voltar } from '../components/ui';
import { useApp } from '../store/app';
import { cor, esp, fonte, raio } from '../theme';

export default function Checkin() {
  const { fazerCheckin, feitosHoje, ofensiva, jaTreinouHoje, treinoDoDia, treinos } = useApp();
  const treino = treinoDoDia() ?? treinos[0] ?? { id: 'livre', nome: 'Treino livre', exercicios: [] as string[] };
  const [foto, setFoto] = useState<string>();
  const [pronto, setPronto] = useState(false);

  const tirarFoto = async () => {
    if (Platform.OS !== 'web') {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Câmera bloqueada', 'Libera a câmera nas configurações pra fazer o check-in com foto.');
        return;
      }
    }
    const r = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: true, aspect: [4, 5] });
    if (!r.canceled) setFoto(r.assets[0].uri);
  };

  const galeria = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: true, aspect: [4, 5] });
    if (!r.canceled) setFoto(r.assets[0].uri);
  };

  const publicar = () => {
    fazerCheckin({ treinoId: treino.id, fotoUri: foto, feitos: feitosHoje });
    setPronto(true);
  };

  if (pronto) {
    return (
      <Tela>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: esp.l, paddingVertical: 60 }}>
          <View style={s.ok}><Ionicons name="checkmark" size={64} color={cor.sobreLimao} /></View>
          <Text style={s.grande}>Tá <Text style={{ color: cor.limao }}>pago!</Text></Text>
          <T fraco tam={16} style={{ textAlign: 'center' }}>
            Ofensiva de {ofensiva} {ofensiva === 1 ? 'dia' : 'dias'} 🔥{'\n'}+{foto ? 15 : 10} pontos no ranking da turma
          </T>
          <View style={{ width: '100%', marginTop: esp.l }}>
            <Botao titulo="Voltar pro início" onPress={() => voltar()} />
          </View>
        </View>
      </Tela>
    );
  }

  return (
    <Tela semTopo>
      <Pressable onPress={tirarFoto} style={s.foto} accessibilityRole="button" accessibilityLabel="Tirar foto do treino">
        {foto ? (
          <Image source={{ uri: foto }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          <>
            <View style={s.cantos} pointerEvents="none">
              {[{ top: 0, left: 0 }, { top: 0, right: 0 }, { bottom: 0, left: 0 }, { bottom: 0, right: 0 }].map((p, i) => (
                <View key={i} style={[s.canto, p, { borderTopWidth: 'top' in p ? 4 : 0, borderBottomWidth: 'bottom' in p ? 4 : 0, borderLeftWidth: 'left' in p ? 4 : 0, borderRightWidth: 'right' in p ? 4 : 0 }]} />
              ))}
            </View>
            <Ionicons name="camera" size={46} color={cor.limao} />
            <T tam={17} peso="negrito" style={{ marginTop: 10 }}>Tira a foto do treino</T>
            <T fraco tam={14}>vale +5 pontos</T>
          </>
        )}
      </Pressable>

      <Linha style={{ gap: esp.s, marginBottom: esp.l }}>
        <View style={{ flex: 1 }}><Botao titulo="Câmera" tipo="escuro" icone={<Ionicons name="camera-outline" size={18} color={cor.texto} />} onPress={tirarFoto} /></View>
        <View style={{ flex: 1 }}><Botao titulo="Galeria" tipo="escuro" icone={<Ionicons name="images-outline" size={18} color={cor.texto} />} onPress={galeria} /></View>
      </Linha>

      <Card style={{ marginBottom: esp.l }}>
        <T fraco tam={13} peso="negrito">TREINO DE HOJE</T>
        <T tam={20} peso="extra" style={{ marginTop: 4 }}>{treino.nome}</T>
        <T fraco tam={14} style={{ marginTop: 4 }}>{feitosHoje.length} de {treino.exercicios.length} exercícios marcados</T>
      </Card>

      <Botao titulo={jaTreinouHoje ? 'Atualizar check-in' : foto ? 'Publicar check-in' : 'Fazer check-in sem foto'} onPress={publicar} />
    </Tela>
  );
}

const s = StyleSheet.create({
  foto: { aspectRatio: 4 / 5, maxHeight: 460, width: '100%', alignSelf: 'center', borderRadius: raio.g, overflow: 'hidden', backgroundColor: cor.card, borderWidth: 1, borderColor: cor.borda, alignItems: 'center', justifyContent: 'center', marginTop: esp.s, marginBottom: esp.l },
  cantos: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, margin: 22 },
  canto: { position: 'absolute', width: 44, height: 44, borderColor: '#fff', borderRadius: 10 },
  ok: { width: 120, height: 120, borderRadius: 60, backgroundColor: cor.limao, alignItems: 'center', justifyContent: 'center' },
  grande: { color: cor.texto, fontFamily: fonte.display, fontSize: 48, letterSpacing: -1 },
});
