import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import { Selo } from '../components/Logo';
import { Botao, Card, Kicker, T, Tela } from '../components/ui';
import { useApp } from '../store/app';
import { cor, esp, fonte, raio } from '../theme';

export default function Convidar() {
  const { perfil, marcarConvite } = useApp();
  const codigo = perfil?.codigoTurma ?? 'BORA-0000';
  const [copiado, setCopiado] = useState(false);
  const mensagem = `Bora treinar comigo no BORA! 💪\nBaixa o app e entra com o código da minha turma: ${codigo}`;

  return (
    <Tela semTopo>
      <View style={{ alignItems: 'center', marginVertical: esp.xl, gap: esp.m }}>
        <Selo tam={72} />
        <T tam={22} peso="extra" style={{ textAlign: 'center' }}>Chama a turma pro BORA</T>
        <T fraco tam={15} style={{ textAlign: 'center' }}>O aluno baixa o app, escolhe "Sou aluno" e coloca este código. Pronto: ele já cai nos seus treinos.</T>
      </View>

      <Card style={{ alignItems: 'center', marginBottom: esp.l }}>
        <Kicker>Código da sua turma</Kicker>
        <Text style={s.codigo} selectable>{codigo}</Text>
      </Card>

      <View style={{ gap: esp.s }}>
        <Botao titulo="Enviar convite" icone={<Ionicons name="share-social" size={20} color={cor.sobreLimao} />} onPress={() => { marcarConvite(); Share.share({ message: mensagem }).catch(() => {}); }} />
        <Botao
          titulo={copiado ? 'Código copiado ✓' : 'Copiar código'}
          tipo="escuro"
          icone={<Ionicons name="copy-outline" size={18} color={cor.texto} />}
          onPress={async () => { marcarConvite(); await Clipboard.setStringAsync(codigo).catch(() => {}); setCopiado(true); }}
        />
      </View>
    </Tela>
  );
}

const s = StyleSheet.create({
  codigo: { color: cor.limao, fontFamily: fonte.display, fontSize: 40, letterSpacing: 2, marginTop: 6, padding: 8, borderRadius: raio.m },
});
