window.nutriCalc = window.nutriCalc || {};

nutriCalc.clearButtons = {
  setup() {
    document.querySelectorAll('.clear-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (input) {
          input.value = '';
          input.focus();
        }
      });
    });
  },
};
