// Peças visuais do BORA, usadas em todas as telas.
import { useEffect, useRef, type ReactNode } from 'react';
import { Alert, Animated, Easing, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type StyleProp, type TextInputProps, type TextStyle, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { cor, esp, fonte, LARGURA_MAX, raio } from '../theme';

export function toque() {
  if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

// Confirmação que funciona no celular e no navegador.
export function confirmar(titulo: string, msg: string, ok = 'Confirmar'): Promise<boolean> {
  if (Platform.OS === 'web') return Promise.resolve(window.confirm(`${titulo}\n\n${msg}`));
  return new Promise((res) =>
    Alert.alert(titulo, msg, [
      { text: 'Cancelar', style: 'cancel', onPress: () => res(false) },
      { text: ok, style: 'destructive', onPress: () => res(true) },
    ]),
  );
}

export function avisar(titulo: string, msg: string) {
  if (Platform.OS === 'web') window.alert(`${titulo}\n\n${msg}`);
  else Alert.alert(titulo, msg);
}

// Entrada suave de cada tela (sobe 12px e aparece).
function Entrada({ children }: { children: ReactNode }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }).start();
  }, [v]);
  return (
    <Animated.View style={{ flexGrow: 1, opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}>
      {children}
    </Animated.View>
  );
}

// Tela com rolagem, área segura e largura máxima (fica bonito no tablet e no navegador).
export function Tela({ children, rolar = true, semTopo = false }: { children: ReactNode; rolar?: boolean; semTopo?: boolean }) {
  const corpo = <Entrada><View style={s.miolo}>{children}</View></Entrada>;
  return (
    <SafeAreaView style={s.tela} edges={semTopo ? ['left', 'right'] : ['top', 'left', 'right']}>
      {rolar ? (
        <ScrollView contentContainerStyle={s.rolagem} showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled">
          {corpo}
        </ScrollView>
      ) : (
        corpo
      )}
    </SafeAreaView>
  );
}

export function Titulo({ branco, limao, sub }: { branco: string; limao?: string; sub?: string }) {
  return (
    <View style={{ marginBottom: esp.l }}>
      <Text style={s.titulo} accessibilityRole="header" numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.75}>
        {branco}
        {limao ? <Text style={{ color: cor.limao }}> {limao}</Text> : null}
      </Text>
      {sub ? <Text style={s.sub}>{sub}</Text> : null}
    </View>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <Text style={s.kicker}>{children}</Text>;
}

export function T({ children, style, fraco, tam = 16, peso = 'regular' }: { children: ReactNode; style?: StyleProp<TextStyle>; fraco?: boolean; tam?: number; peso?: keyof typeof fonte }) {
  return <Text style={[{ color: fraco ? cor.textoSuave : cor.texto, fontSize: tam, fontFamily: fonte[peso] }, style]}>{children}</Text>;
}

export function Card({ children, style, onPress, destaque }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; destaque?: boolean }) {
  const estilo = [s.card, destaque && { backgroundColor: cor.limao, borderColor: cor.limao }, style];
  if (!onPress) return <View style={estilo}>{children}</View>;
  return (
    <Pressable onPress={() => { toque(); onPress(); }} style={({ pressed }) => [estilo, pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }]} accessibilityRole="button">
      {children}
    </Pressable>
  );
}

export function Botao({ titulo, onPress, tipo = 'limao', icone, desativado }: { titulo: string; onPress: () => void; tipo?: 'limao' | 'escuro' | 'contorno'; icone?: ReactNode; desativado?: boolean }) {
  const fundo = tipo === 'limao' ? cor.limao : tipo === 'escuro' ? cor.cardAlto : 'transparent';
  const corTexto = tipo === 'limao' ? cor.sobreLimao : cor.texto;
  return (
    <Pressable
      disabled={desativado}
      onPress={() => { toque(); onPress(); }}
      accessibilityRole="button"
      style={({ pressed }) => [s.botao, { backgroundColor: fundo, opacity: desativado ? 0.4 : pressed ? 0.85 : 1 }, tipo === 'contorno' && { borderWidth: 1.5, borderColor: cor.borda }]}
    >
      {icone}
      <Text style={[s.botaoTexto, { color: corTexto }]}>{titulo}</Text>
    </Pressable>
  );
}

