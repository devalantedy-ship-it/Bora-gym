// Gráfico de linha simples (evolução de carga / 1RM / peso).
import { useState } from 'react';
import { Text, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';
import { cor, fonte } from '../theme';

type Ponto = { data: string; valor: number };

export function GraficoLinha({ pontos, unidade = 'kg', altura = 170 }: { pontos: Ponto[]; unidade?: string; altura?: number }) {
  const [largura, setLargura] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setLargura(e.nativeEvent.layout.width);

  if (pontos.length < 2) {
    return (
      <View style={{ height: altura, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: cor.textoSuave, fontFamily: fonte.media, fontSize: 14, textAlign: 'center' }}>
          Faz esse exercício mais uma vez pra ver o gráfico de evolução.
        </Text>
      </View>
    );
  }

  const valores = pontos.map((p) => p.valor);
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const faixa = Math.max(1, max - min);
  const padY = 18;
  const altGrafico = altura - 34;
  const x = (i: number) => (largura - 12) * (i / (pontos.length - 1)) + 6;
  const y = (v: number) => padY + (altGrafico - padY * 2) * (1 - (v - min) / faixa);
  const linha = pontos.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.valor).toFixed(1)}`).join(' ');
  const area = `${linha} L${x(pontos.length - 1).toFixed(1)},${altGrafico} L${x(0).toFixed(1)},${altGrafico} Z`;
  const ultimo = pontos[pontos.length - 1];
  const dataCurta = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  return (
    <View onLayout={onLayout} style={{ height: altura }}>
      {largura > 0 ? (
        <>
          <Svg width={largura} height={altGrafico}>
            <Defs>
              <LinearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={cor.limao} stopOpacity={0.35} />
                <Stop offset="1" stopColor={cor.limao} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            {[0.25, 0.5, 0.75].map((f) => (
              <Line key={f} x1={0} x2={largura} y1={altGrafico * f} y2={altGrafico * f} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            ))}
            <Path d={area} fill="url(#g)" />
            <Path d={linha} stroke={cor.limao} strokeWidth={3} fill="none" strokeLinejoin="round" strokeLinecap="round" />
            {pontos.map((p, i) => (
              <Circle key={i} cx={x(i)} cy={y(p.valor)} r={i === pontos.length - 1 ? 6 : 3} fill={i === pontos.length - 1 ? cor.limao : cor.fundo} stroke={cor.limao} strokeWidth={2} />
            ))}
          </Svg>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ color: cor.textoFraco, fontFamily: fonte.negrito, fontSize: 11 }}>{dataCurta(pontos[0].data)}</Text>
            <Text style={{ color: cor.textoFraco, fontFamily: fonte.negrito, fontSize: 11 }}>
              menor {String(min).replace('.', ',')}{unidade} · maior {String(max).replace('.', ',')}{unidade}
            </Text>
            <Text style={{ color: cor.limao, fontFamily: fonte.extra, fontSize: 11 }}>{dataCurta(ultimo.data)}</Text>
          </View>
        </>
      ) : null}
    </View>
  );
}
