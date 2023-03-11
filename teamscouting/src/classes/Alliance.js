/**
 * Represents Alliances in FRC Matches. Each Alliance has three teams and a color
 * @class Alliance
 * @param {Match} match
 * @param {0 | 1} color
 * @param {Robot} team1
 * @param {Robot} team2
 * @param {Robot} team3
 */
class Alliance {
    /**
     * @constructor
     * @param {Match} match
     * @param {0 | 1} color
     * @param {Robot} team1
     * @param {Robot} team2
     * @param {Robot} team3
     */
    constructor(match, color, team1, team2, team3) {
        this.match = match;
        this.color = color;
        this.robots = [
            new Robot(team1, this, LEFT),
            new Robot(team2, this, CENTER),
            new Robot(team3, this, RIGHT),
        ];
    }

    /**
     * @function reset
     * @description Resets the alliance to its starting state
     * @memberof Alliance
     */
    reset() {
        for (const robot of this.robots) {
            robot.reset();
        }
    }
}
