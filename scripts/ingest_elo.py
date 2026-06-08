import os
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_KEY
)

df = pd.read_csv("data/eloratings.csv")

df = df.rename(columns={
    "date": "rating_date",
    "team": "team_name",
    "rating": "elo_rating"
})

required = ["rating_date", "team_name", "elo_rating"]
missing = [col for col in required if col not in df.columns]

if missing:
    raise ValueError(f"Missing required columns: {missing}")

df = df[["rating_date", "team_name", "elo_rating"]]

df["rating_date"] = pd.to_datetime(
    df["rating_date"],
    format="mixed",
    errors="coerce"
).dt.date.astype(str)
df["team_name"] = df["team_name"].astype(str).str.strip()
df["elo_rating"] = pd.to_numeric(df["elo_rating"], errors="coerce")

df = df.dropna(subset=["rating_date", "team_name", "elo_rating"])

df["source"] = "eloratings_csv"

records = df.to_dict("records")

batch_size = 1000

for i in range(0, len(records), batch_size):
    batch = records[i:i + batch_size]

    (
        supabase
        .table("team_elo_history")
        .upsert(
            batch,
            on_conflict="rating_date,team_name"
        )
        .execute()
    )

    print(f"Uploaded rows {i} to {i + len(batch)}")

print("Elo data uploaded to Supabase.")