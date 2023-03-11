function robotButtonListener(button, event) {
  const teamNumber = button.getAttribute("team-number");
  const color = button.getAttribute("data-alliance") === "red" ? RED : BLUE;
  document.querySelectorAll("#robots>button").forEach((b) => {
    b.classList.remove("selected");
  });
  button.classList.add("selected");
  selectedRobot = { teamNumber, color };
  
  // Update the mobility bonus button disabled if robot.mobility = true

  updateDisabledButtonText();
  updateButtonDisabledStates();
}

function doDock() {
  console.log("Docking for robot", selectedRobot.teamNumber);
  match.getRobot(selectedRobot).toggleDocked();
}


function doEngage() {
  console.log("Engaging for robot", selectedRobot.teamNumber);
  match.getRobot(selectedRobot).toggleEngaged();
}

function doSingleSubstation() {
  console.log(
    "Single substation for robot",
    selectedRobot.teamNumber,
    "picked up game piece",
    selectedGamePieceType
  );

  match.getRobot(selectedRobot).pickUp(selectedGamePieceType, PICKUP.SINGLE);
  // // Check if robot
  // if (match.getRobot(selectedRobot).getInventory() !== null) {
  //   match.getRobot(selectedRobot).setInventory(selectedGamePieceType);
  //   match.events.push(
  //     new Event(match, match.getRobot(selectedRobot), EVENT_TYPES.PICK_UP_PIECE)
  //   );
  //   // console.log(match.getRobot(selectedRobot).getInventory());
  // }
}

function doDoubleSubstation() {
  console.log("Double substation for robot", selectedRobot.teamNumber);
  match.getRobot(selectedRobot).pickUp(selectedGamePieceType, PICKUP.DOUBLE);
}

function doFieldPickup() {
  console.log("Field pickup for robot", selectedRobot.teamNumber);
  match.getRobot(selectedRobot).pickUp(selectedGamePieceType, PICKUP.FIELD);
}

function doFieldDrop() {
  console.log("Field drop for robot", selectedRobot.teamNumber);
  match.getRobot(selectedRobot).clearInventory();
}

function doMobilityBonus() {
  console.log("Mobility bonus for robot", selectedRobot.teamNumber);
  match.getRobot(selectedRobot).mobilityBonus();
  updateButtonDisabledStates();
}

function toggleEnabled() {
  console.log("Toggle enabled for robot", selectedRobot.teamNumber);
  let robot = match.getRobot(selectedRobot);
  robot.toggleEnabled();
  let robotBtn = getRobotButton(robot);
  robotBtn.classList.toggle("robot-disabled");
  updateDisabledButtonText();
}

function fieldButtonPressed(event) {
  const index = parseInt(event.target.getAttribute("data-index"));
  const color = event.target.parentElement == redAlliance ? RED : BLUE;
  console.log(index, color);
}

function selectGamePiece(gamePiece) {
  if (match.timer.time === 0) {
    match.getRobot(selectedRobot).setInventory(gamePiece);
    console.log(match.getRobot(selectedRobot));
    return;
  }
  selectedGamePieceType = gamePiece;
}

function downloadSerializedMatch() {
  downloadJson(match.serialize(), "match");
}

function uploadSerializedMatch() {
  let file = document.getElementById("matchUpload").files[0];
  if (!file) return;
  file.text().then(x => {match = Match.deserialize(x);});
}

function updateDisabledButtonText() {
  let robot = match.getRobot(selectedRobot);
  document.getElementById("disabledBtn").innerHTML = robot.disabled
    ? "Enable"
    : "Disable";
}

function updateUploadLabel() {
  let file = document.getElementById("matchUpload").files[0];
  if (!file) return;
  document.getElementById("matchUploadLabel").innerText = file.name;
}

function updateButtonDisabledStates() {
  let robot = match ? match.getRobot(selectedRobot) : null;
  if (robot === null) {
    [...document.getElementById("chargeStationRed").children].forEach((x) => {
      x.disabled = true;
    });
    [...document.getElementById("chargeStationBlue").children].forEach((x) => {
      x.disabled = true;
    });
    [...document.querySelector(".redSubstation").children].forEach((x) => {
      x.disabled = true;
    });
    [...document.querySelector(".blueSubstation").children].forEach((x) => {
      x.disabled = true;
    });
    [...document.querySelector(".centerBottom").children].forEach((x) => {
      // if (x.classList.contains("gamePieceSelector")) return;
      if (x.id === "downloadBtn") return;
      if (x.id === "matchUpload" || x.id === "uploadBtn") return;
      x.disabled = true;
    });
    [...document.getElementById("redAlliance").children].forEach((x) => {
      x.disabled = true;
    });
    [...document.getElementById("blueAlliance").children].forEach((x) => {
      x.disabled = true;
    });
  } else {
    let isRed = robot.color === RED;
    [...document.getElementById("chargeStationRed").children].forEach((x) => {
      x.disabled = !isRed;
    });
    [...document.getElementById("chargeStationBlue").children].forEach((x) => {
      x.disabled = isRed;
    });
    [...document.querySelector(".redSubstation").children].forEach((x) => {
      x.disabled = !isRed;
    });
    [...document.querySelector(".blueSubstation").children].forEach((x) => {
      x.disabled = isRed;
    });
    [...document.querySelector(".centerBottom").children].forEach((x) => {
      if (x.id === "mobilityBonusBtn") {
        console.log(x, robot.mobilityBonusEarned);
        x.disabled = robot.mobilityBonusEarned;
        return;
      };
      // if (x.classList.contains("gamePieceSelector")) return;
      x.disabled = false;
    });
    [...document.getElementById("redAlliance").children].forEach((x) => {
      x.disabled = !isRed;
    });
    [...document.getElementById("blueAlliance").children].forEach((x) => {
      x.disabled = isRed;
    });
  }
}

function getRobotButton(robot) {
  return document.querySelector(
    `#robots>button[data-alliance="${
      robot.color === RED ? "red" : "blue"
    }"][team-number="${robot.team}"]`
  );
}

document
  .querySelectorAll('button[data-alliance="red"],button[data-alliance="blue"]')
  .forEach((x) =>
    x.addEventListener("click", (event) => robotButtonListener(x, event))
  );

window.addEventListener("load", updateButtonDisabledStates);
