// Game State
const gameState = {
    stamina: 100,
    maxStamina: 100,
    staminaDrainRate: 0.05,
    foundBirds: new Set(),
    binocularsActive: false,
    gameOver: false,
    activeBirds: [],
    notebookOpen: false
};

// Bird Types
const birdTypes = [
    { id: 1, name: 'Robin', emoji: '🐦', color: '#ff6b6b' },
    { id: 2, name: 'Cardinal', emoji: '🔴', color: '#e74c3c' },
    { id: 3, name: 'Blue Jay', emoji: '🔵', color: '#3498db' },
    { id: 4, name: 'Goldfinch', emoji: '🟡', color: '#f1c40f' },
    { id: 5, name: 'Hummingbird', emoji: '🐝', color: '#9b59b6' },
    { id: 6, name: 'Owl', emoji: '🦉', color: '#8b4513' },
    { id: 7, name: 'Eagle', emoji: '🦅', color: '#d35400' },
    { id: 8, name: 'Duck', emoji: '🦆', color: '#27ae60' },
    { id: 9, name: 'Swan', emoji: '🦢', color: '#ecf0f1' },
    { id: 10, name: 'Peacock', emoji: '🦚', color: '#16a085' }
];

// DOM Elements
const elements = {
    birdsContainer: document.getElementById('birdsContainer'),
    coffeeMaker: document.getElementById('coffeeMaker'),
    notebook: document.getElementById('notebook'),
    notebookOverlay: document.getElementById('notebookOverlay'),
    notebookLines: document.getElementById('notebookLines'),
    binoculars: document.getElementById('binoculars'),
    binocularsOverlay: document.getElementById('binocularsOverlay'),
    staminaBar: document.getElementById('staminaBar'),
    winScreen: document.getElementById('winScreen'),
    finalBirdList: document.getElementById('finalBirdList'),
    restartBtn: document.getElementById('restartBtn'),
    mapWidget: document.getElementById('mapWidget'),
    mapMini: document.getElementById('mapMini'),
    mapExpanded: document.getElementById('mapExpanded'),
    closeMapBtn: document.getElementById('closeMapBtn')
};

// Initialize Game
function initGame() {
    createNotebookLines();
    setupEventListeners();
    startStaminaDrain();
    spawnBirds();
    updateNotebook();
    updateStaminaBar();
}

// Create Notebook Lines
function createNotebookLines() {
    elements.notebookLines.innerHTML = '';

    for (let i = 1; i <= 10; i++) {
        const line = document.createElement('div');
        line.className = 'notebook-line';
        line.dataset.number = i;
        line.dataset.birdId = '';
        elements.notebookLines.appendChild(line);
    }
}

// Spawn Birds
function spawnBirds() {
    elements.birdsContainer.innerHTML = '';
    gameState.activeBirds = [];

    // Spawn 15 birds (some duplicates to make spotting harder)
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            if (gameState.gameOver) return;

            const birdType = birdTypes[Math.floor(Math.random() * birdTypes.length)];
            const bird = createBird(birdType, i);
            gameState.activeBirds.push(bird);
            elements.birdsContainer.appendChild(bird);
        }, i * 800);
    }

    // Continuously spawn new birds
    setInterval(() => {
        if (gameState.gameOver) return;
        if (gameState.activeBirds.length < 12) {
            const birdType = birdTypes[Math.floor(Math.random() * birdTypes.length)];
            const bird = createBird(birdType, Date.now());
            gameState.activeBirds.push(bird);
            elements.birdsContainer.appendChild(bird);

            // Remove bird after some time
            setTimeout(() => {
                if (bird.parentNode && !bird.classList.contains('spotted')) {
                    bird.remove();
                    gameState.activeBirds = gameState.activeBirds.filter(b => b !== bird);
                }
            }, 8000 + Math.random() * 7000);
        }
    }, 3000);
}

