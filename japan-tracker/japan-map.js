/**
 * Japan SVG Map - Carica da Wikimedia Commons
 * Questo file ha già gli ID corretti per ogni prefettura!
 */

async function initializeMap() {
    const svgMap = document.getElementById('japan-map');
    
    if (!svgMap) {
        console.error('SVG map element not found');
        return;
    }
    
    try {
        // Carica il file Wikimedia
        const response = await fetch('japan-tracker/japan-wikimedia.svg');
        
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
        
        // Il file Wikimedia ha già tutti i path con ID corretti
        // Cerchiamo tutti i path con id che inizia con JP-
        const allPaths = loadedSvg.querySelectorAll('path[id^="JP-"]');
        
        console.log(`Found ${allPaths.length} prefecture paths with correct IDs`);
        
        // Crea nuovo gruppo
        const prefecturesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        prefecturesGroup.setAttribute('id', 'prefectures');
        
        allPaths.forEach((path) => {
            const prefId = path.getAttribute('id');
            
            // Crea nuovo path pulito
            const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            const pathData = path.getAttribute('d');
            if (pathData) {
                newPath.setAttribute('d', pathData);
            }
            
            // Estrai il codice (es: JP-01 → 01)
            const prefCode = prefId.replace('JP-', '');
            
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
        
        // Inserisci nel DOM
        svgMap.innerHTML = '';
        svgMap.appendChild(prefecturesGroup);
        
        // Imposta viewBox
        const viewBox = loadedSvg.getAttribute('viewBox');
        if (viewBox) {
            svgMap.setAttribute('viewBox', viewBox);
        } else {
            // Calcola viewBox dai path
            const bbox = prefecturesGroup.getBBox();
            svgMap.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
        }
        
        svgMap.removeAttribute('width');
        svgMap.removeAttribute('height');
        svgMap.style.width = '100%';
        svgMap.style.height = 'auto';
        svgMap.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        
        console.log(`✓ Wikimedia Japan map loaded with ${allPaths.length} prefectures`);
        console.log(`✓ ViewBox: ${svgMap.getAttribute('viewBox')}`);
        
        // Notifica che la mappa è pronta
        window.dispatchEvent(new CustomEvent('mapLoaded'));
        
    } catch (error) {
        console.error('Error loading map:', error);
        alert('Unable to load Wikimedia map. Make sure japan-wikimedia.svg is in the japan-tracker folder. Error: ' + error.message);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMap);
} else {
    initializeMap();
}
