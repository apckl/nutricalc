window.nutriCalc = window.nutriCalc || {};

nutriCalc.displayResults = {
  render(data) {
    const {
      AGE,
      AGS,
      AGMI,
      OMEGA3,
      OMEGA6,
      AJR_CALORIES,
      DEPENSE_TOTALE,
      ELEVE,
      EXTREMEMENT_ELEVE,
      GLUCIDES,
      IMC,
      INTERPRETATION_IMC,
      LIPIDES,
      METABOLISME_BASE,
      NORMAL,
      POIDS,
      PROPORTION_GLUCIDES,
      PROPORTION_LIPIDES,
      PROPORTION_PROTEINES,
      PROTEINES,
      PROFIL,
      SOUHAIT_PERTE_POIDS,
      SUCRES,
      TRES_ELEVE,
    } = nutriCalc.constants;
    document.getElementById('userInfo').textContent = data[PROFIL];
    document.getElementById('imc').textContent =
      data[IMC].toLocaleString('fr-FR') + ' kg/m²';
    const souhaitPertePoids = data[SOUHAIT_PERTE_POIDS] === 'oui';
    let imcInterpretationText = data[INTERPRETATION_IMC];
    if (data[INTERPRETATION_IMC] === NORMAL && souhaitPertePoids) {
      imcInterpretationText += ' (mais souhaite perdre du poids)';
    }
    if (
      [ELEVE, EXTREMEMENT_ELEVE, TRES_ELEVE].includes(
        data[INTERPRETATION_IMC]
      ) &&
      souhaitPertePoids
    ) {
      imcInterpretationText += ' (souhaite perdre du poids)';
    }
    document.getElementById('imcInterpretation').textContent =
      imcInterpretationText;
    const blocDepensesEnergetiques = document.getElementById(
      'blocDepensesEnergetiques'
    );
    if (data[AGE] > 2) {
      document.getElementById('mbResult').textContent =
        data[METABOLISME_BASE] + ' kcal/jour';
      document.getElementById('totalResult').textContent =
        data[DEPENSE_TOTALE] + ' kcal/jour';
      const tbody = document.querySelector('#activityBreakdown tbody');
      tbody.innerHTML = '';
      Object.keys(nutriCalc.constants.COEFFICIENTS_ACTIVITES).forEach(
        (activity) => {
          const hours = parseFloat(data[activity]) || 0;
          if (hours > 0) {
            const label =
              nutriCalc.constants.LABELS_ACTIVITES_ADULTES[activity] ||
              activity;
            const kcalPerHour = Math.round(
              nutriCalc.constants.COEFFICIENTS_ACTIVITES[activity] * data[POIDS]
            );
            const kcalTotal = Math.round(kcalPerHour * hours);
            const tr = document.createElement('tr');
            tr.innerHTML = `
          <td>${label}</td>
          <td style="text-align: center; vertical-align: middle;">${hours.toLocaleString('fr-FR')}</td>
          <td style="text-align: center; vertical-align: middle;">${kcalPerHour}</td>
          <td style="text-align: center; vertical-align: middle;">${kcalTotal}</td>
        `;
            tbody.appendChild(tr);
          }
        }
      );
      blocDepensesEnergetiques.classList.remove('d-none');
    } else {
      blocDepensesEnergetiques.classList.add('d-none');
    }
    let caloriesTextContent = data[AJR_CALORIES] + ' kcal';
    if (data[SOUHAIT_PERTE_POIDS] === 'oui') {
      const deficitCalorique = data[DEPENSE_TOTALE] - data[AJR_CALORIES];
      const pertePoidsHebdomadaire = ((7 * deficitCalorique) / 8000)
        .toFixed(1)
        .replace('.', ',');
      caloriesTextContent += ` (déficit calorique de ${deficitCalorique} kcal par jour pour une perte de poids de ${pertePoidsHebdomadaire} kg par semaine)`;
    }
    document.getElementById('caloriesResult').textContent = caloriesTextContent;
    document.getElementById('proteinesResult').textContent =
      data[PROTEINES] +
      ' g (' +
      data[PROPORTION_PROTEINES] +
      ' des apports caloriques et ' +
      nutriCalc.numberFormatter.formatRatio(
        data[PROTEINES],
        data[POIDS],
        2,
        false
      ) +
      ' g par kg de poids corporel)';
    document.getElementById('lipidesResult').textContent =
      data[LIPIDES] +
      ' g (' +
      data[PROPORTION_LIPIDES] +
      ' des apports caloriques)';
    if (data[AGE] < 3) {
      document.getElementById('divAgsResult').classList.add('d-none');
      document.getElementById('divAgmiResult').classList.add('d-none');
    } else {
      document.getElementById('divAgsResult').classList.remove('d-none');
      document.getElementById('divAgmiResult').classList.remove('d-none');
      document.getElementById('agsResult').textContent = data[AGS] + ' g';
      document.getElementById('agmiResult').textContent = data[AGMI] + ' g';
    }
    document.getElementById('omega6Result').textContent =
      data[OMEGA6].toLocaleString('fr-FR') + ' g';
    document.getElementById('omega3Result').textContent =
      data[OMEGA3].toLocaleString('fr-FR') + ' g';
    document.getElementById('glucidesResult').textContent =
      data[GLUCIDES] +
      ' g (' +
      data[PROPORTION_GLUCIDES] +
      ' des apports caloriques)';
    if (data[AGE] < 4) {
      document.getElementById('divGlucidesResult').classList.add('mb-2');
      document.getElementById('divSucresResult').classList.add('d-none');
    } else {
      document.getElementById('divGlucidesResult').classList.remove('mb-2');
      document.getElementById('divSucresResult').classList.remove('d-none');
      document.getElementById('sucresResult').textContent =
        data[SUCRES] + ' g de sucres (fructose, glucose, saccharose)';
    }
    document.getElementById('nutritionForm').classList.add('d-none');
    document.getElementById('result').classList.remove('d-none');
  },
};
