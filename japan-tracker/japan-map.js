/**
 * Japan SVG Map - Carica direttamente da Wikimedia Commons
 */

async function initializeMap() {
    const svgMap = document.getElementById('japan-map');
    
    if (!svgMap) {
        console.error('SVG map element not found');
        return;
    }
    
    try {
        // Carica direttamente da Wikimedia Commons
        const response = await fetch('https://upload.wikimedia.org/wikipedia/commons/d/db/Japan_prefectures.svg');
        
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
        
        console.log('SVG loaded, analyzing structure...');
        
        // Wikimedia può avere diverse strutture, proviamo vari selettori
        let prefecturePaths = [];
        
        // Opzione 1: path con id JP-XX
        prefecturePaths = loadedSvg.querySelectorAll('path[id^="JP-"]');
        console.log(`Opzione 1 (id^="JP-"): found ${prefecturePaths.length} paths`);
        
        // Opzione 2: path in un gruppo specifico
        if (prefecturePaths.length === 0) {
            const groups = loadedSvg.querySelectorAll('g');
            console.log(`Found ${groups.length} groups, searching for prefecture paths...`);
            
            groups.forEach(g => {
                const paths = g.querySelectorAll('path');
                if (paths.length > 40) { // Probabile gruppo delle prefetture
                    prefecturePaths = paths;
                    console.log(`Found group with ${paths.length} paths`);
                }
            });
        }
        
        // Opzione 3: tutti i path
        if (prefecturePaths.length === 0) {
            prefecturePaths = loadedSvg.querySelectorAll('path');
            console.log(`Opzione 3 (all paths): found ${prefecturePaths.length} paths`);
        }
        
        if (prefecturePaths.length === 0) {
            throw new Error('No prefecture paths found in SVG');
        }
        
        // Crea nuovo gruppo
        const prefecturesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        prefecturesGroup.setAttribute('id', 'prefectures');
        
        let processedCount = 0;
        
        prefecturePaths.forEach((path, index) => {
            // Prova a estrarre l'ID dal path stesso
            let prefId = path.getAttribute('id');
            
            // Se l'id non è nel formato JP-XX, usa l'indice
            if (!prefId || !prefId.startsWith('JP-')) {
                const prefCode = String(index + 1).padStart(2, '0');
                prefId = `JP-${prefCode}`;
            }
            
            const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            const pathData = path.getAttribute('d');
            if (!pathData) return; // Salta path vuoti
            
            newPath.setAttribute('d', pathData);
            
            const prefCode = prefId.replace('JP-', '');
            newPath.setAttribute('id', prefId);
            newPath.setAttribute('data-code', prefCode);
            newPath.setAttribute('data-prefecture', prefId);
            newPath.classList.add('prefecture-path');
            
            // Copia altri attributi utili (fill, stroke, etc)
            const fill = path.getAttribute('fill');
            const stroke = path.getAttribute('stroke');
            if (fill) newPath.setAttribute('data-original-fill', fill);
            if (stroke) newPath.setAttribute('data-original-stroke', stroke);
            
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            const prefData = PREFECTURES[prefId];
            if (prefData) {
                title.textContent = `${prefData.name} (${prefData.nameJa})`;
                newPath.appendChild(title);
            }
            
            prefecturesGroup.appendChild(newPath);
            processedCount++;
        });
        
        svgMap.innerHTML = '';
        svgMap.appendChild(prefecturesGroup);
        
        // Imposta viewBox
        const viewBox = loadedSvg.getAttribute('viewBox');
        if (viewBox && viewBox !== '0 0 0 0') {
            svgMap.setAttribute('viewBox', viewBox);
        } else {
            // Calcola viewBox dinamicamente
            const bbox = prefecturesGroup.getBBox();
            const padding = 10;
            svgMap.setAttribute('viewBox', 
                `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`);
        }
        
        svgMap.removeAttribute('width');
        svgMap.removeAttribute('height');
        svgMap.style.width = '100%';
        svgMap.style.height = 'auto';
        svgMap.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        
        console.log(`✓ Wikimedia map loaded with ${processedCount} prefectures`);
        console.log(`✓ ViewBox: ${svgMap.getAttribute('viewBox')}`);
        
        window.dispatchEvent(new CustomEvent('mapLoaded'));
        
    } catch (error) {
        console.error('Error loading map:', error);
        alert('Unable to load map from Wikimedia. Error: ' + error.message);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMap);
} else {
    initializeMap();
}
