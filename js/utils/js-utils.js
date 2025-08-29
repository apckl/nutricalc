window.nutriCalc = window.nutriCalc || {};

nutriCalc.jsUtils = {
  debounce(callback, delay) {
    let timeout;

    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => callback.apply(this, args), delay);
    };
  },
  empty(input) {
    return (
      input === undefined ||
      input === null ||
      input === false ||
      (nutriCalc.jsUtils.isString(input) && input.trim() === '')
    );
  },
  isString(input) {
    return typeof input === 'string';
  },
  parseFormatedDate(value) {
    if (!nutriCalc.jsUtils.isString(value)) {
      return null;
    }
    if (value.length !== 10) {
      return null;
    }
    const [jour, mois, annee] = value.split('/').map(Number);
    if (!jour || !mois || !annee) {
      return null;
    }

    return new Date(annee, mois - 1, jour);
  },
  parseFormattedNumber(value) {
    if (!nutriCalc.jsUtils.isString(value)) {
      return 0;
    }
    const normalized = value.replace(',', '.').trim();
    const parsed = parseFloat(normalized);

    return isNaN(parsed) ? 0 : parsed;
  },
};
