// Barra de abas: no iPhone e no Android usa a barra NATIVA do sistema (vidro no iOS,
// respeita a área segura); no navegador usa a barra em JavaScript.
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';
import type { ComponentProps } from 'react';
import { Platform } from 'react-native';
import { cor, fonte } from '../theme';

type Icone = ComponentProps<typeof Ionicons>['name'];
export type Aba = { nome: string; titulo: string; icone: Icone };

// Ícone equivalente no iOS (SF Symbols) e no Android (Material Symbols)
const NATIVO: Record<string, { sf: string; sfOn: string; md: string }> = {
  barbell: { sf: 'dumbbell', sfOn: 'dumbbell.fill', md: 'fitness_center' },
  people: { sf: 'person.2', sfOn: 'person.2.fill', md: 'group' },
  flame: { sf: 'flame', sfOn: 'flame.fill', md: 'local_fire_department' },
  trophy: { sf: 'trophy', sfOn: 'trophy.fill', md: 'emoji_events' },
  person: { sf: 'person.crop.circle', sfOn: 'person.crop.circle.fill', md: 'account_circle' },
  'stats-chart': { sf: 'chart.bar', sfOn: 'chart.bar.fill', md: 'bar_chart' },
};

export function Abas({ abas }: { abas: Aba[] }) {
  if (Platform.OS !== 'web') {
    return (
      <NativeTabs tintColor={cor.limao} labelStyle={{ fontFamily: fonte.negrito }} minimizeBehavior="onScrollDown">
        {abas.map((a) => {
          const n = NATIVO[a.icone] ?? NATIVO.person;
          return (
            <NativeTabs.Trigger key={a.nome} name={a.nome}>
              <NativeTabs.Trigger.Label>{a.titulo}</NativeTabs.Trigger.Label>
              <NativeTabs.Trigger.Icon sf={{ default: n.sf as never, selected: n.sfOn as never }} md={n.md as never} />
            </NativeTabs.Trigger>
          );
        })}
      </NativeTabs>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cor.limao,
        tabBarInactiveTintColor: cor.textoFraco,
        tabBarStyle: { backgroundColor: '#0E0E10', borderTopColor: cor.borda },
        tabBarLabelStyle: { fontFamily: fonte.negrito, fontSize: 11 },
        sceneStyle: { backgroundColor: cor.fundo },
      }}
    >
      {abas.map((a) => (
        <Tabs.Screen
          key={a.nome}
          name={a.nome}
          options={{
            title: a.titulo,
            tabBarIcon: ({ color, focused }) => <Ionicons name={(focused ? a.icone : `${a.icone}-outline`) as Icone} size={24} color={color as string} />,
          }}
        />
      ))}
    </Tabs>
  );
}
