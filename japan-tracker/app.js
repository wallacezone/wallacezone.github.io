/**
 * Japan Prefecture Tracker - Main Application Logic
 * Handles state management, interactions, localStorage, and URL sharing
 */

// Application state
let prefectureStates = {};
let isReadOnlyMode = false;

// DOM Elements
let tooltip;
let visitedCountElement;
let progressBar;
let shareBtn;
let resetBtn;
let shareLinkContainer;
let shareLinkInput;
let copyLinkBtn;
let readOnlyBanner;

/**
 * Initialize the application
 */
function init() {
    // Get DOM elements
    tooltip = document.getElementById('tooltip');
    visitedCountElement = document.getElementById('visited-count');
    progressBar = document.getElementById('progress-bar');
    shareBtn = document.getElementById('share-btn');
    resetBtn = document.getElementById('reset-btn');
    shareLinkContainer = document.getElementById('share-link-container');
    shareLinkInput = document.getElementById('share-link-input');
    copyLinkBtn = document.getElementById('copy-link-btn');
    readOnlyBanner = document.getElementById('read-only-banner');
    
    // Initialize prefecture states
    initializePrefectureStates();
    
    // Check if URL contains shared state
    checkForSharedState();
    
    // Load state from localStorage or URL
    if (!isReadOnlyMode) {
        loadStateFromLocalStorage();
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Update counter
    updateCounter();
    
    console.log('✓ Application initialized');
}

/**
 * Initialize all prefecture states to NOT_MARKED
 */
function initializePrefectureStates() {
    Object.keys(PREFECTURES).forEach(prefId => {
        prefectureStates[prefId] = STATE.NOT_MARKED;
    });
}

/**
 * Check URL for shared state parameter
 */
function checkForSharedState() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedState = urlParams.get('state');
    
    if (sharedState) {
        try {
            // Decompress and parse the shared state
            const decompressed = LZString.decompressFromEncodedURIComponent(sharedState);
            const parsedState = JSON.parse(decompressed);
            
            // Load the shared state
            prefectureStates = parsedState;
            
            // Enable read-only mode
            isReadOnlyMode = true;
            enableReadOnlyMode();
            
            console.log('✓ Loaded shared map state');
        } catch (error) {
            console.error('Error loading shared state:', error);
        }
    }
}

/**
 * Enable read-only mode
 */
function enableReadOnlyMode() {
    // Show read-only banner
    readOnlyBanner.classList.remove('hidden');
    
    // Hide action buttons
    resetBtn.style.display = 'none';
    shareBtn.textContent = '🔗 Create Your Own Map';
    
    // Disable clicking on prefectures
    const paths = document.querySelectorAll('.prefecture-path');
    paths.forEach(path => {
        path.classList.add('readonly');
        path.style.cursor = 'default';
    });
    
    // Update share button to create new map
    shareBtn.onclick = () => {
        window.location.href = window.location.origin + window.location.pathname;
    };
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Wait for map to be initialized
    setTimeout(() => {
        const paths = document.querySelectorAll('.prefecture-path');
        
        paths.forEach(path => {
            const prefId = path.getAttribute('data-prefecture');
            
            if (!isReadOnlyMode) {
                // Click event - cycle through states
                path.addEventListener('click', (e) => {
                    e.stopPropagation();
                    cyclePrefectureState(prefId);
                });
            }
            
            // Hover events - show tooltip
            path.addEventListener('mouseenter', (e) => {
                showTooltip(prefId);
            });
            
            path.addEventListener('mousemove', (e) => {
                moveTooltip(e);
            });
            
            path.addEventListener('mouseleave', () => {
                hideTooltip();
            });
        });
        
        // Apply current states to map
        applyStatesToMap();
        
        console.log('✓ Event listeners attached to prefectures');
    }, 100);
    
    // Button event listeners
    if (!isReadOnlyMode) {
        shareBtn.addEventListener('click', generateShareLink);
        resetBtn.addEventListener('click', resetMap);
        copyLinkBtn.addEventListener('click', copyShareLink);
    }
}

/**
 * Cycle prefecture through states: not-marked -> to-visit -> visited -> not-marked
 */
function cyclePrefectureState(prefId) {
    const currentState = prefectureStates[prefId];
    
    // Cycle to next state
    switch (currentState) {
        case STATE.NOT_MARKED:
            prefectureStates[prefId] = STATE.TO_VISIT;
            break;
        case STATE.TO_VISIT:
            prefectureStates[prefId] = STATE.VISITED;
            break;
        case STATE.VISITED:
            prefectureStates[prefId] = STATE.NOT_MARKED;
            break;
        default:
            prefectureStates[prefId] = STATE.NOT_MARKED;
    }
    
    // Update visual state
    updatePrefectureVisual(prefId);
    
    // Save to localStorage
    saveStateToLocalStorage();
    
    // Update counter
    updateCounter();
}

