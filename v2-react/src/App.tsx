import { useState, useMemo } from 'react';
import { Layout } from './components/layout/Layout';
import { Hero } from './components/features/Hero';
import { KanbanBoard } from './components/features/KanbanBoard';
import { AttractionCard } from './components/features/AttractionCard';
import { AccommodationCard } from './components/features/AccommodationCard';
import { CostBreakdown } from './components/features/CostBreakdown';
import { useTripCalculator } from './hooks/useTripCalculator';
import { ATTRACTIONS } from './data/attractions';
import { ACCOMMODATIONS } from './data/accommodations';
import { TRIP_DAYS } from './data/config';
import type { Itinerary } from './data/types';

const REGIONS = ['Todos', 'Alto Paraíso', 'São Jorge', 'Cavalcante', 'Teresina de Goiás', 'Vargem Bonita', 'São João da Aliança', 'Colinas do Sul'];

function App() {
  const [itinerary, setItinerary] = useState<Itinerary>({
    '2026-05-31-morning': ['vale-da-lua'],
    '2026-06-02-morning': ['santa-barbara']
  });
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const calculations = useTripCalculator(itinerary);
  const { totalCost, perPersonCost, totalDays, travelers } = calculations;

  const filteredAttractions = useMemo(() => {
    return ATTRACTIONS.filter(attr => {
      const regionMatch = activeFilter === 'Todos' || attr.region === activeFilter;
      const searchMatch = attr.name.toLowerCase().includes(searchQuery.toLowerCase());
      return regionMatch && searchMatch;
    }).sort((a, b) => {
      if (a.region !== b.region) return a.region.localeCompare(b.region);
      return a.name.localeCompare(b.name);
    });
  }, [activeFilter, searchQuery]);

  const toggleAttractionInItinerary = (attractionId: string, dayDate: string, periodId: string) => {
    const key = `${dayDate}-${periodId}`;
    setItinerary(prev => {
      const current = prev[key] || [];
      if (current.includes(attractionId)) {
        return { ...prev, [key]: current.filter(id => id !== attractionId) };
      } else {
        return { ...prev, [key]: [...current, attractionId] };
      }
    });
  };

  return (
    <Layout>
      <Hero
        totalCost={totalCost}
        perPersonCost={perPersonCost}
        totalDays={totalDays}
        travelers={travelers}
      />

      <KanbanBoard
        itinerary={itinerary}
        onRemoveAttraction={(id, date, p) => toggleAttractionInItinerary(id, date, p)}
      />

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {/* Attractions Section */}
        <section id="atracoes">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-display font-bold text-white tracking-tight">Crie seu Roteiro</h2>
              <p className="text-slate-500 mt-1">Selecione e arraste as atrações para o seu roteiro.</p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Region Filters */}
              <div className="flex flex-wrap gap-2">
                {REGIONS.map(region => (
                  <button
                    key={region}
                    onClick={() => setActiveFilter(region)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeFilter === region
                      ? 'bg-brand-earth-ochre text-white shadow-lg shadow-brand-earth-ochre/20'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                      }`}
                  >
                    {region}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar atração..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 bg-slate-800/50 border border-slate-700 py-2 pl-4 pr-10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-earth-ochre/50"
                />
                <div className="absolute right-3 top-2.5 text-slate-500">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAttractions.map(attraction => (
              <AttractionCard
                key={attraction.id}
                attraction={attraction}
                isInItinerary={Object.values(itinerary).flat().includes(attraction.id)}
                onToggle={(id) => {
                  // Se já estiver no roteiro, removemos de todos os lugares
                  // Se não estiver, adicionamos ao primeiro slot livre (ou simplesmente não fazemos nada se não encontrar, mas vamos tentar adicionar ao primeiro dia livre)
                  if (Object.values(itinerary).flat().includes(id)) {
                    setItinerary(prev => {
                      const next = { ...prev };
                      Object.keys(next).forEach(k => {
                        next[k] = next[k].filter(attrId => attrId !== id);
                      });
                      return next;
                    });
                  } else {
                    // Tenta achar o primeiro slot livre
                    const firstDay = TRIP_DAYS[0].date;
                    toggleAttractionInItinerary(id, firstDay, 'morning');
                  }
                }}
              />
            ))}
            {filteredAttractions.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                <p className="text-slate-500 font-medium">Nenhuma atração encontrada com esses filtros.</p>
              </div>
            )}
          </div>
        </section>

        {/* Accommodation Section */}
        <section id="hospedagem">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-display font-bold text-white tracking-tight">Nossas Bases</h2>
            <p className="text-slate-500 mt-1">Hospedagens confirmadas para o roteiro.</p>
          </div>
          <div className="space-y-8 flex flex-col items-center">
            {ACCOMMODATIONS.map(acc => (
              <AccommodationCard key={acc.id} accommodation={acc} />
            ))}
          </div>
        </section>

        {/* Financial Section */}
        <section id="custos" className="pt-12">
          <CostBreakdown
            carRental={calculations.carRental}
            totalAccommodation={calculations.totalAccommodation}
            totalFood={calculations.totalFood}
            totalAttractions={calculations.totalAttractions}
            totalCost={calculations.totalCost}
          />
        </section>
      </div>
    </Layout>
  );
}

export default App;
