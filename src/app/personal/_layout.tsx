import { Redirect } from 'expo-router';
import { Abas } from '../../components/Abas';
import { useApp } from '../../store/app';

export default function PersonalLayout() {
  const { papel } = useApp();
  if (papel !== 'personal') return <Redirect href={papel === 'aluno' ? '/aluno' : '/entrar'} />;
  return (
    <Abas
      abas={[
        { nome: 'index', titulo: 'Alunos', icone: 'people' },
        { nome: 'treinos', titulo: 'Treinos', icone: 'barbell' },
        { nome: 'frequencia', titulo: 'Frequência', icone: 'stats-chart' },
        { nome: 'perfil', titulo: 'Perfil', icone: 'person' },
      ]}
    />
  );
}
