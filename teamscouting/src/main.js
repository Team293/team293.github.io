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
    document.getElementById("blue-teamnum-3").value,
    MATCH_TYPES[document.getElementById("matchType").value],
    COMPETITION_TYPES[document.getElementById("compType").value],
    document.getElementById("match-number").value
  );
  setInterval(() => {
    loop();
  }, 1000 / 60);
  document.getElementById("initial-input").style.display = "none";
  document.getElementById("board").style.display = "";
  match.setupTeamButtons();

  window.generateTest(match);
}

function loop() {
  match.update();
}
