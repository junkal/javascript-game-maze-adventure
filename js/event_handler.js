import { CONFIG } from './config.js';

/**
 * EventHandler
 * ------------
 * Handles keyboard input for player movement, pause toggling, and game start/restart.
 * It manages key hold behavior with move cooldown, and delegates control flow to the Game instance.
 */
export class EventHandler {
    /**
     * Constructs the EventHandler and sets up input mappings and listeners.
     * 
     * @param {Game} game - The Game instance to control
     */    
    constructor(game) {
        this.game = game;
        this.heldKey = null;
        this.moveCooldown = 0;
        this.moveCooldown = CONFIG.moveCooldownFrames || 5;
  
        this.keyMap = {
            ArrowUp: [0, -1],
            ArrowDown: [0, 1],
            ArrowLeft: [-1, 0],
            ArrowRight: [1, 0],
        };
        this.registerListeners();
    }
  
    /**
     * Registers keydown and keyup event listeners for the game.
     */    
    registerListeners() {
        document.addEventListener("keydown", (e) => this.onKeyDown(e));
        document.addEventListener("keyup", (e) => this.onKeyUp(e));
    }
  
    /**
     * Handles keydown events for movement, pausing, and game start/restart.
     * 
     * @param {KeyboardEvent} e - The keydown event
     */    
    onKeyDown(e) {
        if (this.keyMap[e.key]) {
            this.heldKey = e.key;
        }
    
        // Allow pause toggle
        if (e.key.toLowerCase() === "p" && this.game) {
            this.game.togglePause();
            return;
        }
    
        // Win restart (after win, wait for Enter)
        if (this.game && this.game.readyToRestart && e.key === "Enter") {
            this.game.readyToRestart = false;
    
            const overlay = document.getElementById("game-over-overlay");
            if (overlay) {
                overlay.innerHTML = `<span style="font-size: 16px;">🔄 Restarting level...</span>`;
            }
    
            setTimeout(() => {
                window.startGame();
            }, 3000);
            return;
        }
    
        // First-time start or normal restart
        if (e.key === "Enter" && !window.gameStarted) {
            window.startGame();
        }
    }
  
    /**
     * Handles keyup events to stop movement.
     * 
     * @param {KeyboardEvent} e - The keyup event
     */    
    onKeyUp(e) {
        if (e.key === this.heldKey) {
            this.heldKey = null;
            this.moveCooldown = 0;
        }
    }
  
    /**
     * Called every game frame to apply continuous movement input.
     * Uses a cooldown to prevent movement from being too fast while a key is held.
     */    
    update() {
        if (this.heldKey && !this.game.gameOver) {
            const move = this.keyMap[this.heldKey];
            if (move && this.moveCooldown === 0) {
                this.game.player.move(move[0], move[1], this.game.maze);
                this.moveCooldown = CONFIG.moveCooldownFrames || 8;
            }
  
            if (this.moveCooldown > 0) this.moveCooldown--;
        }
    }
}