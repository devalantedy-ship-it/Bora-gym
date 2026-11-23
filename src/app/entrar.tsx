import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartaoFoto } from '../components/extras';
import { Marca, Selo } from '../components/Logo';
import { Botao, Campo, toque } from '../components/ui';
import { img } from '../data/mock';
import { useApp, type Papel } from '../store/app';
import { cor, esp, fonte, LARGURA_MAX } from '../theme';

const PAPEIS: Record<Papel, { titulo: string; sub: string; foto: number; itens: string[] }> = {
  personal: {
    titulo: 'Sou personal',
    sub: 'Monto os treinos e acompanho a turma',
    foto: img.terra,
    itens: ['Monte treinos em 3 passos', 'Grave o vídeo de cada exercício', 'Veja quem treinou e quem sumiu'],
  },
  aluno: {
    titulo: 'Sou aluno',
    sub: 'Vejo meu treino e registro o dia',
    foto: img.kettle,
    itens: ['Treino do dia com vídeo', 'Check-in com foto', 'Ofensiva e ranking da turma'],
  },
};

export default function Entrar() {
  const { entrar } = useApp();
  const [papel, setPapel] = useState<Papel | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');

  const continuar = () => {
    if (!papel) return;
    if (nome.trim().length < 2) return setErro('Coloca seu nome.');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setErro('Coloca um e-mail válido.');
    if (senha.length < 6) return setErro('A senha precisa ter pelo menos 6 caracteres.');
    setErro('');
    entrar({ nome: nome.trim(), email: email.trim(), papel, codigo: codigo.trim() || undefined });
    router.replace(papel === 'aluno' ? '/aluno' : '/personal');
  };

  // Passo 1: escolher como vai usar o app
  if (!papel) {
    return (
      <View style={{ flex: 1, backgroundColor: cor.fundo }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={s.miolo} showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: 'center', gap: 12, marginTop: esp.l, marginBottom: esp.xl }}>
              <Selo tam={64} />
              <Marca tam={46} />
              <Text style={s.slogan}>Como você vai usar o BORA?</Text>
            </View>
            <View style={{ gap: esp.l }}>
              {(['personal', 'aluno'] as Papel[]).map((p) => (
                <CartaoFoto key={p} foto={PAPEIS[p].foto} altura={230} onPress={() => setPapel(p)}>
                  <View style={s.cartaoTopo}>
                    <Text style={s.cartaoTitulo}>{PAPEIS[p].titulo}</Text>
                    <View style={s.seta}><Ionicons name="arrow-forward" size={20} color={cor.sobreLimao} /></View>
                  </View>
                  <Text style={s.cartaoSub}>{PAPEIS[p].sub}</Text>
                  <View style={{ gap: 4, marginTop: 10 }}>
                    {PAPEIS[p].itens.map((i) => (
                      <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Ionicons name="checkmark-circle" size={16} color={cor.limao} />
                        <Text style={s.item}>{i}</Text>
                      </View>
                    ))}
                  </View>
                </CartaoFoto>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // Passo 2: cadastro curto
  const info = PAPEIS[papel];
  return (
    <View style={{ flex: 1, backgroundColor: cor.fundo }}>
      <Image source={info.foto} style={[StyleSheet.absoluteFill, { opacity: 0.35 }]} contentFit="cover" />
      <LinearGradient colors={['rgba(10,10,10,0.3)', 'rgba(10,10,10,0.9)', '#0A0A0A']} locations={[0, 0.35, 0.6]} style={StyleSheet.absoluteFill} pointerEvents="none" />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={s.miolo} keyboardShouldPersistTaps="handled">
            <Pressable onPress={() => { toque(); setPapel(null); setErro(''); }} style={s.voltar} accessibilityRole="button" accessibilityLabel="Voltar e trocar perfil">
              <Ionicons name="chevron-back" size={20} color={cor.texto} />
              <Text style={s.voltarTexto}>Trocar</Text>
            </Pressable>
            <View style={{ marginTop: esp.xxl * 2, marginBottom: esp.xl }}>
              <Text style={s.kickerGrande}>{info.titulo}</Text>
              <Text style={s.grande}>Bora <Text style={{ color: cor.limao }}>começar.</Text></Text>
              <Text style={s.cartaoSub}>{papel === 'personal' ? 'Crie sua conta e monte o primeiro treino em menos de 2 minutos.' : 'Entra e já vê o treino que o seu personal montou.'}</Text>
            </View>
            <Campo rotulo="Seu nome" value={nome} onChangeText={setNome} placeholder="Como a turma te chama" autoComplete="name" />
            <Campo rotulo="E-mail" value={email} onChangeText={setEmail} placeholder="voce@email.com" autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
            <Campo rotulo="Senha" value={senha} onChangeText={setSenha} placeholder="Mínimo 6 caracteres" secureTextEntry autoComplete="password" />
            {papel === 'aluno' ? (
              <Campo rotulo="Código da turma (opcional)" value={codigo} onChangeText={setCodigo} placeholder="Ex.: BORA-AB12" autoCapitalize="characters" />
            ) : null}
            {erro ? <Text style={s.erro}>{erro}</Text> : null}
            <Botao titulo={papel === 'personal' ? 'Criar minha conta' : 'Entrar'} onPress={continuar} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  miolo: { width: '100%', maxWidth: LARGURA_MAX, alignSelf: 'center', paddingHorizontal: esp.xl - 4, paddingBottom: esp.xxl },
  slogan: { color: cor.textoSuave, fontFamily: fonte.media, fontSize: 17 },
  cartaoTopo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cartaoTitulo: { color: cor.texto, fontFamily: fonte.display, fontSize: 28, letterSpacing: -0.5 },
  cartaoSub: { color: 'rgba(255,255,255,0.8)', fontFamily: fonte.media, fontSize: 15, marginTop: 4 },
  seta: { width: 40, height: 40, borderRadius: 20, backgroundColor: cor.limao, alignItems: 'center', justifyContent: 'center' },
  item: { color: cor.texto, fontFamily: fonte.media, fontSize: 14 },
  voltar: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginTop: esp.m, paddingVertical: 8, paddingRight: 12 },
  voltarTexto: { color: cor.texto, fontFamily: fonte.negrito, fontSize: 15 },
  kickerGrande: { color: cor.limao, fontFamily: fonte.negrito, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  grande: { color: cor.texto, fontFamily: fonte.display, fontSize: 40, letterSpacing: -1, lineHeight: 46 },
  erro: { color: cor.perigo, fontFamily: fonte.media, fontSize: 14, textAlign: 'center', marginBottom: esp.m },
});
