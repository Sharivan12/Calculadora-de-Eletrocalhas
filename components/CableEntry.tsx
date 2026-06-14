
import React, { useEffect } from 'react';
import { CableData, CableForm, InsulationType } from '../types';
import { CABLE_GAUGES, COMMAND_GAUGES, MULTI_CORE_OPTIONS_FULL, MULTI_CORE_OPTIONS_POWER } from '../constants';
import { calculateEffectiveArea } from '../utils/calculations';

interface Props {
  cable: CableData;
  insulation: InsulationType;
  onUpdate: (id: string, updates: Partial<CableData>) => void;
  onRemove: (id: string) => void;
}

const CableEntry: React.FC<Props> = ({ cable, insulation, onUpdate, onRemove }) => {
  const gaugesToDisplay = cable.category === 'Comando' 
    ? CABLE_GAUGES.filter(g => COMMAND_GAUGES.includes(g.size))
    : CABLE_GAUGES;

  const coreOptions = cable.category === 'Força' 
    ? MULTI_CORE_OPTIONS_POWER 
    : MULTI_CORE_OPTIONS_FULL;

  // Atualiza quando a isolação global mudar
  useEffect(() => {
    const { diameter, area } = calculateEffectiveArea(
      insulation,
      cable.gauge,
      cable.cores,
      cable.form === 'Multipolar'
    );
    if (diameter !== cable.diameter) {
      onUpdate(cable.id, { diameter, area });
    }
  }, [insulation]);

  const handleUpdate = (updates: Partial<CableData>) => {
    const nextCable = { ...cable, ...updates };
    
    // Se mudou de categoria para Força, garantir que cores esteja no limite
    if (updates.category === 'Força' && nextCable.cores && nextCable.cores > 5) {
      nextCable.cores = 5;
      updates.cores = 5;
    }

    if (updates.form === 'Multipolar' && !updates.cores) {
      nextCable.cores = undefined;
    }

    const { diameter, area } = calculateEffectiveArea(
      insulation,
      nextCable.gauge, 
      nextCable.cores, 
      nextCable.form === 'Multipolar'
    );
    onUpdate(cable.id, { ...updates, diameter, area });
  };

  return (
    <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 mb-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex justify-between items-center mb-4">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${cable.category === 'Força' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
          {cable.category}
        </span>
        <button 
          onClick={() => onRemove(cable.id)}
          className="text-gray-300 hover:text-red-500 transition-colors p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black text-secondary uppercase mb-1.5 opacity-50 ml-1">Formação</label>
          <select 
            value={cable.form}
            onChange={(e) => handleUpdate({ 
              form: e.target.value as CableForm, 
              cores: e.target.value === 'Singelo' ? 1 : undefined 
            })}
            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary rounded-xl text-sm font-bold text-secondary p-3 appearance-none transition-all"
          >
            <option value="Singelo">Singelo</option>
            <option value="Multipolar">Multipolar</option>
          </select>
        </div>

        {cable.form === 'Multipolar' && (
          <div>
            <label className="block text-[10px] font-black text-secondary uppercase mb-1.5 opacity-50 ml-1">Condutores (Vias)</label>
            <select 
              value={cable.cores || ""}
              onChange={(e) => handleUpdate({ cores: e.target.value === "" ? undefined : parseInt(e.target.value) })}
              className={`w-full bg-gray-50 border-2 border-transparent focus:border-primary rounded-xl text-sm font-bold p-3 appearance-none transition-all ${!cable.cores ? 'text-gray-400' : 'text-secondary'}`}
            >
              <option value="">Selecione...</option>
              {coreOptions.map(n => (
                <option key={n} value={n} className="text-secondary">{n} vias</option>
              ))}
            </select>
          </div>
        )}
        
        <div className="col-span-1">
          <label className="block text-[10px] font-black text-secondary uppercase mb-1.5 opacity-50 ml-1">Bitola Core</label>
          <select 
            value={cable.gauge}
            onChange={(e) => handleUpdate({ gauge: parseFloat(e.target.value) })}
            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary rounded-xl text-sm font-bold text-secondary p-3 appearance-none transition-all"
          >
            {gaugesToDisplay.map(g => (
              <option key={g.size} value={g.size}>{g.size} mm²</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black text-secondary uppercase mb-1.5 opacity-50 ml-1">Quantidade</label>
          <input 
            type="number"
            min="1"
            value={cable.quantity}
            onChange={(e) => handleUpdate({ quantity: parseInt(e.target.value) || 0 })}
            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary rounded-xl text-sm font-bold text-secondary p-3 transition-all"
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
        <div>
          <p className="text-[9px] font-black text-gray-300 uppercase">Resumo Técnico ({insulation})</p>
          <p className="text-xs font-bold text-secondary">
            {cable.form === 'Multipolar' 
              ? (cable.cores ? `${cable.cores}x${cable.gauge} mm²` : `---x${cable.gauge} mm²`) 
              : `${cable.gauge} mm²`}
            <span className="mx-2 text-gray-200">|</span> 
            Ø ext: {cable.diameter > 0 ? `${cable.diameter.toFixed(1)}mm` : '--'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-gray-300 uppercase">Subtotal Área</p>
          <p className="text-lg font-black text-primary">{(cable.area * cable.quantity).toFixed(0)} <span className="text-[10px] font-normal">mm²</span></p>
        </div>
      </div>
    </div>
  );
};

export default CableEntry;
