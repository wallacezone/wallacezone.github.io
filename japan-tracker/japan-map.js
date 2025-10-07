/**
 * Japan SVG Map - Loads High-Quality Local SVG File
 */

async function initializeMap() {
    const svgContainer = document.getElementById('map-container');
    const svgMap = document.getElementById('japan-map');
    
    if (!svgMap) {
        console.error('SVG map element not found');
        return;
    }
    
    try {
        // Option 1: Load from local file (recommended for production)
        const response = await fetch('./japan-tracker/map-japan.svg');
        
        if (!response.ok) {
            throw new Error(`Failed to load map: ${response.status}`);
        }
        
        const svgText = await response.text();
        
        // Parse and inject the SVG
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const loadedSvg = svgDoc.querySelector('svg');
        
        if (!loadedSvg) {
            throw new Error('Invalid SVG structure');
        }
        
        // Replace placeholder SVG
        svgMap.setAttribute('viewBox', loadedSvg.getAttribute('viewBox'));
        svgMap.innerHTML = loadedSvg.innerHTML;
        
        // Process prefecture paths
        const prefecturePaths = svgMap.querySelectorAll('path[data-code]');
        
        prefecturePaths.forEach(path => {
            const code = path.getAttribute('data-code');
            const prefId = `JP-${code.padStart(2, '0')}`;
            
            // Add our custom attributes
            path.setAttribute('data-prefecture', prefId);
            path.classList.add('prefecture-path');
            
            // Add accessibility title
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            const prefData = PREFECTURES[prefId];
            if (prefData) {
                title.textContent = `${prefData.name} (${prefData.nameJa})`;
                path.insertBefore(title, path.firstChild);
            }
        });
        
        console.log('✓ High-quality Japan map loaded successfully');
        
    } catch (error) {
        console.error('Error loading map:', error);
        console.log('Attempting fallback...');
        loadFallbackFromCDN();
    }
}

/**
 * Fallback: Load from CDN or external source
 */
async function loadFallbackFromCDN() {
    try {
        // Try loading from public CDN sources
        const cdnUrls = [
            'https://raw.githubusercontent.com/geolonia/japanese-prefectures/master/map-full.svg',
            'https://upload.wikimedia.org/wikipedia/commons/c/cf/Japan_prefectures.svg'
        ];
        
        for (const url of cdnUrls) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const svgText = await response.text();
                    processSVG(svgText);
                    console.log('✓ Loaded map from CDN fallback');
                    return;
                }
            } catch (e) {
                continue;
            }
        }
        
        throw new Error('All fallback options failed');
        
    } catch (error) {
        console.error('Could not load map from any source:', error);
        alert('Unable to load map. Please check your internet connection or ensure map-japan.svg is in the same directory.');
    }
}

/**
 * Process SVG text and inject into page
 */
function processSVG(svgText) {
    const svgMap = document.getElementById('japan-map');
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const loadedSvg = svgDoc.querySelector('svg');
    
    if (loadedSvg) {
        svgMap.setAttribute('viewBox', loadedSvg.getAttribute('viewBox'));
        svgMap.innerHTML = loadedSvg.innerHTML;
        
        // Add our classes and attributes
        const paths = svgMap.querySelectorAll('path');
        paths.forEach((path, index) => {
            if (!path.getAttribute('data-prefecture')) {
                const prefId = `JP-${String(index + 1).padStart(2, '0')}`;
                path.setAttribute('data-prefecture', prefId);
                path.classList.add('prefecture-path');
            }
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMap);
} else {
    initializeMap();
}
