import { Text, View } from 'react-native';
import { T, Tela } from '../components/ui';
import { cor, esp, fonte } from '../theme';

// Rascunho de política de privacidade (LGPD). Revisar com o responsável antes de publicar nas lojas.
const SECOES: { titulo: string; texto: string }[] = [
  { titulo: 'Quem somos', texto: 'O BORA é um app que conecta personal trainers e alunos: o personal monta os treinos e acompanha a frequência, e o aluno vê os exercícios em vídeo e registra o treino do dia.' },
  { titulo: 'Quais dados guardamos', texto: 'Nome, e-mail, os treinos montados pelo seu personal, os check-ins que você faz (data, treino e, se você quiser, uma foto) e as reações no feed da turma.' },
  { titulo: 'Para que usamos', texto: 'Só para o app funcionar: mostrar seus treinos, calcular sua ofensiva e seus pontos, montar o ranking da turma e mostrar sua frequência para o seu personal. Não vendemos seus dados.' },
  { titulo: 'Quem vê o quê', texto: 'Seu personal vê seus check-ins e sua frequência. A sua turma vê seu nome, sua ofensiva, seus pontos e as fotos que você publicar no feed. Ninguém de fora da turma vê.' },
  { titulo: 'Câmera e fotos', texto: 'O app só usa a câmera e a galeria quando você toca para tirar ou escolher uma foto do check-in (ou, no caso do personal, gravar o vídeo de um exercício).' },
  { titulo: 'Seus direitos (LGPD)', texto: 'Você pode ver, corrigir e apagar seus dados quando quiser. Em Perfil → Excluir conta, tudo é apagado de forma definitiva.' },
  { titulo: 'Contato', texto: 'Dúvidas sobre privacidade: fale com o responsável pelo app pelo e-mail informado na página da loja.' },
];

export default function Privacidade() {
  return (
    <Tela semTopo>
      <T fraco tam={13} style={{ marginTop: esp.s, marginBottom: esp.l }}>Última atualização: novembro de 2026</T>
      <View style={{ gap: esp.l }}>
        {SECOES.map((s) => (
          <View key={s.titulo}>
            <Text style={{ color: cor.texto, fontFamily: fonte.extra, fontSize: 17, marginBottom: 6 }}>{s.titulo}</Text>
            <T fraco tam={15} style={{ lineHeight: 22 }}>{s.texto}</T>
          </View>
        ))}
      </View>
    </Tela>
  );
}
