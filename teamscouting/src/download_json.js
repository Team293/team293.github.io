function downloadJson(jsonText, name) {
  // thank you https://stackoverflow.com/a/30800715 but what the actual hecc
  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonText);
  let dlAnchorElem = document.getElementById("downloadAnchorElem");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", name + ".json");
  dlAnchorElem.click();
}
