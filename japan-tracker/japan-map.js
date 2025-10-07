/**
 * Japan SVG Map - Carica il file SimpleMaps con mappatura corretta
 */

// Mappa di corrispondenza tra l'ordine dei path di SimpleMaps e i codici prefettura
// SimpleMaps ordina geograficamente: sud-ovest (Okinawa) a nord-est (Hokkaido)
const SIMPLEMAPS_TO_PREFECTURE = {
    0: '47',  // Okinawa
    1: '40',  // Fukuoka
    2: '44',  // Oita
    3: '43',  // Kumamoto
    4: '41',  // Saga
    5: '42',  // Nagasaki
    6: '45',  // Miyazaki
    7: '46',  // Kagoshima
    8: '39',  // Kochi
    9: '38',  // Ehime
    10: '37', // Kagawa
    11: '36', // Tokushima
    12: '35', // Yamaguchi
    13: '34', // Hiroshima
    14: '33', // Okayama
    15: '32', // Shimane
    16: '31', // Tottori
    17: '30', // Wakayama
    18: '29', // Nara
    19: '28', // Hyogo
    20: '27', // Osaka
    21: '26', // Kyoto
    22: '25', // Shiga
    23: '24', // Mie
    24: '23', // Aichi
    25: '21', // Gifu
    26: '18', // Fukui
    27: '17', // Ishikawa
    28: '16', // Toyama
    29: '22', // Shizuoka
    30: '19', // Yamanashi
    31: '20', // Nagano
    32: '15', // Niigata
    33: '14', // Kanagawa
    34: '13', // Tokyo
    35: '12', // Chiba
    36: '11', // Saitama
    37: '10', // Gunma
    38: '09', // Tochigi
    39: '08', // Ibaraki
    40: '07', // Fukushima
    41: '06', // Yamagata
    42: '05', // Akita
    43: '04', // Miyagi
    44: '03', // Iwate
    45: '02', // Aomori
    46: '01'  // Hokkaido
};

async function initializeMap() {
    const svgMap = document.getElementById('japan-map');
    
    if (!svgMap) {
        console.error('SVG map element not found');
        return;
    }
    
    try {
        // Carica il file SVG
        const response = await fetch('japan-tracker/japan-simplemaps.svg');
        
        if (!response.ok) {
            throw new Error(`Failed to load map: ${response.status}`);
        }
        
        const svgText = await response.text();
        
        // Parse SVG
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const loadedSvg = svgDoc.querySelector('svg');
        
        if (!loadedSvg) {
            throw new Error('Invalid SVG structure');
        }
        
        // Estrai viewBox
        const viewBox = loadedSvg.getAttribute('viewBox');
        if (viewBox) {
            svgMap.setAttribute('viewBox', viewBox);
        }
        
        // Rimuovi width e height per renderlo responsive
        svgMap.removeAttribute('width');
        svgMap.removeAttribute('height');
        svgMap.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        
        // Trova il gruppo features
        const featuresGroup = loadedSvg.querySelector('#features');
        
        if (!featuresGroup) {
            throw new Error('Features group not found in SVG');
        }
        
        // Estrai tutti i path
        const paths = featuresGroup.querySelectorAll('path');
        
        console.log(`Found ${paths.length} paths in SimpleMaps file`);
        
        // Crea nuovo gruppo per le prefetture
        const prefecturesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        prefecturesGroup.setAttribute('id', 'prefectures');
        
        // Mappa i path alle prefetture usando la corrispondenza
        paths.forEach((path, index) => {
            const prefCode = SIMPLEMAPS_TO_PREFECTURE[index];
            
            if (!prefCode) {
                console.warn(`No mapping found for path index ${index}`);
                return;
            }
            
            const prefId = `JP-${prefCode}`;
            
            // Crea nuovo path
            const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            // Copia il path d
            const pathData = path.getAttribute('d');
            if (pathData) {
                newPath.setAttribute('d', pathData);
            }
            
            // Aggiungi attributi
            newPath.setAttribute('id', prefId);
            newPath.setAttribute('data-code', prefCode);
            newPath.setAttribute('data-prefecture', prefId);
            newPath.classList.add('prefecture-path');
            
            // Aggiungi title
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            const prefData = PREFECTURES[prefId];
            if (prefData) {
                title.textContent = `${prefData.name} (${prefData.nameJa})`;
                newPath.appendChild(title);
            }
            
            prefecturesGroup.appendChild(newPath);
        });
        
        // Pulisci e inserisci
        svgMap.innerHTML = '';
        svgMap.appendChild(prefecturesGroup);
        
        console.log(`✓ Japan map loaded successfully with ${paths.length} prefectures`);
        
    } catch (error) {
        console.error('Error loading map:', error);
        alert('Unable to load map. Error: ' + error.message);
    }
}

// Inizializza quando DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMap);
} else {
    initializeMap();
}
