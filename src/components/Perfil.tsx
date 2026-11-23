import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { iniciaisDe } from '../data/mock';
import { useApp } from '../store/app';
import { cor, esp, raio } from '../theme';
import { Marca } from './Logo';
import { Avatar, Botao, Card, confirmar, Kicker, Linha, T, Tela, toque } from './ui';

type Icone = ComponentProps<typeof Ionicons>['name'];

function Opcao({ icone, titulo, onPress, perigo }: { icone: Icone; titulo: string; onPress: () => void; perigo?: boolean }) {
  return (
    <Pressable onPress={() => { toque(); onPress(); }} style={({ pressed }) => [s.opcao, pressed && { opacity: 0.8 }]} accessibilityRole="button">
      <Ionicons name={icone} size={20} color={perigo ? cor.perigo : cor.textoSuave} />
      <T tam={15} peso="media" style={[{ flex: 1 }, perigo && { color: cor.perigo }]}>{titulo}</T>
      <Ionicons name="chevron-forward" size={18} color={cor.textoFraco} />
    </Pressable>
  );
}

export function Perfil({ extras }: { extras: { icone: Icone; titulo: string; valor: string; onPress?: () => void }[] }) {
  const { nome, papel, perfil, sair, excluirConta } = useApp();

  const excluir = async () => {
    const ok = await confirmar('Excluir sua conta?', 'Seus treinos, check-ins e fotos são apagados para sempre. Não dá pra desfazer.', 'Excluir conta');
    if (!ok) return;
    await excluirConta();
    router.replace('/entrar');
  };

  return (
    <Tela>
      <View style={{ alignItems: 'center', marginVertical: esp.xl, gap: 8 }}>
        <Avatar iniciais={iniciaisDe(nome || 'BO')} tam={88} />
        <T tam={26} peso="extra">{nome || 'Atleta'}</T>
        <T fraco tam={14}>{papel === 'personal' ? 'Personal trainer' : 'Aluno'} · {perfil?.email}</T>
      </View>

      <View style={{ gap: esp.m }}>
        {extras.map((e) => (
          <Card key={e.titulo} style={{ paddingVertical: esp.l }} onPress={e.onPress}>
            <Linha>
              <Ionicons name={e.icone} size={22} color={cor.limao} />
              <T tam={15} peso="media" style={{ flex: 1 }}>{e.titulo}</T>
              <T fraco tam={15} peso="negrito">{e.valor}</T>
            </Linha>
          </Card>
        ))}
      </View>

      <Kicker>{' '}</Kicker>
      <Kicker>Conta</Kicker>
      <View style={s.grupo}>
        <Opcao icone="create-outline" titulo="Editar perfil" onPress={() => router.push('/editar-perfil')} />
        <View style={s.divisor} />
        <Opcao icone="swap-horizontal" titulo={papel === 'personal' ? 'Trocar pra visão do aluno' : 'Trocar pra visão do personal'} onPress={() => { sair(); router.replace('/entrar'); }} />
        <View style={s.divisor} />
        <Opcao icone="shield-checkmark-outline" titulo="Privacidade e termos" onPress={() => router.push('/privacidade')} />
        <View style={s.divisor} />
        <Opcao icone="trash-outline" titulo="Excluir conta" onPress={excluir} perigo />
      </View>

      <View style={{ marginTop: esp.xl }}>
        <Botao titulo="Sair" tipo="contorno" onPress={() => { sair(); router.replace('/entrar'); }} />
      </View>
      <View style={{ alignItems: 'center', marginTop: esp.xxl, opacity: 0.5 }}>
        <Marca tam={22} />
        <T fraco tam={12}>versão 1.0.0</T>
      </View>
    </Tela>
  );
}

const s = StyleSheet.create({
  grupo: { backgroundColor: cor.card, borderRadius: raio.g, borderWidth: 1, borderColor: cor.borda, overflow: 'hidden' },
  opcao: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: esp.l, height: 58 },
  divisor: { height: 1, backgroundColor: cor.borda, marginLeft: 50 },
});
