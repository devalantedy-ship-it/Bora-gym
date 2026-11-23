import { Text, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { cor, fonte } from '../theme';

export function Selo({ tam = 72 }: { tam?: number }) {
  return (
    <View style={{ width: tam, height: tam, borderRadius: tam * 0.27, backgroundColor: cor.limao, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={tam * 0.66} height={tam * 0.66} viewBox="0 0 100 100">
        {[[18, 50, 82, 50], [28, 32, 28, 68], [72, 32, 72, 68], [14, 40, 14, 60], [86, 40, 86, 60]].map(([x1, y1, x2, y2], i) => (
          <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0A0A0A" strokeWidth={10} strokeLinecap="round" />
        ))}
      </Svg>
    </View>
  );
}

export function Marca({ tam = 56 }: { tam?: number }) {
  return (
    <Text style={{ color: cor.texto, fontFamily: fonte.display, fontSize: tam, letterSpacing: -tam * 0.04 }}>
      BORA<Text style={{ color: cor.limao }}>.</Text>
    </Text>
  );
}
