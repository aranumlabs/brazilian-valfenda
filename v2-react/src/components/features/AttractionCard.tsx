import React from 'react';
import { Card, CardContent } from '../ui/Card';
import type { Attraction } from '../../data/types';
import { MapPin, Star, Footprints, Clock, ExternalLink, CalendarPlus, Check, Info } from 'lucide-react';

interface AttractionCardProps {
    attraction: Attraction;
    isInItinerary?: boolean;
    onToggle?: (attractionId: string) => void;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({
    attraction,
    isInItinerary = false,
    onToggle
}) => {
    const formatCurrency = (value: number) => {
        if (value === 0) return 'Grátis';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <Card className={`group h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-brand-earth-ochre/10 ${isInItinerary ? 'ring-2 ring-brand-green-leaf/50 shadow-lg shadow-brand-green-leaf/5' : ''
            }`}>
            <div className="relative h-56 overflow-hidden">
                <img
                    src={attraction.images[0]}
                    alt={attraction.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>

                {/* Badges Superior */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="bg-brand-green-deep/80 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10 shadow-xl">
                        {attraction.type}
                    </span>
                    {attraction.guideRequired && (
                        <span className="bg-brand-earth-ochre/90 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10 shadow-xl flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            Guia
                        </span>
                    )}
                    {attraction.fourWheelRequired && (
                        <span className="bg-brand-sky-blue/80 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10 shadow-xl">
                            4x4
                        </span>
                    )}
                </div>

                {/* Region Badge Inferior */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold uppercase tracking-widest">
                        <MapPin className="w-3 h-3 text-brand-earth-ochre" />
                        {attraction.region}
                    </div>
                </div>

                {/* Status Indicator */}
                {isInItinerary && (
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-green-leaf text-white flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                        <Check className="w-5 h-5 stroke-[3px]" />
                    </div>
                )}
            </div>

            <CardContent className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-display font-black text-xl text-white group-hover:text-brand-earth-ochre transition-colors leading-tight">
                        {attraction.name}
                    </h3>
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[11px] font-black text-white">4.9</span>
                    </div>
                </div>

                <p className="text-slate-400 text-[13px] line-clamp-2 mb-6 leading-relaxed flex-grow">
                    {attraction.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2.5 text-slate-300">
                        <div className="w-8 h-8 rounded-lg bg-brand-green-leaf/10 flex items-center justify-center">
                            <Footprints className="w-4 h-4 text-brand-green-leaf" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">Trilha</span>
                            <span className="text-[11px] font-bold">{attraction.trailLength}km</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-300">
                        <div className="w-8 h-8 rounded-lg bg-brand-sky-blue/10 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-brand-sky-blue" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">Duração</span>
                            <span className="text-[11px] font-bold">{attraction.duration}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Entrada</span>
                        <span className="text-base font-black text-white">{formatCurrency(attraction.entranceFee)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onToggle?.(attraction.id)}
                            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 shadow-xl ${isInItinerary
                                ? 'bg-brand-green-leaf text-white shadow-brand-green-leaf/20 hover:bg-brand-green-leaf/90'
                                : 'bg-brand-earth-ochre text-white hover:bg-brand-earth-ochre/90 shadow-brand-earth-ochre/20 hover:scale-[1.02]'
                                } active:scale-95`}
                        >
                            {isInItinerary ? (
                                <>
                                    <Check className="w-4 h-4 stroke-[3px]" />
                                    No Roteiro
                                </>
                            ) : (
                                <>
                                    <CalendarPlus className="w-4 h-4" />
                                    Roteiro
                                </>
                            )}
                        </button>
                        <a
                            href={attraction.googlePhotosUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 group/btn"
                            title="Ver Fotos"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
