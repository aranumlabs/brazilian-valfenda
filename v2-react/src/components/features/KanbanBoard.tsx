import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { MapPin, Clock, X, Sunrise, Sun, Sunset } from 'lucide-react';
import { TRIP_DAYS } from '../../data/config';
import { ATTRACTIONS } from '../../data/attractions';
import type { Itinerary, PeriodId } from '../../data/types';

interface KanbanBoardProps {
    itinerary: Itinerary;
    onRemoveAttraction: (attractionId: string, dayDate: string, periodId: PeriodId) => void;
}

const PERIOD_CONFIG: { id: PeriodId; label: string; icon: any; time: string }[] = [
    { id: 'morning', label: 'Manhã', icon: Sunrise, time: '09:00' },
    { id: 'afternoon', label: 'Tarde', icon: Sun, time: '14:00' },
    { id: 'evening', label: 'Noite', icon: Sunset, time: '19:00' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ itinerary, onRemoveAttraction }) => {
    return (
        <section className="py-12 px-4 max-w-7xl mx-auto overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight">Roteiro da Jornada</h2>
                    <p className="text-slate-500 mt-1">Organize seus dias entre as maravilhas da Chapada.</p>
                </div>
            </div>

            <div className="flex overflow-x-auto pb-8 gap-6 snap-x no-scrollbar">
                {TRIP_DAYS.map((day, idx) => (
                    <div key={day.date} className="flex-shrink-0 w-[280px] md:w-[320px] snap-start group">
                        <div className="flex items-center justify-between mb-6 px-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center font-display font-bold text-brand-earth-ochre group-hover:bg-brand-earth-ochre group-hover:text-white transition-all shadow-lg">
                                    {idx + 1}
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">{day.weekday}</h3>
                                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                        <MapPin className="w-3 h-3 text-brand-earth-ochre" />
                                        {day.base}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {PERIOD_CONFIG.map((period) => {
                                const key = `${day.date}-${period.id}`;
                                const attractionIds = itinerary[key] || [];
                                const periodAttractions = ATTRACTIONS.filter(a => attractionIds.includes(a.id));

                                return (
                                    <div key={period.id} className="space-y-3">
                                        <div className="flex items-center justify-between px-2">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <period.icon className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{period.label} • {period.time}</span>
                                            </div>
                                        </div>

                                        {periodAttractions.length > 0 ? (
                                            periodAttractions.map(attr => (
                                                <Card key={attr.id} className="!rounded-2xl border-l-4 border-l-brand-earth-ochre group/card relative overflow-visible">
                                                    <CardContent className="!p-4">
                                                        <button
                                                            onClick={() => onRemoveAttraction(attr.id, day.date, period.id)}
                                                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500/80 transition-all opacity-0 group-hover/card:opacity-100 z-10"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                        <h4 className="font-bold text-white text-[13px] mb-1 leading-tight">{attr.name}</h4>
                                                        <p className="text-slate-500 text-[10px] leading-snug line-clamp-2 mb-3">
                                                            {attr.description}
                                                        </p>
                                                        <div className="flex items-center gap-3 text-brand-earth-ochre/80 text-[10px] font-bold uppercase tracking-tighter">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {attr.duration}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="w-3 h-3" />
                                                                {attr.region}
                                                            </span>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        ) : (
                                            <div className="py-4 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center">
                                                <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Livre</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
