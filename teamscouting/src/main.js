const match = new Match("293", "254", "11", "193", "41", "1089");

match.redAlliance.robots[0].startingElement = EMPTY;

setInterval(() => {
    loop();
}, 1000 / 60);

function loop() {
    match.update();
}
