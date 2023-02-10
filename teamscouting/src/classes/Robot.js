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
     * @function setInventory
     * @description Sets the inventory of the robot
     * @param {number} gamePiece The game piece to set the inventory to
     * @memberof Robot
     */
    setInventory(gamePiece) {
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
            this.inventory = gamePiece;
            const game = this.alliance.match;
            this.alliance.match.events.push({
                type: "pickupGamePiece",
                team: this.team,
                gamePiece: gamePiece,
                alliance: this.alliance.color,
                location: location,
                time: game.timer.time,
                auto: game.mode.isAuto(),
            });
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
        if (this.inventory === EMPTY) {
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
            game.events.push({
                type: "scoreGamePiece",
                team: this.team,
                gamePiece: this.inventory,
                alliance: this.alliance.color,
                location: location,
                time: game.timer.time,
                auto: game.mode.isAuto(),
            });
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
            game.events.push({
                type: "mobilityBonus",
                team: this.team,
                alliance: this.alliance.color,
                time: game.timer.time,
            });
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
    getInventory(events) {
        let inventory = this.startingElement;
        for (const event of events) {
            if (event.type === "pickupGamePiece" && event.team === this.team) {
                inventory = event.matchPiece;
            }
            if (event.type === "scoreGamePiece" && event.team === this.team) {
                inventory = EMPTY;
            }
        }
        return inventory;
    }
}
