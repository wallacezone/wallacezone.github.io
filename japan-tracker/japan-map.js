/**
 * Japan SVG Map - Mappatura corretta finale
 */

// Mappatura SimpleMaps index → Prefecture Code (basata su dati reali)
const INDEX_TO_PREF = {
    0: '01',   // Hokkaido (Y=590)
    1: '02',   // Aomori (Y=507)
    2: '03',   // Iwate (Y=497)
    3: '04',   // Miyagi (Y=505)
    4: '05',   // Akita (Y=492)
    5: '06',   // Yamagata (Y=527)
    6: '07',   // Fukushima (Y=545)
    7: '08',   // Ibaraki (Y=483)
    8: '09',   // Tochigi (Y=469)
    9: '10',   // Gunma (Y=493)
    10: '11',  // Saitama (Y=504)
    11: '12',  // Chiba (Y=432)
    12: '13',  // Tokyo (Y=471)
    13: '14',  // Kanagawa (Y=432)
    14: '15',  // Niigata (Y=446)
    15: '16',  // Toyama (Y=435)
    16: '17',  // Ishikawa (Y=414)
    17: '18',  // Fukui (Y=378)
    18: '19',  // Yamanashi (Y=385)
    19: '20',  // Nagano (Y=347)
    20: '21',  // Gifu (Y=319)
    21: '22',  // Shizuoka (Y=271)
    22: '23',  // Aichi (Y=225)
    23: '24',  // Mie (Y=274)
    24: '25',  // Shiga (Y=320)
    25: '26',  // Kyoto (Y=357)
    26: '27',  // Osaka (Y=396)
    27: '28',  // Hyogo (Y=426)
    28: '29',  // Nara (Y=610)
    29: '30',  // Wakayama (Y=430)
    30: '31',  // Tottori (Y=440)
    31: '32',  // Shimane (Y=444)
    32: '33',  // Okayama (Y=463)
    33: '34',  // Hiroshima (Y=482)
    34: '35',  // Yamaguchi (Y=456)
    35: '36',  // Tokushima (Y=448)
    36: '37',  // Kagawa (Y=459)
    37: '01',  // HOKKAIDO (Y=122) - Il grande a nord!
    38: '39',  // Kochi (Y=737)
    39: '40',  // Fukuoka (Y=389)
    40: '41',  // Saga (Y=404)
    41: '42',  // Nagasaki (Y=383)
    42: '43',  // Kumamoto (Y=415)
    43: '44',  // Oita (Y=435)
    44: '45',  // Miyazaki (Y=407)
    45: '46',  // Kagoshima (Y=424)
    46: '47'   // Okinawa (Y=468)
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
        
        const featuresGroup = loadedSvg.querySelector('#features');
        
        if (!featuresGroup) {
            throw new Error('Features group not found in SVG');
        }
        
        const paths = featuresGroup.querySelectorAll('path');
        console.log(`Found ${paths.length} paths in SimpleMaps file`);
        
        const prefecturesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        prefecturesGroup.setAttribute('id', 'prefectures');
        
        paths.forEach((path, index) => {
            // USA LA MAPPATURA CORRETTA
            const prefCode = INDEX_TO_PREF[index];
            
            if (!prefCode) {
                console.warn(`No prefecture code for index ${index}`);
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
        
        svgMap.setAttribute('viewBox', '0 0 1000 846');
        svgMap.removeAttribute('width');
        svgMap.removeAttribute('height');
        svgMap.style.width = '100%';
        svgMap.style.height = 'auto';
        svgMap.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        
        console.log(`✓ Japan map loaded successfully with ${paths.length} prefectures`);
        console.log(`✓ ViewBox set to: ${svgMap.getAttribute('viewBox')}`);
        
        window.dispatchEvent(new CustomEvent('mapLoaded'));
        
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
