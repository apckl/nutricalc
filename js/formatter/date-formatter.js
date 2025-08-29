window.nutriCalc = window.nutriCalc || {};

nutriCalc.dateFormatter = {
  formatDateInput(dateInput) {
    if (
      nutriCalc.jsUtils.empty(dateInput) ||
      !nutriCalc.jsUtils.isString(dateInput)
    ) {
      return '';
    }
    const digits = dateInput.replace(/\D/g, '').substring(0, 8);
    const parts = [];
    const day = digits.substring(0, 2);
    const month = digits.substring(2, 4);
    const year = digits.substring(4, 8);
    const currentYear = new Date().getFullYear();
    if (day && (parseInt(day, 10) < 0 || parseInt(day, 10) > 31)) {
      return '';
    }
    if (day === '00') {
      return '0';
    }
    if (day.length === 1) {
      return day;
    }
    if (!month) {
      return day;
    }
    parts.push(day);
    if (parseInt(month) < 0 || parseInt(month) > 12) {
      return parts.join('/');
    }
    parts.push(month);
    if (year) {
      const yearInt = parseInt(year, 10);
      if (yearInt >= 1900 && yearInt <= currentYear) {
        parts.push(year);
      }
      if (yearInt > currentYear) {
        parts.push('20');
      }
      if (yearInt === 1 || yearInt === 2 || yearInt === 20 || yearInt === 19) {
        parts.push(year);
      }
      if (
        yearInt >= 190 &&
        yearInt <= parseInt(String(currentYear).substring(0, 3), 10)
      ) {
        parts.push(year);
      }
    }

    return parts.join('/');
  },
  init() {
    const inputs = document.querySelectorAll('[data-format="date"]');
    inputs.forEach((input) => {
      input.addEventListener(
        'input',
        nutriCalc.jsUtils.debounce(function () {
          this.value = nutriCalc.dateFormatter.formatDateInput(this.value);
        }, 500)
      );
    });
  },
};
