const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'data.js');

let content = fs.readFileSync(FILE_PATH, 'utf8');

// 1. Add specific attractions
const NEW_ATTRACTIONS = `    {
        id: 'jardim-maytrea',
        name: 'Jardim de Maytrea',
        region: 'Alto Paraíso',
        type: 'mirante',
        description: 'Cartão postal da Chapada. Famoso por suas veredas ecológicas e montanhas pitorescas. Ideal para final de tarde.',
        distanceFromBase: 20,
        trailLength: 0,
        duration: '1h',
        durationSlots: 'half',
        difficulty: 'Fácil',
        entranceFee: 0,
        guideRequired: false,
        guideCost: 0,
        guideGroupSize: 0,
        fourWheelRequired: false,
        bestTime: 'Fim de tarde (Pôr do Sol)',
        tips: 'Fica na beira da estrada (GO-239) entre Alto Paraíso e São Jorge. Rende fotos incríveis.',
        lat: -14.1350,
        lng: -47.6350,
        images: [],
    },
    {
        id: 'gota-sat-som',
        name: 'Gota Sat Som',
        region: 'Alto Paraíso',
        type: 'experiencia',
        description: 'Templo de imersão sonora e música de elevação. Experiência de som relaxante e cura.',
        distanceFromBase: 2,
        trailLength: 0,
        duration: '2h',
        durationSlots: 'half',
        difficulty: 'Fácil',
        entranceFee: 80, // Aproximado
        guideRequired: false,
        guideCost: 0,
        guideGroupSize: 0,
        fourWheelRequired: false,
        bestTime: 'Fim de tarde / Noite',
        tips: 'Verificar a programação no Instagram @gota.satsom e reservar com antecedência.',
        lat: -14.1200,
        lng: -47.5250,
        images: [],
    },
    {
        id: 'observatorio',
        name: 'Observatório Astronômico',
        region: 'Alto Paraíso',
        type: 'experiencia',
        description: 'Observação das estrelas e planetas com telescópios na região limpa e sem poluição luminosa da Chapada.',
        distanceFromBase: 5,
        trailLength: 0,
        duration: '2-3h',
        durationSlots: 'half',
        difficulty: 'Fácil',
        entranceFee: 100, // Aproximado
        guideRequired: true,
        guideCost: 0,
        guideGroupSize: 0,
        fourWheelRequired: false,
        bestTime: 'Noite',
        tips: 'Consultar no @observatoriochapadaveadeiros pois depende das condições climáticas.',
        lat: -14.1400,
        lng: -47.5000,
        images: [],
    },
    {
        id: 'mirante-sao-jorge',
        name: 'Barzinho Mirante São Jorge',
        region: 'São Jorge',
        type: 'mirante',
        description: 'Mirante do Pôr do Sol com vista privilegiada para o Parque Nacional. Cerveja gelada, drinks e música.',
        distanceFromBase: 1,
        trailLength: 0,
        duration: '2-3h',
        durationSlots: 'half',
        difficulty: 'Fácil',
        entranceFee: 30, // Consumação + entrada
        guideRequired: false,
        guideCost: 0,
        guideGroupSize: 0,
        fourWheelRequired: false,
        bestTime: 'Fim de tarde (Pôr do Sol)',
        tips: 'Chegar um pouco antes do pôr do sol para garantir lugar. @mirante.saojorge',
        lat: -14.1650,
        lng: -47.8100,
        images: [],
    },
];
`;

// Only add if not already added
if (!content.includes('jardim-maytrea')) {
    const listEndIndex = content.lastIndexOf('];');
    if (listEndIndex !== -1) {
        content = content.slice(0, listEndIndex) + NEW_ATTRACTIONS.replace('];\n', '') + content.slice(listEndIndex);
    }
}

// 2. Populate images arrays for ALL attractions with 10 random/thematic unsplash images
const fallbackImages = [
    'https://images.unsplash.com/photo-1547432098-8ec01bc09355?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518182170546-076616fd46d3?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620050867807-6f8e71887e47?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616851179047-ee8dcc1adfcb?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550953625-f7729de17282?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1623067645161-59ce95cd0841?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596700813958-382a988d5e1b?q=80&w=600&auto=format&fit=crop',
];

const imageStr = "['" + fallbackImages.join("', '") + "']";
content = content.replace(/images:\s*\[\s*\]/g, "images: " + imageStr);

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Attractions and images added to data.js successfully.');
