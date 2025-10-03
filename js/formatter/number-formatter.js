window.nutriCalc = window.nutriCalc || {};

nutriCalc.numberFormatter = {
  formatNumberInput(value, allowDecimals = true) {
    let rawValue = value.trim();
    rawValue = rawValue.replace(/[^\d.,]/g, '');
    rawValue = rawValue.replace(/\./g, ',');
    if (!allowDecimals) {
      return rawValue.replace(/,/g, '');
    }
    if (rawValue) {
      const parts = rawValue.split(',');
      const integerPart = parts[0] || '0';
      const decimalPart = (parts[1] || '').slice(0, 2);
      let formated = '';
      if (rawValue.includes(',')) {
        formated = decimalPart
          ? `${integerPart},${decimalPart}`
          : `${integerPart},`;
      } else {
        formated = integerPart;
      }

      return /^0+$/.test(formated) ? '' : formated;
    }

    return '';
  },
  formatRatio(numerateur, denominateur, decimals = 0, pourcentage = true) {
    return (
      (((pourcentage ? 100 : 1) * numerateur) / denominateur)
        .toFixed(decimals)
        .replace('.', ',') + (pourcentage ? '%' : '')
    );
  },
  init() {
    const floatInputs = document.querySelectorAll('[data-format="float"]');
    floatInputs.forEach((input) => {
      input.addEventListener(
        'input',
        nutriCalc.jsUtils.debounce(function () {
          this.value = nutriCalc.numberFormatter.formatNumberInput(this.value);
        }, 500)
      );
    });
    const integerInputs = document.querySelectorAll('[data-format="integer"]');
    integerInputs.forEach((input) => {
      input.addEventListener(
        'input',
        nutriCalc.jsUtils.debounce(function () {
          this.value = nutriCalc.numberFormatter.formatNumberInput(
            this.value,
            false
          );
        }, 500)
      );
    });
  },
};
