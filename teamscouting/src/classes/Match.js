/**
 * @class Match
 * @param {string} team1 Team number of the first team (red)
 * @param {string} team2 Team number of the second team (red)
 * @param {string} team3 Team number of the third team (red)
 * @param {string} team4 Team number of the fourth team (blue)
 * @param {string} team5 Team number of the fifth team (blue)
 * @param {string} team6 Team number of the sixth team (blue)
 */
class Match {
    /**
     * @constructor
     * @param {string} team1 Team number of the first team (red)
     * @param {string} team2 Team number of the second team (red)
     * @param {string} team3 Team number of the third team (red)
     * @param {string} team4 Team number of the fourth team (blue)
     * @param {string} team5 Team number of the fifth team (blue)
     * @param {string} team6 Team number of the sixth team (blue)
     */
    constructor(
        team1,
        team2,
        team3,
        team4,
        team5,
        team6,
        matchType,
        compType,
        matchNumber
    ) {
        this.archive = false;
        this.redAlliance = new Alliance(this, RED, team1, team2, team3);
        this.blueAlliance = new Alliance(this, BLUE, team4, team5, team6);

        this.matchType = matchType;
        this.compType = compType;
        this.matchNumber = matchNumber;

        this.events = [];

        this.mode = {
            auto: true,
            teleop: false,

            isAuto() {
                return this.auto;
            },

            isTeleop() {
                return !this.auto;
            },
        };

        /**
         * @object Timer
         * @property {Match} match - The match that the timer is in
         * @property {number} time - The current time of the timer
         * @property {boolean} running - Whether the timer is running or not
         * @property {number} autoLength - The length of the auto period in seconds
         * @property {number} matchLength - The length of the match in seconds
         * @memberof Match
         */
        this.timer = {
            match: this,
            time: 0,
            // Whether the timer is running or not
            running: false,
            autoLength: 15, // seconds
            matchLength: 135, // 2:15 in seconds
            // whether we are in auto or teleop
            lastUpdate: Date.now(),
            deltaTime: 0,

            /**
             * @method reset
             * @description Reset the timer to 0
             * @memberof Timer
             */
            reset() {
                this.time = 0;
                this.running = false;
            },

            /**
             * @method play
             * @description Start the timer
             * @memberof Timer
             */
            play() {
                if (this.time < this.matchLength) this.running = true;
            },

            /**
             * @method pause
             * @description Pause the timer
             * @memberof Timer
             */
            pause() {
                this.running = false;
            },

            /**
             * @method toggle
             * @description Toggle the timer
             * @memberof Timer
             */
            toggle() {
                if (this.time < this.matchLength) this.running = !this.running;
            },

            /**
             * @method setTime
             * @description Set the time of the timer
             * @param {number} time The time to set the timer to
             * @memberof Timer
             */
            setTime(time) {
                this.time = time;
            },

            /**
             * @method delta
             * @description Calculate the delta time
             * @memberof Timer
             * @returns {number} The delta time
             */
            delta() {
                const now = Date.now();
                this.deltaTime = (now - this.lastUpdate) / 1000;
                this.lastUpdate = now;
                return this.deltaTime;
            },

            /**
             * @method update
             * @description Update the timer
             * @memberof Timer
             */
            update() {
                // update the timer
                this.delta(); // calculate the delta time

                if (this.running) {
                    // increment the timer
                    this.time += this.deltaTime;
                }
                if (this.time > this.matchLength) {
                    // set the timer to the max time
                    this.time = this.matchLength;
                    this.running = false;
                }

                // update the game state
                if (this.time > this.autoLength) {
                    // change the game state to teleop
                    this.match.mode.auto = false;
                } else {
                    // change the game state to auto
                    this.match.mode.auto = true;
                }

                // update the timer on the user interface
                UserInterface.updateTimer(this.toString());

                // update the play/pause button
                UserInterface.playing(this.running);

                // update "Mobility Bonus" button's status
                UserInterface.updateMobilityBonus(this.match.mode.isAuto());

                // update UI for inventories
                UserInterface.updateRobotInventories();
            },

            /**
             * @method toString
             * @description Convert the timer to a string
             * @memberof Timer
             * @returns {string} The timer as a string
             */
            toString() {
                // Calculate minutes from time
                const minutes = Math.floor(this.time / 60);
                // Calculate seconds from time
                const seconds = Math.floor(this.time % 60);
                // Calculate milliseconds from time
                const milliseconds = Math.floor((this.time % 1) * 100);
                // Return a formatted string
                return `${minutes.toString()}:${seconds
                    .toString()
                    .padStart(2, "0")}.${milliseconds
                    .toString()
                    .padStart(2, "0")}`;
            },
        };

        /**
         * @object Scoring
         * @typedef {Object} Scoring
         * @memberof Match
         */
        this.scoring = {
            /**
             * @method fieldState
             * @description Get the current state of the field
             * @memberof Scoring
             * @returns {Object} The current state of the field, which includes the scoring grid and the score
             */
            getFieldState(events = this.events) {
                // Create an object that represents the scoring grid
                const scoringGrid = {
                    red: new Array(27).fill(0).map((x) => []), // 9x3 grid
                    blue: new Array(27).fill(0).map((x) => []), // 9x3 grid
                };

                // Create an object to keep track of the score for each alliance
                const score = {
                    red: 0,
                    blue: 0,
                };

                // Loop through each event
                for (const event of events) {
                    // If the event is a placeGamePiece event
                    if (event.type === EVENT_TYPES.SCORE_PIECE) {
                        const { robot, location } = event;
                        const alliance = robot.color === RED ? "red" : "blue";
                        // Location is the index of the array
                        scoringGrid[alliance][event.gridPosition].push(
                            event.pieceType
                        );
                        // Row is the top, middle, or bottom
                        const row = this.getPieceRow(location);
                        // autoOrTeleop is "AUTO" or "TELEOP" depending on the time
                        const autoOrTeleop = event.isAuto ? "AUTO" : "TELEOP";
                        // Add the points to the score
                        score[alliance] +=
                            POINT_VALUES[autoOrTeleop].GAME_PIECES[row];
                    }
                    if (event.type === EVENT_TYPES.DISLODGE_PIECE) {
                        const { robot, location } = event;
                        const alliance = robot.color === RED ? "red" : "blue";
                        let oldPiece =
                            scoringGrid[alliance][event.gridPosition];
                        scoringGrid[alliance][event.gridPosition] = [];
                        const row = this.getPieceRow(location);
                        const autoOrTeleop = event.isAuto ? "AUTO" : "TELEOP";
                        //score[alliance] -= POINT_VALUES[autoOrTeleop].GAME_PIECES[row];
                    }

                    // If the event is a mobilityBonus event
                    if (event.type === EVENT_TYPES.EARN_MOBILITY_BONUS) {
                        const { alliance, isAuto } = event;
                        if (isAuto) {
                            score[alliance] += POINT_VALUES.AUTO.MOBILITY;
                        } else {
                            throw new Error(
                                "Mobility bonus can only be awarded in auto"
                            );
                        }
                    }
                }

                // Calculate the link bonus for each alliance
                score.red += this.calculateLinkBonus(scoringGrid.red);
                score.blue += this.calculateLinkBonus(scoringGrid.blue);

                return {
                    scoringGrid,
                    score,
                };
            },

            /**
             * @method calculateLinkBonus
             * @description Calculate the link bonus for an alliance
             * @memberof Scoring
             * @param {Array} scoringGrid The scoring grid for an alliance
             * @returns {number} The link bonus for the alliance
             */
            calculateLinkBonus(scoringGrid) {
                let score = 0;
                let count = 0;

                for (const [iteration, gamePiece] of scoringGrid.entries()) {
                    // Reset on new row
                    if (iteration % 9 === 0) {
                        count = 0;
                    }

                    // If the game piece is not empty
                    if (gamePiece?.length || gamePiece !== undefined) {
                        count++;
                    } else {
                        count = 0;
                    }

                    // If we have 3 in a row
                    if (count === 3) {
                        // Add the link bonus
                        score += POINT_VALUES.TELEOP.LINK;
                        // Reset the count
                        count = 0;
                    }
                }

                return score;
            },

            /**
             * @method getPieceRow
             * @description Get the row of a piece
             * @memberof Scoring
             * @param {number} piece The piece to get the row of
             * @returns {string} The row of the piece
             */
            getPieceRow(piece) {
                if (piece < 9 * (TOP + 1)) {
                    return "TOP";
                } else if (piece < 9 * (MIDDLE + 1)) {
                    return "MIDDLE";
                }
                return "BOTTOM";
            },
        };
    }

