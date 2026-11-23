import { router } from 'expo-router';
import { Perfil } from '../../components/Perfil';
import { useApp } from '../../store/app';

export default function PerfilPersonal() {
  const { alunos, treinos, desafio, perfil } = useApp();
  return (
    <Perfil
      extras={[
        { icone: 'people', titulo: 'Alunos', valor: String(alunos.length), onPress: () => router.push('/personal') },
        { icone: 'barbell', titulo: 'Treinos montados', valor: String(treinos.length), onPress: () => router.push('/personal/treinos') },
        { icone: 'trophy', titulo: 'Desafio ativo', valor: desafio ? `${desafio.dias} dias` : 'Nenhum', onPress: () => router.push('/desafio') },
        { icone: 'link', titulo: 'Código da turma', valor: perfil?.codigoTurma ?? '', onPress: () => router.push('/convidar') },
      ]}
    />
  );
}
