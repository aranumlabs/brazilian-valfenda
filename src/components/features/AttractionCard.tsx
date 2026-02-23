import React from 'react';
import { Card, CardContent } from '../ui/Card';
import type { Attraction } from '../../data/types';
import { MapPin, Star, Footprints, Clock, ExternalLink } from 'lucide-react';

interface AttractionCardProps {
    attraction: Attraction;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({ attraction }) => {
    return (
        <Card className="group">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={attraction.images[0]}
                    alt={attraction.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                    <span className="bg-brand-green-deep/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10">
                        {attraction.type}
                    </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
                        <MapPin className="w-3 h-3 text-brand-earth-ochre" />
                        {attraction.region}
                    </div>
                </div>
            </div>

            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-brand-earth-ochre transition-colors">
                        {attraction.name}
                    </h3>
                    <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] font-bold text-white">4.8</span>
                    </div>
                </div>

                <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {attraction.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Footprints className="w-4 h-4 text-brand-green-leaf" />
                        <span className="text-[10px] font-semibold">{attraction.trailLength}km Trilha</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4 text-brand-sky-blue" />
                        <span className="text-[10px] font-semibold">{attraction.duration}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="text-xs">
                        <span className="text-slate-500 block mb-0.5">Entrada</span>
                        <span className="text-white font-bold">R$ {attraction.entranceFee}</span>
                    </div>
                    <a
                        href={attraction.googlePhotosUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/5 rounded-xl hover:bg-brand-earth-ochre hover:text-white transition-all group/btn"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </CardContent>
        </Card>
    );
};