    /**
     * @method start
     * @description Start the match
     * @memberof Match
     */
    start() {
        this.timer.start();
    }

    /**
     * @method reset
     * @description Reset the match
     * @memberof Match
     */
    reset() {
        this.timer.reset();
        if (!this.archive) {
            this.events = [];
            this.redAlliance.reset();
            this.blueAlliance.reset();
        }
    }

    /**
     * @method update
     * @description Update the match
     * @memberof Match
     */
    update() {
        // update the timer element
        this.timer.update();

        UserInterface.updateGameState(this.mode.isTeleop() ? "TELEOP" : "AUTO");
    }

    /**
     * @method setupTeamButtons
     * @description Set up the team buttons
     * @memberof Match
     */
    setupTeamButtons() {
        for (let color of ["red", "blue"]) {
            for (let i = 1; i <= 3; i++) {
                let btn = document.querySelector(
                    `button[data-alliance=${color}][data-team-index="${i}"]`
                );
                let alliance =
                    color === "red" ? this.redAlliance : this.blueAlliance;
                let team = alliance.robots[i - 1].team;
                btn.innerHTML = team;
                btn.setAttribute("team-number", team);
            }
        }
    }

    /**
     * @method getRobot
     * @description Gets a robot
     * @memberof Match
     * @param {object} robot robot data
     * @returns {Robot | null}
     */
    getRobot(robot) {
        if (!robot) return null;
        let alliance =
            robot.color === RED ? this.redAlliance : this.blueAlliance;
        let team = alliance.robots.find((x) => x.team === robot.teamNumber);
        return team;
    }

