import createMiniDND from "./miniDND.js";

const miniDND = createMiniDND();

// ======================
// GAME DATA
// ======================
// The correct positions of the letters as JSON data
const gameDataArray = {
  level1: [
    {
      index: "0",
      correctPositions: {
        a2: "S",
        a3: "O"
      }
    }
  ],
  level2: [
    {
      index: "0",
      correctPositions: {
        a1: "A",
        a2: "N",
        a3: "T"
      }
    }
  ],
  level3: [
    {
      index: "0",
      correctPositions: {
        a1: "E",
        a2: "C",
        a3: "H",
        a4: "O"
      }
    }
  ],
  level4: [
    {
      index: "0",
      correctPositions: {
        a1: "H",
        a2: "A",
        a3: "N",
        a4: "D",
        b4: "O"
      }
    }
  ],
  level5: [
    {
      index: "0",
      correctPositions: {
        a1: "K",
        a2: "I",
        a3: "W",
        a4: "I",
        b4: "C",
        c4: "E"
      }
    }
  ],
  level6: [
    {
      index: "0",
      correctPositions: {
        a1: "B",
        a2: "O",
        a3: "W",
        a4: "L",
        b4: "I",
        c4: "M",
        d4: "E"
      }
    }
  ],
  level7: [
    {
      index: "0",
      correctPositions: {
        a1: "U",
        a2: "G",
        a3: "L",
        a4: "Y",
        b4: "E",
        c4: "A",
        d4: "R",
        e4: "S"
      }
    }
  ],
  level8: [
    {
      index: "0",
      correctPositions: {
        a1: "D",
        a2: "E",
        a3: "N",
        a4: "T",
        b4: "A",
        c4: "B",
        d4: "O",
        e4: "O",
        b1: "O"
      }
    }
  ],
  level9: [
    {
      index: "0",
      correctPositions: {
        a1: "L",
        a2: "A",
        a3: "V",
        a4: "A",
        b4: "U",
        c4: "D",
        d4: "I",
        e4: "O",
        b1: "E",
        c1: "T"
      }
    }
  ],
  level10: [
    {
      index: "0",
      correctPositions: {
        a1: "A",
        a2: "Q",
        a3: "U",
        a4: "A",
        b4: "G",
        c4: "A",
        d4: "I",
        e4: "N",
        b1: "P",
        c1: "E",
        d1: "X"
      }
    }
  ],
  level11: [
    {
      index: "0",
      correctPositions: {
        a1: "R",
        a2: "A",
        a3: "M",
        a4: "P",
        b4: "A",
        c4: "U",
        d4: "S",
        e4: "E",
        b1: "E",
        c1: "A",
        d1: "C",
        e1: "H"
      }
    }
  ],
  level12: [
    {
      index: "0",
      correctPositions: {
        a1: "F",
        a2: "R",
        a3: "O",
        a4: "G",
        b4: "H",
        c4: "O",
        d4: "S",
        e4: "T",
        b1: "R",
        c1: "O",
        d1: "S",
        e1: "T",
        e2: "O"
      }
    }
  ],
  level13: [
    {
      index: "0",
      correctPositions: {
        a1: "B",
        a2: "R",
        a3: "E",
        a4: "W",
        b4: "H",
        c4: "A",
        d4: "L",
        e4: "E",
        b1: "U",
        c1: "G",
        d1: "G",
        e1: "Y",
        e2: "U",
        e3: "L"
      }
    }
  ]
};


// ======================
// GET GAME DATA
// ======================

let currentLevel =
  parseInt(localStorage.getItem("13kjsgames.frantic13.currentLevel")) || 1;

console.log(currentLevel);

let lastIndex =
  parseInt(localStorage.getItem("13kjsgames.frantic13.lastGameIndex")) || 0;

let hasFailedLastGame =
  localStorage.getItem("13kjsgames.frantic13.hasFailedLastGame") === "true";

