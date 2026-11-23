// Conversa personal ↔ aluno. id = id do aluno (ou "eu" quando quem abre é o aluno logado).
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toque } from '../../components/ui';
import { quandoTexto } from '../../data/mock';
import { useApp } from '../../store/app';
import { cor, esp, fonte, LARGURA_MAX, raio } from '../../theme';

const RAPIDAS = { personal: ['Bora treinar hoje? 💪', 'Mandou bem no treino!', 'Sentimos sua falta 👀'], aluno: ['Treino pago ✅', 'Posso trocar um exercício?', 'Tô com dor no ombro'] };

export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mensagens, enviarMensagem, papel, alunos } = useApp();
  const [texto, setTexto] = useState('');
  const rolagem = useRef<ComponentRef<typeof ScrollView>>(null);
  const eu = papel === 'personal' ? 'personal' : 'aluno';
  const thread = id ?? 'eu';
  const lista = mensagens[thread] ?? [];
  const titulo = papel === 'personal' ? alunos.find((a) => a.id === thread)?.nome ?? 'Aluno' : 'Seu personal';

  useEffect(() => {
    setTimeout(() => rolagem.current?.scrollToEnd({ animated: true }), 50);
  }, [lista.length]);

  const enviar = (t = texto) => {
    if (!t.trim()) return;
    toque();
    enviarMensagem(thread, eu, t.trim());
    setTexto('');
  };

  return (
    <SafeAreaView style={s.tela} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: titulo }} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} keyboardVerticalOffset={90}>
        <ScrollView ref={rolagem} contentContainerStyle={s.miolo}>
          {lista.length === 0 ? <Text style={s.vazio}>Comece a conversa. Tudo que vocês combinarem fica aqui.</Text> : null}
          {lista.map((m) => {
            const minha = m.de === eu;
            return (
              <View key={m.id} style={[s.balao, minha ? s.minha : s.dele]}>
                <Text style={[s.texto, minha && { color: cor.sobreLimao }]}>{m.texto}</Text>
                <Text style={[s.hora, minha && { color: 'rgba(17,17,17,0.6)' }]}>{quandoTexto(m.quando)}</Text>
              </View>
            );
          })}
        </ScrollView>
        <View style={s.rapidas}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: esp.l }}>
            {RAPIDAS[eu].map((r) => (
              <Pressable key={r} onPress={() => enviar(r)} style={s.rapida}><Text style={s.rapidaTexto}>{r}</Text></Pressable>
            ))}
          </ScrollView>
        </View>
        <View style={s.barra}>
          <TextInput value={texto} onChangeText={setTexto} placeholder="Mensagem" placeholderTextColor={cor.textoFraco} style={s.campo} multiline onSubmitEditing={() => enviar()} />
          <Pressable onPress={() => enviar()} style={[s.enviar, !texto.trim() && { opacity: 0.4 }]} accessibilityRole="button" accessibilityLabel="Enviar">
            <Ionicons name="arrow-up" size={22} color={cor.sobreLimao} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cor.fundo },
  miolo: { width: '100%', maxWidth: LARGURA_MAX, alignSelf: 'center', padding: esp.l, gap: 8, flexGrow: 1 },
  vazio: { color: cor.textoSuave, fontFamily: fonte.media, fontSize: 14, textAlign: 'center', marginTop: esp.xxl },
  balao: { maxWidth: '82%', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10 },
  minha: { alignSelf: 'flex-end', backgroundColor: cor.limao, borderBottomRightRadius: 6 },
  dele: { alignSelf: 'flex-start', backgroundColor: cor.card, borderWidth: 1, borderColor: cor.borda, borderBottomLeftRadius: 6 },
  texto: { color: cor.texto, fontFamily: fonte.media, fontSize: 15, lineHeight: 20 },
  hora: { color: cor.textoFraco, fontFamily: fonte.media, fontSize: 11, marginTop: 4, alignSelf: 'flex-end' },
  rapidas: { paddingVertical: 8 },
  rapida: { borderWidth: 1.5, borderColor: cor.borda, borderRadius: raio.pill, paddingHorizontal: 14, paddingVertical: 8 },
  rapidaTexto: { color: cor.texto, fontFamily: fonte.negrito, fontSize: 13 },
  barra: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: esp.l, paddingVertical: 10, borderTopWidth: 1, borderTopColor: cor.borda, width: '100%', maxWidth: LARGURA_MAX, alignSelf: 'center' },
  campo: { flex: 1, minHeight: 46, maxHeight: 120, borderRadius: 23, backgroundColor: cor.card, borderWidth: 1, borderColor: cor.borda, paddingHorizontal: 16, paddingTop: 12, color: cor.texto, fontFamily: fonte.media, fontSize: 15 },
  enviar: { width: 46, height: 46, borderRadius: 23, backgroundColor: cor.limao, alignItems: 'center', justifyContent: 'center' },
});
