window.nutriCalc = window.nutriCalc || {};

nutriCalc.quantityFormatter = {
  formatQuantity(qty, unit, poids) {
    const uniteLower = unit.toLowerCase();
    const { GRAMMES, MILLILITRES } = nutriCalc.constants;
    if (uniteLower === GRAMMES) {
      return `${qty} g`;
    }
    if (uniteLower === MILLILITRES) {
      return `${qty} mL`;
    }
    const match = unit.match(/^([^(]+?)(?:\s*\(.*\))?$/);
    if (!match) {
      return `${qty} ${unit}`;
    }
    let label = match[1].trim();
    let labelFormate = label;
    if (qty > 1) {
      let pluralize = true;
      const mots = label.split(' ');
      labelFormate = mots
        .map((mot) => {
          if (!pluralize) return mot;
          if (mot === 'à') {
            pluralize = false;
            return mot;
          }
          return nutriCalc.textFormatter.pluralize(mot);
        })
        .join(' ');
    }

    return `${qty} ${labelFormate} (${poids} g)`;
  },
};
