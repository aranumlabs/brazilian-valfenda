
const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\jaime\\OneDrive\\Desktop\\chapada-veadeiros\\data.js';

let content = fs.readFileSync(filePath, 'utf8');

// Identify ATTRACTIONS array
const startMarker = 'const ATTRACTIONS = [';
const endMarker = '];';

let startIndex = content.indexOf(startMarker) + startMarker.length;
let depth = 1;
let endIndex = -1;

for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') depth--;

    if (depth === 0) {
        endIndex = i;
        break;
    }
}

if (startIndex === -1 || endIndex === -1) {
    console.error("Markers not found");
    process.exit(1);
}

const attractionsStr = content.substring(startIndex, endIndex);

// Parse JSON-like array
// Note: The data in data.js uses standard JSON formatting for the most part (quoted keys, etc.)
// We can use a trick to evaluate the array in a sandbox or just clean it up.
// Since I know the data is well-formatted, I'll attempt a JSON.parse with cleanup.
function parseAttractions(str) {
    try {
        // Remove trailing commas
        let cleaned = str.replace(/,\s*([\]}])/g, '$1');
        // Add brackets
        return JSON.parse('[' + cleaned + ']');
    } catch (e) {
        console.error("JSON parse error:", e);
        // Fallback to evaluating as JS if allowed (caution: only use on trusted internal files)
        try {
            return eval('[' + str + ']');
        } catch (e2) {
            console.error("Eval error:", e2);
            return null;
        }
    }
}

let attractions = parseAttractions(attractionsStr);

if (!attractions) {
    process.exit(1);
}

// 1. Unify Macaquinhos
const macaquinhosMerged = {
    "id": "macaquinhos",
    "name": "Complexo Cataratas dos Macaquinhos",
    "region": "Alto Paraíso",
    "type": "complexo",
    "description": "Complexo deslumbrante com 10 cachoeiras, incluindo a Cachoeira da Caverna, Banho dos Macacos e a majestosa Cachoeira da Luz (187m).",
    "trailLength": 7,
    "duration": "Dia inteiro",
    "durationSlots": "full",
    "difficulty": "Moderada-Difícil",
    "entranceFee": 60,
    "guideRequired": false,
    "guideCost": 0,
    "guideGroupSize": 0,
    "fourWheelRequired": true,
    "bestTime": "Estação seca (maio-setembro)",
    "tips": "A última queda (Cachoeira da Luz) é imperdível. Últimos 30km de estrada de terra exigem atenção.",
    "lat": -14.23,
    "lng": -47.45,
    "images": [
        "https://images.unsplash.com/photo-1547432098-8ec01bc09355?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518182170546-076616fd46d3?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1596700813958-382a988d5e1b?q=80&w=600&auto=format&fit=crop"
    ],
    "distances": {
        "altoParaiso": 43,
        "saoJorge": 75,
        "cavalcante": 132
    },
    "googlePhotosUrl": "https://www.google.com/search?q=Complexo+Cataratas+dos+Macaquinhos+fotos&tbm=isch"
};

attractions = attractions.filter(a => a.id !== 'macaquinhos');
attractions.push(macaquinhosMerged);

// 2. Add Bar do Mirante
const barSunset = {
    "id": "bar-mirante-sunset",
    "name": "Bar do Mirante do Pôr do Sol",
    "region": "São Jorge",
    "type": "experiencia",
    "description": "O melhor ponto de encontro em São Jorge para apreciar o pôr do sol com drinks, música ao vivo e uma vista privilegiada da Chapada.",
    "trailLength": 0,
    "duration": "2-3h",
    "durationSlots": "half",
    "difficulty": "Fácil",
    "entranceFee": 0,
    "guideRequired": false,
    "guideCost": 0,
    "guideGroupSize": 0,
    "fourWheelRequired": false,
    "bestTime": "17h-19h",
    "tips": "Chegue cedo para garantir mesa. Ótimo para relaxar após as trilhas.",
    "lat": -14.172,
    "lng": -47.653,
    "images": [
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1574096079513-d8259312b785?q=80&w=600&auto=format&fit=crop"
    ],
    "distances": {
        "altoParaiso": 36,
        "saoJorge": 0,
        "cavalcante": 126
    },
    "googlePhotosUrl": "https://www.google.com/search?q=Bar+do+Mirante+do+Pôr+do+Sol+São+Jorge+fotos&tbm=isch"
};

if (!attractions.find(a => a.id === 'bar-mirante-sunset')) {
    attractions.push(barSunset);
}

// 3. Sorting
const complexos = attractions.filter(a => a.type === 'complexo').sort((a, b) => a.name.localeCompare(b.name));
const rest = attractions.filter(a => a.type !== 'complexo').sort((a, b) => a.name.localeCompare(b.name));

const sorted = [...complexos, ...rest];

// 4. Serialize back
let serialized = ' \n';
sorted.forEach((a, idx) => {
    let json = JSON.stringify(a, null, 8);
    let indented = '    ' + json.replace(/\n/g, '\n    ');
    serialized += indented + (idx < sorted.length - 1 ? ',\n' : '\n');
});

const finalContent = content.substring(0, startIndex) + serialized + content.substring(endIndex);

fs.writeFileSync(filePath, finalContent, 'utf8');
console.log("DONE");
