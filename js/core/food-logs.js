window.nutriCalc = window.nutriCalc || {};

nutriCalc.foodLogs = {
  ajrRatios: {},
  data: {},
  foodItems: [],
  totals: {},
  addFoodItem(name, qty, unit) {
    const {
      ACIDES_GRAS_MONOINSATURES,
      ACIDES_GRAS_SATURES,
      CALORIES,
      GLUCIDES,
      LACTOSE,
      LIPIDES,
      OMEGA3,
      OMEGA6,
      PROTEINES,
      SUCRES_HORS_LACTOSE,
    } = nutriCalc.constants.NUTRIMENTS;
    const food = nutriCalc.foodCompositionTable.find(
      (f) => f.nom.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (!food) {
      return;
    }
    let poids = 0;
    if (unit === nutriCalc.constants.GRAMMES) {
      poids = qty;
    } else if (unit === nutriCalc.constants.MILLILITRES) {
      poids = qty * food.densite;
    } else if (food.portions) {
      const portion = food.portions.find((p) => p.label === unit);
      if (!portion) return;
      poids = portion.poids * qty;
    } else {
      poids = qty;
    }
    const ref = food.nutrimentsPour100g;
    const proteines = (ref[PROTEINES] * poids) / 100;
    const lipides = (ref[LIPIDES] * poids) / 100;
    const acidesGrasSatures = (ref[ACIDES_GRAS_SATURES] * poids) / 100;
    const acidesGrasMonoinsatures =
      (ref[ACIDES_GRAS_MONOINSATURES] * poids) / 100;
    const omega3 = (ref[OMEGA3] * poids) / 100;
    const omega6 = (ref[OMEGA6] * poids) / 100;
    const glucides = (ref[GLUCIDES] * poids) / 100;
    const sucresHorsLactose = (ref[SUCRES_HORS_LACTOSE] * poids) / 100;
    const lactose = (ref[LACTOSE] * poids) / 100;
    const calories = proteines * 4 + glucides * 4 + lipides * 9;
    const qtyDisplay = nutriCalc.quantityFormatter.formatQuantity(
      qty,
      unit,
      poids
    );
    const item = {
      id: Date.now(),
      name,
      qty,
      qtyDisplay,
      poids,
      unit,
      [CALORIES]: calories,
      [PROTEINES]: proteines,
      [LIPIDES]: lipides,
      [ACIDES_GRAS_SATURES]: acidesGrasSatures,
      [ACIDES_GRAS_MONOINSATURES]: acidesGrasMonoinsatures,
      [OMEGA3]: omega3,
      [OMEGA6]: omega6,
      [GLUCIDES]: glucides,
      [SUCRES_HORS_LACTOSE]: sucresHorsLactose,
      [LACTOSE]: lactose,
    };
    this.foodItems.push(item);
    this.saveToStorage();
    this.updateFoodTable();
    this.renderTotals();
    const foodNameEl = document.getElementById('foodName');
    const qtyEl = document.getElementById('foodQty');
    const unitSelect = document.getElementById('foodUnit');
    foodNameEl.value = '';
    qtyEl.value = '';
    unitSelect.innerHTML =
      '<option value="" disabled selected>— choisir une unité —</option>';
    unitSelect.disabled = true;
    document.getElementById('addFoodButton').disabled = true;
    foodNameEl.focus();
  },
  calculateRatios() {
    const { CALORIES, GLUCIDES, LIPIDES, PROTEINES } =
      nutriCalc.constants.NUTRIMENTS;
    const { AJR_CALORIES } = nutriCalc.constants;
    this.ajrRatios = {
      [CALORIES]: nutriCalc.numberFormatter.formatRatio(
        this.totals[CALORIES],
        this.data[AJR_CALORIES]
      ),
      [PROTEINES]: nutriCalc.numberFormatter.formatRatio(
        this.totals[PROTEINES],
        this.data[PROTEINES]
      ),
      [GLUCIDES]: nutriCalc.numberFormatter.formatRatio(
        this.totals[GLUCIDES],
        this.data[GLUCIDES]
      ),
      [LIPIDES]: nutriCalc.numberFormatter.formatRatio(
        this.totals[LIPIDES],
        this.data[LIPIDES]
      ),
    };
  },
  calculateTotals() {
    const {
      ACIDES_GRAS_SATURES,
      ACIDES_GRAS_MONOINSATURES,
      CALORIES,
      GLUCIDES,
      LACTOSE,
      LIPIDES,
      OMEGA3,
      OMEGA6,
      PROTEINES,
      SUCRES_HORS_LACTOSE,
    } = nutriCalc.constants.NUTRIMENTS;
    const {
      FORMATED_ACIDES_GRAS_SATURES,
      FORMATED_ACIDES_GRAS_MONOINSATURES,
      FORMATED_GLUCIDES,
      FORMATED_LACTOSE,
      FORMATED_LIPIDES,
      FORMATED_OMEGA3,
      FORMATED_OMEGA6,
      FORMATED_PROTEINES,
      FORMATED_SUCRES_HORS_LACTOSE,
    } = nutriCalc.constants.FORMATED_NUTRIMENTS;
    const totals = this.foodItems.reduce(
      (totals, item) => {
        totals[CALORIES] += item[CALORIES];
        totals[PROTEINES] += item[PROTEINES];
        totals[LIPIDES] += item[LIPIDES];
        totals[ACIDES_GRAS_SATURES] += item[ACIDES_GRAS_SATURES];
        totals[ACIDES_GRAS_MONOINSATURES] += item[ACIDES_GRAS_MONOINSATURES];
        totals[OMEGA3] += item[OMEGA3];
        totals[OMEGA6] += item[OMEGA6];
        totals[GLUCIDES] += item[GLUCIDES];
        totals[SUCRES_HORS_LACTOSE] += item[SUCRES_HORS_LACTOSE];
        totals[LACTOSE] += item[LACTOSE];
        return totals;
      },
      {
        [CALORIES]: 0,
        [PROTEINES]: 0,
        [LIPIDES]: 0,
        [ACIDES_GRAS_SATURES]: 0,
        [ACIDES_GRAS_MONOINSATURES]: 0,
        [OMEGA3]: 0,
        [OMEGA6]: 0,
        [GLUCIDES]: 0,
        [SUCRES_HORS_LACTOSE]: 0,
        [LACTOSE]: 0,
      }
    );

    return {
      [CALORIES]: Math.round(totals[CALORIES]),
      [PROTEINES]: totals[PROTEINES],
      [FORMATED_PROTEINES]: totals[PROTEINES].toFixed(1).replace('.', ','),
      [LIPIDES]: totals[LIPIDES],
      [FORMATED_LIPIDES]: totals[LIPIDES].toFixed(1).replace('.', ','),
      [ACIDES_GRAS_SATURES]: totals[ACIDES_GRAS_SATURES],
      [FORMATED_ACIDES_GRAS_SATURES]: totals[ACIDES_GRAS_SATURES].toFixed(
        1
      ).replace('.', ','),
      [ACIDES_GRAS_MONOINSATURES]: totals[ACIDES_GRAS_MONOINSATURES],
      [FORMATED_ACIDES_GRAS_MONOINSATURES]: totals[
        ACIDES_GRAS_MONOINSATURES
      ].toFixed(1).replace('.', ','),
      [OMEGA3]: totals[OMEGA3],
      [FORMATED_OMEGA3]: totals[OMEGA3].toFixed(2).replace('.', ','),
      [OMEGA6]: totals[OMEGA6],
      [FORMATED_OMEGA6]: totals[OMEGA6].toFixed(2).replace('.', ','),
      [GLUCIDES]: totals[GLUCIDES],
      [FORMATED_GLUCIDES]: totals[GLUCIDES].toFixed(1).replace('.', ','),
      [SUCRES_HORS_LACTOSE]: totals[SUCRES_HORS_LACTOSE],
      [FORMATED_SUCRES_HORS_LACTOSE]: totals[SUCRES_HORS_LACTOSE].toFixed(
        1
      ).replace('.', ','),
      [LACTOSE]: totals[LACTOSE],
      [FORMATED_LACTOSE]: totals[LACTOSE].toFixed(2).replace('.', ','),
    };
  },
  clearFoodTable() {
    const tbody = document.querySelector('#foodTable tbody');
    tbody.innerHTML = '';
  },
  loadFromStorage() {
    const storedItems = localStorage.getItem('foodItems');
    if (storedItems) {
      this.foodItems = JSON.parse(storedItems);
      this.updateFoodTable();
      this.renderTotals();
    }
    const savedData = localStorage.getItem(nutriCalc.constants.NUTRICALC_DATA);
    if (savedData) {
      this.data = JSON.parse(savedData);
    }
  },
  removeFoodItem(id) {
    this.foodItems = this.foodItems.filter((item) => item.id !== id);
    this.saveToStorage();
    this.updateFoodTable();
    this.renderTotals();
  },
  renderTotals() {
    const { CALORIES, GLUCIDES, LIPIDES, PROTEINES } =
      nutriCalc.constants.NUTRIMENTS;
    const {
      FORMATED_ACIDES_GRAS_SATURES,
      FORMATED_ACIDES_GRAS_MONOINSATURES,
      FORMATED_GLUCIDES,
      FORMATED_LACTOSE,
      FORMATED_LIPIDES,
      FORMATED_OMEGA3,
      FORMATED_OMEGA6,
      FORMATED_PROTEINES,
      FORMATED_SUCRES_HORS_LACTOSE,
    } = nutriCalc.constants.FORMATED_NUTRIMENTS;
    this.totals = this.calculateTotals();
    this.calculateRatios();
    const foodTotalsEl = document.getElementById('foodTotals');
    if (this.foodItems.length > 0) {
      foodTotalsEl.innerHTML = `
          <div class="card p-3 shadow-sm">
            <h6><strong>Énergie</strong></h6>
            <p>${this.totals[CALORIES]} kcal (${this.ajrRatios[CALORIES]} des AJR)</p>
            <div class="progress">
              <div class="progress-bar bg-secondary"
                   role="progressbar"
                   style="width: ${this.ajrRatios[CALORIES]}">
              </div>
            </div>
          </div>
          <div class="card p-3 shadow-sm">
            <h6>Protéines</h6>
            <p>${this.totals[FORMATED_PROTEINES]} g (${this.ajrRatios[PROTEINES]} des AJR)</p>
            <div class="progress">
              <div class="progress-bar bg-success"
                   role="progressbar"
                   style="width: ${this.ajrRatios[PROTEINES]}">
              </div>
            </div>
          </div>
          <div class="card p-3 shadow-sm">
            <h6>Lipides</h6>
            <p>${this.totals[FORMATED_LIPIDES]} g (${this.ajrRatios[LIPIDES]} des AJR)</p>
            <div class="progress mb-2">
              <div class="progress-bar bg-purple"
                   role="progressbar"
                   style="width: ${this.ajrRatios[LIPIDES]}">
              </div>
            </div>
            <ul class="small mb-0">
              <li>Acides gras saturés : ${this.totals[FORMATED_ACIDES_GRAS_SATURES]} g</li>
              <li>Monoinsaturés : ${this.totals[FORMATED_ACIDES_GRAS_MONOINSATURES]} g</li>
              <li>Oméga 6 : ${this.totals[FORMATED_OMEGA6]} g</li>
              <li>Oméga 3 : ${this.totals[FORMATED_OMEGA3]} g</li>
            </ul>
          </div>
          <div class="card p-3 shadow-sm">
            <h6>Glucides</h6>
            <p>${this.totals[FORMATED_GLUCIDES]} g (${this.ajrRatios[GLUCIDES]} des AJR)</p>
            <div class="progress mb-2">
              <div class="progress-bar bg-info"
                   role="progressbar"
                   style="width: ${this.ajrRatios[GLUCIDES]}">
              </div>
            </div>
            <ul class="small mb-0">
              <li>Sucres (hors lactose et galactose) : ${this.totals[FORMATED_SUCRES_HORS_LACTOSE]} g</li>
              <li>Lactose : ${this.totals[FORMATED_LACTOSE]} g</li>
            </ul>
          </div>
        `;
    } else {
      foodTotalsEl.textContent = '';
    }
  },
  reset() {
    this.foodItems.length = 0;
    this.ajrRatios = {};
    this.data = {};
    this.totals = {};
    localStorage.removeItem(nutriCalc.constants.FOOD_ITEMS);
    this.clearFoodTable();
    document.getElementById('blocFoodSummary').classList.add('d-none');
  },
  saveToStorage() {
    localStorage.setItem(
      nutriCalc.constants.FOOD_ITEMS,
      JSON.stringify(this.foodItems)
    );
  },
  updateFoodTable() {
    const { CALORIES, GLUCIDES, LIPIDES, PROTEINES } =
      nutriCalc.constants.NUTRIMENTS;
    // --- Vue desktop ---
    const tbody = document.querySelector('#foodTable tbody');
    tbody.innerHTML = '';
    this.foodItems.forEach((item) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${item.name}</td>
          <td>${item.qtyDisplay}</td>
          <td class="text-center">
            ${Math.round(item[CALORIES])}
          </td>
          <td class="text-center">
            ${item[PROTEINES].toFixed(1).replace('.', ',')}
          </td>
          <td class="text-center">
            ${item[LIPIDES].toFixed(1).replace('.', ',')}
          </td>
          <td class="text-center">
            ${item[GLUCIDES].toFixed(1).replace('.', ',')}
          </td>
          <td>
            <button
              class="btn btn-sm btn-outline-danger remove-btn"
              data-id="${item.id}"
            >
              <i class="bi bi-trash"></i>
            </button>
          </td>
        `;
      tbody.appendChild(tr);
    });
    // --- Vue mobile (accordion) ---
    const accordion = document.querySelector('#foodAccordion');
    accordion.innerHTML = '';
    this.foodItems.forEach((item, index) => {
      const collapseId = `collapse${item.id}`;
      const card = document.createElement('div');
      card.className = 'accordion-item';
      card.innerHTML = `
          <h2 class="accordion-header" id="heading${item.id}">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#${collapseId}"
            >
              ${item.name} – ${item.qtyDisplay}
            </button>
          </h2>
          <div id="${collapseId}" class="accordion-collapse collapse"
               data-bs-parent="#foodAccordion">
            <div class="accordion-body">
              <ul class="mb-2 small">
                <li>Énergie : ${Math.round(item[CALORIES])} kcal</li>
                <li>Protéines : ${item[PROTEINES].toFixed(1)} g</li>
                <li>Lipides : ${item[LIPIDES].toFixed(1)} g</li>
                <li>Glucides : ${item[GLUCIDES].toFixed(1)} g</li>
              </ul>
              <button
                class="btn btn-sm btn-outline-danger remove-btn"
                data-id="${item.id}"
              >
                <i class="bi bi-trash"></i> Supprimer
              </button>
            </div>
          </div>
        `;
      accordion.appendChild(card);
    });
    document.querySelectorAll('.remove-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        this.removeFoodItem(id);
      });
    });
    const blocFoodSummary = document.getElementById('blocFoodSummary');
    if (this.foodItems.length > 0) {
      blocFoodSummary.classList.remove('d-none');
    } else {
      blocFoodSummary.classList.add('d-none');
    }
  },
  init() {
    this.loadFromStorage();
    this.renderTotals();
    const foodNameEl = document.getElementById('foodName');
    const unitSelect = document.getElementById('foodUnit');
    const foodListEl = document.getElementById('foodList');
    foodListEl.innerHTML = '';
    const namesMap = new Map(); // key: lowercased name, value: display name
    nutriCalc.foodCompositionTable.forEach((f) => {
      const key = f.nom.trim().toLowerCase();
      if (!namesMap.has(key)) namesMap.set(key, f.nom.trim());
    });
    for (const [, displayName] of namesMap) {
      const opt = document.createElement('option');
      opt.value = displayName;
      foodListEl.appendChild(opt);
    }
    foodNameEl.addEventListener('input', (e) => {
      const key = e.target.value.trim().toLowerCase();
      const food = nutriCalc.foodCompositionTable.find(
        (f) => f.nom.trim().toLowerCase() === key
      );
      const qtyEl = document.getElementById('foodQty');
      unitSelect.innerHTML =
        '<option value="" disabled selected>— choisir une unité —</option>';
      unitSelect.disabled = true;
      document.getElementById('addFoodButton').disabled = true;
      if (food) {
        const { GRAMMES, MILLILITRES } = nutriCalc.constants;
        unitSelect.dataset.ration = food.ration ? food.ration : '';
        unitSelect.disabled = false;
        if (!food.portions || food.portions.length === 0) {
          unitSelect.innerHTML = '';
          unitSelect.appendChild(new Option(GRAMMES, GRAMMES));
          if (food.liquide) {
            unitSelect.appendChild(new Option(MILLILITRES, MILLILITRES));
          }
          unitSelect.value = GRAMMES;
          qtyEl.value = food.ration ? food.ration : 100;
          document.getElementById('addFoodButton').disabled = false;
        } else {
          unitSelect.appendChild(new Option(GRAMMES, GRAMMES));
          if (food.liquide) {
            unitSelect.appendChild(new Option(MILLILITRES, MILLILITRES));
          }
          food.portions.forEach((p) => {
            unitSelect.appendChild(new Option(p.label, p.label));
          });
        }
      }
    });
    unitSelect.addEventListener('change', () => {
      const qtyEl = document.getElementById('foodQty');
      if (unitSelect.value) {
        if (unitSelect.value === nutriCalc.constants.GRAMMES) {
          const ration = unitSelect.dataset.ration;
          qtyEl.value = ration ? ration : 100;
        } else if (unitSelect.value === nutriCalc.constants.MILLILITRES) {
          qtyEl.value = 100;
        } else {
          qtyEl.value = 1;
        }
        document.getElementById('addFoodButton').disabled = false;
      } else {
        qtyEl.value = '';
        document.getElementById('addFoodButton').disabled = true;
      }
    });
    document.getElementById('foodForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = foodNameEl.value.trim();
      const qty = parseFloat(document.getElementById('foodQty').value);
      const unit = unitSelect.value;
      if (!name || isNaN(qty) || qty <= 0 || !unit) return;
      this.addFoodItem(name, qty, unit);
      e.target.reset();
      unitSelect.innerHTML =
        '<option value="" disabled selected>— choisir une unité —</option>';
      unitSelect.disabled = true;
      foodNameEl.focus();
    });
  },
};
