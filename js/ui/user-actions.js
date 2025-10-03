window.nutriCalc = window.nutriCalc || {};

nutriCalc.userActions = {
  updateForm(form) {
    const {
      AGE,
      FAIBLE,
      INTERPRETATION_IMC,
      SOUHAIT_PERTE_POIDS,
      TRES_FAIBLE,
    } = nutriCalc.constants;
    const data = nutriCalc.formSubmit.getData(form);
    nutriCalc.calculations.calculerAges(data);
    nutriCalc.calculations.calculerImc(data);
    nutriCalc.calculations.calculerInterpretationImc(data);
    const blocSouhaitPertePoids = document.getElementById(
      'blocSouhaitPertePoids'
    );
    const dataAreValid = nutriCalc.formSubmit.validateData(data, false, false);
    const radios = document.querySelectorAll('input[name="souhaitPertePoids"]');
    if (
      dataAreValid &&
      ![FAIBLE, TRES_FAIBLE].includes(data[INTERPRETATION_IMC]) &&
      data[AGE] > 2
    ) {
      blocSouhaitPertePoids.classList.remove('d-none');
      radios.forEach((radio) => (radio.required = true));
    } else {
      data[SOUHAIT_PERTE_POIDS] = 'non';
      blocSouhaitPertePoids.classList.add('d-none');
      radios.forEach((radio) => {
        radio.checked = false;
        radio.required = false;
      });
    }
    const blocActivites = document.getElementById('blocActivites');
    if (dataAreValid && data[AGE] > 2) {
      blocActivites.classList.remove('d-none');
    } else {
      blocActivites.classList.add('d-none');
    }
    nutriCalc.formSubmit.saveDataToLocalStorage(data);
  },
  init() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    const form = document.getElementById('nutritionForm');
    nutriCalc.formSubmit.loadDataFromLocalStorage(form);
    this.updateForm(form);
    form.addEventListener(
      'submit',
      nutriCalc.formSubmit.handle.bind(nutriCalc.formSubmit)
    );
    const editButton = document.getElementById('editData');
    const result = document.getElementById('result');
    const aliments = document.getElementById('aliments');
    if (editButton) {
      editButton.addEventListener('click', function () {
        result.classList.add('d-none');
        form.classList.remove('d-none');
        aliments.classList.add('d-none');
        nutriCalc.scrollToPageTop();
      });
    }
    const resetButton = document.getElementById('resetData');
    const blocActivites = document.getElementById('blocActivites');
    const blocSouhaitPertePoids = document.getElementById(
      'blocSouhaitPertePoids'
    );
    if (resetButton) {
      resetButton.addEventListener('click', function () {
        form.reset();
        result.classList.add('d-none');
        form.classList.remove('d-none');
        aliments.classList.add('d-none');
        blocActivites.classList.add('d-none');
        blocSouhaitPertePoids.classList.add('d-none');
        localStorage.removeItem(nutriCalc.constants.NUTRICALC_DATA);
        nutriCalc.foodLogs.reset();
        nutriCalc.scrollToPageTop();
      });
    }
    const alimentsButton = document.getElementById('alimentsButton');
    if (alimentsButton) {
      alimentsButton.addEventListener('click', function () {
        result.classList.add('d-none');
        form.classList.add('d-none');
        aliments.classList.remove('d-none');
        nutriCalc.foodLogs.init();
        nutriCalc.scrollToPageTop();
      });
    }
    const backToResultButton = document.getElementById('backToResultButton');
    if (backToResultButton) {
      backToResultButton.addEventListener('click', function () {
        result.classList.remove('d-none');
        form.classList.add('d-none');
        aliments.classList.add('d-none');
        nutriCalc.scrollToPageTop();
      });
    }
    const inputs = document.querySelectorAll(
      '[data-format="date"], [data-format="integer"], [data-format="float"]'
    );
    inputs.forEach((input) => {
      input.addEventListener(
        'input',
        nutriCalc.jsUtils.debounce(function () {
          nutriCalc.userActions.updateForm(form);
        }, 500)
      );
    });
  },
};
