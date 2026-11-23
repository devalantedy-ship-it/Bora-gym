import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Acao, Anel, BotaoMais } from '../../components/extras';
import { Avatar, Card, Kicker, Linha, T, Tela, toque } from '../../components/ui';
import { DIAS_LONGOS, type Aluno } from '../../data/mock';
import { useApp } from '../../store/app';
import { cor, esp, fonte, raio } from '../../theme';

function status(a: Aluno) {
  if (a.ultimoTreino === 0) return { texto: 'Treinou hoje', cor: cor.limao };
  if (a.ultimoTreino <= 1) return { texto: 'Treinou ontem', cor: cor.textoSuave };
  return { texto: `Sumiu há ${a.ultimoTreino} dias`, cor: cor.perigo };
}

export default function InicioPersonal() {
  const { nome, alunos, marcos } = useApp();
  const sumidos = alunos.filter((a) => a.ultimoTreino >= 3);
  const hoje = alunos.filter((a) => a.ultimoTreino === 0).length;
  const d = new Date();

  const passos = [
    { feito: marcos.treinoCriado, titulo: 'Monte seu primeiro treino', sub: 'Nome, dias e exercícios. Leva 1 minuto.', ir: () => router.push('/novo-treino') },
    { feito: marcos.videoEnviado, titulo: 'Grave o vídeo de um exercício', sub: 'O aluno vê como executar certinho.', ir: () => router.push({ pathname: '/personal/treinos', params: { aba: 'exercicios' } }) },
    { feito: marcos.convidou, titulo: 'Convide seus alunos', sub: 'Manda o código da turma no WhatsApp.', ir: () => router.push('/convidar') },
    { feito: marcos.desafioCriado, titulo: 'Lance um desafio com prêmio', sub: 'Engaja a turma a não faltar.', ir: () => router.push('/desafio') },
  ];
  const feitos = passos.filter((p) => p.feito).length;
  const proximo = passos.findIndex((p) => !p.feito);

  const chamar = (a: Aluno) => {
    toque();
    const msg = encodeURIComponent(`Fala ${a.nome}! Sentimos sua falta no treino 💪 Bora voltar hoje? Seu treino já tá no BORA.`);
    Linking.openURL(`https://wa.me/?text=${msg}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: cor.fundo }}>
      <Tela>
        <T fraco tam={15}>{DIAS_LONGOS[d.getDay()]}, {d.getDate()}</T>
        <Text style={s.ola} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>Bora, <Text style={{ color: cor.limao }}>{(nome || 'coach').split(' ')[0]}!</Text></Text>

        {feitos < passos.length ? (
          <Card style={{ marginTop: esp.l, marginBottom: esp.l, padding: 0, overflow: 'hidden' }}>
            <Linha style={{ padding: esp.l, paddingBottom: esp.m }}>
              <Anel valor={feitos / passos.length} tam={58} grossura={7}>
                <Text style={s.anelTexto}>{feitos}/{passos.length}</Text>
              </Anel>
              <View style={{ flex: 1 }}>
                <T tam={18} peso="extra">Comece aqui</T>
                <T fraco tam={13}>Deixa sua turma pronta em 4 passos</T>
              </View>
            </Linha>
            {passos.map((p, i) => (
              <Pressable key={p.titulo} onPress={() => { toque(); p.ir(); }} style={({ pressed }) => [s.passo, i === proximo && s.passoAtual, pressed && { opacity: 0.8 }]} accessibilityRole="button">
                <View style={[s.check, p.feito && { backgroundColor: cor.limao, borderColor: cor.limao }]}>
                  {p.feito ? <Ionicons name="checkmark" size={16} color={cor.sobreLimao} /> : <Text style={s.checkNum}>{i + 1}</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <T tam={15} peso="negrito" style={p.feito && { color: cor.textoSuave, textDecorationLine: 'line-through' }}>{p.titulo}</T>
                  {!p.feito ? <T fraco tam={12}>{p.sub}</T> : null}
                </View>
                {!p.feito ? <Ionicons name="chevron-forward" size={18} color={i === proximo ? cor.limao : cor.textoFraco} /> : null}
              </Pressable>
            ))}
          </Card>
        ) : null}

        <Kicker>{feitos < passos.length ? 'Ações rápidas' : ' '}</Kicker>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: esp.m, marginBottom: esp.l }}>
          <Acao destaque icone="barbell" titulo="Novo treino" sub="Monte e envie pra turma" onPress={() => router.push('/novo-treino')} />
          <Acao icone="flash" titulo="Planos prontos" sub="Hipertrofia, força, emagrecer" onPress={() => router.push('/planos')} />
          <Acao icone="library" titulo="Biblioteca" sub="873 exercícios com demonstração" onPress={() => router.push('/biblioteca')} />
          <Acao icone="person-add" titulo="Convidar" sub="Código da sua turma" onPress={() => router.push('/convidar')} />
          <Acao icone="trophy" titulo="Desafio" sub="Com prêmio de verdade" onPress={() => router.push('/desafio')} />
        </View>

        <Linha style={{ gap: esp.m, marginBottom: esp.l }}>
          <Card style={{ flex: 1 }}>
            <Kicker>Hoje</Kicker>
            <Text style={s.big}>{hoje}<Text style={s.bigSub}>/{alunos.length}</Text></Text>
            <T fraco tam={13}>fizeram check-in</T>
          </Card>
          <Card style={{ flex: 1 }} onPress={() => router.push('/personal/frequencia')}>
            <Kicker>Frequência</Kicker>
            <Text style={s.big}>87<Text style={s.bigSub}>%</Text></Text>
            <T fraco tam={13}>esta semana ›</T>
          </Card>
        </Linha>

        {sumidos.length > 0 ? (
          <>
            <Kicker>Precisa de atenção</Kicker>
            <View style={{ gap: esp.s, marginBottom: esp.l }}>
              {sumidos.map((a) => (
                <View key={a.id} style={s.alerta}>
                  <View style={s.exclama}><Text style={{ color: '#fff', fontFamily: fonte.black }}>!</Text></View>
                  <View style={{ flex: 1 }}>
                    <T tam={15} peso="negrito">{a.nome} sumiu há {a.ultimoTreino} dias</T>
                    <T fraco tam={12}>{a.frequencia}% de frequência no mês</T>
                  </View>
                  <Pressable onPress={() => chamar(a)} style={s.chamar} accessibilityRole="button" accessibilityLabel={`Chamar ${a.nome} no WhatsApp`}>
                    <Ionicons name="logo-whatsapp" size={16} color={cor.sobreLimao} />
                    <Text style={s.chamarTexto}>Chamar</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </>
        ) : null}

        <Kicker>Sua turma ({alunos.length})</Kicker>
        <View style={{ gap: esp.s, marginBottom: 80 }}>
          {alunos.map((a) => {
            const st = status(a);
            return (
              <Card key={a.id} onPress={() => router.push({ pathname: '/detalhe-aluno/[id]', params: { id: a.id } })} style={{ paddingVertical: 12 }}>
                <Linha>
                  <Avatar iniciais={a.iniciais} />
                  <View style={{ flex: 1 }}>
                    <T tam={16} peso="negrito">{a.nome}</T>
                    <Text style={{ color: st.cor, fontFamily: fonte.media, fontSize: 13 }}>{st.texto}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <T tam={15} peso="extra">🔥 {a.ofensiva}</T>
                    <T fraco tam={12}>{a.frequencia}% mês</T>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={cor.textoFraco} />
                </Linha>
              </Card>
            );
          })}
        </View>
      </Tela>
      <BotaoMais rotulo="Novo treino" onPress={() => router.push('/novo-treino')} />
    </View>
  );
}

const s = StyleSheet.create({
  ola: { color: cor.texto, fontFamily: fonte.display, fontSize: 30, letterSpacing: -0.5 },
  anelTexto: { color: cor.texto, fontFamily: fonte.extra, fontSize: 14 },
  passo: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: esp.l, paddingVertical: 12, borderTopWidth: 1, borderTopColor: cor.borda },
  passoAtual: { backgroundColor: 'rgba(212,255,58,0.07)' },
  check: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: cor.borda, alignItems: 'center', justifyContent: 'center' },
  checkNum: { color: cor.textoSuave, fontFamily: fonte.extra, fontSize: 13 },
  big: { color: cor.texto, fontFamily: fonte.display, fontSize: 36, letterSpacing: -1 },
  bigSub: { color: cor.textoFraco, fontSize: 20 },
  alerta: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: cor.card, borderRadius: raio.m, borderWidth: 1, borderColor: 'rgba(255,90,60,0.35)', padding: 14 },
  exclama: { width: 34, height: 34, borderRadius: 17, backgroundColor: cor.perigo, alignItems: 'center', justifyContent: 'center' },
  chamar: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: cor.limao, borderRadius: raio.pill, paddingHorizontal: 14, height: 38 },
  chamarTexto: { color: cor.sobreLimao, fontFamily: fonte.extra, fontSize: 14 },
});
