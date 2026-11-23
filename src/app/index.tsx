import { Redirect } from 'expo-router';
import { useApp } from '../store/app';

export default function Inicio() {
  const { papel } = useApp();
  if (papel === 'aluno') return <Redirect href="/aluno" />;
  if (papel === 'personal') return <Redirect href="/personal" />;
  return <Redirect href="/entrar" />;
}
