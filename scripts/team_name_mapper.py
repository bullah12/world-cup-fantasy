import os
import pandas as pd


MANUAL_TEAM_NAME_MAP = {
    "USA": "United States",
    "United States of America": "United States",
    "USMNT": "United States",

    "South Korea": "Korea Republic",
    "Korea": "Korea Republic",
    "Republic of Korea": "Korea Republic",

    "Turkey": "Türkiye",
    "Turkiye": "Türkiye",

    "Ivory Coast": "Côte d’Ivoire",
    "Cote d'Ivoire": "Côte d’Ivoire",
    "Cote d’Ivoire": "Côte d’Ivoire",
    "Côte d'Ivoire": "Côte d’Ivoire",
    "Côte d’Ivoire": "Côte d’Ivoire",

    "DR Congo": "Congo DR",
    "Democratic Republic of Congo": "Congo DR",
    "Democratic Republic of the Congo": "Congo DR",
    "Congo-Kinshasa": "Congo DR",
    "Zaire": "Congo DR",
    "Zaïre": "Congo DR",

    "Cape Verde": "Cabo Verde",
    "Cape Verde Islands": "Cabo Verde",
    "Cabo Verde": "Cabo Verde",

    "Czech Republic": "Czechia",

    "Bosnia-Herzegovina": "Bosnia and Herzegovina",
    "Bosnia & Herzegovina": "Bosnia and Herzegovina",
    "Bosnia and Herzegovina": "Bosnia and Herzegovina",

    "IR Iran": "Iran",

    "KSA": "Saudi Arabia",
    "Saudi": "Saudi Arabia",
    "Saudi Arabia": "Saudi Arabia",

    "South Africa": "South Africa",
    "Central African Republic": "Central African Republic",
    "New Zealand": "New Zealand",
}


def clean_team_name(name):
    if name is None:
        return ""

    cleaned = str(name).strip()

    # Fix common bad encodings/non-breaking spaces
    cleaned = cleaned.replace("Â", "")
    cleaned = cleaned.replace("\xa0", " ")

    # Fix curly/smart quote inconsistencies
    cleaned = cleaned.replace("’", "'").replace("‘", "'")

    # Normalise repeated spaces
    cleaned = " ".join(cleaned.split())

    return cleaned


def load_former_names_map():
    path = os.path.join("data", "former_names.csv")

    if not os.path.exists(path):
        return {}

    try:
        df = pd.read_csv(path, encoding="utf-8")
    except UnicodeDecodeError:
        df = pd.read_csv(path, encoding="latin1")

    required_columns = {"current", "former"}

    if not required_columns.issubset(df.columns):
        return {}

    mapping = {}

    for _, row in df.iterrows():
        current = clean_team_name(row["current"])
        former = clean_team_name(row["former"])

        if current and former:
            mapping[former] = current

    return mapping


FORMER_NAMES_MAP = load_former_names_map()


def canonical_team_name(name):
    cleaned = clean_team_name(name)

    if not cleaned:
        return ""

    # Manual mappings first because these match your app's names
    if cleaned in MANUAL_TEAM_NAME_MAP:
        return MANUAL_TEAM_NAME_MAP[cleaned]

    # Former names file second
    if cleaned in FORMER_NAMES_MAP:
        mapped_name = clean_team_name(FORMER_NAMES_MAP[cleaned])

        # Apply manual mappings again in case former_names.csv maps to
        # a name that still differs from your app naming.
        return MANUAL_TEAM_NAME_MAP.get(mapped_name, mapped_name)

    return cleaned