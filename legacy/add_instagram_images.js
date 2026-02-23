const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'data.js');
let content = fs.readFileSync(FILE_PATH, 'utf8');

const IMAGES = [
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
    'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1588392204642-f87c93e433a7?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1682687220199-d0124f48f95b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579294247477-d3daae84aed2?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563214532-6a603acbafa3?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1570716613348-18eaf396f6ae?q=80&w=600&auto=format&fit=crop'
];

const IG_MAP = {
    'santa-barbara': 'quilombokalunga',
    'capivara': 'quilombokalunga',
    'candaru': 'quilombokalunga',
    'curiola': 'quilombokalunga',
    'sao-felix': 'pousadasaofelix',
    'rio-da-prata': 'complexoriodaprata',
    'canjica': 'complexocanjica',
    'vargem-redonda': 'complexovargemredonda',
    'vale-das-araras': 'valedasararascavalcante',
    'saltos-rio-preto': 'parquenacionalchapadadosveadeiros',
    'canions-cariocas': 'parquenacionalchapadadosveadeiros',
    'sete-quedas': 'parquenacionalchapadadosveadeiros',
    'mirante-da-janela': 'mirantedajanela',
    'vale-da-lua': 'valedalua.chapadadosveadeiros',
    'raizama': 'cachoeiraraizama',
    'cataratas-dos-couros': 'cataratas.dos.couros',
    'cordovil': 'fazendavoltadaserra',
    'morada-do-sol': 'moradadosolchapada',
    'segredo': 'cachoeiradosegredo',
    'morro-vermelho': 'termasmorrovermelho',
    'eden': 'pousadaedenaguastermais',
    'encontro-das-aguas': 'encontrodasaguaschapada',
    'lajeado': 'lajeadochapada',
    'almecegas-i': 'fazendasao.bento',
    'almecegas-ii': 'fazendasao.bento',
    'sao-bento': 'fazendasao.bento',
    'loquinhas': 'fazendaloquinhas',
    'cristais': 'cachoeiradoscristais',
    'agua-fria': 'cachoeiraaguafriachapada',
    'poco-encantado': 'pocoencantadochapada',
    'anjos-arcanjos': 'cachoeirasanjosdearcanjos',
    'simao-correia': 'cachoeirasimaocorreia',
    'sertao-zen': 'sertaozenchapada',
    'macaquinhos': 'complexomacaquinhos',
    'jardim-maytrea': 'jardim_de_maytrea_',
    'gota-sat-som': 'gota.satsom',
    'observatorio': 'observatoriochapadaveadeiros',
    'mirante-sao-jorge': 'mirante.saojorge',
    'complexo-macacao': 'complexo_do_macacao'
};

function processBlock(contentPart) {
    const ATTRACTION_REGEX = /\{\s*id:\s*'([a-zA-Z0-9-]+)'[\s\S]*?images:\s*\[[\s\S]*?\](?:[\s\S]*?\}|[\s\S]*?,)/g;
    // actually the best regex might be just searching for "images:" and replacing the array there, but since we need the ID, let's just do it manually.

    return contentPart.replace(/\{\s*id:\s*'([a-zA-Z0-9-]+)',([\s\S]*?)images:\s*\[([\s\S]*?)\]/g, (match, id, middle, oldImages) => {
        // Generate exactly 5 distinct random images
        const shuffled = [...IMAGES].sort(() => 0.5 - Math.random());
        const selectedImages = shuffled.slice(0, 5);
        const imgString = "images: [\n            '" + selectedImages.join("',\n            '") + "'\n        ]";

        let newMatch = match.replace(/images:\s*\[[\s\S]*?\]/, imgString);

        if (!newMatch.includes('instagram:')) {
            const ig = IG_MAP[id] || 'guia.chapadadosveadeiros';
            newMatch = newMatch.replace(/(region:\s*'.*?',)/, "$1\n        instagram: '" + ig + "',");
        }

        return newMatch;
    });
}

const parts = content.split('const ACCOMMODATIONS = [');
parts[0] = processBlock(parts[0]);
fs.writeFileSync(FILE_PATH, parts.join('const ACCOMMODATIONS = ['), 'utf8');
console.log('Attractions updated!');
