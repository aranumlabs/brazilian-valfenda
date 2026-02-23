import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Wallet, Info } from 'lucide-react';

interface CostBreakdownProps {
    carRental: number;
    totalAccommodation: number;
    totalFood: number;
    totalAttractions: number;
    totalCost: number;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({
    carRental,
    totalAccommodation,
    totalFood,
    totalAttractions,
    totalCost
}) => {
    const items = [
        { label: 'Aluguel de Carro (suv)', value: carRental, color: 'text-brand-sky-blue' },
        { label: 'Hospedagem (3 bases)', value: totalAccommodation, color: 'text-brand-green-leaf' },
        { label: 'Alimentação Estimada', value: totalFood, color: 'text-brand-earth-ochre' },
        { label: 'Entradas de Atrações', value: totalAttractions, color: 'text-white' },
    ];

    return (
        <Card className="max-w-xl mx-auto border-brand-earth-ochre/20">
            <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-brand-earth-ochre/20 rounded-lg">
                        <Wallet className="w-5 h-5 text-brand-earth-ochre" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white">Detalhamento de Custos</h3>
                </div>

                <div className="space-y-4 mb-8">
                    {items.map((item) => (
                        <div key={item.label} className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">{item.label}</span>
                            <span className={`font-bold ${item.color}`}>R$ {item.value.toLocaleString('pt-BR')}</span>
                        </div>
                    ))}
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center text-lg">
                        <span className="text-white font-black uppercase tracking-widest text-xs">Total Final</span>
                        <span className="text-white font-black">R$ {totalCost.toLocaleString('pt-BR')}</span>
                    </div>
                </div>

                <div className="bg-brand-sky-blue/10 border border-brand-sky-blue/20 p-4 rounded-2xl flex gap-3">
                    <Info className="w-5 h-5 text-brand-sky-blue flex-shrink-0" />
                    <p className="text-[11px] text-brand-sky-blue leading-relaxed">
                        Os valores são estimativos baseados em cotações e médias de mercado.
                        Cálculos realizados considerando 4 adultos pela Chapada dos Veadeiros.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
