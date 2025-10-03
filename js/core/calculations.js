window.nutriCalc = window.nutriCalc || {};

nutriCalc.calculations = {
  calculerAges(data) {
    const { AGE, AGE_MOIS, DATE_NAISSANCE } = nutriCalc.constants;
    const naissance = nutriCalc.jsUtils.parseFormatedDate(data[DATE_NAISSANCE]);
    if (naissance) {
      const MS_PER_YEAR = 365.25 * 24 * 3600 * 1000;
      const MS_PER_MONTH = MS_PER_YEAR / 12;
      data[AGE] = Math.floor((Date.now() - naissance.getTime()) / MS_PER_YEAR);
      data[AGE_MOIS] = Math.round(
        (Date.now() - naissance.getTime()) / MS_PER_MONTH
      );
    }
  },
  calculerImc(data) {
    const { IMC, POIDS, TAILLE } = nutriCalc.constants;
    data[IMC] =
      Math.round((10 * data[POIDS]) / Math.pow(data[TAILLE] / 100, 2)) / 10;
  },
  calculerAjrCalories(data) {
    const { AGE, AJR_CALORIES, DEPENSE_TOTALE, POIDS, SOUHAIT_PERTE_POIDS } =
      nutriCalc.constants;
    if (data[AGE] < 3) {
      this.calculerAjrCaloriesBebe(data);
    } else {
      this.calculerMetabolismeBaseParHeure(data);
      this.calculerDepenseTotale(data);
      if (data[SOUHAIT_PERTE_POIDS] !== 'oui') {
        data[AJR_CALORIES] = data[DEPENSE_TOTALE];
      } else {
        const pertePoidsMensuelle = 0.05 * data[POIDS];
        const deficitCaloriqueJournalier = Math.min(
          1000,
          (8000 * pertePoidsMensuelle) / (365.25 / 12)
        );
        data[AJR_CALORIES] = Math.round(
          data[DEPENSE_TOTALE] - deficitCaloriqueJournalier
        );
      }
    }
  },
  calculerAjrCaloriesBebe(data) {
    const {
      AGE_MOIS,
      AJR_CALORIES,
      INTERPRETATION_IMC,
      NORMAL,
      POIDS,
      POIDS_CIBLE,
    } = nutriCalc.constants;
    const ageMois = data[AGE_MOIS];
    let poids = data[POIDS];
    if (data[INTERPRETATION_IMC] !== NORMAL) {
      poids = data[POIDS_CIBLE];
    }
    let caloriesParKg;
    if (ageMois <= 6) caloriesParKg = 100;
    else if (ageMois <= 12) caloriesParKg = 90;
    else caloriesParKg = 80;
    data[AJR_CALORIES] = Math.floor(caloriesParKg * poids);
  },
  calculerDepenseTotale(data) {
    const {
      AGE,
      COEFFICIENTS_ACTIVITES,
      DEPENSE_TOTALE,
      METABOLISME_BASE,
      METABOLISME_BASE_HORAIRE,
    } = nutriCalc.constants;
    if (data[AGE] >= 3) {
      const metabolismeBase = data[METABOLISME_BASE_HORAIRE];
      let depenseTotale = 0;
      for (const activite in COEFFICIENTS_ACTIVITES) {
        depenseTotale +=
          COEFFICIENTS_ACTIVITES[activite] *
          metabolismeBase *
          (data[activite] || 0);
      }
      data[METABOLISME_BASE] = Math.floor(24 * data[METABOLISME_BASE_HORAIRE]);
      data[DEPENSE_TOTALE] = Math.floor(depenseTotale);
    }
  },
  calculerInterpretationImc(data) {
    const { AGE_MOIS, IMC, INTERPRETATION_IMC } = nutriCalc.constants;
    if (data[AGE_MOIS] >= 228) {
      data[INTERPRETATION_IMC] = this.interpretationImcAdulte(data[IMC]);
    } else {
      data[INTERPRETATION_IMC] = this.interpretationImcEnfant(data);
    }
  },
  calculerMetabolismeBaseParHeure(data) {
    const {
      AGE,
      HOMME,
      METABOLISME_BASE_HORAIRE,
      POIDS,
      SEXE,
      SURFACE_CORPORELLE,
      TAILLE,
    } = nutriCalc.constants;
    const age = data[AGE];
    // Surface corporelle en m² (DuBois & DuBois, 1916)
    const surfaceCorporelle =
      0.007184 * Math.pow(data[TAILLE], 0.725) * Math.pow(data[POIDS], 0.425);
    let mbRef;
    // Tables Aub-Dubois
    if (data[SEXE] === HOMME) {
      if (age < 12) mbRef = 52;
      else if (age < 14) mbRef = 50;
      else if (age < 16) mbRef = 46;
      else if (age < 18) mbRef = 43;
      else if (age < 20) mbRef = 41;
      else if (age < 40) mbRef = 39.5;
      else if (age < 50) mbRef = 38.5;
      else if (age < 60) mbRef = 37.5;
      else if (age < 70) mbRef = 36.5;
      else mbRef = 35.5;
    } else {
      if (age < 12) mbRef = 50;
      else if (age < 14) mbRef = 46.5;
      else if (age < 16) mbRef = 43;
      else if (age < 18) mbRef = 40;
      else if (age < 20) mbRef = 38;
      else if (age < 30) mbRef = 37;
      else if (age < 40) mbRef = 36.5;
      else if (age < 50) mbRef = 36;
      else if (age < 60) mbRef = 35;
      else if (age < 70) mbRef = 34;
      else mbRef = 33;
    }
    data[SURFACE_CORPORELLE] = surfaceCorporelle;
    data[METABOLISME_BASE_HORAIRE] = mbRef * surfaceCorporelle;
  },
  calculerNiveauActivite(data) {
    const {
      AGE,
      CATEGORIE_ACTIVITE,
      COEFFICIENTS_ACTIVITES,
      HOMME,
      NIVEAU_ACTIVITE,
      SEXE,
    } = nutriCalc.constants;
    if (data[AGE] >= 3) {
      let niveauActivite = 0;
      for (const activite in COEFFICIENTS_ACTIVITES) {
        const heures = data[activite] || 0;
        niveauActivite += (COEFFICIENTS_ACTIVITES[activite] * heures) / 24;
      }
      data[NIVEAU_ACTIVITE] = Math.round(niveauActivite * 100) / 100;
      if (niveauActivite < 1.4) data[CATEGORIE_ACTIVITE] = 'très sédentaire';
      else if (niveauActivite < 1.7) data[CATEGORIE_ACTIVITE] = 'sédentaire';
      else if (niveauActivite < 2.0)
        data[CATEGORIE_ACTIVITE] =
          data[SEXE] === HOMME ? 'modérément actif' : 'modérément active';
      else if (niveauActivite < 2.4)
        data[CATEGORIE_ACTIVITE] =
          data[SEXE] === HOMME ? 'très actif' : 'très active';
      else
        data[CATEGORIE_ACTIVITE] =
          data[SEXE] === HOMME ? 'extrêmement actif' : 'extrêmement active';
    }
  },
  calculerMacroNutriments(data) {
    const {
      ACIDES_GRAS_MONOINSATURES,
      ACIDES_GRAS_SATURES,
      GLUCIDES,
      LIPIDES,
      OMEGA3,
      OMEGA6,
      PROTEINES,
      SUCRES,
    } = nutriCalc.constants.NUTRIMENTS;
    const {
      AGE,
      AGE_MOIS,
      AJR_CALORIES,
      MAX,
      MAX_PROTEINES,
      MIN,
      MIN_PROTEINES,
      OPTION_LIPIDES,
      OPTION_PROTEINES,
      PROPORTION_GLUCIDES,
      PROPORTION_LIPIDES,
      PROPORTION_PROTEINES,
      PROTEINES_CIBLE,
    } = nutriCalc.constants;
    this.calculerProteines(data);
    const age = data[AGE];
    const calories = data[AJR_CALORIES];
    let proteines = data[PROTEINES_CIBLE];
    if (data[OPTION_PROTEINES] === MIN) {
      proteines = data[MIN_PROTEINES];
    } else if (data[OPTION_PROTEINES] === MAX) {
      proteines = data[MAX_PROTEINES];
    }
    const caloriesProteines = proteines * 4;
    let caloriesLipides = calories * 0.375;
    let caloriesAgs = calories * 0.105;
    let caloriesAgmi = calories * 0.19;
    let caloriesOmega3 = calories * 0.01;
    let caloriesOmega6 = calories * 0.04;
    if (age < 3) {
      const ageMois = data[AGE_MOIS];
      if (ageMois < 6) {
        caloriesLipides = calories * 0.525;
      } else {
        caloriesLipides = calories * 0.4725;
      }
      caloriesAgs = caloriesLipides * 0.5;
      caloriesOmega3 = calories * 0.0045;
      caloriesOmega6 = calories * 0.027;
      caloriesAgmi =
        caloriesLipides - caloriesAgs - caloriesOmega6 - caloriesOmega3;
    } else {
      if (data[OPTION_LIPIDES] === MIN) {
        caloriesLipides = calories * 0.35;
        caloriesAgs = calories * 0.09;
        caloriesAgmi = calories * 0.18;
      } else if (data[OPTION_LIPIDES] === MAX) {
        caloriesLipides = calories * 0.4;
        caloriesAgs = calories * 0.12;
        caloriesAgmi = calories * 0.2;
      }
    }
    const caloriesGlucides = calories - caloriesProteines - caloriesLipides;
    data[GLUCIDES] = Math.floor(caloriesGlucides / 4);
    data[LIPIDES] = Math.floor(caloriesLipides / 9);
    data[ACIDES_GRAS_SATURES] = Math.floor(caloriesAgs / 9);
    data[ACIDES_GRAS_MONOINSATURES] = Math.ceil(caloriesAgmi / 9);
    data[OMEGA3] = Math.ceil((10 * caloriesOmega3) / 9) / 10;
    data[OMEGA6] = Math.floor((10 * caloriesOmega6) / 9) / 10;
    data[PROTEINES] = proteines;
    data[PROPORTION_PROTEINES] = nutriCalc.numberFormatter.formatRatio(
      caloriesProteines,
      calories
    );
    data[PROPORTION_GLUCIDES] = nutriCalc.numberFormatter.formatRatio(
      caloriesGlucides,
      calories
    );
    data[PROPORTION_LIPIDES] = nutriCalc.numberFormatter.formatRatio(
      caloriesLipides,
      calories
    );
    let maxSucresByAge;
    if (age < 8) maxSucresByAge = 60;
    else if (age < 13) maxSucresByAge = 75;
    else maxSucresByAge = 100;
    const maxSucresByCalories = Math.floor((0.1 * calories) / 4);
    data[SUCRES] =
      maxSucresByAge > maxSucresByCalories
        ? maxSucresByCalories
        : maxSucresByAge;
  },
  calculerProfil(data) {
    const {
      AGE,
      AGE_MOIS,
      CATEGORIE_ACTIVITE,
      HOMME,
      POIDS,
      PROFIL,
      SEXE,
      TAILLE,
    } = nutriCalc.constants;
    let personne = data[SEXE] === HOMME ? 'Homme' : 'Femme';
    const age = data[AGE];
    const ageMois = data[AGE_MOIS];
    if (personne === 'Homme') {
      if (age < 12) personne = 'Garçon';
      else if (age < 18) personne = 'Adolescent';
    } else {
      if (age < 12) personne = 'Fille';
      else if (age < 18) personne = 'Adolescente';
    }
    const poids = data[POIDS].toLocaleString('fr-FR');
    if (ageMois <= 24) {
      data[PROFIL] =
        `Bébé de ${ageMois} mois pesant ${poids} kg pour ${data[TAILLE]} cm`;
    } else {
      const tailleMetre = (data[TAILLE] / 100).toFixed(2).replace('.', ',');
      data[PROFIL] =
        `${personne} de ${age} ans ${data[CATEGORIE_ACTIVITE]} et pesant ${poids} kg pour ${tailleMetre} m`;
    }
  },
  calculerProteines(data) {
    const {
      AGE,
      AJR_CALORIES,
      MAX_PROTEINES,
      MIN_PROTEINES,
      NIVEAU_ACTIVITE,
      POIDS,
      PROTEINES_CIBLE,
      SOUHAIT_PERTE_POIDS,
    } = nutriCalc.constants;
    const age = data[AGE];
    const poids = data[POIDS];
    let minPerKg;
    if (age < 3) minPerKg = 2;
    else if (age < 4) minPerKg = 0.95;
    else if (age < 11) minPerKg = 0.92;
    else if (age < 15) minPerKg = 0.9;
    else if (age < 60) minPerKg = 0.83;
    else minPerKg = 1.0;
    let ratio;
    if (age < 3) {
      ratio = 1;
    } else {
      const niveauActivite = data[NIVEAU_ACTIVITE];
      if (niveauActivite <= 1.7) ratio = 1;
      else if (niveauActivite >= 2.4) ratio = 2.2 / minPerKg;
      else {
        const t = (niveauActivite - 1.7) / (2.4 - 1.7);
        ratio = 1 + t * (2.2 / minPerKg - 1);
      }
    }
    let minByWeight = minPerKg * ratio * poids;
    let maxByWeight = age < 3 ? 3 * poids : 2.2 * poids;
    const ajrCalories =
      data[SOUHAIT_PERTE_POIDS] === 'oui'
        ? Math.max(data[AJR_CALORIES], (minByWeight * 4) / 0.27)
        : data[AJR_CALORIES];
    data[AJR_CALORIES] = ajrCalories;
    const minByCalories =
      age < 3 ? (ajrCalories * 0.07) / 4 : (ajrCalories * 0.1) / 4;
    const maxByCalories =
      age < 3 ? (ajrCalories * 0.15) / 4 : (ajrCalories * 0.27) / 4;
    const minProteines = Math.max(minByCalories, minByWeight);
    const maxProteines = Math.min(maxByCalories, maxByWeight);
    const proteinesCible = Math.round((minProteines + maxProteines) / 2);
    data[MIN_PROTEINES] = Math.ceil(minProteines);
    data[MAX_PROTEINES] = Math.floor(maxProteines);
    data[PROTEINES_CIBLE] = proteinesCible;
  },
  interpretationImcAdulte(imc) {
    if (imc) {
      if (imc < 16) return nutriCalc.constants.TRES_FAIBLE;
      if (imc < 18.5) return nutriCalc.constants.FAIBLE; // IMC < 18.5 : insuffisance pondérale (maigreur)
      if (imc < 25) return nutriCalc.constants.NORMAL; // 18.5 <= IMC < 25 : IMC normal
      if (imc < 30) return nutriCalc.constants.ELEVE; // 25 <= IMC < 30 : surpoids
      if (imc < 40) return nutriCalc.constants.TRES_ELEVE; // 30 <= IMC < 40 : obésité modérée à sévère

      return nutriCalc.constants.EXTREMEMENT_ELEVE;
    }

    return '';
  },
  interpretationImcEnfant(data) {
    const {
      AGE_MOIS,
      ELEVE,
      EXTREMEMENT_ELEVE,
      FAIBLE,
      IMC,
      IMC_MEDIAN,
      NORMAL,
      POIDS_CIBLE,
      SEXE,
      TAILLE,
      TRES_ELEVE,
      TRES_FAIBLE,
    } = nutriCalc.constants;
    const ageMois = data[AGE_MOIS];
    const imc = data[IMC];
    const sexe = data[SEXE];
    if (ageMois !== undefined && imc && sexe) {
      const seuilsSexe = nutriCalc.SEUILS_IMC_ENFANTS[sexe];
      const seuils = seuilsSexe[ageMois];
      const L = seuils.l;
      const M = seuils.m;
      const S = seuils.s;
      data[IMC_MEDIAN] = seuils.p50;
      data[POIDS_CIBLE] =
        Math.round(10 * seuils.p50 * Math.pow(data[TAILLE] / 100, 2)) / 10;
      const z = ((imc / M) ** L - 1) / (L * S);
      // Source : https://cdn.who.int/media/docs/default-source/child-growth/growth-reference-5-19-years/calcule.pdf
      if (z < -3) return TRES_FAIBLE;
      if (z < -2) return FAIBLE;
      if (z < 1) return NORMAL;
      if (ageMois < 60) {
        // Enfant de moins de 5 ans :
        //   IMC normal jusqu'à la médiane plus 2 écarts-types
        //   surpoids lorsque l'IMC dépasse la médiane plus 2 écarts-types
        //   surpoids lorsque l'IMC dépasse la médiane plus 3 écarts-types
        if (z <= 2) return NORMAL;
        if (z <= 3) return ELEVE; // surpoids
        if (z <= 4) return TRES_ELEVE; // obésité
      } else {
        // Enfant de 5 à 19 ans :
        //   IMC normal jusqu'à la médiane plus 1 écart-type
        //   surpoids lorsque l'IMC dépasse la médiane plus 1 écart-type
        //   surpoids lorsque l'IMC dépasse la médiane plus 2 écarts-types
        if (z <= 1) return NORMAL;
        if (z <= 2) return ELEVE; // surpoids
        if (z <= 3) return TRES_ELEVE; // obésité
      }

      return EXTREMEMENT_ELEVE;
    }

    return '';
  },
  main(data) {
    this.calculerAges(data);
    this.calculerImc(data);
    this.calculerInterpretationImc(data);
    this.calculerNiveauActivite(data);
    this.calculerProfil(data);
    this.calculerAjrCalories(data);
    this.calculerMacroNutriments(data);
  },
};
