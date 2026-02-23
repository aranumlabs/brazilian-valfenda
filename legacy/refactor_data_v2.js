const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.js');
let dataContent = fs.readFileSync(dataPath, 'utf8');

// Jardim de Maytrea Info from research
const jmInfo = {
    distances: {
        altoParaiso: 22,
        saoJorge: 17,
        cavalcante: 109
    },
    images: [
        'https://acrosstheuniverse.blog.br/wp-content/uploads/2021/05/jardim-de-maytrea-chapada-dos-veadeiros-1.jpg',
        'https://goiasturismo.go.gov.br/images/atracoes/alto-paraiso-de-goias/jardim-de-maytrea.jpg',
        'https://media-cdn.tripadvisor.com/media/photo-s/0e/69/9b/6c/jardim-de-maytreia.jpg'
    ],
    googlePhotosUrl: 'https://www.google.com/maps/place/Mirante+Jardim+de+Maytrea/@-14.130341,-47.6871181,17z/data=!4m7!3m6!1s0x93459e07310b85c1:0xc9febb37ff2e3971!8m2!3d-14.130341!4d-47.6871181!10e5!16s%2Fg%2F1ydntpdsl',
    description: 'Cartão postal da Chapada. Famoso por suas veredas ecológicas e montanhas pitorescas. Ideal para contemplação e fotos.',
    tips: 'Localizado na beira da estrada (GO-239) entre Alto Paraíso e São Jorge. Entrada gratuita.',
    entranceFee: 0,
    trailLength: 0
};

// Simple cleanup and refactor script
// 1. Identify ATTRACTIONS array
const attractionsMatch = dataContent.match(/const ATTRACTIONS = (\[[\s\S]*?\]);/);
if (!attractionsMatch) {
    console.error('Could not find ATTRACTIONS array');
    process.exit(1);
}

// We'll evaluate the array safely (since it's a simple JS file)
let attractions = eval(attractionsMatch[1]);

// 2. Filter duplicates
const seenIds = new Set();
attractions = attractions.filter(attr => {
    if (seenIds.has(attr.id)) return false;
    seenIds.add(attr.id);
    return true;
});

// 3. Transform structure
attractions = attractions.map(attr => {
    const newAttr = { ...attr };

    // Convert distanceFromBase to distances object
    const dist = attr.distanceFromBase || 0;
    newAttr.distances = {
        altoParaiso: dist,
        saoJorge: null,
        cavalcante: null
    };

    // Remove instagram
    delete newAttr.instagram;
    delete newAttr.distanceFromBase;

    // Limit images to 3
    if (newAttr.images && newAttr.images.length > 3) {
        newAttr.images = newAttr.images.slice(0, 3);
    }

    // Add placeholder googlePhotosUrl
    newAttr.googlePhotosUrl = `https://www.google.com/search?q=${encodeURIComponent(attr.name + ' Chapada dos Veadeiros photos')}&tbm=isch`;

    // Special case for Jardim de Maytrea
    if (attr.id === 'jardim-maytrea') {
        Object.assign(newAttr, jmInfo);
    }

    return newAttr;
});

// 4. Update data.js content
const newAttractionsStr = `const ATTRACTIONS = ${JSON.stringify(attractions, null, 4)};`;
dataContent = dataContent.replace(/const ATTRACTIONS = \[[\s\S]*?\];/, newAttractionsStr);

fs.writeFileSync(dataPath, dataContent);
console.log('data.js refactored successfully.');
