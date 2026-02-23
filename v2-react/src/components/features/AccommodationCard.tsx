import React from 'react';
import { Card, CardContent } from '../ui/Card';
import type { Accommodation } from '../../data/types';
import { Home, Star, Coffee, Calendar, ExternalLink } from 'lucide-react';

interface AccommodationCardProps {
    accommodation: Accommodation;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation }) => {
    return (
        <Card className="group flex flex-col md:flex-row max-w-4xl w-full overflow-hidden">
            <div className="md:w-1/3 relative h-64 md:h-auto">
                <div className="absolute inset-0 bg-brand-green-deep flex items-center justify-center text-6xl">
                    {accommodation.image}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-deep to-transparent opacity-60"></div>
                <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                        <Star className="w-3 h-3 text-brand-earth-ochre fill-brand-earth-ochre" />
                        <span className="text-xs font-bold text-white">{accommodation.rating}</span>
                    </div>
                </div>
            </div>

            <div className="md:w-2/3 flex flex-col">
                <CardContent className="p-5 md:p-8 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Home className="w-4 h-4 text-brand-green-leaf" />
                                <span className="text-[10px] font-bold text-brand-green-leaf uppercase tracking-widest">{accommodation.city}</span>
                            </div>
                            <h3 className="font-display font-black text-2xl text-white group-hover:text-brand-earth-ochre transition-colors leading-tight">
                                {accommodation.name}
                            </h3>
                        </div>
                        <div className="text-right">
                            <span className="text-slate-500 text-[10px] font-bold uppercase block mb-1">Diária</span>
                            <span className="text-2xl font-black text-white">R$ {accommodation.pricePerNight}</span>
                        </div>
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        {accommodation.description}
                    </p>

                    <div className="flex flex-wrap gap-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-brand-earth-ochre" />
                            <span>{accommodation.checkIn} — {accommodation.checkOut}</span>
                        </div>
                        {accommodation.breakfast && (
                            <div className="flex items-center gap-2">
                                <Coffee className="w-4 h-4 text-brand-green-leaf" />
                                <span>Café da Manhã Incluso</span>
                            </div>
                        )}
                    </div>
                </CardContent>

                <div className="px-5 py-4 md:px-8 md:py-5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500">Reserva Confirmada via Booking.com</span>
                    </div>
                    <a
                        href={accommodation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-brand-earth-ochre px-6 py-2.5 rounded-2xl text-xs font-black text-white hover:bg-brand-earth-ochre/80 transition-all active:scale-95 shadow-lg shadow-brand-earth-ochre/20"
                    >
                        Ver Detalhes
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </Card>
    );
};
