import { useMemo } from 'react';
import { TRIP_CONFIG, TRIP_DAYS } from '../data/config';
import { ATTRACTIONS } from '../data/attractions';
import { ACCOMMODATIONS } from '../data/accommodations';
import { CAR_OPTIONS } from '../data/carOptions';
import type { Itinerary } from '../data/types';

export const useTripCalculator = (itinerary: Itinerary = {}) => {
    const calculations = useMemo(() => {
        // Collect all unique selected attraction IDs
        const selectedIds = Array.from(new Set(Object.values(itinerary).flat()));
        const selectedAttractions = ATTRACTIONS.filter(a => selectedIds.includes(a.id));

        // 1. Car rental costs
        const car = CAR_OPTIONS[0];
        const carRental = car.dailyRate * car.totalDays;

        // 2. Accommodation costs
        const totalAccommodation = ACCOMMODATIONS.reduce((sum, acc) => {
            const [dIn, mIn, yIn] = acc.checkIn.split('/').map(Number);
            const [dOut, mOut, yOut] = acc.checkOut.split('/').map(Number);
            const dateIn = new Date(yIn, mIn - 1, dIn);
            const dateOut = new Date(yOut, mOut - 1, dOut);
            const nights = Math.ceil((dateOut.getTime() - dateIn.getTime()) / (1000 * 60 * 60 * 24));
            return sum + (acc.pricePerNight * nights * TRIP_CONFIG.couples);
        }, 0);

        // 3. Estimated food/extras (R$ 150/day per person)
        const totalDays = TRIP_DAYS.length;
        const foodPerPerson = totalDays * 150;
        const totalFood = foodPerPerson * TRIP_CONFIG.travelers;

        // 4. Attractions total
        const totalAttractions = selectedAttractions.reduce((sum, a) => {
            const entrance = a.entranceFee * TRIP_CONFIG.travelers;
            const guide = a.guideRequired ? a.guideCost : 0;
            return sum + entrance + guide;
        }, 0);

        const totalCost = carRental + totalAccommodation + totalFood + totalAttractions;
        const perPersonCost = totalCost / TRIP_CONFIG.travelers;

        return {
            totalCost,
            perPersonCost,
            totalDays,
            travelers: TRIP_CONFIG.travelers,
            carRental,
            totalAccommodation,
            totalFood,
            totalAttractions
        };
    }, [itinerary]);

    return calculations;
};
