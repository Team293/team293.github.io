/**
 * @class Robot
 * @param {string} team The team number of the robot
 * @param {Alliance} alliance The alliance that the robot is on
 * @param {number} startingPosition The starting position of the robot
 * @property {number} inventory The game piece that the robot has in its inventory
 * @property {number} startingElement The game piece that the robot starts with
 * @property {number} startingPosition The starting position of the robot
 */
class Robot {
  /**
   * @constructor
   * @param {string} team The team number of the robot
   * @param {Alliance} alliance The alliance that the robot is on
   * @param {number} startingPosition The starting position of the robot
   */
  constructor(team, alliance, startingPosition) {
    this.team = team;
    this.alliance = alliance;
    this.inventory = EMPTY;
    this.startingElement = EMPTY;
    this.startingPosition = startingPosition;
    this.startingPosition = CENTER;
    this.disabled = false;
    this.mobilityBonusEarned = false;

    this.docked = false;
    this.engaged = false;
  }

  /**
   * @function reset
   * @description Resets the robot to its starting state
   * @memberof Robot
   */
  reset() {
    this.inventory = this.startingElement;
  }

  /**
   * @function clearInventory
   * @description Clears the inventory of the robot
   * @memberof Robot
   */
  clearInventory() {
    this.alliance.match.events.push(
      new ClearInventoryEvent(this.alliance.match, this)
    );
    this.inventory = EMPTY;
  }

  /**
   * @function setInventory
   * @description Sets the inventory of the robot
   * @param {number} gamePiece The game piece to set the inventory to
   * @memberof Robot
   */
  setInventory(gamePiece) {
    this.alliance.match.events.push(
      new SetInventoryEvent(this.alliance.match, this, gamePiece)
    )
    this.inventory = gamePiece;
  }

  /**
   * @function pickUp
   * @description Picks up a game piece from the field
   * @param {number} gamePiece The game piece to pick up
   * @param {number} location The location of the game piece
   * @memberof Robot
   */
  pickUp(gamePiece, location) {
    if (this.inventory === EMPTY) {
      this.inventory(gamePiece);
      this.alliance.match.events.push(
        new PickUpEvent(this.alliance.match, this, location, gamePiece)
      );
    } else {
      throw new Error(
        "Cannot pick up a game piece if the robot's inventory is full."
      );
    }
  }

  /**
   * @function scorePiece
   * @description Scores a game piece on the field
   * @param {number} location The location to score the game piece
   * @memberof Robot
   */
  scorePiece(location) {
    if (this.inventory !== EMPTY) {
      const game = this.alliance.match;
      // Get the field state and check if there is a game piece there
      const { scoringGrid: fieldState } = game.scoring.getFieldState();
      // Location is the index of the array
      const gamePiece = fieldState[this.alliance.color][location];
      if (gamePiece !== EMPTY) {
        // There is a game piece there, so we can't score
        throw new Error(
          "Cannot score a game piece if there is already a game piece there."
        );
      }
      // Score the game piece
      game.events.push(
        new ScorePieceEvent(game, this, location, this.inventory)
      );
      this.inventory = EMPTY;
    } else {
      throw new Error(
        "Cannot score a game piece if the robot's inventory is empty."
      );
    }
  }

  /**
   * @function mobilityBonus
   * @description Gives the robot a mobility bonus
   * @memberof Robot
   */
  mobilityBonus() {
    const game = this.alliance.match;
    if (game.mode.isAuto()) {
      this.mobilityBonusEarned = true;
      game.events.push(new EarnMobilityEvent(game, this));
    } else {
      throw new Error(
        "Mobility bonus can only be awarded during Autonomous mode."
      );
    }
  }

  /**
   * @function getInventory
   * @description Gets the inventory of the robot
   * @param {Array} events The events to use to calculate the inventory
   * @returns {number} The inventory of the robot
   * @memberof Robot
   */
  getInventory(/* events */) {
    // TODO: I don't know why this is so complicated, "return this.inventory" just works...
    // let inventory = this.startingElement;
    // for (const event of events) {
    //     if (event.type === "pickupGamePiece" && event.team === this.team) {
    //         inventory = event.matchPiece;
    //     }
    //     if (event.type === "scoreGamePiece" && event.team === this.team) {
    //         inventory = EMPTY;
    //     }
    // }
    return this.inventory;
  }

  get color() {
    return this.alliance.color;
  }

  toggleEnabled() {
    this.disabled = !this.disabled;
    if (this.disabled) {
      this.alliance.match.events.push(new DisabledEvent(this.alliance.match, this));
    } else {
      this.alliance.match.events.push(new EnabledEvent(this.alliance.match, this));
    }
  }

  toggleDocked() {
    this.docked = !this.docked;
    if (this.docked) {
      this.alliance.match.events.push(new DockEvent(this.alliance.match, this));
    } else {
      this.alliance.match.events.push(new UndockEvent(this.alliance.match, this));
    }
  }

  toggleEngaged() {
    this.engaged = !this.engaged;
    if (this.engaged) {
      this.alliance.match.events.push(new EngageEvent(this.alliance.match, this));
    } else {
      this.alliance.match.events.push(new DisengageEvent(this.alliance.match, this));
    }
  }
}
