/**
 * Japan SVG Map - Loader for High-Quality SVG
 */

async function initializeMap() {
    const svgMap = document.getElementById('japan-map');
    
    if (!svgMap) {
        console.error('SVG map element not found');
        return;
    }
    
    try {
        // Carica il file SVG dalla sottocartella japan-tracker
        const response = await fetch('japan-tracker/map-japan.svg');
        
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
        
        // Inserisci il contenuto SVG
        svgMap.setAttribute('viewBox', loadedSvg.getAttribute('viewBox'));
        svgMap.innerHTML = loadedSvg.innerHTML;
        
        // Processa i path delle prefetture
        const prefecturePaths = svgMap.querySelectorAll('path[data-code]');
        
        prefecturePaths.forEach(path => {
            const code = path.getAttribute('data-code');
            const prefId = `JP-${code.padStart(2, '0')}`;
            
            // Aggiungi attributi personalizzati
            path.setAttribute('id', prefId);
            path.setAttribute('data-prefecture', prefId);
            path.classList.add('prefecture-path');
            
            // Aggiungi title per accessibilità
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            const prefData = PREFECTURES[prefId];
            if (prefData) {
                title.textContent = `${prefData.name} (${prefData.nameJa})`;
                path.insertBefore(title, path.firstChild);
            }
        });
        
        console.log('✓ High-quality Japan map loaded with 47 prefectures');
        
    } catch (error) {
        console.error('Error loading map:', error);
        alert('Unable to load map. Please ensure map-japan.svg is in the japan-tracker folder.');
    }
}

// Inizializza quando DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMap);
} else {
    initializeMap();
}
