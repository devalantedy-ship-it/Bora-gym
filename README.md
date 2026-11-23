# Bora-gym

**BORA.** — seu personal no bolso.

App de treino que conecta o personal trainer e os alunos dele. O personal monta os treinos (do zero, por plano pronto ou pela biblioteca de exercícios) e acompanha a turma; o aluno vê o treino do dia com demonstração, registra carga e repetições, faz check-in com foto e mantém a ofensiva.

## O que tem

**Personal**
- "Comece aqui" com os primeiros passos e ações rápidas
- Montar treino em 3 passos (nome e dias → exercícios → revisar), pra turma toda ou alunos específicos
- Planos prontos: Hipertrofia ABC, Emagrecimento, Força 5x5, Primeiros Passos
- Biblioteca com 873 exercícios com demonstração animada, busca em português e favoritos
- Exercícios próprios com vídeo gravado pelo personal
- Ficha do aluno: treinos, frequência, evolução de carga, chat e WhatsApp
- Convite por código da turma e desafios com prêmio

**Aluno**
- Treino do dia e modo treino guiado: carga e reps por série, "anterior", tipos de série, descanso, aviso de recorde, sugestão de carga e resumo no final
- Check-in com foto, ofensiva (com salva-ofensiva), ranking e feed da turma
- Recuperação muscular, histórico, gráficos de evolução, medidas com IMC e % de gordura, relatório do mês
- Chat com o personal

## Tecnologia

- [Expo](https://expo.dev) SDK 58 + Expo Router (React Native, TypeScript) — iOS, Android e web
- Barra de abas nativa no iOS/Android
- Dados salvos no aparelho (AsyncStorage) por enquanto; o próximo passo é o Supabase

## Rodar

```bash
npm install
npx expo start
```

Abra no celular com o app **Expo Go** (no iPhone, logue na mesma conta Expo no app e no computador) ou aperte `w` pra abrir no navegador.

Versão web: `npx expo export --platform web`.

## Créditos

Fotos e dados dos exercícios da biblioteca: [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (domínio público / Unlicense). Gerados por `scripts/importar-biblioteca.js`.
