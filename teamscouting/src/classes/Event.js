/**
 * Represents events in FRC Matches.
 * @class Event
 * @param {Match} match
 * @param {Robot} robot
 * @param {string} eventType
 */
class Event {
  /**
   * @constructor
   * @param {Match} match
   * @param {Robot} robot
   * @param {string} eventType
   */
  constructor(match, robot, eventType) {
    this.match = match;
    this.robot = robot;
    this.eventType = eventType;
    this.time = this.match.timer.time;
  }
}

/**
 * Represents a pick up event in FRC Matches.
 * @class PickUpEvent
 * @param {Match} match
 * @param {Robot} robot
 * @param {string} eventType
 * @param {number} location
 */
class PickUpEvent extends Event {
  constructor(match, robot, location, pieceType) {
    super(match, robot, EVENT_TYPES.PICK_UP_PIECE);
    this.location = location;
    this.pieceType = pieceType;
  }
}

/**
 * Represents a set inventory event in FRC Matches.
 * @class SetInventoryEvent
 * @param {Match} match
 * @param {Robot} robot
 * @param {number} pieceType
 */
class SetInventoryEvent extends Event {
  constructor(match, robot, pieceType) {
    super(match, robot, EVENT_TYPES.SET_INVENTORY);
    this.pieceType = pieceType;
  }
}

/**
 * Represents a score piece event in FRC Matches.
 * @class ScorePieceEvent
 * @param {Match} match
 * @param {Robot} robot
 * @param {number} gridPosition
 */
class ScorePieceEvent extends Event {
  constructor(match, robot, gridPosition, pieceType) {
    super(match, robot, EVENT_TYPES.SCORE_PIECE);
    this.gridPosition = gridPosition;
    this.pieceType = pieceType;
  }
}

/**
 * Represents a earn mobility bonus event in FRC Matches.
 * @class EarnPointsEvent
 * @param {Match} match
 * @param {Robot} robot
 */
class EarnMobilityEvent extends Event {
  constructor(match, robot) {
    super(match, robot, EVENT_TYPES.EARN_MOBILITY_BONUS);
  }
}

/**
 * Represents a drop piece event in FRC Matches.
 * @class DropPieceEvent
 * @param {Match} match
 * @param {Robot} robot
 */
class DropPieceEvent extends Event {
  constructor(match, robot) {
    super(match, robot, EVENT_TYPES.DROP_PIECE);
  }
}

/**
 * Represents a toggle enabled event in FRC Matches.
 * @class ToggleEnabledEvent
 * @param {Match} match
 * @param {Robot} robot
 */
class EnabledEvent extends Event {
  constructor(match, robot) {
    super(match, robot, EVENT_TYPES.ENABLED);
  }
}

/**
 * Represents a disable event in FRC Matches.
 * @class DisableEvent
 * @param {Match} match
 * @param {Robot} robot
 */
class DisabledEvent extends Event {
  constructor(match, robot) {
    super(match, robot, EVENT_TYPES.DISABLED);
  }
}

/**
 * Represents a dock event in FRC Matches.
 * @class DockEvent
 * @param {Match} match
 * @param {Robot} robot
 */
class DockEvent extends Event {
  constructor(match, robot) {
    super(match, robot, EVENT_TYPES.CHARGE_STATION_DOCK);
  }
}

/**
 * Represents a undock event in FRC Matches.
 * @class UndockEvent
 * @param {Match} match
 * @param {Robot} Robot
 */
class UndockEvent extends Event {
  constructor(match, robot) {
    super(match, robot, EVENT_TYPES.CHARGE_STATION_UNDOCK);
  }
}

/**
 * Represents an engage event in FRC Matches.
 * @class EngageEvent
 * @param {Match} match
 * @param {Robot} robot
 */
class EngageEvent extends Event {
  constructor(match, robot) {
    super(match, robot, EVENT_TYPES.CHARGE_STATION_ENGAGE);
  }
}

/**
 * Represents a disengage event in FRC Matches.
 * @class DisengageEvent
 * @param {Match} match
 * @param {Robot} robot
 */
class DisengageEvent extends Event {
  constructor(match, robot) {
    super(match, robot, EVENT_TYPES.CHARGE_STATION_DISENGAGE);
  }
}