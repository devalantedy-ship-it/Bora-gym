# Recon map: Hevy + Hevy Coach (iOS / Android)

Scope: o loop de treino do Hevy (registrar séries com carga, rotinas, histórico, PRs, gráficos) e o lado do personal do Hevy Coach (programas, atribuir a clientes, acompanhar, chat).
For: BORA — app do personal (amigo do usuário) e dos alunos dele. Mesmas ideias de produto, com o design do BORA (escuro + verde-limão, Archivo Black/Inter). Nenhum texto, código, ícone ou imagem do Hevy entra no BORA.
Date: 2026-11-23

## Sources

| # | source | URL | notes |
| --- | --- | --- | --- |
| 1 | marketing site | https://www.hevyapp.com/ | lido: seções registrar treino, progresso, comunidade, relógio, web |
| 2 | página de recursos | https://www.hevyapp.com/features/ | lido: lista de recursos por categoria (só títulos) |
| 3 | Hevy Coach home | https://hevycoach.com/ | lido |
| 4 | Hevy Coach recursos | https://hevycoach.com/features/ | lido |
| 5 | Hevy Coach preços | https://hevycoach.com/pricing/ | lido: US$ 25/mês por faixa de clientes, 30 dias grátis, clientes não pagam |
| 6 | App Store | https://apps.apple.com/us/app/hevy-workout-tracker-gym-log/id1458862350 | lido: descrição, Pro vs grátis, preços, 5 avaliações |
| 7 | central de ajuda | https://help.hevyapp.com/ | **bloqueada (403)**, não contornada |
| 8 | Google Play | https://play.google.com/store/apps/details?id=com.hevy | sem conteúdo útil |
| 9 | API pública | https://api.hevyapp.com/docs | não lida (ver próximos passos) |

Sem conta do usuário no Hevy: nada foi visto por dentro do app. Telas abaixo são inferidas das descrições públicas (confiança indicada).

## Core loop

Abrir a rotina do dia → registrar cada série (carga × reps) vendo o que fez da última vez → timer de descanso automático → salvar o treino → ver PR, gráfico e sequência. No Coach: o personal monta o programa, atribui ao cliente e acompanha aderência e progresso.

## Screens

| ID | screen | route / how to reach | purpose | key components | states seen |
| --- | --- | --- | --- | --- | --- |
| S01 | Feed (home) | aba inicial | treinos de quem você segue, curtir e comentar | card de treino, curtir, comentar | (inferido) |
| S02 | Treino (início) | aba treino | começar treino vazio ou a partir de rotina; pastas de rotinas | lista de rotinas, pastas, botão iniciar | (inferido) |
| S03 | Treino em andamento | iniciar treino | registrar séries: carga, reps, RPE, tipo de série; anterior ao lado; timer | tabela de séries, check por série, timer, notas | (inferido, App Store + features) |
| S04 | Biblioteca de exercícios | adicionar exercício | buscar/filtrar exercício, vídeo e instruções, criar personalizado | busca, filtro por músculo/equipamento, vídeo | (inferido) |
| S05 | Detalhe do exercício | tocar no exercício | vídeo, instruções, histórico, gráfico, PRs, 1RM | gráfico, lista de recordes | (inferido) |
| S06 | Salvar treino | terminar treino | resumo (duração, volume, PRs), foto, compartilhar | resumo, medalhas de PR | (inferido) |
| S07 | Perfil / estatísticas | aba perfil | calendário, sequência, gráficos por grupo muscular, relatório mensal | calendário, gráficos | (inferido) |
| S08 | Medidas e fotos | perfil → medidas | peso, medidas corporais, fotos de progresso | formulário, galeria | (inferido) |
| S09 | Construtor de rotina | criar rotina | montar rotina, ordem, séries alvo, superset | lista ordenável | (inferido) |
| S10 | Coach: dashboard | web/app do coach | visão dos clientes e atividade recente | lista de clientes, feed de atividade | (Coach features) |
| S11 | Coach: cliente | dashboard → cliente | programa atribuído, progresso, aderência, métricas | gráficos, programa | (Coach features) |
| S12 | Coach: construtor de plano | coach → planos | montar programa de várias semanas e atribuir | builder | (Coach features) |
| S13 | Coach: chat | coach ↔ cliente | conversa com notificações | lista de conversas, mensagens | (Coach features) |
| S14 | Coach: convite | coach → convidar | convite por e-mail ou link com formulário | formulário, link | (Coach features) |

