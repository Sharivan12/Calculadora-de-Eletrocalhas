
import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CableData, CableType, InsulationType } from './types';
import { CABLE_GAUGES, STANDARD_ABAS } from './constants';
import CableEntry from './components/CableEntry';
import ResultCard from './components/ResultCard';
import { getTrayDimension, getConduitSize, calculateEffectiveArea } from './utils/calculations';

const Logo = () => (
  <div className="flex flex-col items-center">
    <svg width="60" height="40" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
      <path d="M10 45 L50 15" stroke="#E99C16" strokeWidth="5" strokeLinecap="round" />
      <path d="M40 55 L80 25" stroke="#E99C16" strokeWidth="5" strokeLinecap="round" />
      <path d="M22 36 L52 46" stroke="#E99C16" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <path d="M30 30 L60 40" stroke="#E99C16" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <path d="M38 24 L68 34" stroke="#E99C16" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <path d="M46 18 L76 28" stroke="#E99C16" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <path d="M10 45 L10 49 L50 19 L50 15 Z" fill="#C78512" />
      <path d="M40 55 L40 59 L80 29 L80 25 Z" fill="#C78512" />
    </svg>
    <span className="mestre-energia text-primary text-[8px] mt-0.5 tracking-tighter whitespace-nowrap">Mestre da Energia</span>
  </div>
);

const App: React.FC = () => {
  const [cables, setCables] = useState<CableData[]>([]);
  const [eletrocalhaAba, setEletrocalhaAba] = useState(50);
  const [leitoAba, setLeitoAba] = useState(100);
  const [insulation, setInsulation] = useState<InsulationType>('1kV');

  const addCable = (category: CableType) => {
    const defaultGauge = category === 'Comando' ? 1.0 : 2.5;
    const defaultForm = 'Singelo';
    const defaultCores = 1; 
    const { diameter, area } = calculateEffectiveArea(insulation, defaultGauge, defaultCores, false);
    
    const newCable: CableData = {
      id: uuidv4(),
      category,
      form: defaultForm,
      cores: defaultCores,
      gauge: defaultGauge,
      quantity: 1,
      diameter,
      area
    };
    setCables([...cables, newCable]);
  };

  const updateCable = (id: string, updates: Partial<CableData>) => {
    setCables(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const removeCable = (id: string) => {
    setCables(prev => prev.filter(c => c.id !== id));
  };

  const totals = useMemo(() => {
    const totalArea = cables.reduce((acc, c) => acc + (c.area * c.quantity), 0);
    const totalCount = cables.reduce((acc, c) => acc + c.quantity, 0);
    return { totalArea, totalCount };
  }, [cables]);

  const results = useMemo(() => {
    const ecWidth = getTrayDimension(totals.totalArea, eletrocalhaAba);
    const calculatedLWidth = getTrayDimension(totals.totalArea, leitoAba);
    const lWidth = Math.max(200, calculatedLWidth);
    const condResult = getConduitSize(totals.totalArea, totals.totalCount);

    const ecOccupancy = totals.totalArea > 0 ? (totals.totalArea / (ecWidth * eletrocalhaAba)) * 100 : 0;
    const lOccupancy = totals.totalArea > 0 ? (totals.totalArea / (lWidth * leitoAba)) * 100 : 0;
    const condOccupancy = condResult ? (totals.totalArea / condResult.internalArea) * 100 : 0;

    return {
      eletrocalha: { width: ecWidth, occupancy: ecOccupancy },
      leito: { width: lWidth, occupancy: lOccupancy },
      eletroduto: { 
        size: condResult?.label || '-', 
        occupancy: condOccupancy,
        limit: (condResult?.limit || 0.4) * 100
      }
    };
  }, [totals, eletrocalhaAba, leitoAba]);

  return (
    <div className="min-h-screen pb-10 bg-gray-50">
      <header className="bg-secondary text-white p-5 shadow-xl rounded-b-[2.5rem] sticky top-0 z-50">
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Logo />
              <div className="border-l border-white/20 pl-3">
                <h1 className="text-sm font-black leading-tight text-primary uppercase">Calculadora de<br/>Infraestrutura</h1>
                <p className="text-[9px] text-white/60 uppercase tracking-widest font-bold">NBR 5410</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-primary uppercase font-bold mb-0.5">Área Total</p>
              <p className="text-xl font-black">{totals.totalArea.toFixed(1)} <span className="text-[10px] font-normal text-white/40">mm²</span></p>
            </div>
          </div>

          <div className="bg-white/5 p-1 rounded-2xl flex items-center">
            <button 
              onClick={() => setInsulation('750V')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${insulation === '750V' ? 'bg-primary text-secondary shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              Cabo 450/750V
            </button>
            <button 
              onClick={() => setInsulation('1kV')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${insulation === '1kV' ? 'bg-primary text-secondary shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              Cabo 0.6/1kV
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="font-bold text-secondary uppercase text-xs tracking-wider">Lançamento de Cabos</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(['Força', 'Comando'] as CableType[]).map((type) => (
              <button
                key={type}
                onClick={() => addCable(type)}
                className="flex flex-col items-center justify-center p-5 bg-white border-b-4 border-primary/20 hover:border-primary rounded-[2rem] shadow-sm transition-all active:scale-95 group"
              >
                <div className={`p-3 rounded-full mb-1 transition-colors ${type === 'Força' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'} group-hover:bg-primary group-hover:text-white`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase text-secondary tracking-wide">{type}</span>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {cables.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Clique acima para lançar cabos</p>
              </div>
            ) : (
              cables.map((cable) => (
                <CableEntry 
                  key={cable.id} 
                  cable={cable}
                  insulation={insulation}
                  onUpdate={updateCable} 
                  onRemove={removeCable} 
                />
              ))
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-bold text-secondary uppercase text-xs tracking-wider px-2">Dimensionamento Calculado</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <ResultCard 
              title="Eletrocalha" 
              type="Eletrocalha"
              totalArea={totals.totalArea}
              width={results.eletrocalha.width}
              aba={eletrocalhaAba}
              onAbaChange={setEletrocalhaAba}
              availableAbas={STANDARD_ABAS}
              occupancy={results.eletrocalha.occupancy}
            />

            <ResultCard 
              title="Leito Porta Cabos" 
              type="Leito"
              totalArea={totals.totalArea}
              width={results.leito.width}
              aba={leitoAba}
              onAbaChange={setLeitoAba}
              availableAbas={STANDARD_ABAS.filter(a => a >= 100)}
              occupancy={results.leito.occupancy}
            />

            <ResultCard 
              title="Eletroduto" 
              type="Eletroduto"
              totalArea={totals.totalArea}
              conduitSize={results.eletroduto.size}
              occupancy={results.eletroduto.occupancy}
              limit={results.eletroduto.limit}
            />
          </div>
        </section>

        <footer className="px-4 py-8">
          <div className="bg-secondary p-5 rounded-2xl shadow-lg relative overflow-hidden flex justify-center items-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16"></div>
            <span className="mestre-energia text-[10px] text-white/30 tracking-widest relative z-10">© Mestre da Energia</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
