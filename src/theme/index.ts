// Identidade do BORA: fundo quase preto, cards grafite, verde-limão de destaque.
export const cor = {
  fundo: '#0A0A0A',
  card: '#151517',
  cardAlto: '#1E1E21',
  borda: '#2A2A2E',
  texto: '#FFFFFF',
  textoSuave: '#A1A1A6',
  textoFraco: '#6E6E73',
  limao: '#D4FF3A',
  limaoEscuro: '#2A3A08',
  sobreLimao: '#111111',
  perigo: '#FF5A3C',
  ok: '#3DDC84',
} as const;

export const fonte = {
  regular: 'Inter_400Regular',
  media: 'Inter_600SemiBold',
  negrito: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
  black: 'Inter_900Black',
  display: 'ArchivoBlack_400Regular', // mesma fonte do logo do vídeo
} as const;

export const raio = { p: 12, m: 18, g: 26, pill: 999 } as const;
export const esp = { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32 } as const;

// Largura máxima do conteúdo: no tablet e no navegador o app não estica demais.
export const LARGURA_MAX = 640;
