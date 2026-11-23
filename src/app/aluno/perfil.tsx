import { router } from 'expo-router';
import { Perfil } from '../../components/Perfil';
import { useApp } from '../../store/app';

export default function PerfilAluno() {
  const { ofensiva, checkins, pontosSemana, historico, medidas } = useApp();
  const ultimaMedida = medidas[medidas.length - 1];
  return (
    <Perfil
      extras={[
        { icone: 'flame', titulo: 'Ofensiva atual', valor: `${ofensiva} dias`, onPress: () => router.push('/aluno/ofensiva') },
        { icone: 'calendar', titulo: 'Treinos registrados', valor: String(checkins.length) },
        { icone: 'trophy', titulo: 'Pontos na semana', valor: String(pontosSemana), onPress: () => router.push('/aluno/ranking') },
        { icone: 'time', titulo: 'Histórico de treinos', valor: `${historico.length} ›`, onPress: () => router.push('/historico') },
        { icone: 'body', titulo: 'Medidas e peso', valor: ultimaMedida?.peso ? `${ultimaMedida.peso} kg ›` : '›', onPress: () => router.push('/medidas') },
        { icone: 'stats-chart', titulo: 'Relatório do mês', valor: '›', onPress: () => router.push('/relatorio') },
        { icone: 'chatbubbles', titulo: 'Falar com o personal', valor: '›', onPress: () => router.push({ pathname: '/chat/[id]', params: { id: 'eu' } }) },
      ]}
    />
  );
}