// Create Bird Element
function createBird(birdType, index) {
    const bird = document.createElement('div');
    bird.className = 'bird';
    bird.innerHTML = birdType.emoji;
    bird.dataset.birdId = birdType.id;
    bird.dataset.birdName = birdType.name;

    // ========== BIRD POSITIONING ==========
    // CHANGE BELOW: Adjust spawn range (all percentages stay within birds-container)
    const left = 10 + Math.random() * 80;     // Horizontal: 10% to 90% of container width
    const bottom = 10 + Math.random() * 80;   // Vertical: 10% to 90% of container height

    bird.style.left = `${left}%`;
    bird.style.bottom = `${bottom}%`;

    // Make smaller if farther away (harder to click without binoculars)
    const depth = Math.random();
    if (depth > 0.6) {
        bird.style.fontSize = '14px';
        bird.style.opacity = '0.7';
    } else if (depth > 0.3) {
        bird.style.fontSize = '18px';
    }

    // Add flying animation
    if (Math.random() > 0.5) {
        bird.classList.add('flying');
    }

    // Click handler
    bird.addEventListener('click', (e) => {
        e.stopPropagation();
        spotBird(bird, birdType);
    });

    return bird;
}

// Spot Bird
function spotBird(birdElement, birdType) {
    if (gameState.gameOver) return;

    const birdId = birdType.id;

    if (gameState.foundBirds.has(birdId)) {
        // Already found this bird
        showBirdAlreadyFound(birdElement);
        return;
    }

    // New bird found!
    gameState.foundBirds.add(birdId);
    birdElement.classList.add('spotted');

    // Update notebook
    updateNotebook();

    // Show found notification
    showBirdFoundNotification(birdType);

    // Check win condition
    if (gameState.foundBirds.size === birdTypes.length) {
        winGame();
    }
}

// Show Bird Found Notification
function showBirdFoundNotification(birdType) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #3d7a37;
        color: #fff;
        padding: 16px 24px;
        font-size: 10px;
        z-index: 150;
        animation: pixelFadeInOut 2s steps(4) forwards;
        white-space: nowrap;
    `;
    notification.innerHTML = `NEW! ${birdType.emoji} ${birdType.name.toUpperCase()}`;

    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 2000);
}

// Show Bird Already Found
function showBirdAlreadyFound(birdElement) {
    birdElement.style.animation = 'none';
    birdElement.offsetHeight; // Trigger reflow
    birdElement.style.animation = 'pixelShake 0.4s steps(4)';
}

// Update Notebook
function updateNotebook() {
    const lines = elements.notebookLines.querySelectorAll('.notebook-line');

    // Clear all lines first
    lines.forEach(line => {
        line.innerHTML = '';
        line.dataset.birdId = '';
    });

    // Fill in found birds in order
    let lineNumber = 0;
    gameState.foundBirds.forEach(birdId => {
        const birdType = birdTypes.find(b => b.id === birdId);
        if (lineNumber < 10 && birdType) {
            const line = lines[lineNumber];
            const entry = document.createElement('div');
            entry.className = 'bird-entry';
            entry.innerHTML = `
                <span class="bird-emoji">${birdType.emoji}</span>
                <span>${birdType.name}</span>
            `;
            line.appendChild(entry);
            line.dataset.birdId = birdId;
            lineNumber++;
        }
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Coffee Maker
    elements.coffeeMaker.addEventListener('click', () => {
        if (gameState.gameOver) return;
        drinkCoffee();
    });

    // Notebook - toggle overlay
    elements.notebook.addEventListener('click', () => {
        if (gameState.gameOver) return;
        toggleNotebook();
    });

    // Binoculars
    elements.binoculars.addEventListener('click', () => {
        if (gameState.gameOver) return;
        toggleBinoculars();
    });

    // Map Widget
    elements.mapMini.addEventListener('click', () => {
        if (gameState.gameOver) return;
        toggleMap();
    });

    // Close Map Button
    elements.closeMapBtn.addEventListener('click', () => {
        closeMap();
    });

    // Restart Button
    elements.restartBtn.addEventListener('click', () => {
        restartGame();
    });
}

// Toggle Notebook Overlay
function toggleNotebook() {
    gameState.notebookOpen = !gameState.notebookOpen;
    if (gameState.notebookOpen) {
        elements.notebookOverlay.classList.add('active');
    } else {
        elements.notebookOverlay.classList.remove('active');
    }
}

// Drink Coffee
function drinkCoffee() {
    const restoreAmount = 30;
    gameState.stamina = Math.min(gameState.maxStamina, gameState.stamina + restoreAmount);
    updateStaminaBar();

    // Show drinking notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #6b4423;
        color: #fff;
        padding: 12px 20px;
        font-size: 9px;
        z-index: 150;
        animation: pixelFadeInOut 1s steps(4) forwards;
        white-space: nowrap;
    `;
    notification.innerHTML = '☕ COFFEE BREAK!';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 1000);
}

