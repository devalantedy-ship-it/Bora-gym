import { ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Inter_900Black, useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from '../store/app';
import { cor, fonte } from '../theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

const modal = (title: string) => ({ presentation: 'modal' as const, headerShown: true, title });

function Navegacao() {
  const { pronto } = useApp();
  const [fontes] = useFonts({ Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Inter_900Black, ArchivoBlack_400Regular });
  const tudoPronto = pronto && fontes;

  useEffect(() => {
    if (tudoPronto) SplashScreen.hideAsync().catch(() => {});
  }, [tudoPronto]);

  if (!tudoPronto) return <View style={{ flex: 1, backgroundColor: cor.fundo }} />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: cor.fundo },
        headerStyle: { backgroundColor: cor.fundo },
        headerTintColor: cor.texto,
        headerTitleStyle: { fontFamily: fonte.negrito },
        headerShadowVisible: false,
        headerBackTitle: 'Voltar',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="entrar" options={{ animation: 'fade' }} />
      <Stack.Screen name="aluno" />
      <Stack.Screen name="personal" />
      <Stack.Screen name="exercicio/[id]" options={{ headerShown: true, title: '' }} />
      <Stack.Screen name="detalhe-aluno/[id]" options={{ headerShown: true, title: '' }} />
      <Stack.Screen name="treino-ao-vivo" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="checkin" options={modal('Check-in do dia')} />
      <Stack.Screen name="novo-treino" options={modal('Treino')} />
      <Stack.Screen name="novo-exercicio" options={modal('Exercício')} />
      <Stack.Screen name="desafio" options={modal('Desafio da turma')} />
      <Stack.Screen name="convidar" options={modal('Convidar aluno')} />
      <Stack.Screen name="editar-perfil" options={modal('Editar perfil')} />
      <Stack.Screen name="privacidade" options={{ headerShown: true, title: 'Privacidade' }} />
      <Stack.Screen name="historico" options={{ headerShown: true, title: 'Histórico de treinos' }} />
      <Stack.Screen name="medidas" options={{ headerShown: true, title: 'Medidas e peso' }} />
      <Stack.Screen name="relatorio" options={{ headerShown: true, title: 'Relatório do mês' }} />
      <Stack.Screen name="chat/[id]" options={{ headerShown: true, title: 'Conversa' }} />
      <Stack.Screen name="planos" options={{ headerShown: true, title: 'Planos prontos' }} />
      <Stack.Screen name="biblioteca/index" options={{ headerShown: true, title: 'Biblioteca de exercícios' }} />
      <Stack.Screen name="biblioteca/[id]" options={{ headerShown: true, title: '' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="light" />
        <Navegacao />
      </AppProvider>
    </SafeAreaProvider>
  );
}
