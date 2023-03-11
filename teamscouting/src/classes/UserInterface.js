/**
 * @fileoverview UserInterface class
 * @namespace UserInterface
 */

/**
 * @class UserInterface
 * @property {HTMLElement} timer The timer element.
 * @property {HTMLElement} playButton The play button element.
 * @property {HTMLElement} pauseButton The pause button element.
 * @property {HTMLElement} mobilityBonusButton The "Mobility Bonus" button element.
 * @property {HTMLElement} matchState The game state element.
 * @property {function} playing Sets the play/pause button.
 * @property {function} updateTimer Updates the timer.
 * @property {function} updateGameState Updates the game state.
 */
const UserInterface = {
  timer: document.getElementById("timer"),
  playButton: document.getElementById("playIcon"),
  pauseButton: document.getElementById("pauseIcon"),
  mobilityBonusButton: document.getElementById("mobilityBonusBtn"),
  matchState: document.getElementById("matchState"),
  fullscreenButton: document.getElementById("fullscreen"),
  exitFullscreenButton: document.getElementById("fullscreenExit"),
  fullscreen: false,

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
   * @function updateMobilityBonus Updates the status of the "Mobility Bonus" button.
   * @param {boolean} isAuto Whether or not the game is in Auto mode.
   * @memberof UserInterface
   */
  updateMobilityBonus(isAuto) {
    if (!isAuto) {
      this.mobilityBonusButton.disabled = true;
    }
  },

  /**
   * @function updateGameState Updates the game state in the UI.
   * @param {string} state The state to update the game state to.
   * @memberof UserInterface
   */
  updateGameState(state) {
    if (state !== this.matchState.innerHTML) {
      this.matchState.innerHTML = state;
    }

    const elem = document.getElementById("matchSelectedPiece");
    elem.innerText = selectedGamePieceType === CUBE ? "CUBE" : "CONE";
    elem.dataset.type = selectedGamePieceType === CUBE ? "cube" : "cone";

    document.querySelectorAll(".gamePieceSelector").forEach((x) => {
      x.classList.remove("selected");
    });
    document
      .getElementById(
        (selectedGamePieceType === CUBE ? "cube" : "cone") + "Selector"
      )
      .classList.add("selected");
  },

  toggleFullscreen() {
    this.fullscreen = !this.fullscreen;
    // toggle fullscreen
    if (document.fullscreenElement) {
      try {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        if (document.body.requestFullscreen) document.body.requestFullscreen();
        else if (document.body.mozRequestFullScreen)
          document.body.mozRequestFullScreen();
        else if (document.body.webkitRequestFullscreen)
          document.body.webkitRequestFullscreen();
      } catch (e) {
        console.error(e);
      }
    }

    this.updateFullscreen();
  },

  updateFullscreen() {
    if (this.fullscreen) {
      this.fullscreenButton.classList.add("hidden");
      this.exitFullscreenButton.classList.remove("hidden");
    } else {
      this.fullscreenButton.classList.remove("hidden");
      this.exitFullscreenButton.classList.add("hidden");
    }
  },

  updateRobotInventories() {
    for (let robot of match.redAlliance.robots.concat(
      match.blueAlliance.robots
    )) {
      let btn = getRobotButton(robot);
      if (robot.inventory === CUBE) {
        btn.innerHTML =
          robot.team + '<div class="inventory" data-type="cube"></div>';
      } else if (robot.inventory === CONE) {
        btn.innerHTML =
          robot.team + '<div class="inventory" data-type="cone"></div>';
      } else {
        btn.innerHTML = robot.team;
      }
    }
  },
};

// when fullscreen is opened or closed update the UI
document.addEventListener("fullscreenchange", () => {
  UserInterface.fullscreen = document.fullscreenElement;
  UserInterface.updateFullscreen();
});

// get redAlliance and blueAlliance elements
const redAlliance = document.getElementById("redAlliance");
for (let row = 0; row < 9; row++) {
  for (let col = 0; col <= 2; col++) {
    // row adds 1, column adds 9
    let index = row + col * 9;
    // create the element
    let button = document.createElement("button");
    button.appendChild(document.createTextNode(index.toString()));
    // add data-index attribute
    button.setAttribute("data-index", index);
    // add event listener
    button.addEventListener("click", (e) => fieldButtonPressed(e));
    redAlliance.appendChild(button);
  }
}

const blueAlliance = document.getElementById("blueAlliance");
for (let row = 0; row < 9; row++) {
  for (let col = 2; col >= 0; col--) {
    // row adds 1, column adds 9
    let index = row + col * 9;
    // create the element
    let button = document.createElement("button");
    button.appendChild(document.createTextNode(index.toString()));
    // add data-index attribute
    button.setAttribute("data-index", index);
    // add event listener
    button.addEventListener("click", (e) => fieldButtonPressed(e));
    blueAlliance.appendChild(button);
  }
}