// Toggle Binoculars
function toggleBinoculars() {
    gameState.binocularsActive = !gameState.binocularsActive;

    if (gameState.binocularsActive) {
        elements.binocularsOverlay.classList.add('active');
        elements.birdsContainer.style.transform = 'scale(1.5)';
        elements.birdsContainer.style.transformOrigin = 'center center';
    } else {
        elements.binocularsOverlay.classList.remove('active');
        elements.birdsContainer.style.transform = 'scale(1)';
    }
}

// Toggle Map
function toggleMap() {
    elements.mapExpanded.classList.add('active');
}

// Close Map
function closeMap() {
    elements.mapExpanded.classList.remove('active');
}

// Start Stamina Drain
function startStaminaDrain() {
    setInterval(() => {
        if (gameState.gameOver) return;

        gameState.stamina -= gameState.staminaDrainRate;

        if (gameState.stamina <= 0) {
            gameState.stamina = 0;
            // At low stamina, birds become harder to spot
            elements.birdsContainer.style.filter = 'brightness(0.7) blur(1px)';
        } else if (gameState.stamina > 30) {
            elements.birdsContainer.style.filter = 'brightness(1)';
        }

        updateStaminaBar();
    }, 100);
}

// Update Stamina Bar
function updateStaminaBar() {
    elements.staminaBar.style.width = `${gameState.stamina}%`;

    if (gameState.stamina < 30) {
        elements.staminaBar.classList.add('low');
    } else {
        elements.staminaBar.classList.remove('low');
    }
}

// Win Game
function winGame() {
    gameState.gameOver = true;

    // Show final bird list
    elements.finalBirdList.innerHTML = '';
    gameState.foundBirds.forEach(birdId => {
        const birdType = birdTypes.find(b => b.id === birdId);
        const item = document.createElement('div');
        item.className = 'final-bird-list-item';
        item.innerHTML = `
            <span style="font-size: 24px;">${birdType.emoji}</span>
            <span>${birdType.name}</span>
        `;
        elements.finalBirdList.appendChild(item);
    });

    // Show win screen
    elements.winScreen.classList.add('active');
}

// Restart Game
function restartGame() {
    // Reset game state
    gameState.stamina = 100;
    gameState.foundBirds.clear();
    gameState.binocularsActive = false;
    gameState.gameOver = false;
    gameState.activeBirds = [];
    gameState.notebookOpen = false;

    // Reset UI
    elements.winScreen.classList.remove('active');
    elements.binocularsOverlay.classList.remove('active');
    elements.notebookOverlay.classList.remove('active');
    elements.mapExpanded.classList.remove('active');
    elements.birdsContainer.style.transform = 'scale(1)';
    elements.birdsContainer.style.filter = 'brightness(1)';

    // Recreate notebook lines
    createNotebookLines();

    // Clear and respawn
    elements.birdsContainer.innerHTML = '';
    spawnBirds();
    updateStaminaBar();
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pixelFadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
    }
    @keyframes pixelShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-4px); }
        50% { transform: translateX(4px); }
        75% { transform: translateX(-4px); }
    }
`;
document.head.appendChild(style);

// Start the game when page loads
window.addEventListener('DOMContentLoaded', initGame);
