const redButtons = document.querySelectorAll(`#chargeStationRed > button,
.redSubstation > button,
#redAlliance > button,
button[data-alliance="red"]`);
redButtons.forEach(x => x.classList.add("redButton"));

const blueButtons = document.querySelectorAll(`#chargeStationBlue > button,
.blueSubstation > button,
#blueAlliance > button,
button[data-alliance="blue"]`);
blueButtons.forEach(x => x.classList.add("blueButton"));