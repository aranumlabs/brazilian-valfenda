import type { Accommodation } from './types';

export const ACCOMMODATIONS: Accommodation[] = [
    {
        id: 'pousada-camelot',
        name: 'Pousada Camelot',
        city: 'Alto Paraíso',
        pricePerNight: 329.00,
        checkIn: '30/05/2026',
        checkOut: '01/06/2026',
        breakfast: true,
        rating: 4.8,
        image: '🏰',
        description: 'Tema medieval, café da manhã regional de qualidade, ótima localização.',
        url: 'https://pousadacamelot.com.br/'
    },
    {
        id: 'pousada-vale-araras',
        name: 'Pousada Vale das Araras',
        city: 'Cavalcante',
        pricePerNight: 330.00,
        checkIn: '01/06/2026',
        checkOut: '04/06/2026',
        breakfast: true,
        rating: 4.7,
        image: '🌿',
        description: 'Imersão na natureza, cachoeira privativa, excelente para observação de araras.',
        url: 'https://www.booking.com/hotel/br/pousada-vale-das-araras.html'
    },
    {
        id: 'pousada-dente-leao',
        name: 'Pousada Dente de Leão',
        city: 'Alto Paraíso',
        pricePerNight: 400.00,
        checkIn: '04/06/2026',
        checkOut: '07/06/2026',
        breakfast: true,
        rating: 4.9,
        image: '🌼',
        description: 'Pousada charmosa com atendimento excepcional e suítes confortáveis.',
        url: 'https://www.booking.com/hotel/br/pousada-dente-leao.html'
    }
];
