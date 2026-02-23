export interface CarOption {
    id: string;
    name: string;
    type: string;
    dailyRate: number;
    totalDays: number;
    rental: string;
    features: string[];
    image: string;
    observation: string;
}

export const CAR_OPTIONS: CarOption[] = [
    {
        id: 'localiza-tcross',
        name: 'VW T-Cross 1.0 Turbo ou similar',
        type: 'Grupo GX - SUV Compacto',
        dailyRate: 254.03,
        totalDays: 8,
        rental: 'Localiza',
        features: [
            'Proteção Total Incluída',
            'Condutor Adicional Ilimitado',
            'Taxas Inclusas',
            'Km Ilimitado'
        ],
        image: '🚙',
        observation: 'Cotação para o período integral da viagem.'
    }
];
