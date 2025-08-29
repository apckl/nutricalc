import pandas as pd

# Fichiers source
boys_file = "data/bmi-boys-perc-who2007-exp.csv"
girls_file = "data/bmi-girls-perc-who2007-exp.csv"

# Colonnes des fichiers csv
columns_names = [
    "L", "M", "S",
    "P01", "P1", "P3", "P5", "P10", "P15", "P25",
    "P50", "P75", "P85", "P90", "P95", "P97", "P99", "P999"
]


def load_and_filter(file, sex_label):
    df = pd.read_csv(file, sep=";", decimal=",")
    print(f"Colonnes détectées pour {sex_label} :", df.columns.tolist())
    age_col = "Month"
    df = df[(df[age_col] >= 0) & (df[age_col] <= 228)]
    df = df[[age_col] + columns_names].copy()
    thresholds = {
        int(row[age_col]): {
            p.lower(): float(f"{row[p]:.3f}") for p in columns_names
        }
        for _, row in df.iterrows()
    }
    return thresholds


boys_thresholds = load_and_filter(boys_file, "H")
girls_thresholds = load_and_filter(girls_file, "F")

js_output = "window.nutriCalc = window.nutriCalc || {};\n\n"
js_output += "// Fichier créé avec le script Python generateBmiChildrenThresholds.py\n"
js_output += "// Ce script permet d'enregistrer les données des fichiers\n"
js_output += "// bmi-boys-perc-who2007-exp.csv et bmi-girls-perc-who2007-exp.csv\n"
js_output += "// du dossier data dans l'objet JavaScript ci-dessous\n"
js_output += "// Source des fichiers csv : Organisation mondiale de la Santé\n"
js_output += "// https://www.who.int/tools/growth-reference-data-for-5to19-years/indicators/bmi-for-age\n"
js_output += "// https://www.who.int/toolkits/child-growth-standards/standards/body-mass-index-for-age-bmi-for-age\n"
js_output += "nutriCalc.SEUILS_IMC_ENFANTS = {\n"
js_output += "  H: {\n"
for age, vals in boys_thresholds.items():
    js_output += f"    {age}: {vals},\n"
js_output += "  },\n"
js_output += "  F: {\n"
for age, vals in girls_thresholds.items():
    js_output += f"    {age}: {vals},\n"
js_output += "  }\n};\n"

with open("js/core/seuils-imc-enfants.js", "w", encoding="utf-8") as f:
    f.write(js_output)

print("✅ Fichier seuils-imc-enfants.js généré avec succès !")
