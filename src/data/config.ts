import type { TripConfig } from './types';

export const TRIP_CONFIG: TripConfig = {
    startDate: '2026-05-30',
    endDate: '2026-06-07',
    adults: 4,
    children: 0,
    travelers: 4,
    couples: 2,
    origin: 'Aeroporto de Brasília (BSB)',
    distanceBSBtoCavalcante: 322,
    distanceBSBtoAltoParaiso: 235,
    distanceBSBtoSaoJorge: 270,
};

export const TRIP_DAYS = [
    { date: '2026-05-30', label: '30/05', weekday: 'Sáb', base: 'Alto Paraíso' },
    { date: '2026-05-31', label: '31/05', weekday: 'Dom', base: 'Alto Paraíso' },
    { date: '2026-06-01', label: '01/06', weekday: 'Seg', base: 'Cavalcante' },
    { date: '2026-06-02', label: '02/06', weekday: 'Ter', base: 'Cavalcante' },
    { date: '2026-06-03', label: '03/06', weekday: 'Qua', base: 'Cavalcante' },
    { date: '2026-06-04', label: '04/06', weekday: 'Qui', base: 'Alto Paraíso' },
    { date: '2026-06-05', label: '05/06', weekday: 'Sex', base: 'Alto Paraíso' },
    { date: '2026-06-06', label: '06/06', weekday: 'Sáb', base: 'Alto Paraíso' },
    { date: '2026-06-07', label: '07/06', weekday: 'Dom', base: 'Retorno' },
];
