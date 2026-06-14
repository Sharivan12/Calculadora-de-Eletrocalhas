
import { STANDARD_WIDTHS, OCCUPANCY_LIMITS, CONDUIT_SIZES, DIAMETERS_1KV, DIAMETERS_750V } from '../constants';
import { InsulationType } from '../types';

export const getDiameterFromTable = (
  insulation: InsulationType,
  gauge: number,
  cores: number | undefined,
  isMultipolar: boolean
): number => {
  const table = insulation === '1kV' ? DIAMETERS_1KV : DIAMETERS_750V;

  if (!isMultipolar) {
    const val = (table.unipolar as any)[gauge];
    if (val) return val;
    // Fallback heurístico se não estiver na tabela unipolar
    return Math.sqrt(gauge) * 2;
  }

  if (isMultipolar && cores) {
    const coreTable = (table.multipolar as any)[cores];
    if (coreTable) {
      const val = coreTable[gauge];
      if (val) return val;
    }
    // Fallback heurístico para multipolares não mapeados (ex: comandos com muitas vias)
    const singleCoreDia = (table.unipolar as any)[gauge] || Math.sqrt(gauge) * 1.5;
    const factor = Math.sqrt(cores) * 1.15;
    return singleCoreDia * factor;
  }

  return 0;
};

export const calculateEffectiveArea = (
  insulation: InsulationType,
  gauge: number, 
  cores: number | undefined, 
  isMultipolar: boolean
): { diameter: number, area: number } => {
  if (isMultipolar && !cores) {
    return { diameter: 0, area: 0 };
  }

  const finalDiameter = getDiameterFromTable(insulation, gauge, cores, isMultipolar);
  const area = (Math.PI * Math.pow(finalDiameter, 2)) / 4;
  
  return { diameter: finalDiameter, area };
};

export const getSmallestWidth = (requiredArea: number, aba: number): number => {
  for (const width of STANDARD_WIDTHS) {
    if (width * aba >= requiredArea) {
      return width;
    }
  }
  return STANDARD_WIDTHS[STANDARD_WIDTHS.length - 1];
};

export const getConduitSize = (totalArea: number, cableCount: number): { label: string, internalArea: number, limit: number } | null => {
  if (totalArea === 0) return null;
  let limit = OCCUPANCY_LIMITS.CONDUIT.THREE_PLUS;
  if (cableCount === 1) limit = OCCUPANCY_LIMITS.CONDUIT.ONE;
  if (cableCount === 2) limit = OCCUPANCY_LIMITS.CONDUIT.TWO;

  for (const conduit of CONDUIT_SIZES) {
    if (totalArea / conduit.internalArea <= limit) {
      return { ...conduit, limit };
    }
  }
  return { label: 'N/A', internalArea: CONDUIT_SIZES[CONDUIT_SIZES.length - 1].internalArea, limit };
};

export const getTrayDimension = (totalArea: number, aba: number): number => {
  if (totalArea === 0) return 0;
  const requiredPhysicalArea = totalArea / OCCUPANCY_LIMITS.TRAY;
  return getSmallestWidth(requiredPhysicalArea, aba);
};
