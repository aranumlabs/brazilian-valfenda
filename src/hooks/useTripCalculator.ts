import { useMemo } from 'react';
import { TRIP_CONFIG } from '../data/config';
import { ATTRACTIONS } from '../data/attractions';
import { ACCOMMODATIONS } from '../data/accommodations';
import { CAR_OPTIONS } from '../data/carOptions';

export const useTripCalculator = () => {
    const calculations = useMemo(() => {
        // 1. Car rental costs
        const carRental = CAR_OPTIONS[0].dailyRate * CAR_OPTIONS[0].totalDays;

        // 2. Accommodation costs
        const totalAccommodation = ACCOMMODATIONS.reduce((sum, acc) => {
            // Simplification: treating each entry as a total for that period
            // In a real app, we'd calculate nights between checkIn and checkOut
            return sum + acc.pricePerNight * 3; // Assuming 3 nights for example
        }, 0);

        // 3. Estimated food/extras (suggested R$ 150/day per person)
        const totalDays = 9;
        const foodPerPerson = totalDays * 150;
        const totalFood = foodPerPerson * TRIP_CONFIG.travelers;

        // 4. Attractions total (sample calculation with some default selections)
        const selectedAttractionsIds = ['santa-barbara', 'vale-da-lua', 'observatorio'];
        const totalAttractions = ATTRACTIONS
            .filter(a => selectedAttractionsIds.includes(a.id))
            .reduce((sum, a) => sum + (a.entranceFee * TRIP_CONFIG.travelers), 0);

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
    }, []);

    return calculations;
};
