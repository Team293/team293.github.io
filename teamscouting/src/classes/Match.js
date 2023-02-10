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
    constructor(team1, team2, team3, team4, team5, team6) {
        this.archive = false;
        this.redAlliance = new Alliance(this, RED, team1, team2, team3);
        this.blueAlliance = new Alliance(this, BLUE, team4, team5, team6);

        this.events = [];

        this.mode = {
            auto: true,
            teleop: false,

            isAuto() {
                return this.auto;
            },

            isTeleop() {
                return this.teleop;
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
                    this.match.mode.teleop = true;
                } else {
                    // change the game state to auto
                    this.match.mode.auto = true;
                    this.match.mode.teleop = false;
                }

                // update the timer on the user interface
                UserInterface.updateTimer(this.toString());

                // update the play/pause button
                UserInterface.playing(this.running);
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
            getFieldState(events) {
                // Create an object that represents the scoring grid
                const scoringGrid = {
                    red: new Array(27).fill([]), // 9x3 grid
                    blue: new Array(27).fill([]), // 9x3 grid
                };

                // Create an object to keep track of the score for each alliance
                const score = {
                    red: 0,
                    blue: 0,
                };

                // Loop through each event
                for (const event of events) {
                    // If the event is a placeGamePiece event
                    if (event.type === "placeGamePiece") {
                        const { alliance, location, auto } = event;
                        // Location is the index of the array
                        scoringGrid[alliance][location].push(event.matchPiece);
                        // Row is the top, middle, or bottom
                        const row = this.getPieceRow(location);
                        // autoOrTeleop is "AUTO" or "TELEOP" depending on the time
                        const autoOrTeleop = auto ? "AUTO" : "TELEOP";
                        // Add the points to the score
                        score[alliance] +=
                            POINT_VALUES[autoOrTeleop].match_PIECES[row];
                    }

                    // If the event is a mobilityBonus event
                    if (event.type === "mobilityBonus") {
                        const { alliance, auto } = event;
                        if (auto) {
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
                let iteration = 0;

                for (const gamePiece of scoringGrid) {
                    // Reset on new row
                    if (iteration % 9 === 0) {
                        count = 0;
                    }

                    // If the game piece is not empty
                    if (gamePiece !== EMPTY) {
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

                    iteration++;
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
}