    /**
     * @method serialize
     * @description Converts the match to JSON
     * @memberof Match
     * @returns {string}
     */
    serialize() {
        let obj = {
            archive: this.archive,
            matchType: this.matchType,
            compType: this.compType,
            matchNumber: this.matchNumber,
        };
        // gets all data except match from events
        obj.events = this.events.map((x) => ({
            ...x,
            match: undefined,
        }));
        obj.redAlliance = {
            color: this.redAlliance.color,
            robots: this.redAlliance.robots.map((x) => ({
                team: x.team,
                startingPosition: x.startingPosition,
            })),
        };
        obj.blueAlliance = {
            color: this.blueAlliance.color,
            robots: this.blueAlliance.robots.map((x) => ({
                team: x.team,
                startingPosition: x.startingPosition,
            })),
        };
        return JSON.stringify(obj);
    }

    /**
     * @function deserialize
     * @description Converts a JSON representation of a match to the match itself
     * @memberof Match
     * @static
     * @param {string} jsonRepresentation the JSON representation
     * @returns {Match}
     */
    static deserialize(jsonRepresentation) {
        // do we still need this
        let obj = JSON.parse(jsonRepresentation);
        let teamNumbers = obj.redAlliance.robots
            .concat(obj.blueAlliance.robots)
            .map((x) => x.team);
        let match = new Match(...teamNumbers);
        for (let event of obj.events) {
            let color = obj.redAlliance.robots
                .map((x) => x.team)
                .includes(event.robot)
                ? RED
                : BLUE;
            match.events.push(
                new Event(
                    match,
                    match.getRobot({ color: color, teamNumber: event.robot }),
                    event.eventType
                )
            );
        }
        return match;
    }

    /**
     * @function getCurrentScore
     * @description Gets the current score of the match
     * @memberof Match
     * @returns {number, number}
     */
    getCurrentScore() {
        for (let event of this.events) {
            // todo
        }
        return [0, 0];
    }
}
