import { Redirect } from 'expo-router';
import { Abas } from '../../components/Abas';
import { useApp } from '../../store/app';

export default function AlunoLayout() {
  const { papel } = useApp();
  if (papel !== 'aluno') return <Redirect href={papel === 'personal' ? '/personal' : '/entrar'} />;
  return (
    <Abas
      abas={[
        { nome: 'index', titulo: 'Hoje', icone: 'barbell' },
        { nome: 'turma', titulo: 'Turma', icone: 'people' },
        { nome: 'ofensiva', titulo: 'Ofensiva', icone: 'flame' },
        { nome: 'ranking', titulo: 'Ranking', icone: 'trophy' },
        { nome: 'perfil', titulo: 'Perfil', icone: 'person' },
      ]}
    />
  );
}