function updateLevelDisplay(currentLevel) {
  document.querySelector(".level").textContent = `Level ${currentLevel}`;
}

// Update next game index based on failure or success
function updateNextGameIndex(success) {
  const levelKey = `level${currentLevel}`;
  const levelData = gameDataArray[levelKey];

  if (success) {
    // Move to the next level and reset the index if the level was completed
    currentLevel++;
    localStorage.setItem("13kjsgames.frantic13.currentLevel", currentLevel);
    //updateLevelDisplay(currentLevel); // Update the level display
    lastIndex = 0; // Start from the first index for the new level
    localStorage.setItem("13kjsgames.frantic13.lastGameIndex", lastIndex);
    localStorage.setItem("13kjsgames.frantic13.hasFailedLastGame", false);
  } else {
    // If the player failed, increase the index for the current level
    lastIndex = (lastIndex + 1) % levelData.length;
    localStorage.setItem("13kjsgames.frantic13.lastGameIndex", lastIndex);
    localStorage.setItem("13kjsgames.frantic13.hasFailedLastGame", true);
  }

  return { currentLevel, lastIndex };
}

function getGameData(level, index) {
  const levelKey = `level${level}`;
  const levelData = gameDataArray[levelKey];

  if (!levelData) {
    console.error(`No data available for level ${level}`);
    return null;
  }

  const gameData = levelData.find((game) => game.index === index.toString());

  if (!gameData) {
    console.error(`No data available for index ${index} in level ${level}`);
    return null;
  }

  return gameData;
}

// Use the correctPositions from the current game data
const currentGameData = getGameData(currentLevel, lastIndex);

let correctPositions = {};

if (!currentGameData) {
  console.error("No game data available.");
  corrrectPositions = {};
} else {
  // Use the correctPositions from the current game data
  correctPositions = currentGameData.correctPositions;
  hideUnusedSlots(correctPositions);
}

// ========================
// HIDE SLOTS WHEN NOT USED
// ========================

function hideUnusedSlots(correctPositions) {
  const slots = document.querySelectorAll(".move"); // Select all slots

  for (let slot of slots) {
    const slotId = slot.getAttribute("data-slot");

    // Skip the spawn tile slot
    if (slotId === "tile-spawn") {
      continue;
    }

    // If the slot is not in the correctPositions, hide it and set data-tile to "is-hidden"
    if (!correctPositions.hasOwnProperty(slotId)) {
      slot.classList.add("is-hidden");
    } else {
      // Ensure slots that are in correctPositions are visible
      slot.classList.remove("is-hidden");
    }
  }
}

// ======================
// CHECK TILE POSITIONS
// ======================

function checkTiles() {
  const slots = document.querySelectorAll(".move"); // Select all slots and the spawn-tile

  slots.forEach((slot) => {
    const slotId = slot.getAttribute("data-slot");
    const tileDiv = slot.querySelector(".drag");
    const tileValue = tileDiv.textContent.trim(); // Get the value inside the tile

    // Compare with the correct position
    if (correctPositions[slotId] && correctPositions[slotId] === tileValue) {
      tileDiv.setAttribute("data-tile", "true"); // Set to true if correct
      slot.classList.add("disabled"); // Add a disabled class
      slot.classList.remove("move");
      addTime(); // Add 13 seconds
    } else if (slotId === "tile-spawn") {
      tileDiv.setAttribute("data-tile", "spawned"); // Add data-spawned attribute
    } else if (tileValue === "") {
      tileDiv.setAttribute("data-tile", "empty"); // Set to 'empty' if the tile contains no letters
    } else {
      tileDiv.setAttribute("data-tile", "false"); // Set to false if incorrect
      slot.classList.remove("disabled"); // Remove disabled class if incorrect
      slot.classList.add("move");
    }
  });
}

// ======================
// RANDOMISE LETTER SPAWNING
// ======================

