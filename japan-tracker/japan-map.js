/**
 * Japan SVG Map - Mappatura corretta basata su coordinate geografiche
 */

// Mappatura corretta: SimpleMaps index → Codice Prefettura
// Basata sui dati geografici reali (posizione Y e dimensioni)
const SIMPLEMAPS_ORDER = {
    0: '01',   // Index 0: Hokkaido (Y=590, grande)
    1: '02',   // Index 1: Aomori (Y=507)
    2: '03',   // Index 2: Iwate (Y=497)
    3: '04',   // Index 3: Miyagi (Y=505)
    4: '05',   // Index 4: Akita (Y=492)
    5: '06',   // Index 5: Yamagata (Y=527)
    6: '07',   // Index 6: Fukushima (Y=545)
    7: '08',   // Index 7: Ibaraki (Y=483)
    8: '09',   // Index 8: Tochigi (Y=469)
    9: '10',   // Index 9: Gunma (Y=493)
    10: '11',  // Index 10: Saitama (Y=504)
    11: '12',  // Index 11: Chiba (Y=432)
    12: '13',  // Index 12: Tokyo (Y=471)
    13: '14',  // Index 13: Kanagawa (Y=432)
    14: '15',  // Index 14: Niigata (Y=446)
    15: '16',  // Index 15: Toyama (Y=435)
    16: '17',  // Index 16: Ishikawa (Y=414)
    17: '18',  // Index 17: Fukui (Y=378)
    18: '19',  // Index 18: Yamanashi (Y=385)
    19: '20',  // Index 19: Nagano (Y=347)
    20: '21',  // Index 20: Gifu (Y=319)
    21: '22',  // Index 21: Shizuoka (Y=271)
    22: '23',  // Index 22: Aichi (Y=225)
    23: '24',  // Index 23: Mie (Y=274)
    24: '25',  // Index 24: Shiga (Y=320)
    25: '26',  // Index 25: Kyoto (Y=357)
    26: '27',  // Index 26: Osaka (Y=396)
    27: '28',  // Index 27: Hyogo (Y=426)
    28: '29',  // Index 28: Nara (Y=610, molto grande - sembra errore nel SVG)
    29: '30',  // Index 29: Wakayama (Y=430)
    30: '31',  // Index 30: Tottori (Y=440)
    31: '32',  // Index 31: Shimane (Y=444)
    32: '33',  // Index 32: Okayama (Y=463)
    33: '34',  // Index 33: Hiroshima (Y=482)
    34: '35',  // Index 34: Yamaguchi (Y=456)
    35: '36',  // Index 35: Tokushima (Y=448)
    36: '37',  // Index 36: Kagawa (Y=459)
    37: '01',  // Index 37: HOKKAIDO (Y=122, IL PIÙ GRANDE E NORD!)
    38: '39',  // Index 38: Kochi (Y=737)
    39: '40',  // Index 39: Fukuoka (Y=389)
    40: '41',  // Index 40: Saga (Y=404)
    41: '42',  // Index 41: Nagasaki (Y=383)
    42: '43',  // Index 42: Kumamoto (Y=415)
    43: '44',  // Index 43: Oita (Y=435)
    44: '45',  // Index 44: Miyazaki (Y=407)
    45: '46',  // Index 45: Kagoshima (Y=424)
    46: '47'   // Index 46: Okinawa (Y=468)
};

async function initializeMap() {
    const svgMap = document.getElementById('japan-map');
    
    if (!svgMap) {
        console.error('SVG map element not found');
        return;
    }
    
    try {
        const response = await fetch('japan-tracker/japan-simplemaps.svg');
        
        if (!response.ok) {
            throw new Error(`Failed to load map: ${response.status}`);
        }
        
        const svgText = await response.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const loadedSvg = svgDoc.querySelector('svg');
        
        if (!loadedSvg) {
            throw new Error('Invalid SVG structure');
        }
        
        const viewBox = loadedSvg.getAttribute('viewBox');
        if (viewBox) {
            svgMap.setAttribute('viewBox', viewBox);
        }
        
        svgMap.removeAttribute('width');
        svgMap.removeAttribute('height');
        svgMap.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        
        const featuresGroup = loadedSvg.querySelector('#features');
        
        if (!featuresGroup) {
            throw new Error('Features group not found in SVG');
        }
        
        const paths = featuresGroup.querySelectorAll('path');
        console.log(`Found ${paths.length} paths in SimpleMaps file`);
        
        const prefecturesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        prefecturesGroup.setAttribute('id', 'prefectures');
        
        // Usa la mappatura corretta
        paths.forEach((path, index) => {
            const prefCode = SIMPLEMAPS_ORDER[index];
            
            if (!prefCode) {
                console.warn(`No mapping for index ${index}`);
                return;
            }
            
            const prefId = `JP-${prefCode}`;
            const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            const pathData = path.getAttribute('d');
            if (pathData) {
                newPath.setAttribute('d', pathData);
            }
            
            newPath.setAttribute('id', prefId);
            newPath.setAttribute('data-code', prefCode);
            newPath.setAttribute('data-prefecture', prefId);
            newPath.classList.add('prefecture-path');
            
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            const prefData = PREFECTURES[prefId];
            if (prefData) {
                title.textContent = `${prefData.name} (${prefData.nameJa})`;
                newPath.appendChild(title);
            }
            
            prefecturesGroup.appendChild(newPath);
        });
        
        svgMap.innerHTML = '';
        svgMap.appendChild(prefecturesGroup);
        
        console.log(`✓ Japan map loaded with correct mapping`);
        
    } catch (error) {
        console.error('Error loading map:', error);
        alert('Unable to load map. Error: ' + error.message);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMap);
} else {
    initializeMap();
}
