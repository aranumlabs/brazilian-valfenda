import React from 'react';
import { Users, Wallet, MapPin, Calculator } from 'lucide-react';

interface HeroProps {
    totalCost: number;
    perPersonCost: number;
    totalDays: number;
    travelers: number;
}

export const Hero: React.FC<HeroProps> = ({ totalCost, perPersonCost, totalDays, travelers }) => {
    return (
        <section className="relative overflow-hidden pt-12 pb-20 px-4">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-brand-green-leaf rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-earth-ochre rounded-full blur-[150px]" />
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="font-display text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                        Chapadeiros <span className="text-brand-earth-ochre italic">Voadores</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Uma viagem até Valfenda Brasileira
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl group hover:bg-white/[0.06] transition-all">
                        <div className="bg-brand-green-leaf/20 p-3 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6 text-brand-green-leaf" />
                        </div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Viajantes</p>
                        <h3 className="text-2xl font-bold text-white">{travelers} Adultos</h3>
                    </div>

                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl group hover:bg-white/[0.06] transition-all">
                        <div className="bg-brand-earth-ochre/20 p-3 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                            <MapPin className="w-6 h-6 text-brand-earth-ochre" />
                        </div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Duração</p>
                        <h3 className="text-2xl font-bold text-white">{totalDays} Dias Intensos</h3>
                    </div>

                    <div className="bg-brand-earth-ochre p-6 rounded-3xl group shadow-[0_20px_50px_rgba(180,140,77,0.3)] transition-all">
                        <div className="bg-white/20 p-3 rounded-2xl w-fit mb-4">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-white/70 text-sm font-medium mb-1">Total Estimado</p>
                        <h3 className="text-2xl font-black text-white">R$ {totalCost.toLocaleString('pt-BR')}</h3>
                    </div>

                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl group hover:bg-white/[0.06] transition-all">
                        <div className="bg-brand-sky-blue/20 p-3 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                            <Calculator className="w-6 h-6 text-brand-sky-blue" />
                        </div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Por Pessoa</p>
                        <h3 className="text-2xl font-bold text-white">R$ {perPersonCost.toLocaleString('pt-BR')}</h3>
                    </div>
                </div>
            </div>
        </section>
    );
};
