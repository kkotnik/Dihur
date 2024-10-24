let hunger = 50;
let energy = 50;
let pettedCount = 0;
let gameStartTime = Date.now(); // Record when the game started
let hasRunAway = false; // Track if the ferret has run away

const hungerElement = document.getElementById('hunger');
const energyElement = document.getElementById('energy');
const pettedCountElement = document.getElementById('petted-count');
const timerElement = document.getElementById('timer'); // Element to display the timer
const petElement = document.getElementById('pet');
const feedButton = document.getElementById('feed');
const sleepButton = document.getElementById('sleep');
const dancingFerret = document.getElementById('dancing-ferret');
const dancingVideoSource = document.getElementById('dancing-video-source');
const sleepingFerret = document.getElementById('sleeping-ferret');
const happyFerret = document.getElementById('happy-ferret');

// Load saved state from localStorage
function loadGame() {
    const savedHunger = localStorage.getItem('hunger');
    const savedEnergy = localStorage.getItem('energy');
    const savedPettedCount = localStorage.getItem('pettedCount');

    if (savedHunger !== null) hunger = parseInt(savedHunger);
    if (savedEnergy !== null) energy = parseInt(savedEnergy);
    if (savedPettedCount !== null) pettedCount = parseInt(savedPettedCount);

    updateDisplay();
}

// Update displayed values
function updateDisplay() {
    hungerElement.textContent = hunger;
    energyElement.textContent = energy;
    pettedCountElement.textContent = pettedCount;
}

// Randomly select a dancing video
function getRandomDancingVideo() {
    const videos = ['dancing1.mp4', 'dancing2.mp4'];
    const randomIndex = Math.floor(Math.random() * videos.length);
    return videos[randomIndex];
}

// Feed function
feedButton.addEventListener('click', () => {
    if (hasRunAway) return; // Prevent actions if ferret has run away

    hunger = Math.min(hunger + 20, 100); // max hunger is 100
    updateDisplay();
    saveGame();
    showDancingFerret();
});

// Sleep function
sleepButton.addEventListener('click', () => {
    if (hasRunAway) return; // Prevent actions if ferret has run away

    energy = Math.min(energy + 20, 100); // max energy is 100
    updateDisplay();
    saveGame();
    showSleepingFerret();
});

// Petting function
petElement.addEventListener('click', () => {
    if (hasRunAway) return; // Prevent actions if ferret has run away

    pettedCount++;
    pettedCountElement.textContent = pettedCount;

    // Change to happy ferret
    const originalFerret = petElement.firstElementChild; // Get the original ferret image
    originalFerret.style.display = 'none'; // Hide the original image
    happyFerret.style.display = 'block'; // Show happy ferret image

    setTimeout(() => {
        happyFerret.style.display = 'none'; // Hide happy ferret image after 1 second
        originalFerret.style.display = 'block'; // Show original ferret image again
    }, 1000); // 1 second

    saveGame();
});

// Save game state
function saveGame() {
    localStorage.setItem('hunger', hunger);
    localStorage.setItem('energy', energy);
    localStorage.setItem('pettedCount', pettedCount);
}

// Show dancing ferret
function showDancingFerret() {
    petElement.firstElementChild.style.display = 'none'; // Hide the ferret image
    const videoFile = getRandomDancingVideo(); // Get random video
    dancingVideoSource.src = videoFile; // Set the video source
    dancingFerret.style.display = 'block'; // Show the dancing video
    dancingFerret.load(); // Load the new video
    dancingFerret.play(); // Play the video

    // Hide the video after 3 seconds and show the ferret image again
    setTimeout(() => {
        dancingFerret.style.display = 'none';
        petElement.firstElementChild.style.display = 'block'; // Show the ferret image
    }, 3000); // 3 seconds
}

// Show sleeping ferret
function showSleepingFerret() {
    petElement.firstElementChild.style.display = 'none'; // Hide the ferret image
    sleepingFerret.style.display = 'block'; // Show the sleeping image

    // Hide the sleeping image after 3 seconds and show the ferret image again
    setTimeout(() => {
        sleepingFerret.style.display = 'none';
        petElement.firstElementChild.style.display = 'block'; // Show the ferret image
    }, 3000); // 3 seconds
}

// Game loop to decrease hunger and energy
setInterval(() => {
    if (hasRunAway) return; // Stop the interval if the ferret has run away

    hunger = Math.max(hunger - 1, 0); // decrease hunger
    energy = Math.max(energy - 1, 0); // decrease energy

    updateDisplay();
    saveGame();

    // Check runaway conditions
    const elapsedTime = (Date.now() - gameStartTime) / 1000; // Time in seconds
    if (hunger === 0 && elapsedTime >= 7200) { // 2 hours in seconds
        runAway();
    } else if (energy === 0 && elapsedTime >= 14400) { // 4 hours in seconds
        runAway();
    }
}, 5000); // Decrease every 5 seconds

// Run away function
function runAway() {
    hasRunAway = true; // Set runaway status
    petElement.firstElementChild.style.display = 'none'; // Hide the ferret image
    alert('Your ferret has run away! You need to restart the game.'); // Alert the user
    resetGame(); // Reset the game
}

// Reset game function
function resetGame() {
    localStorage.removeItem('hunger');
    localStorage.removeItem('energy');
    localStorage.removeItem('pettedCount');
    hunger = 50;
    energy = 50;
    pettedCount = 0;
    updateDisplay();
    loadGame();
    gameStartTime = Date.now(); // Reset game start time
}

// Timer function to update minutes since opened
setInterval(() => {
    if (hasRunAway) return; // Stop the timer if the ferret has run away

    const elapsedTime = Math.floor((Date.now() - gameStartTime) / 60000); // Time in minutes
    timerElement.textContent = elapsedTime; // Update timer display
}, 60000); // Update every minute

// Initialize game
loadGame();
