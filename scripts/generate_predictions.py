import os
import math
from re import match
from dotenv import load_dotenv
from supabase import create_client

from team_name_mapper import canonical_team_name

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env")

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

BASE_ELO = 1500
HOME_ADVANTAGE = 40
MAX_GOALS = 7
MODEL_VERSION = "elo-poisson-v1"


def load_latest_elo():
    response = (
        supabase
        .table("latest_team_elo")
        .select("*")
        .execute()
    )

    return {
        row["team_name"]: float(row["elo_rating"])
        for row in response.data
    }


def load_matches():
    response = (
        supabase
        .table("matches")
        .select("*")
        .execute()
    )

    return response.data


def expected_score(rating_a, rating_b):
    return 1 / (1 + 10 ** ((rating_b - rating_a) / 400))


def poisson_probability(expected_goals, goals):
    return (
        math.exp(-expected_goals)
        * expected_goals ** goals
        / math.factorial(goals)
    )


def estimate_expected_goals(home_team, away_team, ratings):
    home_elo = ratings.get(home_team, BASE_ELO)
    away_elo = ratings.get(away_team, BASE_ELO)

    home_strength = expected_score(
        home_elo + HOME_ADVANTAGE,
        away_elo
    )

    away_strength = expected_score(
        away_elo,
        home_elo + HOME_ADVANTAGE
    )

    home_expected_goals = 0.6 + (home_strength * 2.2)
    away_expected_goals = 0.6 + (away_strength * 2.2)

    return home_expected_goals, away_expected_goals


def predict_match(match, ratings):
    home_team = canonical_team_name(match["home_team"])
    away_team = canonical_team_name(match["away_team"])

    home_expected_goals, away_expected_goals = estimate_expected_goals(
        home_team,
        away_team,
        ratings
    )

    home_win_prob = 0
    draw_prob = 0
    away_win_prob = 0
    score_probabilities = []

    for home_score in range(MAX_GOALS + 1):
        for away_score in range(MAX_GOALS + 1):
            probability = (
                poisson_probability(home_expected_goals, home_score)
                * poisson_probability(away_expected_goals, away_score)
            )

            score_probabilities.append({
                "match_id": match["id"],
                "home_score": home_score,
                "away_score": away_score,
                "probability": round(probability * 100, 4),
            })

            if home_score > away_score:
                home_win_prob += probability
            elif home_score == away_score:
                draw_prob += probability
            else:
                away_win_prob += probability

    total = home_win_prob + draw_prob + away_win_prob

    home_win_prob = home_win_prob / total
    draw_prob = draw_prob / total
    away_win_prob = away_win_prob / total

    most_likely_score = max(
        score_probabilities,
        key=lambda row: row["probability"]
    )

    return {
        "match_id": match["id"],
        "home_team": home_team,
        "away_team": away_team,
        "home_win_prob": round(home_win_prob * 100, 2),
        "draw_prob": round(draw_prob * 100, 2),
        "away_win_prob": round(away_win_prob * 100, 2),
        "predicted_home_goals": round(home_expected_goals, 2),
        "predicted_away_goals": round(away_expected_goals, 2),
        "predicted_score": f"{most_likely_score['home_score']}-{most_likely_score['away_score']}",
        "model_version": MODEL_VERSION,
        "score_probabilities": score_probabilities,
    }


def is_real_fixture(match):
    home = match.get("home_team", "")
    away = match.get("away_team", "")

    placeholder_words = [
        "Group",
        "Match",
        "Winner",
        "Runner-up",
        "3rd Place",
        "Loser",
    ]

    return not any(
        word in home or word in away
        for word in placeholder_words
    )


def save_prediction(prediction):
    match_prediction_payload = {
        "match_id": prediction["match_id"],
        "home_team": prediction["home_team"],
        "away_team": prediction["away_team"],
        "home_win_prob": prediction["home_win_prob"],
        "draw_prob": prediction["draw_prob"],
        "away_win_prob": prediction["away_win_prob"],
        "predicted_home_goals": prediction["predicted_home_goals"],
        "predicted_away_goals": prediction["predicted_away_goals"],
        "predicted_score": prediction["predicted_score"],
        "model_version": prediction["model_version"],
    }

    (
        supabase
        .table("match_predictions")
        .upsert(match_prediction_payload)
        .execute()
    )

    (
        supabase
        .table("match_score_probabilities")
        .delete()
        .eq("match_id", prediction["match_id"])
        .execute()
    )

    (
        supabase
        .table("match_score_probabilities")
        .insert(prediction["score_probabilities"])
        .execute()
    )


def main():
    ratings = load_latest_elo()
    matches = load_matches()

    if not ratings:
        raise ValueError("No Elo ratings found. Make sure latest_team_elo has data.")

    real_matches = [
        match for match in matches
        if is_real_fixture(match)
    ]

    print(f"Loaded {len(ratings)} Elo ratings")
    print(f"Loaded {len(real_matches)} real fixtures")

    for match in real_matches:
        prediction = predict_match(match, ratings)
        save_prediction(prediction)

        print(
            f"{prediction['home_team']} vs {prediction['away_team']} "
            f"→ {prediction['predicted_score']} "
            f"({prediction['home_win_prob']}% / "
            f"{prediction['draw_prob']}% / "
            f"{prediction['away_win_prob']}%)"
        )

    print("Predictions generated successfully.")

    missing_elo_teams = [
    team
    for team in set(
        [m["home_team"] for m in matches] +
        [m["away_team"] for m in matches]
    )
    if canonical_team_name(team) not in ratings
    and "Match" not in team
    and "Group" not in team
    ]

    print("Missing Elo teams:", missing_elo_teams)


if __name__ == "__main__":
    main()