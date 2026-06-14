
import React from 'react';

interface Props {
  title: string;
  type: 'Eletrocalha' | 'Leito' | 'Eletroduto';
  totalArea: number;
  width?: number;
  aba?: number;
  conduitSize?: string;
  onAbaChange?: (val: number) => void;
  availableAbas?: number[];
  occupancy: number;
  limit?: number;
}

const ResultCard: React.FC<Props> = ({ 
  title, 
  type, 
  totalArea, 
  width, 
  aba, 
  conduitSize, 
  onAbaChange, 
  availableAbas = [],
  occupancy,
  limit = 40
}) => {
  const isConduit = type === 'Eletroduto';

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100 flex flex-col h-full hover:shadow-xl transition-shadow border-b-4 border-primary/10">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-black text-secondary text-lg uppercase tracking-tight">{title}</h3>
        <div className={`p-2.5 rounded-xl ${isConduit ? 'bg-secondary text-primary' : 'bg-primary text-secondary'}`}>
          {isConduit ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-5">
        {!isConduit ? (
          <>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">Altura da Aba</label>
              <div className="relative">
                <select 
                  value={aba}
                  onChange={(e) => onAbaChange?.(parseInt(e.target.value))}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-xl font-black text-secondary focus:ring-4 focus:ring-primary/20 focus:border-primary appearance-none transition-all"
                >
                  {availableAbas.map(a => <option key={a} value={a}>{a} mm</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary p-5 rounded-2xl border-l-8 border-primary shadow-inner">
              <p className="text-[10px] font-black text-primary uppercase mb-1">Largura Mínima</p>
              <p className="text-4xl font-black text-white">{width} <span className="text-sm font-normal text-white/40">mm</span></p>
            </div>
          </>
        ) : (
          <div className="bg-secondary p-6 rounded-2xl border-l-8 border-primary flex flex-col items-center justify-center h-full min-h-[160px] shadow-inner">
            <p className="text-[10px] font-black text-primary uppercase mb-2">Polegadas (SCH 40)</p>
            <p className="text-5xl font-black text-white">{conduitSize}</p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-5 border-t border-gray-100">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Taxa de Ocupação (Limite {limit.toFixed(0)}%)</p>
            <p className={`text-2xl font-black ${occupancy > limit ? 'text-red-500' : 'text-secondary'}`}>
              {occupancy.toFixed(1)}%
            </p>
          </div>
          <div className="h-3 w-32 bg-gray-100 rounded-full overflow-hidden mb-1">
            <div 
              className={`h-full transition-all duration-500 ${occupancy > limit ? 'bg-red-500' : 'bg-primary'}`} 
              style={{ width: `${Math.min((occupancy / limit) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
