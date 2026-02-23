
const fs = require('fs');
const path = require('path');

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

const BASES = {
    altoParaiso: { lat: -14.1311, lng: -47.5147 },
    saoJorge: { lat: -14.1722, lng: -47.8183 },
    cavalcante: { lat: -13.7915, lng: -47.4578 }
};

function calculateRoadDistance(lat1, lon1, lat2, lon2) {
    const d = haversine(lat1, lon1, lat2, lon2);
    return Math.round(d * 1.5);
}

function getGooglePhotosUrl(name) {
    const query = name.replace(/ /g, '+');
    return `https://www.google.com/search?q=${query}+fotos+chapada+dos+veadeiros&tbm=isch`;
}

const dataPath = path.join(__dirname, 'data.js');
let content = fs.readFileSync(dataPath, 'utf8');

// Use a more robust regex for the ATTRACTIONS array
const match = content.match(/const ATTRACTIONS = (\[[\s\S]*?\]);/);
if (!match) {
    console.error("Could not find ATTRACTIONS array");
    process.exit(1);
}

// We need to handle the fact that it's JS, not strict JSON. 
// But given the previous refactor, it's very close to JSON.
let attractions;
try {
    // Attempt to evaluate the array literal safely
    // Since we know the content and it's our own structured data
    attractions = JSON.parse(match[1]);
} catch (e) {
    console.error("Error parsing ATTRACTIONS as JSON, trying simplified eval");
    try {
        // Fallback for non-strict JSON (like missing quotes on keys if they were there)
        attractions = eval(match[1]);
    } catch (e2) {
        console.error("Fatal: Could not parse ATTRACTIONS array", e2);
        process.exit(1);
    }
}

attractions.forEach(attr => {
    if (attr.lat && attr.lng) {
        attr.distances = {
            altoParaiso: calculateRoadDistance(attr.lat, attr.lng, BASES.altoParaiso.lat, BASES.altoParaiso.lng),
            saoJorge: calculateRoadDistance(attr.lat, attr.lng, BASES.saoJorge.lat, BASES.saoJorge.lng),
            cavalcante: calculateRoadDistance(attr.lat, attr.lng, BASES.cavalcante.lat, BASES.cavalcante.lng)
        };
    }

    attr.googlePhotosUrl = getGooglePhotosUrl(attr.name);

    // Manual overrides for accuracy
    if (attr.id === 'jardim-maytrea') {
        attr.distances = { altoParaiso: 22, saoJorge: 17, cavalcante: 109 };
    }
    if (attr.id === 'santa-barbara') {
        attr.distances = { altoParaiso: 117, saoJorge: 153, cavalcante: 27 };
    }
    if (attr.id === 'capivara') {
        attr.distances = { altoParaiso: 115, saoJorge: 151, cavalcante: 25 };
    }
});

const newArrayStr = JSON.stringify(attractions, null, 4);
const newContent = content.replace(/const ATTRACTIONS = \[[\s\S]*?\];/, `const ATTRACTIONS = ${newArrayStr};`);

fs.writeFileSync(dataPath, newContent, 'utf8');
console.log("Successfully enriched attractions data.");