// Extract all letters from correctPositions
let letters = Object.values(correctPositions);

// Shuffle the letters array (Fisher-Yates Shuffle)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Shuffle the letters to randomize the order
shuffle(letters);

// ======================
// DISPLAY NEXT LETTER IN SPAWN TILE
// ======================

function displayNextLetter() {
  if (letters.length > 0) {
    const nextLetter = letters.shift(); // Get and remove the first letter
    const spawnTile = document.querySelector('[data-slot="tile-spawn"] .drag');

    spawnTile.textContent = nextLetter; // Set the spawn-tile content to the next letter
  }
}

// ======================
// MOVE COUNTER
// ======================

// Initialize the move counter
let moveCount = 0;

//Function to update the move counter
function updateMoveCounter() {
  const moveCounter = document.querySelector(
    "game-data-wrapper span:first-child"
  );
  parseInt(moveCounter.textContent.split(": ")[1]);
  moveCount += 1;
  moveCounter.textContent = `Moves: ${moveCount}`;
  // ===========================
  // END GAME LOGIC
  // ===========================
  if (gameCompleted()) {
    // Define gameCompleted() logic to check if the game is over
    // If game is completed, stop the timer and store game data
    clearInterval(timerInterval); // Stop the timer
    const timeTaken = timeLeft - 13;
    timeLeft = timeTaken; // So the end game timer state does not jump up

    storeGameData(moveCount, timeTaken); // Store the game data with time taken
    calculateStats(); // Optionally calculate average, PB, etc
    updateNextGameIndex(true); // Save to local storage to move to the next level
    const endPopover = document.getElementById("game-finished");
    const finishedLevelText = document.querySelector(".level-complete").textContent = `Great! You completed level ${currentLevel} in ${moveCount} moves and with ${timeTaken} seconds left.`;
    endPopover.showPopover();
    //alert(`Great! You finished in ${moveCount} moves and ${timeTaken} seconds left.`);
  }
}

// ======================
// PAST GAME STATS
// ======================

// Function to calculate and display average moves and personal best (PB)
function calculateStats() {
  const storedData =
    JSON.parse(localStorage.getItem("13kjsgames.frantic.personalBests")) || [];

  // Get the personal best moves and best time from local storage
  const personalBestMoves = storedData.bestMoves || Infinity;
  const personalBestTime = storedData.bestTime || -Infinity;

  // Display the personal best moves if available
  if (personalBestMoves !== Infinity) {
    document.querySelector(
      "game-data-wrapper span:nth-child(3)"
    ).textContent = `PB: ${personalBestMoves}`;
  } else {
    document.querySelector(
      "game-data-wrapper span:nth-child(2)"
    ).textContent = `PB: -`;
  }

  // Display the personal best time if available
  if (personalBestTime !== -Infinity) {
    document.querySelector(
      "game-data-wrapper span:nth-child(2)"
    ).textContent = `Best time: ${personalBestTime} secs`;
  } else {
    document.querySelector(
      "game-data-wrapper span:nth-child(2)"
    ).textContent = `Best time: -`;
  }
}

// ======================
// TIMER
// ======================
let timerInterval;
let timeLeft = 13;
let elapsedTime = 0;
let timerStarted = false;
let isPaused = false; // To track the paused state

// Function to update the timer display
function updateTimerDisplay() {
  const timerElement = document.querySelector(".timer");
  timerElement.textContent = timeLeft;
}

function updateTimerColor(timeLeft) {
  const timerElement = document.querySelector(".timer");

  if (timeLeft < 14) {
    timerElement.style.setProperty("--timer-color", "crimson");
  } else if (timeLeft >= 14 && timeLeft <= 45) {
    timerElement.style.setProperty("--timer-color", "gold");
  } else {
    timerElement.style.setProperty("--timer-color", "forestgreen");
  }
}