## Flows

```
F01 Aluno faz o treino do dia (Hevy)
    S02 -> S03 (registra cada série com carga/reps, vê o anterior, timer) -> S06 salvar
    happy path: ~1 toque por série + 1 pra iniciar + 1 pra salvar
    edge: trocar exercício no meio, adicionar série, superset, treino sem rotina

F02 Ver evolução de um exercício
    S07 ou S03 -> S05 (gráfico, PR, 1RM)

F03 Personal cria programa e atribui (Coach)
    S12 montar -> S11 atribuir ao cliente -> cliente vê no app
    edge: atribuir pra vários clientes de uma vez (planos "em escala")

F04 Personal acompanha e conversa
    S10 -> S11 (aderência, progresso) -> S13 chat

F05 Convidar cliente
    S14 e-mail ou link -> cliente cria conta em ~2 min -> já cai no programa
```

## Components

| component | variants | states | used on |
| --- | --- | --- | --- |
| Linha de série | normal, aquecimento, falha, drop | vazia, preenchida, concluída, PR | S03, S09 |
| Timer de descanso | flutuante, tela cheia | contando, terminou | S03 |
| Gráfico de exercício | carga, 1RM, volume, reps | vazio, com dados | S05, S07, S11 |
| Card de treino (feed) | próprio, de outro | curtido | S01 |
| Calendário de treinos | mês, ano | com sequência | S07 |
| Chat | lista, conversa | não lida | S13 |

## Inferred data model

```
Exercise     id, name, muscle_group, equipment, video, instructions, custom(bool), owner
             evidence: features "Exercise Library", "Custom Exercises" · confidence: high
Routine      id, name, folder_id, exercises[{exercise_id, sets_target, reps_target, rest, superset_id, notes}]
             evidence: "Routine Planner", "Folders" · confidence: high
Workout      id, user_id, routine_id?, started_at, duration, notes, photo
             evidence: App Store, "Save Workout" · confidence: high
WorkoutSet   id, workout_id, exercise_id, index, type (normal|warmup|failure|drop), weight, reps, duration, distance, rpe, done
             evidence: App Store ("pesos, repetições, duração e RPE", tipos de série) · confidence: high
PersonalRecord  user_id, exercise_id, kind (max weight | 1RM | volume | reps), value, workout_id
             evidence: "PRs", "Live PR Notification" · confidence: medium
BodyMeasure  user_id, date, weight, measures{...}, photo · evidence: "Body Measurements", "Progress Pictures" · confidence: medium
Follow / Like / Comment  (social) · confidence: high
CoachClient  coach_id, client_id, invited_at, status · evidence: Coach "Client Management" · confidence: high
Program      coach_id, weeks[{routines}] , assigned_to[] · evidence: "Training Plan Builder" · confidence: medium
Message      thread(coach,client), body, sent_at, read · evidence: "Client Chat" · confidence: high
```

Relationships: User 1-n Workout, Workout 1-n WorkoutSet, Exercise 1-n WorkoutSet, Coach 1-n Client, Program n-n Client.

## Feature matrix

See `features.csv`. Must: 14, should: 12, could: 9, skip: 6.

## Out of scope (cannot or should not be cloned)

- A biblioteca de 400+ vídeos de exercício do Hevy (conteúdo deles). No BORA, os vídeos são gravados pelo próprio personal.
- A rede social e os usuários do Hevy (atletas, leaderboards globais). No BORA a comunidade é a turma do personal.
- Apple Watch / Wear OS, Live Activity, widgets (código nativo; dá pra fazer depois com build própria).
- Integrações com Strava, Claude/ChatGPT (podem vir depois).
- Hevy Trainer (gerador de plano por IA): o BORA tem o personal de verdade.
- Cobrança pela Paddle: o BORA ainda não cobra nada.

## Size

Screens 14, flows 5, entidades 10. Partes difíceis: registro de séries rápido e confiável (offline), cálculo de PR/1RM e gráficos, chat em tempo real (precisa do Supabase Realtime). Tamanho pro BORA ganhar o que importa: **M** (algumas semanas), feito em fatias.
