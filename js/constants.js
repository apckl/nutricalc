window.nutriCalc = window.nutriCalc || {};

nutriCalc.constants = {
  // Activités
  SOMMEIL: 'sommeil',
  REPOS: 'repos',
  ASSIS_CALME: 'assisCalme',
  ASSIS_ACTIF: 'assisActif',
  DEBOUT_CALME: 'deboutCalme',
  MENAGE_LEGER: 'menageLeger',
  PROMENADE: 'promenade',
  MENAGE_SOUTENU: 'menageSoutenu',
  MARCHE_ALERTE: 'marcheAlerte',
  SPORT: 'sport',
  SPORT_SOUTENU: 'sportSoutenu',
  SPORT_INTENSE: 'sportIntense',

  ACTIVITES: [
    'sommeil',
    'repos',
    'assisCalme',
    'assisActif',
    'deboutCalme',
    'menageLeger',
    'promenade',
    'menageSoutenu',
    'marcheAlerte',
    'sport',
    'sportSoutenu',
    'sportIntense',
  ],

  // Source : https://pacompendium.com/
  COEFFICIENTS_ACTIVITES: {
    sommeil: 1.0, // Sommeil, sieste
    repos: 1.3, // Lecture, télévision, tricot, couture calme, passager assis
    assisCalme: 1.5, // Repas calme, conversations, travail de bureau léger
    assisActif: 1.8, // Conduite, travail de bureau actif
    deboutCalme: 2.2, // Toilette, habillage, cuisine simple, petit rangement, vente au comptoir
    menageLeger: 2.5, // Ménage léger, s’occuper d’un enfant, faire quelques courses à pied
    promenade: 2.9, // Marche ~4 km/h : promenade tranquille, balade du chien, flânerie
    menageSoutenu: 3.5, // Ménage soutenu, petit jardinage, déplacements à bon pas
    marcheAlerte: 4.5, // Marche 6 km/h
    sport: 6.0, // Vélo loisir 16–19 km/h, natation tranquille, sport collectif loisir
    sportSoutenu: 8.5, // Jogging 8–9 km/h, vélo 20–22 km/h, natation soutenue, sport de raquette vif
    sportIntense: 10.0, // Course >10 km/h, cyclisme >23 km/h, natation rapide
  },

  LABELS_ACTIVITES_ADULTES: {
    sommeil: 'Sommeil, sieste',
    repos: 'Repos (lecture, TV)',
    assisCalme: 'Activité assise calme',
    assisActif: 'Travail de bureau actif',
    deboutCalme: 'Activité debout calme',
    menageLeger: 'Ménage léger',
    promenade: 'Promenade',
    menageSoutenu: 'Ménage soutenu',
    marcheAlerte: 'Marche alerte',
    sport: 'Sport loisir',
    sportSoutenu: 'Sport soutenu',
    sportIntense: 'Sport intense',
  },

  // Autres constantes
  AGMI: 'acidesGrasMonoInsatures',
  AGS: 'acidesGrasSatures',
  AGE: 'age',
  AGE_MOIS: 'ageMois',
  AJR_CALORIES: 'ajrCalories',
  CATEGORIE_ACTIVITE: 'categorieActivite',
  DATE_NAISSANCE: 'dateNaissance',
  DEPENSE_TOTALE: 'depenseTotale',
  ELEVE: 'élevé',
  EXTREMEMENT_ELEVE: 'extrêmement élevé',
  FAIBLE: 'faible',
  FEMME: 'F',
  GLUCIDES: 'glucides',
  HOMME: 'H',
  IMC: 'imc',
  IMC_MEDIAN: 'imcMedian',
  INTERPRETATION_IMC: 'interpretationImc',
  LIPIDES: 'lipides',
  MAX: 'max',
  MAX_PROTEINES: 'maxProteines',
  METABOLISME_BASE: 'metabolismeBase',
  METABOLISME_BASE_HORAIRE: 'metabolismeBaseHoraire',
  MIN: 'min',
  MIN_PROTEINES: 'minProteines',
  NIVEAU_ACTIVITE: 'niveauActivite',
  NORMAL: 'normal',
  NUTRICALC_DATA: 'nutriCalcData',
  OMEGA3: 'omega3',
  OMEGA6: 'omega6',
  OPTION_LIPIDES: 'optionLipides',
  OPTION_PROTEINES: 'optionProteines',
  POIDS: 'poids',
  POIDS_CIBLE: 'poidsCible',
  PROFIL: 'profil',
  PROPORTION_GLUCIDES: 'proportionGlucides',
  PROPORTION_LIPIDES: 'proportionLipides',
  PROPORTION_PROTEINES: 'proportionProteines',
  PROTEINES: 'proteines',
  PROTEINES_CIBLE: 'proteinesCible',
  SEXE: 'sexe',
  SOUHAIT_PERTE_POIDS: 'souhaitPertePoids',
  SUCRES: 'sucres',
  SURFACE_CORPORELLE: 'surfaceCorporelle',
  TAILLE: 'taille',
  TRES_ELEVE: 'très élevé',
  TRES_FAIBLE: 'très faible',
};
