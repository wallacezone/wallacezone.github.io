/**
 * Japan SVG Map - Carica il file SimpleMaps SENZA rimappatura
 */

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
        
        // I path sono GIÀ nell'ordine corretto! Index = Prefecture number
        paths.forEach((path, index) => {
            // SimpleMaps usa index diretto: 0=JP-01, 1=JP-02, etc.
            const prefCode = String(index + 1).padStart(2, '0');
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
