/**
 * Presença X3 no mapa do Brasil.
 * Edite este arquivo para atualizar o mapa, os contadores e os textos do painel.
 * As siglas ficam em minúsculas (padrão do pacote @svg-maps/brazil).
 */

/** Estados com operação ativa — a ordem define o ciclo automático do painel. */
export const ACTIVE_STATES = ['sp', 'mg', 'rj', 'go', 'df', 'pa', 'ap'];

/** Estado exibido ao carregar a página. */
export const INITIAL_STATE = 'sp';

/** Linhas de conexão animadas entre estados ativos. */
export const CONNECTIONS = [
  ['sp', 'rj'],
  ['sp', 'mg'],
  ['mg', 'rj'],
  ['mg', 'go'],
  ['go', 'df'],
  ['df', 'pa'],
  ['pa', 'ap'],
  ['sp', 'go'],
];

/** Ajuste fino [x, y] da posição do marcador (o centro do contorno nem sempre cai dentro do estado). */
export const MARKER_OFFSETS = {
  go: [-10, 8],
  mg: [6, 4],
  pa: [0, -6],
  rj: [2, 2],
  sp: [4, 2],
  ap: [0, 4],
};

/** Textos do painel lateral. */
export const STATUS_COPY = {
  active: {
    label: 'Presença X3 ativa',
    tip: 'ATIVO',
    description: 'Operação ativa com estrutura completa de originação e suporte comercial.',
  },
  expansion: {
    label: 'Região em expansão',
    tip: 'EXPANSÃO',
    description: 'Ainda não temos operação local neste estado. Seja parceiro e leve a X3 para a sua região.',
  },
};

/** Intervalo do ciclo automático entre estados (ms) e pausa após interação do usuário. */
export const AUTO_CYCLE_MS = 3600;
export const RESUME_AFTER_MS = 9000;

export const REGIONS = {
  ac: 'Norte', al: 'Nordeste', ap: 'Norte', am: 'Norte', ba: 'Nordeste', ce: 'Nordeste',
  df: 'Centro-Oeste', es: 'Sudeste', go: 'Centro-Oeste', ma: 'Nordeste', mt: 'Centro-Oeste',
  ms: 'Centro-Oeste', mg: 'Sudeste', pa: 'Norte', pb: 'Nordeste', pr: 'Sul', pe: 'Nordeste',
  pi: 'Nordeste', rj: 'Sudeste', rn: 'Nordeste', rs: 'Sul', ro: 'Norte', rr: 'Norte',
  sc: 'Sul', sp: 'Sudeste', se: 'Nordeste', to: 'Norte',
};
