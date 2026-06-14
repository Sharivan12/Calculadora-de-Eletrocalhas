
export type CableType = 'Força' | 'Comando';
export type CableForm = 'Singelo' | 'Multipolar';
export type InsulationType = '750V' | '1kV';

export interface CableData {
  id: string;
  category: CableType;
  form: CableForm;
  cores?: number;
  gauge: number;
  quantity: number;
  diameter: number;
  area: number;
}

export interface DimensionResult {
  type: 'Eletrocalha' | 'Leito' | 'Eletroduto';
  aba: number;
  largura: number;
  ocupacao: number;
  areaTotalOcupada: number;
}

export interface StandardGauge {
  size: number;
  diameter: number;
}
