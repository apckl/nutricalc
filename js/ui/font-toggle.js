window.nutriCalc = window.nutriCalc || {};

nutriCalc.fontToggle = {
  updateFont() {
    const preferredFont = localStorage.getItem('preferredFont');
    if (preferredFont === 'dyslexic') {
      document.body.classList.remove('use-arial');

      return 'Standard';
    }
    document.body.classList.add('use-arial');

    return 'Dys';
  },
  setup() {
    const btn = document.getElementById('toggleFontBtn');
    const label = document.getElementById('fontBtnLabel');
    if (btn && label) {
      label.textContent = nutriCalc.fontToggle.updateFont();
      btn.addEventListener('click', () => {
        if (document.body.classList.contains('use-arial')) {
          document.body.classList.remove('use-arial');
          localStorage.setItem('preferredFont', 'dyslexic');
        } else {
          document.body.classList.add('use-arial');
          localStorage.setItem('preferredFont', 'standard');
        }
        label.textContent = nutriCalc.fontToggle.updateFont();
      });
    }
  },
};
