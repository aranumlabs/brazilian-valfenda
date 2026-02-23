import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { MapPin, Clock, ChevronRight } from 'lucide-react';
import { TRIP_DAYS } from '../../data/config';

export const KanbanBoard: React.FC = () => {
    return (
        <section className="py-12 px-4 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight">Roteiro da Jornada</h2>
                    <p className="text-slate-500 mt-1">Organize seus dias entre as bases da Chapada.</p>
                </div>
                <div className="flex gap-2">
                    <span className="bg-brand-green-leaf/20 text-brand-green-leaf text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-green-leaf/30">
                        Atualizado 2026
                    </span>
                </div>
            </div>

            <div className="flex overflow-x-auto pb-8 gap-6 snap-x no-scrollbar">
                {TRIP_DAYS.map((day, idx) => (
                    <div key={day.date} className="flex-shrink-0 w-[300px] snap-start group">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center font-display font-bold text-brand-earth-ochre group-hover:bg-brand-earth-ochre group-hover:text-white transition-all">
                                    {idx + 1}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm uppercase tracking-wide">{day.weekday} — {day.label}</h3>
                                    <div className="flex items-center gap-1 text-slate-500 text-[10px] font-medium">
                                        <MapPin className="w-3 h-3" />
                                        {day.base}
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <ChevronRight className="w-4 h-4 text-slate-600" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* This would ideally list attractions for that day */}
                            <Card className="!rounded-2xl border-l-4 border-l-brand-earth-ochre">
                                <CardContent className="!p-4">
                                    <span className="inline-block text-[9px] font-black uppercase tracking-tighter text-brand-earth-ochre mb-2">Manhã • 09:00</span>
                                    <h4 className="font-bold text-white text-sm mb-2">Deslocamento & Check-in</h4>
                                    <p className="text-slate-500 text-[11px] leading-snug mb-3">
                                        Chegada e organização na base {day.base}. Preparativos para a primeira incursão.
                                    </p>
                                    <div className="flex items-center gap-3 text-slate-400 text-[10px]">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            2h
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            Centro
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Placeholder for more cards */}
                            <button className="w-full py-3 rounded-2xl border-2 border-dashed border-white/5 text-slate-600 text-[11px] font-bold uppercase tracking-widest hover:border-brand-earth-ochre/30 hover:text-brand-earth-ochre transition-all">
                                + Adicionar Atração
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