export function Pill({ children, ativo }: { children: ReactNode; ativo?: boolean }) {
  return (
    <View style={[s.pill, ativo && { backgroundColor: cor.limao }]}>
      {ativo ? null : <View style={s.pillPonto} />}
      <Text style={[s.pillTexto, ativo && { color: cor.sobreLimao }]}>{children}</Text>
    </View>
  );
}

export function Avatar({ iniciais, destaque, tam = 44 }: { iniciais: string; destaque?: boolean; tam?: number }) {
  return (
    <View style={{ width: tam, height: tam, borderRadius: tam / 2, backgroundColor: destaque ? cor.sobreLimao : cor.cardAlto, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: destaque ? cor.limao : cor.textoSuave, fontFamily: fonte.extra, fontSize: tam * 0.36 }}>{iniciais}</Text>
    </View>
  );
}

export function Barra({ valor, altura = 8 }: { valor: number; altura?: number }) {
  return (
    <View style={{ height: altura, borderRadius: altura, backgroundColor: cor.cardAlto, overflow: 'hidden' }}>
      <View style={{ width: `${Math.max(0, Math.min(1, valor)) * 100}%`, height: '100%', backgroundColor: cor.limao, borderRadius: altura }} />
    </View>
  );
}

export function Linha({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap: esp.m }, style]}>{children}</View>;
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cor.fundo },
  rolagem: { flexGrow: 1, paddingBottom: Platform.OS === 'web' ? 40 : 120 },
  miolo: { width: '100%', maxWidth: LARGURA_MAX, alignSelf: 'center', paddingHorizontal: esp.xl - 4, paddingTop: esp.l, flexGrow: 1 },
  titulo: { color: cor.texto, fontFamily: fonte.display, fontSize: 30, letterSpacing: -0.6, lineHeight: 38 },
  sub: { color: cor.textoSuave, fontFamily: fonte.regular, fontSize: 15, marginTop: 4 },
  kicker: { color: cor.textoFraco, fontFamily: fonte.negrito, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 },
  card: { backgroundColor: cor.card, borderRadius: raio.g, padding: esp.l + 2, borderWidth: 1, borderColor: cor.borda },
  botao: { height: 56, borderRadius: raio.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 24 },
  botaoTexto: { fontFamily: fonte.extra, fontSize: 16 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', backgroundColor: cor.cardAlto, borderRadius: raio.pill, paddingHorizontal: 14, paddingVertical: 8 },
  pillPonto: { width: 8, height: 8, borderRadius: 4, backgroundColor: cor.limao },
  pillTexto: { color: cor.texto, fontFamily: fonte.negrito, fontSize: 13 },
});

// Campo de texto padrão do BORA.
export function Campo({ rotulo, multilinha, style, ...props }: TextInputProps & { rotulo?: string; multilinha?: boolean }) {
  return (
    <View style={{ marginBottom: esp.l }}>
      {rotulo ? <Kicker>{rotulo}</Kicker> : null}
      <TextInput
        placeholderTextColor={cor.textoFraco}
        multiline={multilinha}
        style={[
          { minHeight: 56, borderRadius: raio.m, backgroundColor: cor.card, borderWidth: 1, borderColor: cor.borda, paddingHorizontal: 18, color: cor.texto, fontFamily: fonte.media, fontSize: 16 },
          multilinha && { minHeight: 110, paddingTop: 16, textAlignVertical: 'top' },
          style,
        ]}
        {...props}
      />
    </View>
  );
}

// Volta pra tela anterior; se abriu direto (ex.: link no navegador), vai pro início.
export function voltar() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}
