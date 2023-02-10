/**
 * @enum {number} EMPTY represents an empty inventory.
 */
const EMPTY = 0;
/**
 * @enum {number} CUBE represents a cube in the inventory.
 */
const CUBE = 1;
/**
 * @enum {number} CONE represents a cone in the inventory.
 */
const CONE = 2;

/**
 * @enum {number} Left represents the left side of the field. Used for the starting position.
 */
const LEFT = 0;
/**
 * @enum {number} Center represents the center of the field. Used for the starting position.
 */
const CENTER = 1;
/**
 * @enum {number} Right represents the right side of the field. Used for the starting position.
 */
const RIGHT = 2;

/**
 * @enum {number} Represents the top row of the scoring grid.
 */
const TOP = 0;
/**
 * @enum {number} Represents the middle row of the scoring grid.
 */
const MIDDLE = 1;
/**
 * @enum {number} Represents the bottom row of the scoring grid.
 */
const BOTTOM = 2;

/**
 * @enum {number} The red alliance.
 */
const RED = 0;
/**
 * @enum {number} The blue alliance.
 */
const BLUE = 1;

/**
 * @object PICKUP The different pickup locations.
 * @property {number} FIELD The field.
 * @property {number} LOADING_DROP The loading drop.
 * @property {number} LOADING_SLIDE The loading slide.
 * @property {number} LOADING_CHUTE The loading chute.
 */
const PICKUP = {
    FIELD: 0,
    LOADING_DROP: 1,
    LOADING_SLIDE: 2,
    LOADING_CHUTE: 3,
};

/**
 * @object POINT_VALUES The point values for the different actions.
 * @property {Object} AUTO The point values for the autonomous period.
 * @property {3} AUTO.MOBILITY (3 POINTS) The point value for mobility in autonomous.
 * @property {Object} AUTO.GAME_PIECES The point values for game pieces in autonomous.
 * @property {6} AUTO.GAME_PIECES.TOP (6 POINTS) The point value for a game piece in the top row in autonomous
 * @property {4} AUTO.GAME_PIECES.MIDDLE (4 POINTS) The point value for a game piece in the middle row in autonomous
 * @property {3} AUTO.GAME_PIECES.BOTTOM (3 POINTS) The point value for a game piece in the bottom row in autonomous
 * @property {8} AUTO.DOCKED_NOT_ENGAGED (8 POINTS) The point value for docking in autonomous without engaging the hook.
 * @property {12} AUTO.DOCKED_AND_ENGAGED (12 POINTS) The point value for docking in autonomous with engaging the hook.
 * @property {Object} TELEOP The point values for the teleoperated period.
 * @property {Object} TELEOP.GAME_PIECES The point values for game pieces in teleoperated.
 * @property {5} TELEOP.GAME_PIECES.TOP (5 POINTS) The point value for a game piece in the top row in teleoperated
 * @property {3} TELEOP.GAME_PIECES.MIDDLE (3 POINTS) The point value for a game piece in the middle row in teleoperated
 * @property {2} TELEOP.GAME_PIECES.BOTTOM (2 POINTS) The point value for a game piece in the bottom row in teleoperated
 * @property {6} TELEOP.DOCKED_NOT_ENGAGED (6 POINTS) The point value for docking in teleoperated without engaging the hook.
 * @property {10} TELEOP.DOCKED_AND_ENGAGED (10 POINTS) The point value for docking in teleoperated with engaging the hook.
 * @property {5} TELEOP.LINK (5 POINTS) The point value for linking the robot to the other robot.
 * @property {2} TELEOP.PARK (2 POINTS) The point value for parking the robot.
 */
const POINT_VALUES = {
    AUTO: {
        MOBILITY: 3,
        GAME_PIECES: {
            TOP: 6,
            MIDDLE: 4,
            BOTTOM: 3,
        },
        DOCKED_NOT_ENGAGED: 8,
        DOCKED_AND_ENGAGED: 12,
    },

    TELEOP: {
        GAME_PIECES: {
            TOP: 5,
            MIDDLE: 3,
            BOTTOM: 2,
        },
        DOCKED_NOT_ENGAGED: 6,
        DOCKED_AND_ENGAGED: 10,
        LINK: 5,
        PARK: 2,
    },
};
