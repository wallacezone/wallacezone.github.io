/**
 * Japan SVG Map - Versione di debug
 */

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
        
        // TEMPORANEO: usa index diretto per vedere la mappa
        paths.forEach((path, index) => {
            const prefCode = String(index + 1).padStart(2, '0');
            const prefId = `JP-${prefCode}`;
            
            const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            const pathData = path.getAttribute('d');
            if (pathData) {
                newPath.setAttribute('d', pathData);
            }
            
            newPath.setAttribute('id', prefId);
            newPath.setAttribute('data-code', prefCode);
            newPath.setAttribute('data-prefecture', prefId);
            newPath.setAttribute('data-original-index', index); // Per debug
            newPath.classList.add('prefecture-path');
            
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            const prefData = PREFECTURES[prefId];
            if (prefData) {
                title.textContent = `${prefData.name} (${prefData.nameJa}) [Index: ${index}]`;
                newPath.appendChild(title);
            }
            
            prefecturesGroup.appendChild(newPath);
        });
        
        svgMap.innerHTML = '';
        svgMap.appendChild(prefecturesGroup);
        
        console.log(`✓ Japan map loaded successfully with ${paths.length} prefectures`);
        
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
