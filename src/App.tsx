import { Layout } from './components/layout/Layout';
import { Hero } from './components/features/Hero';
import { KanbanBoard } from './components/features/KanbanBoard';
import { AttractionCard } from './components/features/AttractionCard';
import { AccommodationCard } from './components/features/AccommodationCard';
import { CostBreakdown } from './components/features/CostBreakdown';
import { useTripCalculator } from './hooks/useTripCalculator';
import { ATTRACTIONS } from './data/attractions';
import { ACCOMMODATIONS } from './data/accommodations';

function App() {
  const calculations = useTripCalculator();
  const { totalCost, perPersonCost, totalDays, travelers } = calculations;

  return (
    <Layout>
      <Hero
        totalCost={totalCost}
        perPersonCost={perPersonCost}
        totalDays={totalDays}
        travelers={travelers}
      />

      <KanbanBoard />

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {/* Featured Attractions Section */}
        <section>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-display font-bold text-white tracking-tight">Atrações Imperdíveis</h2>
              <p className="text-slate-500 mt-1">Conheça os segredos da Chapada dos Veadeiros.</p>
            </div>
            <p className="text-xs font-bold text-brand-earth-ochre hidden sm:block uppercase tracking-widest">
              3 de {ATTRACTIONS.length} Lugares
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ATTRACTIONS.slice(0, 3).map(attraction => (
              <AttractionCard key={attraction.id} attraction={attraction} />
            ))}
          </div>
        </section>

        {/* Accommodation Section */}
        <section id="hospedagem">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-display font-bold text-white tracking-tight">Nossas Bases</h2>
            <p className="text-slate-500 mt-1">Hospedagens confirmadas para o grupo.</p>
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
