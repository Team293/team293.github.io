/**
 * @fileoverview UserInterface class
 * @namespace UserInterface
 */

/**
 * @class UserInterface
 * @property {HTMLElement} timer The timer element.
 * @property {HTMLElement} playButton The play button element.
 * @property {HTMLElement} pauseButton The pause button element.
 * @property {HTMLElement} matchState The game state element.
 * @property {function} playing Sets the play/pause button.
 * @property {function} updateTimer Updates the timer.
 * @property {function} updateGameState Updates the game state.
 */
const UserInterface = {
    timer: document.getElementById("timer"),
    playButton: document.getElementById("playIcon"),
    pauseButton: document.getElementById("pauseIcon"),
    matchState: document.getElementById("matchState"),

    /**
     * @function playing Sets the play/pause button in the UI.
     * @param {boolean} playing Whether the game is playing or not.
     * @memberof UserInterface
     */
    playing(playing) {
        if (playing) {
            this.playButton.classList.add("hidden");
            this.pauseButton.classList.remove("hidden");
        } else {
            this.playButton.classList.remove("hidden");
            this.pauseButton.classList.add("hidden");
        }
    },

    /**
     * @function updateTimer Updates the timer in the UI.
     * @param {number} time The time to update the timer to.
     * @memberof UserInterface
     */
    updateTimer(time) {
        this.timer.innerHTML = time;
    },

    /**
     * @function updateGameState Updates the game state in the UI.
     * @param {string} state The state to update the game state to.
     * @memberof UserInterface
     */
    updateGameState(state) {
        this.matchState.innerHTML = state;
    },
};
