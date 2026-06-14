
import { StandardGauge } from './types';

export const CABLE_GAUGES: StandardGauge[] = [
  { size: 0.5, diameter: 2.2 },
  { size: 0.75, diameter: 2.4 },
  { size: 1.0, diameter: 2.6 },
  { size: 1.5, diameter: 3.0 },
  { size: 2.5, diameter: 3.7 },
  { size: 4.0, diameter: 4.2 },
  { size: 6.0, diameter: 4.8 },
  { size: 10.0, diameter: 6.0 },
  { size: 16.0, diameter: 7.4 },
  { size: 25.0, diameter: 9.3 },
  { size: 35.0, diameter: 10.7 },
  { size: 50.0, diameter: 12.7 },
  { size: 70.0, diameter: 14.6 },
  { size: 95.0, diameter: 17.1 },
  { size: 120.0, diameter: 19.0 },
  { size: 150.0, diameter: 21.2 },
  { size: 185.0, diameter: 23.6 },
  { size: 240.0, diameter: 26.9 },
  { size: 300.0, diameter: 30.1 }
];

export const COMMAND_GAUGES = [0.5, 0.75, 1.0, 1.5, 2.5];

export const MULTI_CORE_OPTIONS_FULL = [2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 30, 36, 40, 42, 50, 52, 61, 71];
export const MULTI_CORE_OPTIONS_POWER = [2, 3, 4, 5];

export const STANDARD_ABAS = [50, 75, 100, 125, 150];
export const STANDARD_WIDTHS = [50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000];

// Tabelas de Diâmetro Externo (mm) baseadas nos PDFs Prysmian
export const DIAMETERS_1KV = {
  unipolar: {
    1.5: 4.8, 2.5: 5.2, 4: 5.7, 6: 6.2, 10: 7.4, 16: 9.0, 25: 10.3, 35: 12.4, 
    50: 13.8, 70: 15.7, 95: 17.5, 120: 19.2, 150: 21.7, 185: 23.6, 240: 26.6, 300: 30.6
  },
  multipolar: {
    2: { 1.5: 8.7, 2.5: 9.6, 4: 10.6, 6: 11.7, 10: 14.4, 16: 17.5, 25: 19.7, 35: 23.8 },
    3: { 1.5: 9.2, 2.5: 10.1, 4: 11.2, 6: 12.8, 10: 15.2, 16: 18.6, 25: 21.0, 35: 25.5, 50: 29.1 },
    4: { 1.5: 10.0, 2.5: 11.0, 4: 12.2, 6: 13.9, 10: 16.8, 16: 21.6, 25: 24.9, 35: 28.5 },
    5: { 1.5: 11.2, 2.5: 12.4, 4: 13.9, 6: 15.4, 10: 18.2, 16: 24.1, 25: 28.2, 35: 34.5 }
  }
};

export const DIAMETERS_750V = {
  unipolar: {
    1.0: 2.5, 1.5: 2.9, 2.5: 3.5, 4: 4.0, 6: 4.6, 10: 5.9, 16: 7.5, 25: 8.6, 
    35: 10.6, 50: 12.0, 70: 13.7, 95: 15.8, 120: 17.3, 150: 19.6, 185: 21.5, 240: 24.4
  },
  multipolar: { // PP Cordplast
    2: { 1: 6.6, 1.5: 7.5, 2.5: 9.5, 4: 10.7, 6: 12.2, 10: 15.3 },
    3: { 1: 7.0, 1.5: 8.1, 2.5: 10.3, 4: 11.5, 6: 13.1, 10: 16.2 },
    4: { 1: 8.1, 1.5: 9.7, 2.5: 11.6, 4: 13.2, 6: 14.8, 10: 19.0 },
    5: { 1: 9.0, 1.5: 10.5, 2.5: 12.4, 4: 14.0, 6: 15.8, 10: 19.7 }
  }
};

export const CONDUIT_SIZES = [
  { label: '1/2"', internalArea: 196 },
  { label: '3/4"', internalArea: 342 },
  { label: '1"', internalArea: 564 },
  { label: '1 1/4"', internalArea: 984 },
  { label: '1 1/2"', internalArea: 1345 },
  { label: '2"', internalArea: 2216 },
  { label: '2 1/2"', internalArea: 3166 },
  { label: '3"', internalArea: 4899 },
  { label: '4"', internalArea: 8494 }
];

export const OCCUPANCY_LIMITS = {
  CONDUIT: { ONE: 0.53, TWO: 0.31, THREE_PLUS: 0.40 },
  TRAY: 0.40,
  LADDER: 0.40
};