/**
 * Update prefecture visual appearance based on state
 */
function updatePrefectureVisual(prefId) {
    const path = document.querySelector(`[data-prefecture="${prefId}"]`);
    if (!path) return;
    
    const state = prefectureStates[prefId];
    
    // Remove all state classes
    path.classList.remove('to-visit', 'visited');
    
    // Add appropriate class
    if (state === STATE.TO_VISIT) {
        path.classList.add('to-visit');
    } else if (state === STATE.VISITED) {
        path.classList.add('visited');
    }
}

/**
 * Apply all states to the map
 */
function applyStatesToMap() {
    Object.keys(prefectureStates).forEach(prefId => {
        updatePrefectureVisual(prefId);
    });
}

/**
 * Show tooltip with prefecture name
 */
function showTooltip(prefId) {
    const prefData = PREFECTURES[prefId];
    if (!prefData) return;
    
    tooltip.textContent = `${prefData.name} (${prefData.nameJa})`;
    tooltip.classList.add('show');
}

/**
 * Move tooltip with mouse cursor
 */
function moveTooltip(e) {
    const offset = 15;
    tooltip.style.left = (e.clientX + offset) + 'px';
    tooltip.style.top = (e.clientY + offset) + 'px';
}

/**
 * Hide tooltip
 */
function hideTooltip() {
    tooltip.classList.remove('show');
}

/**
 * Update visited counter and progress bar
 */
function updateCounter() {
    const visitedCount = Object.values(prefectureStates).filter(
        state => state === STATE.VISITED
    ).length;
    
    const percentage = Math.round((visitedCount / 47) * 100);
    
    visitedCountElement.textContent = visitedCount;
    progressBar.style.width = percentage + '%';
}

/**
 * Save state to localStorage
 */
function saveStateToLocalStorage() {
    try {
        localStorage.setItem('japanPrefectureStates', JSON.stringify(prefectureStates));
        console.log('✓ State saved to localStorage');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Load state from localStorage
 */
function loadStateFromLocalStorage() {
    try {
        const savedState = localStorage.getItem('japanPrefectureStates');
        if (savedState) {
            prefectureStates = JSON.parse(savedState);
            applyStatesToMap();
            updateCounter();
            console.log('✓ State loaded from localStorage');
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

/**
 * Generate shareable link
 */
function generateShareLink() {
    try {
        // Convert state to JSON
        const stateJson = JSON.stringify(prefectureStates);
        
        // Compress using LZ-String
        const compressed = LZString.compressToEncodedURIComponent(stateJson);
        
        // Generate URL
        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?state=${compressed}`;
        
        // Display the link
        shareLinkInput.value = shareUrl;
        shareLinkContainer.classList.remove('hidden');
        
        // Auto-select the text
        shareLinkInput.select();
        
        console.log('✓ Share link generated');
    } catch (error) {
        console.error('Error generating share link:', error);
        alert('Error generating share link. Please try again.');
    }
}

/**
 * Copy share link to clipboard
 */
function copyShareLink() {
    shareLinkInput.select();
    shareLinkInput.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        navigator.clipboard.writeText(shareLinkInput.value).then(() => {
            // Visual feedback
            copyLinkBtn.textContent = '✓ Copied!';
            copyLinkBtn.style.background = '#059669';
            
            setTimeout(() => {
                copyLinkBtn.textContent = '📋 Copy Link';
                copyLinkBtn.style.background = '';
            }, 2000);
        });
    } catch (error) {
        // Fallback for older browsers
        document.execCommand('copy');
        copyLinkBtn.textContent = '✓ Copied!';
        
        setTimeout(() => {
            copyLinkBtn.textContent = '📋 Copy Link';
        }, 2000);
    }
}

/**
 * Reset map to initial state
 */
function resetMap() {
    // Show confirmation dialog
    const confirmed = confirm(
        'Are you sure you want to reset the map?\n\nThis will clear all your selections and cannot be undone.'
    );
    
    if (!confirmed) return;
    
    // Reset all states
    initializePrefectureStates();
    
    // Apply to map
    applyStatesToMap();
    
    // Clear localStorage
    localStorage.removeItem('japanPrefectureStates');
    
    // Hide share link container
    shareLinkContainer.classList.add('hidden');
    
    // Update counter
    updateCounter();
    
    console.log('✓ Map reset');
}

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle page visibility change to update from localStorage if another tab modified it
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !isReadOnlyMode) {
        loadStateFromLocalStorage();
    }
});
