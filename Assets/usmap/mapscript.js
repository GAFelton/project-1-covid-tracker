$("document").ready(function(){
  
simplemaps_usmap.hooks.click_state = function (id) {
  localStorage.setItem("Abbreviation", "states/" + simplemaps_usmap_mapdata.state_specific[id].abbrev);
}

$(".sr-state-selector").click( function() {
  var stateAbbrevForStorage = $(this).data("state-abbrev");
  console.log(stateAbbrevForStorage);
  if (stateAbbrevForStorage === "us") {
    localStorage.setItem("Abbreviation", stateAbbrevForStorage);
  }
  else {
    localStorage.setItem("Abbreviation", "states/" + stateAbbrevForStorage);
  }
});

})