/**
 * Japan SVG Map - Carica direttamente il file SimpleMaps
 */

async function initializeMap() {
    const svgMap = document.getElementById('japan-map');
    
    if (!svgMap) {
        console.error('SVG map element not found');
        return;
    }
    
    try {
        // Carica il file SVG originale di SimpleMaps dalla sottocartella
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
        
        // Estrai viewBox e width/height
        const viewBox = loadedSvg.getAttribute('viewBox');
        const width = loadedSvg.getAttribute('width');
        const height = loadedSvg.getAttribute('height');
        
        // Imposta gli attributi sul nostro SVG
        if (viewBox) svgMap.setAttribute('viewBox', viewBox);
        if (width) svgMap.setAttribute('width', width);
        if (height) svgMap.setAttribute('height', height);
        
        // Trova il gruppo "features" che contiene i path delle prefetture
        const featuresGroup = loadedSvg.querySelector('#features');
        
        if (!featuresGroup) {
            throw new Error('Features group not found in SVG');
        }
        
        // Estrai tutti i path dal gruppo features
        const paths = featuresGroup.querySelectorAll('path');
        
        if (paths.length !== 47) {
            console.warn(`Expected 47 prefectures, found ${paths.length}`);
        }
        
        // Crea un nuovo gruppo per le prefetture
        const prefecturesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        prefecturesGroup.setAttribute('id', 'prefectures');
        
        // Mappa i path alle prefetture (SimpleMaps usa l'ordine standard JP-01 a JP-47)
        paths.forEach((path, index) => {
            const prefCode = String(index + 1).padStart(2, '0');
            const prefId = `JP-${prefCode}`;
            
            // Crea un nuovo path con i nostri attributi
            const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            // Copia il path d (coordinate)
            const pathData = path.getAttribute('d');
            if (pathData) {
                newPath.setAttribute('d', pathData);
            }
            
            // Aggiungi i nostri attributi personalizzati
            newPath.setAttribute('id', prefId);
            newPath.setAttribute('data-code', prefCode);
            newPath.setAttribute('data-prefecture', prefId);
            newPath.classList.add('prefecture-path');
            
            // Aggiungi title per accessibilità
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            const prefData = PREFECTURES[prefId];
            if (prefData) {
                title.textContent = `${prefData.name} (${prefData.nameJa})`;
                newPath.appendChild(title);
            }
            
            prefecturesGroup.appendChild(newPath);
        });
        
        // Pulisci e inserisci il nuovo contenuto
        svgMap.innerHTML = '';
        svgMap.appendChild(prefecturesGroup);
        
        console.log(`✓ Japan map loaded successfully with ${paths.length} prefectures`);
        
    } catch (error) {
        console.error('Error loading map:', error);
        console.error('Make sure the SVG file is in the japan-tracker folder');
        alert('Unable to load map. Error: ' + error.message);
    }
}

// Inizializza quando DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMap);
} else {
    initializeMap();
}
