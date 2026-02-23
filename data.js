// ============================================================================
// CHAPADA DOS VEADEIROS - DATA LAYER v2
// Base de dados completa com coordenadas reais, imagens, locadoras, hotéis
// ============================================================================

const TRIP_CONFIG = {
        startDate: '2026-05-30',
        endDate: '2026-06-07',
        adults: 4,
        children: 0,
        travelers: 4,
        couples: 2,
        origin: 'Aeroporto de Brasília (BSB)',
        distanceBSBtoCavalcante: 322,
        distanceBSBtoAltoParaiso: 235,
        distanceBSBtoSaoJorge: 270,
        distanceCavalcanteToAltoParaiso: 90,
        distanceAltoParaisoToSaoJorge: 36,
};

let TRIP_DAYS = [
        { date: '2026-05-30', label: '30/05', weekday: 'Sáb', base: 'Alto Paraíso' },
        { date: '2026-05-31', label: '31/05', weekday: 'Dom', base: 'Alto Paraíso' },
        { date: '2026-06-01', label: '01/06', weekday: 'Seg', base: 'Cavalcante' },
        { date: '2026-06-02', label: '02/06', weekday: 'Ter', base: 'Cavalcante' },
        { date: '2026-06-03', label: '03/06', weekday: 'Qua', base: 'Cavalcante' },
        { date: '2026-06-04', label: '04/06', weekday: 'Qui', base: 'Alto Paraíso' },
        { date: '2026-06-05', label: '05/06', weekday: 'Sex', base: 'Alto Paraíso' },
        { date: '2026-06-06', label: '06/06', weekday: 'Sáb', base: 'Alto Paraíso' },
        { date: '2026-06-07', label: '07/06', weekday: 'Dom', base: 'Retorno' },
];

function getDurationSlots(duration) {
        const d = duration.toLowerCase();
        if (d.includes('dia inteiro') || d.includes('6-8h') || d.includes('5-6h') || d.includes('6-7h') || d.includes('2 dias')) return 'full';
        return 'half';
}

