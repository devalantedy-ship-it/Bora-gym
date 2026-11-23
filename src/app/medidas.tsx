import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Composicao } from '../components/Composicao';
import { GraficoLinha } from '../components/Grafico';
import { Botao, Campo, Card, Kicker, Linha, T, Tela } from '../components/ui';
import { useApp } from '../store/app';
import { cor, esp, fonte, raio } from '../theme';

const CAMPOS = [
  { k: 'peso', l: 'Peso', u: 'kg' },
  { k: 'cintura', l: 'Cintura', u: 'cm' },
  { k: 'peito', l: 'Peito', u: 'cm' },
  { k: 'braco', l: 'Braço', u: 'cm' },
  { k: 'coxa', l: 'Coxa', u: 'cm' },
] as const;
type Chave = (typeof CAMPOS)[number]['k'];

export default function Medidas() {
  const { medidas, adicionarMedida } = useApp();
  const [novo, setNovo] = useState(false);
  const [valores, setValores] = useState<Record<Chave, string>>({ peso: '', cintura: '', peito: '', braco: '', coxa: '' });
  const [foto, setFoto] = useState<string>();
  const ultima = medidas[medidas.length - 1];
  const primeira = medidas[0];
  const fotos = medidas.filter((m) => m.fotoUri);

  const salvar = () => {
    const n = (v: string) => (v.trim() ? parseFloat(v.replace(',', '.')) : undefined);
    adicionarMedida({ peso: n(valores.peso), cintura: n(valores.cintura), peito: n(valores.peito), braco: n(valores.braco), coxa: n(valores.coxa), fotoUri: foto });
    setNovo(false);
    setValores({ peso: '', cintura: '', peito: '', braco: '', coxa: '' });
    setFoto(undefined);
  };

  const escolherFoto = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: true, aspect: [3, 4] });
    if (!r.canceled) setFoto(r.assets[0].uri);
  };

  return (
    <Tela semTopo>
      <Card style={{ marginTop: esp.s, marginBottom: esp.l }}>
        <Linha style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <Text style={s.k}>PESO ATUAL</Text>
            <Text style={s.grande}>{ultima?.peso ? String(ultima.peso).replace('.', ',') : '—'}<Text style={s.unid}> kg</Text></Text>
          </View>
          {ultima?.peso && primeira?.peso && medidas.length > 1 ? (
            <View style={[s.dif, { backgroundColor: ultima.peso <= primeira.peso ? cor.limaoEscuro : '#3D1E1E' }]}>
              <Text style={[s.difTexto, { color: ultima.peso <= primeira.peso ? cor.limao : cor.perigo }]}>
                {ultima.peso <= primeira.peso ? '↓' : '↑'} {Math.abs(ultima.peso - primeira.peso).toFixed(1).replace('.', ',')} kg
              </Text>
            </View>
          ) : null}
        </Linha>
        <View style={{ marginTop: esp.m }}>
          <GraficoLinha pontos={medidas.filter((m) => m.peso).map((m) => ({ data: m.data, valor: m.peso! }))} altura={140} />
        </View>
      </Card>

      <Composicao peso={ultima?.peso} />

      <Kicker>Medidas</Kicker>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: esp.s, marginBottom: esp.l }}>
        {CAMPOS.slice(1).map((c) => {
          const atual = ultima?.[c.k];
          const antes = primeira?.[c.k];
          return (
            <View key={c.k} style={s.medida}>
              <Text style={s.k}>{c.l.toUpperCase()}</Text>
              <Text style={s.medidaValor}>{atual ? String(atual).replace('.', ',') : '—'}<Text style={s.unid}> {c.u}</Text></Text>
              {atual && antes && medidas.length > 1 && atual !== antes ? <T fraco tam={12}>{atual > antes ? '+' : ''}{(atual - antes).toFixed(1).replace('.', ',')} desde o início</T> : null}
            </View>
          );
        })}
      </View>

      {fotos.length ? (
        <>
          <Kicker>Fotos de progresso</Kicker>
          <Linha style={{ gap: esp.s, marginBottom: esp.l, flexWrap: 'wrap' }}>
            {fotos.map((m) => (
              <View key={m.id} style={s.foto}>
                <Image source={{ uri: m.fotoUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
                <Text style={s.fotoData}>{new Date(m.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</Text>
              </View>
            ))}
          </Linha>
        </>
      ) : null}

      {novo ? (
        <Card>
          <T tam={17} peso="extra" style={{ marginBottom: esp.m }}>Nova medição</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: esp.s }}>
            {CAMPOS.map((c) => (
              <View key={c.k} style={{ flexBasis: '47%', flexGrow: 1 }}>
                <Campo rotulo={`${c.l} (${c.u})`} value={valores[c.k]} onChangeText={(v) => setValores({ ...valores, [c.k]: v })} keyboardType="decimal-pad" placeholder={ultima?.[c.k] ? String(ultima[c.k]) : '0'} />
              </View>
            ))}
          </View>
          <Pressable onPress={escolherFoto} style={s.addFoto} accessibilityRole="button">
            {foto ? <Image source={{ uri: foto }} style={StyleSheet.absoluteFill} contentFit="cover" /> : <><Ionicons name="camera-outline" size={22} color={cor.textoSuave} /><T fraco tam={13}>Foto de progresso (opcional)</T></>}
          </Pressable>
          <Botao titulo="Salvar medição" onPress={salvar} desativado={!Object.values(valores).some((v) => v.trim())} />
        </Card>
      ) : (
        <Botao titulo="Registrar medição de hoje" icone={<Ionicons name="add" size={20} color={cor.sobreLimao} />} onPress={() => setNovo(true)} />
      )}
    </Tela>
  );
}

const s = StyleSheet.create({
  k: { color: cor.textoFraco, fontFamily: fonte.negrito, fontSize: 11, letterSpacing: 1 },
  grande: { color: cor.texto, fontFamily: fonte.display, fontSize: 44, letterSpacing: -1 },
  unid: { color: cor.textoSuave, fontFamily: fonte.negrito, fontSize: 16 },
  dif: { borderRadius: raio.pill, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 10 },
  difTexto: { fontFamily: fonte.extra, fontSize: 14 },
  medida: { flexBasis: '47%', flexGrow: 1, backgroundColor: cor.card, borderRadius: raio.m, borderWidth: 1, borderColor: cor.borda, padding: 14 },
  medidaValor: { color: cor.texto, fontFamily: fonte.display, fontSize: 24, marginTop: 4 },
  foto: { width: 96, height: 128, borderRadius: 14, overflow: 'hidden', backgroundColor: cor.card },
  fotoData: { position: 'absolute', bottom: 6, left: 8, color: '#fff', fontFamily: fonte.extra, fontSize: 12 },
  addFoto: { height: 90, borderRadius: raio.m, borderWidth: 1, borderColor: cor.borda, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: esp.l, overflow: 'hidden' },
});
