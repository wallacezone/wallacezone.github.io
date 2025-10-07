/**
 * Japan SVG Map - Carica file con ID già corretti
 */

async function initializeMap() {
    const svgMap = document.getElementById('japan-map');
    
    if (!svgMap) {
        console.error('SVG map element not found');
        return;
    }
    
    try {
        // Carica il file SVG con ID corretti
        const response = await fetch('japan-tracker/japan-map.svg');
        
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
        
        // Trova tutti i path con id="JP-XX"
        const prefecturePaths = loadedSvg.querySelectorAll('path[id^="JP-"]');
        console.log(`Found ${prefecturePaths.length} prefecture paths`);
        
        if (prefecturePaths.length === 0) {
            throw new Error('No prefecture paths found');
        }
        
        // Crea nuovo gruppo
        const prefecturesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        prefecturesGroup.setAttribute('id', 'prefectures');
        
        prefecturePaths.forEach((path) => {
            const prefId = path.getAttribute('id');
            const prefCode = prefId.replace('JP-', '');
            
            const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            // Copia il path data
            const pathData = path.getAttribute('d');
            if (pathData) {
                newPath.setAttribute('d', pathData);
            }
            
            // Imposta attributi
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
            } else {
                console.warn(`No data for ${prefId}`);
            }
            
            prefecturesGroup.appendChild(newPath);
        });
        
        // Inserisci nel DOM
        svgMap.innerHTML = '';
        svgMap.appendChild(prefecturesGroup);
        
        // Imposta viewBox
        const viewBox = loadedSvg.getAttribute('viewBox');
        const width = loadedSvg.getAttribute('width');
        const height = loadedSvg.getAttribute('height');
        
        if (viewBox) {
            svgMap.setAttribute('viewBox', viewBox);
        } else if (width && height) {
            svgMap.setAttribute('viewBox', `0 0 ${width} ${height}`);
        }
        
        svgMap.removeAttribute('width');
        svgMap.removeAttribute('height');
        svgMap.style.width = '100%';
        svgMap.style.height = 'auto';
        svgMap.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        
        console.log(`✓ Japan map loaded with ${prefecturePaths.length} prefectures`);
        console.log(`✓ ViewBox: ${svgMap.getAttribute('viewBox')}`);
        
        // Notifica che la mappa è pronta
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
