# 🥗 NutriCalc

**NutriCalc** est un calculateur nutritionnel interactif permettant d'estimer
vos besoins énergétiques et apports journaliers recommandés en fonction
de votre profil : âge, sexe, poids, taille, activités et objectifs.

## ✅ Fonctionnalités

- Calcul du métabolisme de base et des besoins énergétiques journaliers.
- Répartition des macronutriments (protéines, glucides, lipides) en fonction
  du profil.
- Détail des lipides :
    - acides gras saturés
    - acides gras monoinsaturés
    - acides gras polyinsaturés oméga 3 et oméga 6
- Adaptation automatique en fonction de l'âge (bébés, enfants, adolescents,
  adultes et personnes âgées).
- Prise en compte des activités physiques via répartition horaire (24h).
- Interface claire, ergonomique et responsive grâce au framework CSS
  **Bootstrap**.
- Stockage local des données (LocalStorage).

## 🚀 Utilisation

**NutriCalc** est très simple à utiliser et fonctionne directement depuis votre
navigateur web :

### ✅ Utilisation en ligne
1. Rendez-vous sur :  
   [https://apckl.github.io/nutricalc](https://apckl.github.io/nutricalc)
2. Renseignez vos informations personnelles : sexe, date de naissance, taille,
   poids.
3. Indiquez la durée (en heures) consacrée à chaque activité sur 24 heures.
4. Cliquez sur **Calculer** pour obtenir :
    - votre IMC et son interprétation.
    - votre métabolisme de base et vos besoins énergétiques.
    - les apports journaliers recommandés en calories, protéines, lipides,
      glucides.
5. Consultez le détail par activité et ajustez vos paramètres si nécessaire.

> 🔒 **Confidentialité**  
> Toutes les données sont traitées localement dans votre navigateur.  
> **NutriCalc** n'utilise aucun cookie et n'envoie aucune information à un
serveur.

### ✅ Utilisation locale (hors connexion)
Vous pouvez également exécuter **NutriCalc** en local, sans connexion Internet :
1. Téléchargez ou clonez le dépôt
   [GitHub](https://github.com/apckl/nutricalc).
2. Ouvrez simplement le fichier `index.html` dans votre navigateur (aucune
   installation n’est nécessaire).
3. Profitez des mêmes fonctionnalités que la version en ligne.

> 💡 Idéal pour une utilisation hors ligne ou sur clé USB.

## 🔄 Mise à jour des bibliothèques (optionnel)

**NutriCalc** s'appuie sur la bibliothèque `bootstrap`, stockée localement dans
le dossier `libs/`.

Si vous souhaitez la mettre à jour :

```bash
npm install
npm run update:libs
rm -rf node_modules
```

## 🐍 Script Python (pour information)

Le script Python `scripts/generateBmiChildrenThresholds.py` a permis de
générer les tables de seuils IMC enfants à partir des données officielles de
l'OMS.

Il lit les fichiers CSV du dossier `data` (`bmi-boys-perc-who2007-exp.csv` et
`bmi-girls-perc-who2007-exp.csv`) et produit le fichier
`js/core/seuils-imc-enfants.js`, utilisé par l'application pour interpréter
correctement l'IMC selon l'âge et le sexe.

> ℹ️ Ce script n’est utile que si vous souhaitez régénérer les seuils.

## 📚 Sources scientifiques et références

- [ANSES - Les protéines](https://www.anses.fr/fr/content/les-proteines)
- [ANSES - Les lipides](https://www.anses.fr/fr/content/les-lipides)
- [ANSES - Les sucres dans l'alimentation](https://www.anses.fr/fr/content/sucres-dans-lalimentation)
- [WHO - BMI-for-age (5-19 years)](https://www.who.int/tools/growth-reference-data-for-5to19-years/indicators/bmi-for-age)
- [WHO - BMI-for-age (0-5 years)](https://www.who.int/toolkits/child-growth-standards/standards/body-mass-index-for-age-bmi-for-age)
- [WHO - Obesity and overweight](https://www.who.int/fr/news-room/fact-sheets/detail/obesity-and-overweight)
- [WHO - Sugary drinks and health impacts](https://www.who.int/news/item/11-10-2016-who-urges-global-action-to-curtail-consumption-and-health-impacts-of-sugary-drinks)
- [FAO - Human energy requirements](https://www.fao.org/4/y5686e/y5686e07.htm)
- [Compendium of Physical Activities](https://pacompendium.com/)

**Références livresques :**

- Tremolières, J., Serville, Y., Jacquot, R., & Dupin, H. (1980).
  _Manuel d'alimentation humaine. Tome 1. Les bases de l'alimentation_.
  Paris : ESF. ISBN 2-7101-0067.3.
- Tremolières, J. (1983).
  _Nutrition : physiologie, comportement alimentaire_.
  Paris : Dunod. ISBN 2-04-007185-7.
