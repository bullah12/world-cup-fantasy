import pandas as pd

BASE_ELO = 1500
K = 30

results = pd.read_csv("data/results.csv")

ratings = {}

for _, row in results.iterrows():

    home = row["home_team"]
    away = row["away_team"]

    ratings.setdefault(home, BASE_ELO)
    ratings.setdefault(away, BASE_ELO)

    home_rating = ratings[home]
    away_rating = ratings[away]

    expected_home = 1 / (
        1 + 10 ** ((away_rating - home_rating) / 400)
    )

    if row["home_score"] > row["away_score"]:
        actual_home = 1
    elif row["home_score"] == row["away_score"]:
        actual_home = 0.5
    else:
        actual_home = 0

    ratings[home] += K * (
        actual_home - expected_home
    )

    ratings[away] += K * (
        (1 - actual_home) -
        (1 - expected_home)
    )

elo_df = pd.DataFrame(
    ratings.items(),
    columns=["team", "elo"]
)

elo_df.to_csv(
    "team_elo.csv",
    index=False
)