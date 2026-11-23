// Peças visuais da versão 2: anel de progresso, cartão com foto, botão flutuante, passos, busca.
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps, ReactNode } from 'react';
import { Image as RNImage, Platform, Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { Midia } from '../data/mock';
import { cor, esp, fonte, raio } from '../theme';
import { toque } from './ui';

type Icone = ComponentProps<typeof Ionicons>['name'];

export function Anel({ valor, tam = 84, grossura = 9, children }: { valor: number; tam?: number; grossura?: number; children?: ReactNode }) {
  const r = (tam - grossura) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, valor));
  return (
    <View style={{ width: tam, height: tam, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={tam} height={tam} style={StyleSheet.absoluteFill}>
        <Circle cx={tam / 2} cy={tam / 2} r={r} stroke="rgba(255,255,255,0.15)" strokeWidth={grossura} fill="none" />
        <Circle
          cx={tam / 2}
          cy={tam / 2}
          r={r}
          stroke={cor.limao}
          strokeWidth={grossura}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - v)}
          transform={`rotate(-90 ${tam / 2} ${tam / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
}

// Cartão grande com foto de fundo e degradê escuro por baixo do texto.
export function CartaoFoto({ foto, children, altura = 260, onPress, style }: { foto: Midia; children: ReactNode; altura?: number; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  const corpo = (
    <>
      <RNImage source={foto} style={s.fundo} resizeMode="cover" />
      <LinearGradient colors={['rgba(10,10,10,0)', 'rgba(10,10,10,0.35)', 'rgba(10,10,10,0.9)']} locations={[0.15, 0.5, 1]} style={s.fundo} pointerEvents="none" />
      <View style={{ flex: 1, padding: esp.xl - 4, justifyContent: 'flex-end' }}>{children}</View>
    </>
  );
  const base = [s.foto, { minHeight: altura }, style];
  if (!onPress) return <View style={base}>{corpo}</View>;
  return (
    <Pressable onPress={() => { toque(); onPress(); }} style={({ pressed }) => [base, pressed && { transform: [{ scale: 0.99 }] }]} accessibilityRole="button">
      {corpo}
    </Pressable>
  );
}

// Botão redondo "+" que fica flutuando em cima da barra de abas.
export function BotaoMais({ onPress, rotulo = 'Criar' }: { onPress: () => void; rotulo?: string }) {
  if (Platform.OS !== 'web') return null; // no celular a barra nativa fica embaixo; as ações rápidas fazem esse papel
  return (
    <Pressable onPress={() => { toque(); onPress(); }} style={({ pressed }) => [s.mais, pressed && { transform: [{ scale: 0.94 }] }]} accessibilityRole="button" accessibilityLabel={rotulo}>
      <Ionicons name="add" size={30} color={cor.sobreLimao} />
    </Pressable>
  );
}

// Barra de passos de um assistente (1 de 3, 2 de 3...).
export function Passos({ atual, total, titulos }: { atual: number; total: number; titulos: string[] }) {
  return (
    <View style={{ marginBottom: esp.xl }}>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {Array.from({ length: total }, (_, i) => (
          <View key={i} style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: i <= atual ? cor.limao : cor.cardAlto }} />
        ))}
      </View>
      <Text style={s.passoTexto}>Passo {atual + 1} de {total} · <Text style={{ color: cor.texto }}>{titulos[atual]}</Text></Text>
    </View>
  );
}

export function Busca({ valor, onChange, placeholder }: { valor: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <View style={s.busca}>
      <Ionicons name="search" size={18} color={cor.textoFraco} />
      <TextInput value={valor} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={cor.textoFraco} style={s.buscaInput} autoCorrect={false} />
      {valor ? (
        <Pressable onPress={() => onChange('')} hitSlop={10} accessibilityLabel="Limpar busca">
          <Ionicons name="close-circle" size={18} color={cor.textoFraco} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function Chips<V extends string>({ opcoes, valor, onChange }: { opcoes: V[]; valor: V; onChange: (v: V) => void }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {opcoes.map((o) => (
        <Pressable key={o} onPress={() => { toque(); onChange(o); }} style={[s.chip, valor === o && { backgroundColor: cor.limao, borderColor: cor.limao }]} accessibilityRole="button" accessibilityState={{ selected: valor === o }}>
          <Text style={[s.chipTexto, valor === o && { color: cor.sobreLimao }]}>{o}</Text>
        </Pressable>
      ))}
    </View>
  );
}

// Bloco de ação rápida (ícone grande + título + subtítulo).
export function Acao({ icone, titulo, sub, onPress, destaque }: { icone: Icone; titulo: string; sub: string; onPress: () => void; destaque?: boolean }) {
  return (
    <Pressable onPress={() => { toque(); onPress(); }} style={({ pressed }) => [s.acao, destaque && { backgroundColor: cor.limao, borderColor: cor.limao }, pressed && { transform: [{ scale: 0.97 }] }]} accessibilityRole="button">
      <View style={[s.acaoIcone, destaque && { backgroundColor: cor.sobreLimao }]}>
        <Ionicons name={icone} size={22} color={cor.limao} />
      </View>
      <Text style={[s.acaoTitulo, destaque && { color: cor.sobreLimao }]}>{titulo}</Text>
      <Text style={[s.acaoSub, destaque && { color: cor.sobreLimao, opacity: 0.7 }]}>{sub}</Text>
    </Pressable>
  );
}

// Estado vazio com ícone, texto e um botão.
export function Vazio({ icone, titulo, texto, acao }: { icone: Icone; titulo: string; texto: string; acao?: ReactNode }) {
  return (
    <View style={s.vazio}>
      <View style={s.vazioIcone}><Ionicons name={icone} size={30} color={cor.limao} /></View>
      <Text style={s.vazioTitulo}>{titulo}</Text>
      <Text style={s.vazioTexto}>{texto}</Text>
      {acao ? <View style={{ alignSelf: 'stretch', marginTop: esp.l }}>{acao}</View> : null}
    </View>
  );
}

const s = StyleSheet.create({
  foto: { borderRadius: raio.g + 4, overflow: 'hidden', backgroundColor: cor.card, position: 'relative' },
  fundo: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  mais: { position: 'absolute', right: 20, bottom: 20, width: 62, height: 62, borderRadius: 31, backgroundColor: cor.limao, alignItems: 'center', justifyContent: 'center', shadowColor: cor.limao, shadowOpacity: 0.45, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 8 },
  passoTexto: { color: cor.textoSuave, fontFamily: fonte.negrito, fontSize: 13, marginTop: 10 },
  busca: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 50, borderRadius: raio.pill, backgroundColor: cor.card, borderWidth: 1, borderColor: cor.borda, paddingHorizontal: 16, marginBottom: esp.m },
  buscaInput: { flex: 1, color: cor.texto, fontFamily: fonte.media, fontSize: 15, height: '100%' },
  chip: { borderWidth: 1.5, borderColor: cor.borda, borderRadius: raio.pill, paddingHorizontal: 14, paddingVertical: 8 },
  chipTexto: { color: cor.textoSuave, fontFamily: fonte.negrito, fontSize: 13 },
  acao: { flexGrow: 1, flexBasis: '45%', backgroundColor: cor.card, borderRadius: raio.g, borderWidth: 1, borderColor: cor.borda, padding: esp.l, gap: 6 },
  acaoIcone: { width: 44, height: 44, borderRadius: 14, backgroundColor: cor.cardAlto, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  acaoTitulo: { color: cor.texto, fontFamily: fonte.extra, fontSize: 16 },
  acaoSub: { color: cor.textoSuave, fontFamily: fonte.regular, fontSize: 13, lineHeight: 18 },
  vazio: { alignItems: 'center', backgroundColor: cor.card, borderRadius: raio.g, borderWidth: 1, borderColor: cor.borda, borderStyle: 'dashed', padding: esp.xl },
  vazioIcone: { width: 64, height: 64, borderRadius: 20, backgroundColor: cor.cardAlto, alignItems: 'center', justifyContent: 'center', marginBottom: esp.m },
  vazioTitulo: { color: cor.texto, fontFamily: fonte.extra, fontSize: 18, textAlign: 'center' },
  vazioTexto: { color: cor.textoSuave, fontFamily: fonte.regular, fontSize: 14, textAlign: 'center', marginTop: 6, lineHeight: 20 },
});