// Function to start the timer
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    updateTimerColor(timeLeft); // Updates the color based on time

    // If time runs out, stop the game
    if (timeLeft <= 0) {
      // ========================
      // GAME OVER / LEVEL FAILED
      // ========================
      clearInterval(timerInterval);
      //alert("Time's up! Game over.");
      updateNextGameIndex(false); // for failure
      const popover = document.getElementById("game-over");
      popover.showPopover();

      // Optionally, you can reset or end the game here

      // ======================
      // MORE RESET GAME LOGIC
      // ======================
      const resetButton = document.getElementById("resetGame");
      if (resetButton) {
        resetButton.addEventListener("click", resetGame);
      }

      // Event to trigger resetGame when the popover is closed when clicking the backdrop
      popover.addEventListener("beforetoggle", (event) => {
        resetGame();
      });
    }
  }, 1000); // Update every second
}

// Function to add time (13 seconds)
function addTime() {
  timeLeft += 13;
  // Make sure the game has not finished
  if (!gameCompleted()) {
    updateTimerDisplay();
  }
}

// Function to pause the timer
function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval); // Stop the interval
    timerInterval = null; // Reset the interval variable
    isPaused = true;
  }
}

// Function to resume the timer
function resumeTimer() {
  if (!timerInterval && isPaused) {
    startTimer(); // Restart the timer if it was paused
    isPaused = false;
  }
}

// ======================
// GAME START
// ======================
function startGame() {
  timeLeft = 13; // Reset to 13 seconds
  clearInterval(timerInterval); // Clear any existing timer
  startTimer(); // Start a new timer
}

// Reset timer (add 13 seconds) when a tile is correctly placed
function resetTimer() {
  timeLeft += 13; // Add 13 seconds
}

// ======================
// RESET GAME
// ======================
/*let initialTileStates = {};

// Function to initialize the state of each tile
function initializeTileStates() {
  document.querySelectorAll(".move").forEach((slot) => {
    const tileDiv = slot.querySelector(".drag");
    const slotId = slot.getAttribute("data-slot");
    initialTileStates[slotId] = {
      content: tileDiv.innerHTML,
      tileData: tileDiv.dataset.tile
    };
  });
}

function updateTilesBasedOnCorrectPositions(correctPositions) {
  const slots = document.querySelectorAll(".move");
  slots.forEach((slot) => {
    const tileDiv = slot.querySelector(".drag");
    const slotId = slot.getAttribute("data-slot");

    // Check and set tile based on correctPositions
    if (!correctPositions[slotId]) {
      tileDiv.innerHTML = correctPositions[slotId];
      //tileDiv.dataset.tile = "correct"; // Or any specific value indicating correct position
    }
  });
} */

function resetGame() {
  console.log("Game reset!");
  location.reload();
  /*
  // Reset the game state (moves, tiles, etc.)
  moveCount = 0; // Reset the move counter
  timeLeft = 13; // Reset the timer back to the initial value
  timerStarted = false;
  clearInterval(timerInterval);

  // Reset the move counter display
  const moveCounter = document.querySelector(
    "game-data-wrapper span:first-child"
  );
  if (moveCounter) {
    moveCounter.textContent = `Moves: ${moveCount}`;
  }

  // Get today's game data and correct positions
  const todayGameData = getTodayGameData();
  if (!todayGameData) {
    console.error("No game data available for today.");
    return;
  }

  const correctPositions = todayGameData.correctPositions;

  initializeTileStates();

  // Display the first letter in the spawn tile
  displayNextLetter();

  updateTimerDisplay(); // Reset the timer display
  updateTimerColor(timeLeft); // Reset the timer color

  // Hide the game over popover if necessary
  const popover = document.getElementById("game-over");
  if (popover) {
    popover.hidePopover(); // Ensure popover is hidden when the game resets
  }*/
}

