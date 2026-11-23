import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { urlImg } from '../../components/Demo';
import { Busca, Chips } from '../../components/extras';
import { toque } from '../../components/ui';
import { buscar, EQUIP_BIB, GRUPOS_BIB, type ItemBiblioteca } from '../../data/biblioteca';
import { useApp } from '../../store/app';
import { cor, esp, fonte, LARGURA_MAX, raio } from '../../theme';

export default function Biblioteca() {
  const { exercicios, favoritos, alternarFavorito } = useApp();
  const [soFavoritos, setSoFavoritos] = useState(false);
  const [texto, setTexto] = useState('');
  const [grupo, setGrupo] = useState('Todos');
  const [equip, setEquip] = useState('Todos');
  const [verEquip, setVerEquip] = useState(false);
  const lista = useMemo(() => buscar(texto, grupo, equip).filter((x) => !soFavoritos || favoritos.includes(x.id)), [texto, grupo, equip, soFavoritos, favoritos]);
  const jaTenho = useMemo(() => new Set(Object.values(exercicios).map((e) => e.fonteId).filter(Boolean)), [exercicios]);

  const item = ({ item: x }: { item: ItemBiblioteca }) => (
    <Pressable onPress={() => { toque(); router.push({ pathname: '/biblioteca/[id]', params: { id: x.id } }); }} style={({ pressed }) => [s.item, pressed && { opacity: 0.85 }]} accessibilityRole="button">
      <View style={s.thumb}>
        <Image source={{ uri: urlImg(x.img[0]) }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.nome} numberOfLines={2}>{x.n}</Text>
        <Text style={s.sub} numberOfLines={1}>{x.g} · {x.eq}</Text>
      </View>
      {jaTenho.has(x.id) ? <Ionicons name="checkmark-circle" size={20} color={cor.limao} /> : null}
      <Pressable onPress={() => { toque(); alternarFavorito(x.id); }} hitSlop={10} accessibilityRole="button" accessibilityLabel={favoritos.includes(x.id) ? 'Tirar dos favoritos' : 'Favoritar'}>
        <Ionicons name={favoritos.includes(x.id) ? 'heart' : 'heart-outline'} size={22} color={favoritos.includes(x.id) ? cor.limao : cor.textoFraco} />
      </Pressable>
    </Pressable>
  );

  return (
    <SafeAreaView style={s.tela} edges={['left', 'right', 'bottom']}>
      <FlatList
        data={lista}
        keyExtractor={(x) => x.id}
        renderItem={item}
        initialNumToRender={14}
        windowSize={7}
        contentContainerStyle={s.miolo}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={
          <View style={{ marginBottom: esp.m }}>
            <Text style={s.intro}>{lista.length} exercícios com demonstração. Toque pra ver o movimento e adicionar aos seus treinos.</Text>
            <Busca valor={texto} onChange={setTexto} placeholder="Buscar: supino, rosca, squat…" />
            <Pressable onPress={() => { toque(); setSoFavoritos(!soFavoritos); }} style={[s.fav, soFavoritos && { backgroundColor: cor.limao, borderColor: cor.limao }]} accessibilityRole="button">
              <Ionicons name={soFavoritos ? 'heart' : 'heart-outline'} size={16} color={soFavoritos ? cor.sobreLimao : cor.texto} />
              <Text style={[s.favTexto, soFavoritos && { color: cor.sobreLimao }]}>Favoritos ({favoritos.length})</Text>
            </Pressable>
            <Chips opcoes={GRUPOS_BIB} valor={grupo} onChange={setGrupo} />
            <Pressable onPress={() => setVerEquip(!verEquip)} style={{ paddingVertical: 10 }}>
              <Text style={s.filtro}>{verEquip ? 'Esconder equipamento ▴' : `Equipamento: ${equip} ▾`}</Text>
            </Pressable>
            {verEquip ? <Chips opcoes={EQUIP_BIB} valor={equip} onChange={setEquip} /> : null}
          </View>
        }
        ListEmptyComponent={<Text style={s.intro}>Nada encontrado. Tenta outro nome (em português ou inglês).</Text>}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cor.fundo },
  miolo: { width: '100%', maxWidth: LARGURA_MAX, alignSelf: 'center', padding: esp.l, paddingBottom: 60 },
  intro: { color: cor.textoSuave, fontFamily: fonte.media, fontSize: 14, marginBottom: esp.m, lineHeight: 20 },
  fav: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', borderWidth: 1.5, borderColor: cor.borda, borderRadius: raio.pill, paddingHorizontal: 14, paddingVertical: 8, marginBottom: esp.m },
  favTexto: { color: cor.texto, fontFamily: fonte.negrito, fontSize: 13 },
  filtro: { color: cor.limao, fontFamily: fonte.negrito, fontSize: 13 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: cor.card, borderRadius: raio.m, borderWidth: 1, borderColor: cor.borda, padding: 10 },
  thumb: { width: 64, height: 64, borderRadius: 14, overflow: 'hidden', backgroundColor: '#E9E9E9' },
  nome: { color: cor.texto, fontFamily: fonte.negrito, fontSize: 15 },
  sub: { color: cor.textoSuave, fontFamily: fonte.media, fontSize: 12, marginTop: 2 },
});
