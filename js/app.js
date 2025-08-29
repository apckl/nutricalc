window.nutriCalc = window.nutriCalc || {};

document.addEventListener('DOMContentLoaded', function () {
  nutriCalc.clearButtons.setup();
  nutriCalc.fontToggle.setup();
  nutriCalc.numberFormatter.init();
  nutriCalc.dateFormatter.init();
  nutriCalc.userActions.init();
});
