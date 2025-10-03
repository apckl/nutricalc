window.nutriCalc = window.nutriCalc || {};

nutriCalc.formSubmit = {
  getFormValue(form, name) {
    const el = form.elements[name];
    if (!el) {
      return '';
    }
    let value = el.value?.trim() || '';
    const format = el.dataset ? el.dataset.format : undefined;
    if (format === 'float' || format === 'integer') {
      value = nutriCalc.jsUtils.parseFormattedNumber(value);
      if (isNaN(value)) {
        value = 0;
      }
      if (format === 'integer') {
        value = Math.round(value);
      }
    }

    return value;
  },
  setFormValue(form, name, value) {
    if (form.elements[name]) {
      form.elements[name].value = value;
    }
  },
  getData(form) {
    const get = (name) => this.getFormValue(form, name);
    const {
      DATE_NAISSANCE,
      TAILLE,
      POIDS,
      SEXE,
      SOMMEIL,
      REPOS,
      ASSIS_CALME,
      ASSIS_ACTIF,
      DEBOUT_CALME,
      MENAGE_LEGER,
      PROMENADE,
      MENAGE_SOUTENU,
      MARCHE_ALERTE,
      SOUHAIT_PERTE_POIDS,
      SPORT,
      SPORT_SOUTENU,
      SPORT_INTENSE,
    } = nutriCalc.constants;

    return {
      [SEXE]: get(SEXE),
      [DATE_NAISSANCE]: get(DATE_NAISSANCE),
      [TAILLE]: get(TAILLE),
      [POIDS]: get(POIDS),
      [SOMMEIL]: get(SOMMEIL),
      [REPOS]: get(REPOS),
      [ASSIS_CALME]: get(ASSIS_CALME),
      [ASSIS_ACTIF]: get(ASSIS_ACTIF),
      [DEBOUT_CALME]: get(DEBOUT_CALME),
      [MENAGE_LEGER]: get(MENAGE_LEGER),
      [PROMENADE]: get(PROMENADE),
      [MENAGE_SOUTENU]: get(MENAGE_SOUTENU),
      [MARCHE_ALERTE]: get(MARCHE_ALERTE),
      [SOUHAIT_PERTE_POIDS]: get(SOUHAIT_PERTE_POIDS),
      [SPORT]: get(SPORT),
      [SPORT_SOUTENU]: get(SPORT_SOUTENU),
      [SPORT_INTENSE]: get(SPORT_INTENSE),
    };
  },
  saveDataToLocalStorage(data) {
    localStorage.setItem(
      nutriCalc.constants.NUTRICALC_DATA,
      JSON.stringify(data)
    );
  },
  validateData(data, checkActivities = true, alert = true) {
    const { ACTIVITES, AGE, IMC, POIDS, TAILLE } = nutriCalc.constants;
    if (alert) {
      const oldAlert = document.getElementById('formAlert');
      if (oldAlert) oldAlert.remove();
    }
    let alertContent = '';
    const dateNaissanceIncorrect = data[AGE] === undefined || data[AGE] > 125;
    const tailleOuPoidsIncorrects =
      data[IMC] < 10 ||
      data[IMC] > 200 ||
      data[POIDS] < 1 ||
      data[POIDS] > 700 ||
      data[TAILLE] < 40 ||
      data[TAILLE] > 250;
    if (dateNaissanceIncorrect) {
      if (tailleOuPoidsIncorrects) {
        alertContent =
          'Veuillez vérifier et corriger votre date de naissance, votre taille et votre poids. ';
      } else {
        alertContent =
          'Veuillez vérifier et corriger votre date de naissance. ';
      }
    } else {
      if (tailleOuPoidsIncorrects) {
        alertContent =
          'Veuillez vérifier et corriger votre taille et votre poids. ';
      }
    }
    if (
      checkActivities &&
      !(dateNaissanceIncorrect || tailleOuPoidsIncorrects)
    ) {
      const totalHeures = ACTIVITES.reduce((sum, act) => sum + data[act], 0);
      const activitesIncorrectes =
        data[AGE] > 2 && Math.abs(totalHeures - 24) > 0.01;
      if (activitesIncorrectes) {
        alertContent +=
          "Le total des heures d'activité doit être de 24 heures. Votre total est actuellement : " +
          totalHeures.toFixed(2).replace('.', ',') +
          ' heures.';
      }
    }
    const noErrors = alertContent.length === 0;
    if (alert && !noErrors) {
      const form = document.getElementById('nutritionForm');
      const alertDiv = document.createElement('div');
      alertDiv.id = 'formAlert';
      alertDiv.className = 'alert alert-danger';
      alertDiv.role = 'alert';
      alertDiv.textContent = alertContent;
      form.prepend(alertDiv);
    }

    return noErrors;
  },
  loadDataFromLocalStorage(form) {
    const saved = localStorage.getItem(nutriCalc.constants.NUTRICALC_DATA);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        for (const key in data) {
          this.setFormValue(form, key, data[key]);
        }
      } catch (e) {
        console.error('Erreur de lecture des données locales', e);
      }
    }
  },
  handle(event) {
    event.preventDefault();
    const form = event.target;
    const data = this.getData(form);
    nutriCalc.calculations.main(data);
    nutriCalc.formSubmit.saveDataToLocalStorage(data);
    if (!nutriCalc.formSubmit.validateData(data)) {
      nutriCalc.scrollToPageTop();
    } else {
      nutriCalc.displayResults.render(data);
      nutriCalc.scrollToPageTop();
    }
  },
};
