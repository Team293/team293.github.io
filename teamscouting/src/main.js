// TODO: Make it able to save

let match;
let selectedRobot = null;
let selectedGamePieceType = CONE;

function doInitialInput() {
  match = new Match(
    document.getElementById("red-teamnum-1").value,
    document.getElementById("red-teamnum-2").value,
    document.getElementById("red-teamnum-3").value,
    document.getElementById("blue-teamnum-1").value,
    document.getElementById("blue-teamnum-2").value,
    document.getElementById("blue-teamnum-3").value
  );
  setInterval(() => {
    loop();
  }, 1000 / 60);
  document.getElementById("initial-input").style.display = "none";
  document.getElementById("board").style.display = "";
  match.setupTeamButtons();
}

function loop() {
  match.update();
}
