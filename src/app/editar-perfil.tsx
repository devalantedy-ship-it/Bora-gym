import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { Avatar, Botao, Campo, T, Tela, voltar } from '../components/ui';
import { iniciaisDe } from '../data/mock';
import { useApp } from '../store/app';
import { esp } from '../theme';

export default function EditarPerfil() {
  const { nome, perfil, atualizarNome } = useApp();
  const [novo, setNovo] = useState(nome);

  return (
    <Tela semTopo>
      <View style={{ alignItems: 'center', marginVertical: esp.xl }}>
        <Avatar iniciais={iniciaisDe(novo || 'BO')} tam={88} />
      </View>
      <Campo rotulo="Seu nome" value={novo} onChangeText={setNovo} placeholder="Como a turma te chama" autoFocus />
      <Campo rotulo="E-mail" value={perfil?.email ?? ''} editable={false} style={{ opacity: 0.6 }} />
      <T fraco tam={13} style={{ marginBottom: esp.xl }}>O e-mail é o seu login e não muda por aqui.</T>
      <Botao titulo="Salvar" onPress={() => { atualizarNome(novo.trim()); voltar(); }} desativado={!novo.trim()} />
    </Tela>
  );
}