// ============================================================================
// ATRAÇÕES
// ============================================================================
const ATTRACTIONS = [
        {
                "id": "observatorio",
                "name": "Observatório Astronômico",
                "region": "Alto Paraíso",
                "type": "experiência",
                "description": "Observação do céu estrelado da Chapada com telescópios profissionais e explicação de astrônomos.",
                "trailLength": 0.5,
                "duration": "2h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 120,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Noite",
                "tips": "Agendar com antecedência. O céu da Chapada é um dos melhores do Brasil para observação.",
                "lat": -14.13,
                "lng": -47.52,
                "images": [
                        "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 5,
                        "saoJorge": 41,
                        "cavalcante": 95
                },
                "googlePhotosUrl": "https://share.google/SBEIuDQu4T14TtMdL"
        },
        {
                "id": "bocaina-farias",
                "name": "Bocaina do Farias",
                "region": "São João da Aliança",
                "type": "complexo",
                "description": "Cânion espetacular com imensas paredes de pedra e vegetação densa. Um dos segredos da Chapada.",
                "trailLength": 2.5,
                "duration": "5h",
                "durationSlots": "full",
                "difficulty": "Moderada",
                "entranceFee": 40,
                "guideRequired": true,
                "guideCost": 200,
                "guideGroupSize": 6,
                "fourWheelRequired": false,
                "bestTime": "Manhã",
                "tips": "Trilha rústica, caminhar pelo leito do rio. Necessário guia local.",
                "lat": -14.7,
                "lng": -47.52,
                "images": [
                        "https://images.unsplash.com/photo-1623067645161-59ce95cd0841?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 70,
                        "saoJorge": 118,
                        "cavalcante": 160
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Bocaina+do+Farias+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "cristais",
                "name": "Cachoeira dos Cristais",
                "region": "Alto Paraíso",
                "type": "complexo",
                "description": "Complexo em propriedade particular com vários poços, camping e restaurante.",
                "trailLength": 2,
                "duration": "2-3h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 20,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Dia todo",
                "tips": "Cristais de quartzo no solo!",
                "lat": -14.105,
                "lng": -47.49,
                "images": [
                        "https://images.unsplash.com/photo-1620050867807-6f8e71887e47?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1579294247477-d3daae84aed2?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 6,
                        "saoJorge": 54,
                        "cavalcante": 53
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cachoeira+dos+Cristais+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "loquinhas",
                "name": "Cachoeira Loquinhas",
                "region": "Alto Paraíso",
                "type": "complexo",
                "description": "18 poços cristalinos e 3 trilhas (Loquinhas, Violeta, Ruby). Decks de madeira.",
                "trailLength": 5,
                "duration": "3-5h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 50,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "11h-13h (Poço Xamã com sol)",
                "tips": "Boa infraestrutura: banheiros, lanchonete.",
                "lat": -14.115,
                "lng": -47.51,
                "images": [
                        "https://images.unsplash.com/photo-1596700813958-382a988d5e1b?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1616851179047-ee8dcc1adfcb?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 3,
                        "saoJorge": 51,
                        "cavalcante": 55
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cachoeira+Loquinhas+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "cataratas-dos-couros",
                "name": "Cataratas dos Couros",
                "region": "Alto Paraíso",
                "type": "complexo",
                "description": "Complexo gratuito com Muralha, Almécegas 1000, Parafuso e Buracão.",
                "trailLength": 6,
                "duration": "Dia inteiro",
                "durationSlots": "full",
                "difficulty": "Moderada-Difícil",
                "entranceFee": 0,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": true,
                "bestTime": "Estação seca (junho-setembro)",
                "tips": "Entrada gratuita! Contribuição espontânea p/ vigia.",
                "lat": -14.0922,
                "lng": -47.8428,
                "images": [
                        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1518182170546-076616fd46d3?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1563214532-6a603acbafa3?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 53,
                        "saoJorge": 14,
                        "cavalcante": 80
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cataratas+dos+Couros+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "canjica",
                "name": "Complexo Canjica e Águas Lindas",
                "region": "Cavalcante",
                "type": "complexo",
                "description": "Piscinas naturais com borda infinita natural. Visitação dura o dia todo.",
                "trailLength": 10,
                "duration": "Dia inteiro",
                "durationSlots": "full",
                "difficulty": "Moderada-Difícil",
                "entranceFee": 80,
                "guideRequired": true,
                "guideCost": 350,
                "guideGroupSize": 6,
                "fourWheelRequired": true,
                "bestTime": "Saída cedo",
                "tips": "Tênis fechado obrigatório. Capacidade limitada.",
                "lat": -13.58,
                "lng": -47.43,
                "images": [
                        "https://images.unsplash.com/photo-1682687220199-d0124f48f95b?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1596700813958-382a988d5e1b?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1563214532-6a603acbafa3?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 93,
                        "saoJorge": 117,
                        "cavalcante": 36
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Complexo+Canjica+e+Águas+Lindas+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
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
        },
        {
                "id": "boqueirao-cav",
                "name": "Complexo do Boqueirão",
                "region": "Cavalcante",
                "type": "complexo",
                "description": "Piscinas naturais de águas absurdamente cristalinas. Trilha muito curta e fácil.",
                "trailLength": 0.3,
                "duration": "3-4h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 50,
                "guideRequired": true,
                "guideCost": 150,
                "guideGroupSize": 6,
                "fourWheelRequired": true,
                "bestTime": "Dia todo",
                "tips": "A acesso por estrada de terra (72km de Cavalcante). Recomenda-se 4x4.",
                "lat": -13.65,
                "lng": -47.55,
                "images": [
                        "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1563214532-6a603acbafa3?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 83,
                        "saoJorge": 104,
                        "cavalcante": 72
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Complexo+do+Boqueirão+Cavalcante+fotos&tbm=isch"
        },
        {
                "id": "rio-da-prata",
                "name": "Complexo Rio da Prata",
                "region": "Cavalcante",
                "type": "complexo",
                "description": "8 cachoeiras incluindo Rei do Prata, Pratinha e Esmeralda. Águas esmeralda espetaculares.",
                "trailLength": 14,
                "duration": "Dia inteiro",
                "durationSlots": "full",
                "difficulty": "Moderada",
                "entranceFee": 50,
                "guideRequired": true,
                "guideCost": 200,
                "guideGroupSize": 6,
                "fourWheelRequired": true,
                "bestTime": "Manhã (saída cedo)",
                "tips": "Leve bastante água. Há opção de camping.",
                "lat": -13.6338,
                "lng": -47.4958,
                "images": [
                        "https://images.unsplash.com/photo-1682687220199-d0124f48f95b?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1563214532-6a603acbafa3?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1588392204642-f87c93e433a7?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 83,
                        "saoJorge": 104,
                        "cavalcante": 27
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Complexo+Rio+da+Prata+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "vargem-redonda",
                "name": "Complexo Vargem Redonda",
                "region": "Cavalcante",
                "type": "complexo",
                "description": "Três piscinas naturais esverdeadas com rica biodiversidade e chuveirinhos do cerrado.",
                "trailLength": 11,
                "duration": "Dia inteiro",
                "durationSlots": "full",
                "difficulty": "Fácil-Moderada",
                "entranceFee": 50,
                "guideRequired": true,
                "guideCost": 200,
                "guideGroupSize": 6,
                "fourWheelRequired": true,
                "bestTime": "Manhã",
                "tips": "Limite de 30 visitantes/dia. Reserve com antecedência.",
                "lat": -13.65,
                "lng": -47.42,
                "images": [
                        "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1623067645161-59ce95cd0841?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1563214532-6a603acbafa3?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 82,
                        "saoJorge": 108,
                        "cavalcante": 24
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Complexo+Vargem+Redonda+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "morada-do-sol",
                "name": "Morada do Sol",
                "region": "São Jorge",
                "type": "complexo",
                "description": "Piscinas naturais relaxantes com várias cachoeiras. Trilha leve de 4km.",
                "trailLength": 4,
                "duration": "3-4h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 40,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Manhã",
                "tips": "Ótimo para relaxar.",
                "lat": -14.18,
                "lng": -47.69,
                "images": [
                        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1550953625-f7729de17282?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1570716613348-18eaf396f6ae?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 30,
                        "saoJorge": 21,
                        "cavalcante": 75
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Morada+do+Sol+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "sertao-zen",
                "name": "Sertão Zen",
                "region": "Alto Paraíso",
                "type": "complexo",
                "description": "Santuário ecológico com cachoeiras e trilhas meditativas.",
                "trailLength": 3,
                "duration": "2-3h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 40,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Manhã ou tarde",
                "tips": "Experiência contemplativa e meditativa.",
                "lat": -14.12,
                "lng": -47.53,
                "images": [
                        "https://images.unsplash.com/photo-1563214532-6a603acbafa3?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1550953625-f7729de17282?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 3,
                        "saoJorge": 47,
                        "cavalcante": 56
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Sertão+Zen+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "trilha-amarela",
                "name": "Trilha Amarela (Saltos, Carrossel e Corredeiras)",
                "region": "São Jorge",
                "type": "complexo",
                "description": "A trilha mais icônica do Parque Nacional. Inclui o Salto de 120m, o Salto de 80m (Garimpão), o incrível mirante do Carrossel e as Corredeiras do Rio Preto.",
                "trailLength": 11,
                "duration": "Dia inteiro",
                "durationSlots": "full",
                "difficulty": "Moderada-Difícil",
                "entranceFee": 47,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Manhã (saída cedo)",
                "tips": "Combine os Saltos com o banho nas Corredeiras. Requer fôlego para a subida de volta.",
                "lat": -14.15,
                "lng": -47.62,
                "images": [
                        "https://images.unsplash.com/photo-1682687220199-d0124f48f95b?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1547432098-8ec01bc09355?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1518182170546-076616fd46d3?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 38,
                        "saoJorge": 1,
                        "cavalcante": 120
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Trilha+Amarela+Saltos+Parque+Nacional+Chapada+dos+Veadeiros+fotos&tbm=isch"
        },
        {
                "id": "morro-vermelho",
                "name": "Águas Termais Morro Vermelho",
                "region": "São Jorge",
                "type": "termal",
                "description": "Águas termais naturais para relaxamento após trilhas.",
                "trailLength": 0.5,
                "duration": "1-2h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 10,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Final de tarde",
                "tips": "Perfeito para relaxar depois de trilhas pesadas.",
                "lat": -14.15,
                "lng": -47.678,
                "images": [
                        "https://images.unsplash.com/photo-1570716613348-18eaf396f6ae?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 27,
                        "saoJorge": 23,
                        "cavalcante": 70
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Águas+Termais+Morro+Vermelho+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "anjos-arcanjos",
                "name": "Anjos e Arcanjos",
                "region": "Alto Paraíso",
                "type": "cachoeira",
                "description": "Cachoeira tranquila a 12km de Alto Paraíso com trilha curta.",
                "trailLength": 1.5,
                "duration": "1-2h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 15,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Manhã",
                "tips": "Econômica e acessível.",
                "lat": -14.08,
                "lng": -47.52,
                "images": [
                        "https://images.unsplash.com/photo-1623067645161-59ce95cd0841?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1616851179047-ee8dcc1adfcb?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1518182170546-076616fd46d3?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 9,
                        "saoJorge": 51,
                        "cavalcante": 49
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Anjos+e+Arcanjos+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
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
        },
        {
                "id": "agua-fria",
                "name": "Cachoeira Água Fria",
                "region": "Alto Paraíso",
                "type": "cachoeira",
                "description": "Queda de 130m (70m queda livre). Campos floridos com cristais pelo caminho.",
                "trailLength": 2,
                "duration": "2-3h",
                "durationSlots": "half",
                "difficulty": "Moderada",
                "entranceFee": 30,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Manhã",
                "tips": "Ponto de rapel e canyoning. Acesso pelo Complexo Cristais.",
                "lat": -14.11,
                "lng": -47.485,
                "images": [
                        "https://images.unsplash.com/photo-1620050867807-6f8e71887e47?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1623067645161-59ce95cd0841?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1588392204642-f87c93e433a7?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 6,
                        "saoJorge": 55,
                        "cavalcante": 53
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cachoeira+Água+Fria+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "almecegas-i",
                "name": "Cachoeira Almécegas I",
                "region": "Alto Paraíso",
                "type": "cachoeira",
                "description": "Queda espetacular na Fazenda São Bento com trilha moderada entre vegetação do cerrado.",
                "trailLength": 1.2,
                "duration": "2-3h",
                "durationSlots": "half",
                "difficulty": "Moderada",
                "entranceFee": 70,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "10h-15h",
                "tips": "Ingresso R$70 inclui Almécegas I, II e São Bento.",
                "lat": -14.0964,
                "lng": -47.515,
                "images": [
                        "https://images.unsplash.com/photo-1579294247477-d3daae84aed2?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1596700813958-382a988d5e1b?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1616851179047-ee8dcc1adfcb?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 6,
                        "saoJorge": 51,
                        "cavalcante": 52
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cachoeira+Almécegas+I+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "almecegas-ii",
                "name": "Cachoeira Almécegas II",
                "region": "Alto Paraíso",
                "type": "cachoeira",
                "description": "Cachoeira acessível com poço rasinho, ideal para famílias.",
                "trailLength": 0.4,
                "duration": "1-2h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 0,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "10h-16h",
                "tips": "Inclusa no ingresso combo das Almécegas (R$70).",
                "lat": -14.098,
                "lng": -47.518,
                "images": [
                        "https://images.unsplash.com/photo-1616851179047-ee8dcc1adfcb?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1623067645161-59ce95cd0841?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1596700813958-382a988d5e1b?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 6,
                        "saoJorge": 50,
                        "cavalcante": 52
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cachoeira+Almécegas+II+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "candaru",
                "name": "Cachoeira Candaru",
                "region": "Cavalcante",
                "type": "cachoeira",
                "description": "Tesouro reservado do Quilombo Kalunga, com trilha moderada e experiência autêntica.",
                "trailLength": 2,
                "duration": "4-5h",
                "durationSlots": "half",
                "difficulty": "Moderada",
                "entranceFee": 43,
                "guideRequired": true,
                "guideCost": 200,
                "guideGroupSize": 6,
                "fourWheelRequired": true,
                "bestTime": "Manhã",
                "tips": "Transporte 4x4 por R$30/pessoa para encurtar caminhada.",
                "lat": -13.85,
                "lng": -47.37,
                "images": [
                        "https://images.unsplash.com/photo-1623067645161-59ce95cd0841?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1596700813958-382a988d5e1b?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1550953625-f7729de17282?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 52,
                        "saoJorge": 90,
                        "cavalcante": 17
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cachoeira+Candaru+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "capivara",
                "name": "Cachoeira Capivara",
                "region": "Cavalcante",
                "type": "cachoeira",
                "description": "Duas quedas de 40m dos rios Capivara e Tiririca formam um grande poço para banho.",
                "trailLength": 0.8,
                "duration": "2-3h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 43,
                "guideRequired": true,
                "guideCost": 200,
                "guideGroupSize": 6,
                "fourWheelRequired": true,
                "bestTime": "Manhã",
                "tips": "Combina bem com Santa Bárbara no mesmo dia.",
                "lat": -13.842,
                "lng": -47.388,
                "images": [
                        "https://images.unsplash.com/photo-1682687220199-d0124f48f95b?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1579294247477-d3daae84aed2?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1518182170546-076616fd46d3?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 115,
                        "saoJorge": 151,
                        "cavalcante": 25
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cachoeira+Capivara+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "curiola",
                "name": "Cachoeira Curiola (Guardião)",
                "region": "Cavalcante",
                "type": "cachoeira",
                "description": "Piscina natural de águas azuis com até 12m de profundidade e trampolim de pedra no Vão do Moleque.",
                "trailLength": 6,
                "duration": "6-8h",
                "durationSlots": "full",
                "difficulty": "Moderada",
                "entranceFee": 80,
                "guideRequired": true,
                "guideCost": 200,
                "guideGroupSize": 6,
                "fourWheelRequired": true,
                "bestTime": "12h-14h",
                "tips": "Melhor na estação seca (maio-setembro). Área muito remota.",
                "lat": -13.7,
                "lng": -47.3,
                "images": [
                        "https://images.unsplash.com/photo-1620050867807-6f8e71887e47?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1550953625-f7729de17282?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 80,
                        "saoJorge": 115,
                        "cavalcante": 30
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cachoeira+Curiola+(Guardião)+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "cantinho",
                "name": "Cachoeira do Cantinho",
                "region": "São Jorge",
                "type": "cachoeira",
                "description": "Cachoeira intimista com poço natural para banho.",
                "trailLength": 2,
                "duration": "2-3h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 25,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Manhã",
                "tips": "Menos visitada, tranquilidade garantida.",
                "lat": -14.22,
                "lng": -47.615,
                "images": [
                        "https://images.unsplash.com/photo-1570716613348-18eaf396f6ae?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 22,
                        "saoJorge": 34,
                        "cavalcante": 76
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cachoeira+do+Cantinho+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "cordovil",
                "name": "Cachoeira do Cordovil",
                "region": "São Jorge",
                "type": "cachoeira",
                "description": "Queda de 44m com poço cristalino na Fazenda Volta da Serra. Inclui Poço das Esmeraldas.",
                "trailLength": 10,
                "duration": "4-5h",
                "durationSlots": "half",
                "difficulty": "Moderada",
                "entranceFee": 50,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Manhã",
                "tips": "Trilha inclui Rodeador e Poço das Esmeraldas.",
                "lat": -14.19,
                "lng": -47.67,
                "images": [
                        "https://images.unsplash.com/photo-1570716613348-18eaf396f6ae?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1579294247477-d3daae84aed2?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1550953625-f7729de17282?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 27,
                        "saoJorge": 24,
                        "cavalcante": 75
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cachoeira+do+Cordovil+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "cachoeira-dragao",
                "name": "Cachoeira do Dragão",
                "region": "Vargem Bonita",
                "type": "cachoeira",
                "description": "Expedição por um cânion estreito com águas profundas. Requer natação e espírito de aventura.",
                "trailLength": 3,
                "duration": "6h",
                "durationSlots": "full",
                "difficulty": "Difícil",
                "entranceFee": 150,
                "guideRequired": true,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": true,
                "bestTime": "Manhã",
                "tips": "Valor inclui equipamentos (colete/capacete). Requer esforço físico e saber nadar.",
                "lat": -14.05,
                "lng": -47.75,
                "images": [
                        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1518182170546-076616fd46d3?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 44,
                        "saoJorge": 35,
                        "cavalcante": 134
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cachoeira+do+Dragão+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "label",
                "name": "Cachoeira do Label",
                "region": "São João da Aliança",
                "type": "cachoeira",
                "description": "A maior queda d'água de Goiás, com 187 metros de altura. Trilhas técnicas e visual imponente.",
                "trailLength": 2.5,
                "duration": "5-6h",
                "durationSlots": "full",
                "difficulty": "Difícil",
                "entranceFee": 50,
                "guideRequired": true,
                "guideCost": 200,
                "guideGroupSize": 6,
                "fourWheelRequired": false,
                "bestTime": "Manhã",
                "tips": "Trilha com muitas pedras e trechos íngremes. Use calçados apropriados.",
                "lat": -14.75,
                "lng": -47.45,
                "images": [
                        "https://images.unsplash.com/photo-1623067645161-59ce95cd0841?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1547432098-8ec01bc09355?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 85,
                        "saoJorge": 130,
                        "cavalcante": 175
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cachoeira+do+Label+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "segredo",
                "name": "Cachoeira do Segredo",
                "region": "São Jorge",
                "type": "cachoeira",
                "description": "Cachoeira imponente de 120m com trilha sombreada e poços cristalinos.",
                "trailLength": 8,
                "duration": "4-5h",
                "durationSlots": "half",
                "difficulty": "Moderada",
                "entranceFee": 40,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Manhã",
                "tips": "Travessia de rio necessária. Use calçado apropriado.",
                "lat": -14.2,
                "lng": -47.64,
                "images": [
                        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1563214532-6a603acbafa3?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1596700813958-382a988d5e1b?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 23,
                        "saoJorge": 29,
                        "cavalcante": 74
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cachoeira+do+Segredo+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "sertao",
                "name": "Cachoeira do Sertão",
                "region": "Teresina de Goiás",
                "type": "cachoeira",
                "description": "Localizada no sertão de Teresina, com poços profundos e águas muito geladas.",
                "trailLength": 4,
                "duration": "6h",
                "durationSlots": "full",
                "difficulty": "Difícil",
                "entranceFee": 30,
                "guideRequired": true,
                "guideCost": 150,
                "guideGroupSize": 4,
                "fourWheelRequired": true,
                "bestTime": "Manhã",
                "tips": "Região pouco explorada e muito preservada. Necessário guia experiente.",
                "lat": -13.78,
                "lng": -47.35,
                "images": [
                        "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 105,
                        "saoJorge": 140,
                        "cavalcante": 45
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cachoeira+do+Sertão+Teresina+de+Goiás+fotos&tbm=isch"
        },
        {
                "id": "raizama",
                "name": "Cachoeira Raizama",
                "region": "São Jorge",
                "type": "cachoeira",
                "description": "Piscinas naturais com hidromassagem natural em formações rochosas do Rio São Miguel.",
                "trailLength": 2.6,
                "duration": "2-3h",
                "durationSlots": "half",
                "difficulty": "Fácil-Moderada",
                "entranceFee": 30,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Manhã",
                "tips": "Acessível para famílias. Sem necessidade de guia.",
                "lat": -14.16,
                "lng": -47.65,
                "images": [
                        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1682687220199-d0124f48f95b?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1547432098-8ec01bc09355?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 22,
                        "saoJorge": 27,
                        "cavalcante": 69
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cachoeira+Raizama+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "santa-barbara",
                "name": "Cachoeira Santa Bárbara",
                "region": "Cavalcante",
                "type": "cachoeira",
                "description": "Uma das cachoeiras mais bonitas do Brasil, com águas azul-turquesa cristalinas em território quilombola Kalunga.",
                "trailLength": 1.5,
                "duration": "3-4h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 55,
                "guideRequired": true,
                "guideCost": 200,
                "guideGroupSize": 6,
                "fourWheelRequired": true,
                "bestTime": "11h-14h (sol incide no poço)",
                "tips": "Permanência limitada a 1 hora por grupo. Chegue cedo!",
                "lat": -13.8561,
                "lng": -47.3775,
                "images": [
                        "https://images.unsplash.com/photo-1616851179047-ee8dcc1adfcb?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1547432098-8ec01bc09355?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 117,
                        "saoJorge": 153,
                        "cavalcante": 27
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cachoeira+Santa+Bárbara+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "sao-bento",
                "name": "Cachoeira São Bento",
                "region": "Alto Paraíso",
                "type": "cachoeira",
                "description": "Trilha curta e fácil com poço grande para natação na Fazenda São Bento.",
                "trailLength": 0.3,
                "duration": "1-2h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 40,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "8h-16h",
                "tips": "R$40 individual ou R$70 combo com Almécegas.",
                "lat": -14.1,
                "lng": -47.512,
                "images": [
                        "https://images.unsplash.com/photo-1547432098-8ec01bc09355?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1550953625-f7729de17282?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 5,
                        "saoJorge": 51,
                        "cavalcante": 52
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cachoeira+São+Bento+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "sao-felix",
                "name": "Cachoeira São Félix",
                "region": "Cavalcante",
                "type": "cachoeira",
                "description": "Queda de 35m com praia de areia e piscinas naturais rasas. Ideal para famílias.",
                "trailLength": 0.5,
                "duration": "2-3h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 50,
                "guideRequired": true,
                "guideCost": 200,
                "guideGroupSize": 6,
                "fourWheelRequired": false,
                "bestTime": "Dia todo",
                "tips": "Camping (R$120/adulto). Almoço caseiro disponível.",
                "lat": -13.5984,
                "lng": -47.5481,
                "images": [
                        "https://images.unsplash.com/photo-1518182170546-076616fd46d3?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1616851179047-ee8dcc1adfcb?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1550953625-f7729de17282?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 89,
                        "saoJorge": 105,
                        "cavalcante": 35
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cachoeira+São+Félix+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "simao-correia",
                "name": "Cachoeira Simão Correia",
                "region": "Alto Paraíso",
                "type": "cachoeira",
                "description": "Imponente queda de 120m com águas esverdeadas. Trilha exige preparo com travessia do Rio São Bartolomeu.",
                "trailLength": 14,
                "duration": "6-8h",
                "durationSlots": "full",
                "difficulty": "Difícil",
                "entranceFee": 50,
                "guideRequired": true,
                "guideCost": 200,
                "guideGroupSize": 6,
                "fourWheelRequired": false,
                "bestTime": "Estação seca. Sol no poço até 15h.",
                "tips": "Travessia de rio na ida. Almoço rural no receptivo. Recém-anexada ao Parque Nacional.",
                "lat": -14.06,
                "lng": -47.45,
                "images": [
                        "https://images.unsplash.com/photo-1547432098-8ec01bc09355?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1623067645161-59ce95cd0841?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 16,
                        "saoJorge": 62,
                        "cavalcante": 45
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cachoeira+Simão+Correia+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "canions-cariocas",
                "name": "Cânions e Cariocas",
                "region": "São Jorge",
                "type": "cachoeira",
                "description": "Trilha Vermelha do Parque Nacional com Cânion II e Cachoeira das Cariocas.",
                "trailLength": 12,
                "duration": "6-7h",
                "durationSlots": "full",
                "difficulty": "Moderada-Difícil",
                "entranceFee": 47,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Manhã cedo",
                "tips": "Leve muita água e lanche.",
                "lat": -14.16,
                "lng": -47.605,
                "images": [
                        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1682687220199-d0124f48f95b?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 15,
                        "saoJorge": 35,
                        "cavalcante": 66
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Cânions+e+Cariocas+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "eden",
                "name": "Éden (Águas Termais)",
                "region": "São Jorge",
                "type": "termal",
                "description": "Piscinas de águas termais naturais na Pousada Éden.",
                "trailLength": 0.15,
                "duration": "1-2h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 20,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Final de tarde",
                "tips": "Apenas 150m do estacionamento até as piscinas.",
                "lat": -14.1455,
                "lng": -47.702,
                "images": [
                        "https://images.unsplash.com/photo-1550953625-f7729de17282?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1620050867807-6f8e71887e47?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1547432098-8ec01bc09355?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 30,
                        "saoJorge": 19,
                        "cavalcante": 71
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Éden+(Águas+Termais)+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "encontro-das-aguas",
                "name": "Encontro das Águas",
                "region": "São Jorge",
                "type": "cachoeira",
                "description": "Encontro dos rios São Miguel e Tocantizinho formando praias naturais.",
                "trailLength": 2.5,
                "duration": "2-3h",
                "durationSlots": "half",
                "difficulty": "Fácil-Moderada",
                "entranceFee": 30,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Estação seca",
                "tips": "Praias naturais perfeitas para relaxar.",
                "lat": -14.11,
                "lng": -47.71,
                "images": [
                        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1570716613348-18eaf396f6ae?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1518182170546-076616fd46d3?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 32,
                        "saoJorge": 20,
                        "cavalcante": 67
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Encontro+das+Águas+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "gota-satsom",
                "name": "Gota Sat Som",
                "region": "Alto Paraíso",
                "type": "experiencia",
                "description": "Templo terapêutico em formato de gota. Referência em sound healing, música de elevação e silêncio.",
                "trailLength": 0,
                "duration": "2h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 80,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Fim de tarde / Noite",
                "tips": "Verificar a programação no Instagram @gota.satsom. Experiência sonora toda quarta às 18h.",
                "lat": -14.131,
                "lng": -47.515,
                "images": [
                        "https://images.unsplash.com/photo-1616851179047-ee8dcc1adfcb?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1620050867807-6f8e71887e47?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 0,
                        "saoJorge": 50,
                        "cavalcante": 57
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Gota+Sat+Som+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "jardim-maytrea",
                "name": "Jardim de Maytrea",
                "region": "Alto Paraíso",
                "type": "mirante",
                "description": "Cartão postal da Chapada. Famoso por suas veredas ecológicas e montanhas pitorescas. Ideal para contemplação e fotos.",
                "trailLength": 0,
                "duration": "1h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 0,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Fim de tarde (Pôr do Sol)",
                "tips": "Localizado na beira da estrada (GO-239) entre Alto Paraíso e São Jorge. Entrada gratuita.",
                "lat": -14.135,
                "lng": -47.635,
                "images": [
                        "https://acrosstheuniverse.blog.br/wp-content/uploads/2021/05/jardim-de-maytrea-chapada-dos-veadeiros-1.jpg",
                        "https://goiasturismo.go.gov.br/images/atracoes/alto-paraiso-de-goias/jardim-de-maytrea.jpg",
                        "https://media-cdn.tripadvisor.com/media/photo-s/0e/69/9b/6c/jardim-de-maytreia.jpg"
                ],
                "distances": {
                        "altoParaiso": 22,
                        "saoJorge": 17,
                        "cavalcante": 109
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Jardim+de+Maytrea+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "lajeado",
                "name": "Lajeado",
                "region": "São Jorge",
                "type": "cachoeira",
                "description": "Lajedo natural com piscinas e pequenas quedas próximo à vila.",
                "trailLength": 2,
                "duration": "2-3h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 30,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Manhã",
                "tips": "Próximo de São Jorge, fácil acesso.",
                "lat": -14.175,
                "lng": -47.625,
                "images": [
                        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1596700813958-382a988d5e1b?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 19,
                        "saoJorge": 31,
                        "cavalcante": 69
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Lajeado+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "mirante-da-janela",
                "name": "Mirante da Janela",
                "region": "São Jorge",
                "type": "mirante",
                "description": "Vista panorâmica dos Saltos por \"janela\" natural na rocha. Trilha icônica.",
                "trailLength": 8,
                "duration": "4-5h",
                "durationSlots": "half",
                "difficulty": "Moderada-Difícil",
                "entranceFee": 40,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Manhã ou pôr do sol (guia obrigatório p/ sunset)",
                "tips": "Proibido subir na pedra do mirante. Cachoeira do Abismo no caminho.",
                "lat": -14.165,
                "lng": -47.635,
                "images": [
                        "https://images.unsplash.com/photo-1620050867807-6f8e71887e47?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1570716613348-18eaf396f6ae?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 20,
                        "saoJorge": 30,
                        "cavalcante": 69
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Mirante+da+Janela+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "poco-encantado",
                "name": "Poço Encantado",
                "region": "Alto Paraíso",
                "type": "cachoeira",
                "description": "Cachoeira de 38m com prainha de areia branca e grande poço. Excelente infraestrutura.",
                "trailLength": 0.5,
                "duration": "2-3h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 60,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Dia todo",
                "tips": "Restaurante, banheiros, chalés. Salva-vidas.",
                "lat": -13.84,
                "lng": -47.46,
                "images": [
                        "https://images.unsplash.com/photo-1547432098-8ec01bc09355?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1588392204642-f87c93e433a7?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 49,
                        "saoJorge": 80,
                        "cavalcante": 8
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Poço+Encantado+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "praia-do-jaloba",
                "name": "Praia do Jalobá",
                "region": "São Jorge",
                "type": "cachoeira",
                "description": "Praia fluvial com areias e piscinas naturais em meio ao cerrado.",
                "trailLength": 2,
                "duration": "2-3h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 25,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Manhã ou tarde",
                "tips": "Boa opção para relaxar em praias fluviais.",
                "lat": -14.195,
                "lng": -47.705,
                "images": [
                        "https://images.unsplash.com/photo-1579294247477-d3daae84aed2?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 33,
                        "saoJorge": 19,
                        "cavalcante": 78
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Praia+do+Jalobá+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "thermas-jequitinhonha",
                "name": "Thermas do Jequitinhonha / Éden",
                "region": "Colinas do Sul",
                "type": "experiencia",
                "description": "Águas termais naturais e relaxantes, ideais para o fim do dia após as trilhas.",
                "trailLength": 0.5,
                "duration": "3h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 40,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Fim de tarde",
                "tips": "Excelente infraestrutura com vestiários e lanchonete.",
                "lat": -14.15,
                "lng": -48.05,
                "images": [
                        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 95,
                        "saoJorge": 65,
                        "cavalcante": 145
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Thermas+do+Jequitinhonha+fotos&tbm=isch"
        },
        {
                "id": "sete-quedas",
                "name": "Travessia das Sete Quedas",
                "region": "São Jorge",
                "type": "trilha",
                "description": "Travessia de 23km no Parque Nacional com pernoite e sete cachoeiras. Guia obrigatório.",
                "trailLength": 23,
                "duration": "2 dias",
                "durationSlots": "full",
                "difficulty": "Difícil",
                "entranceFee": 47,
                "guideRequired": true,
                "guideCost": 400,
                "guideGroupSize": 10,
                "fourWheelRequired": false,
                "bestTime": "Estação seca (maio-setembro)",
                "tips": "Agendamento prévio e equipamento de camping.",
                "lat": -14.17,
                "lng": -47.59,
                "images": [
                        "https://images.unsplash.com/photo-1518182170546-076616fd46d3?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1547432098-8ec01bc09355?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1550953625-f7729de17282?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 14,
                        "saoJorge": 37,
                        "cavalcante": 67
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Travessia+das+Sete+Quedas+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "vale-da-lua",
                "name": "Vale da Lua",
                "region": "São Jorge",
                "type": "formação",
                "description": "Formações rochosas lunares esculpidas pelo Rio São Miguel. Piscinas naturais entre as rochas.",
                "trailLength": 1.5,
                "duration": "2-3h",
                "durationSlots": "half",
                "difficulty": "Fácil-Moderada",
                "entranceFee": 40,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "9h-15h",
                "tips": "Cuidado com cabeças d'água. Salva-vidas no local.",
                "lat": -14.1381,
                "lng": -47.6594,
                "images": [
                        "https://images.unsplash.com/photo-1550953625-f7729de17282?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1596700813958-382a988d5e1b?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1588392204642-f87c93e433a7?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 23,
                        "saoJorge": 26,
                        "cavalcante": 66
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Vale+da+Lua+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "vale-das-araras",
                "name": "Vale das Araras",
                "region": "Cavalcante",
                "type": "mirante",
                "description": "RPPN com trilhas fáceis, Cachoeira São Bartolomeu e mais de 160 espécies de aves.",
                "trailLength": 4,
                "duration": "2-3h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 25,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Manhã (observação de aves)",
                "tips": "Trilha sensorial autoguiada. Pousada e restaurante no local.",
                "lat": -13.9134,
                "lng": -47.4814,
                "images": [
                        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1518182170546-076616fd46d3?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1570716613348-18eaf396f6ae?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 37,
                        "saoJorge": 70,
                        "cavalcante": 21
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Vale+das+Araras+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "vale-dourado",
                "name": "Vale Dourado",
                "region": "São Jorge",
                "type": "cachoeira",
                "description": "Cachoeira com piscinas naturais e formações rochosas douradas.",
                "trailLength": 3,
                "duration": "3-4h",
                "durationSlots": "half",
                "difficulty": "Moderada",
                "entranceFee": 30,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Manhã",
                "tips": "Formações rochosas com tonalidade dourada.",
                "lat": -14.21,
                "lng": -47.6,
                "images": [
                        "https://images.unsplash.com/photo-1623067645161-59ce95cd0841?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 19,
                        "saoJorge": 36,
                        "cavalcante": 73
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Vale+Dourado+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "jardim-maytrea",
                "name": "Jardim de Maytrea",
                "region": "Alto Paraíso",
                "type": "mirante",
                "description": "Cartão postal da Chapada. Famoso por suas veredas ecológicas e montanhas pitorescas. Ideal para final de tarde.",
                "trailLength": 0,
                "duration": "1h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 0,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Fim de tarde (Pôr do Sol)",
                "tips": "Fica na beira da estrada (GO-239) entre Alto Paraíso e São Jorge. Rende fotos incríveis.",
                "lat": -14.1350,
                "lng": -47.6350,
                "images": [
                        "https://images.unsplash.com/photo-1547432098-8ec01bc09355?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1518182170546-076616fd46d3?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 20,
                        "saoJorge": 16,
                        "cavalcante": 110
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Jardim+de+Maytrea+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "gota-sat-som",
                "name": "Gota Sat Som",
                "region": "Alto Paraíso",
                "type": "experiencia",
                "description": "Templo de imersão sonora e música de elevação. Experiência de som relaxante e cura.",
                "trailLength": 0,
                "duration": "2h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 80,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Fim de tarde / Noite",
                "tips": "Verificar a programação no Instagram @gota.satsom e reservar com antecedência.",
                "lat": -14.1200,
                "lng": -47.5250,
                "images": [
                        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 2,
                        "saoJorge": 38,
                        "cavalcante": 92
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Gota+Sat+Som+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "mirante-sao-jorge",
                "name": "Barzinho Mirante São Jorge",
                "region": "São Jorge",
                "type": "mirante",
                "description": "Mirante do Pôr do Sol com vista privilegiada para o Parque Nacional. Cerveja gelada, drinks e música.",
                "trailLength": 0,
                "duration": "2-3h",
                "durationSlots": "half",
                "difficulty": "Fácil",
                "entranceFee": 30,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": false,
                "bestTime": "Fim de tarde (Pôr do Sol)",
                "tips": "Chegar um pouco antes do pôr do sol para garantir lugar. @mirante.saojorge",
                "lat": -14.1650,
                "lng": -47.8100,
                "images": [
                        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 35,
                        "saoJorge": 1,
                        "cavalcante": 68
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Mirante+São+Jorge+fotos+chapada+dos+veadeiros&tbm=isch"
        },
        {
                "id": "complexo-macacao",
                "name": "Complexo do Macacão",
                "region": "Alto Paraíso",
                "type": "complexo",
                "description": "Cachoeiras deslumbrantes como a Catedral e poços de águas verdes esmeraldas.",
                "trailLength": 4,
                "duration": "4-5h",
                "durationSlots": "full",
                "difficulty": "Difícil",
                "entranceFee": 50,
                "guideRequired": false,
                "guideCost": 0,
                "guideGroupSize": 0,
                "fourWheelRequired": true,
                "bestTime": "Manhã",
                "tips": "Trilha íngreme com cordas em alguns trechos. Estrutura básica no local. Precisa de 4x4. @complexo_do_macaco",
                "lat": -14.1800,
                "lng": -47.4500,
                "images": [
                        "https://images.unsplash.com/photo-1547432098-8ec01bc09355?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1623067645161-59ce95cd0841?q=80&w=600&auto=format&fit=crop"
                ],
                "distances": {
                        "altoParaiso": 50,
                        "saoJorge": 85,
                        "cavalcante": 60
                },
                "googlePhotosUrl": "https://www.google.com/search?q=Complexo+do+Macacão+fotos+chapada+dos+veadeiros&tbm=isch"
        }
];

// ============================================================================
// HOSPEDAGENS - CONFIRMADAS 2026
// ============================================================================
const ACCOMMODATIONS = [
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
                url: 'https://www.booking.com/hotel/br/pousada-dente-de-leao.html'
        }
];

// ============================================================================
// ALUGUEL DE CARRO - COTAÇÃO LOCALIZA
// ============================================================================
const CAR_OPTIONS = [
        {
                id: 'localiza-tcross',
                name: 'VW T-Cross 1.0 Turbo ou similar',
                type: 'Grupo GX - SUV Compacto',
                dailyRate: 254.03,
                totalDays: 8,
                rental: 'Localiza',
                features: [
                        'Proteção Total Incluída',
                        'Condutor Adicional Ilimitado',
                        'Taxas Inclusas',
                        'Km Ilimitado'
                ],
                image: '🚙',
                observation: 'Cotação para o período integral da viagem.'
        }
];