// ======================
// GAME COMPLETED
// ======================
function gameCompleted() {
  const slots = document.querySelectorAll(".move, .spawn"); // Select only the slots, excluding the spawn tile

  for (let slot of slots) {
    const slotId = slot.getAttribute("data-slot");

    // Skip the spawn tile slot
    if (slotId === "tile-spawn") {
      continue;
    }
    
    // Skip the is-hidden slots
    if (slot.classList.contains("is-hidden")) {
      continue;
    }

    const tileDiv = slot.querySelector(".drag");
    const tileValue = tileDiv ? tileDiv.textContent.trim() : ""; // Get the value inside the tile

    // If any tile is not in the correct position, return false
    if (correctPositions[slotId] && correctPositions[slotId] !== tileValue) {
      return false;
    }

    // If any slot is empty, return false
    if (tileValue === "") {
      return false;
    }
  }

  // If all slots except the spawn tile are correct and not empty, return true
  return true;
}

// ======================
// RESET LEVELS AND INDEX
// ======================

function resetGameProgress() {
  localStorage.setItem("13kjsgames.frantic13.currentLevel", 1); // Reset to level 1
  localStorage.setItem("13kjsgames.frantic13.lastGameIndex", 0); // Reset index
}

// ======================
// STORE GAME DATA IN LOCAL STORAGE
// ======================

function storeGameData(moveCount, timeTaken) {
  // Retrieve stored data or initialize an object for PB
  const storedData = JSON.parse(
    localStorage.getItem("13kjsgames.frantic13.personalBests")
  ) || {
    bestMoves: Infinity, // Use Infinity as the initial value for comparison
    bestTime: Infinity // Use Infinity for best time comparison
  };

  // Check and update the personal best moves
  if (moveCount < storedData.bestMoves) {
    storedData.bestMoves = moveCount;
  }

  // Check and update the personal best time
  if (timeTaken > storedData.bestTime) {
    storedData.bestTime = timeTaken;
  }

  // Store the updated PB in local storage
  localStorage.setItem(
    "13kjsgames.frantic13.personalBests",
    JSON.stringify(storedData)
  );
}

// ======================
// ONDROP EVENT LISTENER
// ======================

miniDND.onDrop((event) => {
  const data = event.detail.data;
  //console.log("Dropped:", data);

  // Check if it's the first spawned tile being dropped
  if (!timerStarted && data.past.dataset.slot === "tile-spawn") {
    startTimer(); // Start the timer
    timerStarted = true; // Ensure the timer only starts once
  }

  // Get the event data of the dropped tile
  const swappedSlot = document.querySelector(
    `[data-slot="${data.container.dataset.slot}"]`
  );

  // Check only the swapped tile
  checkTiles(swappedSlot);

  // Update move counter
  const pastSlot = data.past.dataset.slot;
  const currentSlot = data.container.dataset.slot;
  if (pastSlot != currentSlot) {
    updateMoveCounter();
  }

  // Check if the spawn tile has been emptied
  const spawnTileSlot = document.querySelector('[data-slot="tile-spawn"]');
  const spawnTileContent = spawnTileSlot.querySelector(".drag");

  // If the spawn tile is empty, display the next letter
  if (spawnTileContent.textContent.trim() === "") {
    displayNextLetter();
  }
});

// ======================
// DOM LOADS
// ======================
// Initialize when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const currentLevel =
    parseInt(localStorage.getItem("13kjsgames.frantic13.currentLevel")) || 1;
  const howToPlayPopover = document.getElementById("howToPlay");
                                                   // Check if it's level 1
  //if (currentLevel === 1) {
    howToPlayPopover.showPopover();  // Show how to play popover
  //}
  const howToButton = document.getElementById("howTo");
  if (howToButton) {
    howToButton.addEventListener("click", () => {
      howToPlayPopover.showPopover();
    });
  }
  displayNextLetter(); // Show the first letter in the spawn tile on load
  calculateStats(); // Calculate and display stats on page load
  updateLevelDisplay(currentLevel);
});
