import pandas as pd
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

df = pd.read_csv("data/results.csv")

df = df.rename(columns={
    "date": "match_date"
})

# Clean dates
df["match_date"] = pd.to_datetime(df["match_date"]).dt.date.astype(str)

# Clean score columns so Supabase receives integers, not "0.0"
df["home_score"] = pd.to_numeric(df["home_score"], errors="coerce").fillna(0).astype(int)
df["away_score"] = pd.to_numeric(df["away_score"], errors="coerce").fillna(0).astype(int)

# Clean neutral column
if "neutral" in df.columns:
    df["neutral"] = df["neutral"].fillna(False).astype(bool)

# Keep only columns that exist in your Supabase table
columns = [
    "match_date",
    "home_team",
    "away_team",
    "home_score",
    "away_score",
    "tournament",
    "city",
    "country",
    "neutral"
]

df = df[columns]

records = df.to_dict("records")

batch_size = 1000

for i in range(0, len(records), batch_size):
    batch = records[i:i + batch_size]

    supabase.table("historical_matches").insert(batch).execute()

    print(f"Inserted rows {i} to {i + len(batch)}")

print("Historical matches uploaded")