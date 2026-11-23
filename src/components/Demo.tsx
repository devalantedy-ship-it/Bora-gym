// Demonstração animada de um exercício: alterna as fotos de posição inicial e final.
// Fotos do free-exercise-db (domínio público).
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { cor } from '../theme';

export const BASE_IMG = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
export const urlImg = (caminho: string) => (caminho.startsWith('http') ? caminho : BASE_IMG + caminho);

export function Demo({ imagens, style, animar = true, intervalo = 900 }: { imagens: string[]; style?: StyleProp<ViewStyle>; animar?: boolean; intervalo?: number }) {
  const fade = useRef(new Animated.Value(0)).current;
  const [carregou, setCarregou] = useState(false);
  const duas = imagens.length > 1 && animar;

  useEffect(() => {
    if (!duas) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(intervalo),
        Animated.timing(fade, { toValue: 1, duration: 260, useNativeDriver: Platform.OS !== 'web' }),
        Animated.delay(intervalo),
        Animated.timing(fade, { toValue: 0, duration: 260, useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [duas, fade, intervalo]);

  return (
    <View style={[s.caixa, style]}>
      <Image source={{ uri: urlImg(imagens[0]) }} style={s.img} resizeMode="cover" onLoad={() => setCarregou(true)} />
      {duas ? <Animated.Image source={{ uri: urlImg(imagens[1]) }} style={[s.img, { opacity: fade }]} resizeMode="cover" /> : null}
      {!carregou ? <View style={s.carregando}><ActivityIndicator color={cor.limao} /></View> : null}
    </View>
  );
}

const s = StyleSheet.create({
  caixa: { overflow: 'hidden', backgroundColor: '#E9E9E9' },
  img: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  carregando: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: cor.cardAlto },
});
