export interface Attraction {
    id: string;
    name: string;
    region: string;
    type: string;
    description: string;
    trailLength: number;
    duration: string;
    durationSlots: 'half' | 'full';
    difficulty: 'Fácil' | 'Fácil-Moderada' | 'Moderada' | 'Difícil' | 'Moderada-Difícil' | 'Muito Difícil';
    entranceFee: number;
    guideRequired: boolean;
    guideCost: number;
    guideGroupSize: number;
    fourWheelRequired: boolean;
    bestTime: string;
    tips: string;
    lat: number;
    lng: number;
    images: string[];
    distances: {
        altoParaiso: number;
        saoJorge: number;
        cavalcante: number;
        teresina?: number;
        vargemBonita?: number;
    };
    googlePhotosUrl: string;
    instagramUrl?: string;
}

export interface Accommodation {
    id: string;
    name: string;
    city: string;
    pricePerNight: number;
    checkIn: string;
    checkOut: string;
    breakfast: boolean;
    rating: number;
    image: string;
    description: string;
    url: string;
}

export interface TripConfig {
    startDate: string;
    endDate: string;
    adults: number;
    children: number;
    travelers: number;
    couples: number;
    origin: string;
    distanceBSBtoCavalcante: number;
    distanceBSBtoAltoParaiso: number;
    distanceBSBtoSaoJorge: number;
}
