const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'data.js');
let content = fs.readFileSync(FILE_PATH, 'utf8');

// The new attractions block we want to add to ATTRACTIONS
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
        entranceFee: 80,
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
        entranceFee: 100,
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
        entranceFee: 30,
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
    {
        id: 'complexo-macacao',
        name: 'Complexo do Macacão',
        region: 'Alto Paraíso', // usually accessed from Alto Paraíso/São João
        type: 'complexo',
        description: 'Cachoeiras deslumbrantes como a Catedral e poços de águas verdes esmeraldas.',
        distanceFromBase: 50,
        trailLength: 4,
        duration: '4-5h',
        durationSlots: 'full',
        difficulty: 'Difícil',
        entranceFee: 50,
        guideRequired: false,
        guideCost: 0,
        guideGroupSize: 0,
        fourWheelRequired: true,
        bestTime: 'Manhã',
        tips: 'Trilha íngreme com cordas em alguns trechos. Estrutura básica no local. Precisa de 4x4. @complexo_do_macaco',
        lat: -14.1800,
        lng: -47.4500,
        images: [],
    }
`;

// Populate images arrays for ALL new attractions with 10 random/thematic unsplash images
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
const populatedNewAttractions = NEW_ATTRACTIONS.replace(/images:\s*\[\s*\]/g, "images: " + imageStr);

// Clean up previous mistakes if they exist (we added 4 items to ACCOMMODATIONS)
// The end of ACCOMMODATIONS correctly looks like: { id: 'pousada-bambu', ... }, ];
// If there's an extra id: 'jardim-maytrea' after pousada-bambu, we need to cut it out.

const startOfAccommodations = content.indexOf('const ACCOMMODATIONS = [');
const cleanContentFirstPart = content.slice(0, startOfAccommodations);
const accommodationsContent = content.slice(startOfAccommodations);

// Re-generate ACCOMMODATIONS block (we only want the 20 pousadas).
// The 20 options end with pousada-bambu
const bambuIndex = accommodationsContent.indexOf("id: 'pousada-bambu'");
const bambuEndIndex = accommodationsContent.indexOf("},", bambuIndex) + 2;

const cleanAccommodations = accommodationsContent.slice(0, bambuEndIndex) + "\n];\n";

// Re-insert NEW ATTRACTIONS into ATTRACTIONS
const targetIndex = cleanContentFirstPart.indexOf('// ============================================================================');
let finalContent = cleanContentFirstPart.slice(0, targetIndex);
// find the last ]; before targetIndex
const lastBracket = finalContent.lastIndexOf('];');
if (lastBracket !== -1) {
    if (!finalContent.includes('jardim-maytrea')) {
        finalContent = finalContent.slice(0, lastBracket) + populatedNewAttractions + "\n];\n\n";
    }
}

finalContent = finalContent + cleanContentFirstPart.slice(targetIndex) + cleanAccommodations;

fs.writeFileSync(FILE_PATH, finalContent, 'utf8');
console.log('Fixed data.js and added Complexo do Macacão');
