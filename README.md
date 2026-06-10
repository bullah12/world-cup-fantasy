# Fantasy World Cup 2026

A Supabase-backed fantasy prediction app for the 2026 World Cup.

## Run

Open `index.html` in a browser, or serve the folder with:

```powershell
python -m http.server 5173
```

Then visit `http://localhost:5173`.

## Features

- Create a player with a username and display name; the player ID is the same as the username.
- Duplicate usernames are blocked case-insensitively.
- Select an existing player or create a new one from the header player menu.
- Predict match scores until the configurable lock window before kick-off.
- Next-match summary plus a day-by-day match selector from 1 June 2026 through 31 August 2026.
- Predictions autosave after both score boxes are filled.
- Players, predictions, results, matches, and settings are stored in Supabase for shared multi-device use.
- Match days show fixtures even after results have been entered; prediction editing is controlled by the lock window.
- Leaderboard with total points, correct predictions, and five-match form indicators.
- Per-player prediction history with a player dropdown and total points summary.
- Results admin panel to enter final scores and recalculate standings.
- Supabase Auth-protected admin tab for results, scoring parameters, and deleting users.

## Editing Matches And Points

The app is deliberately parameterised in `app.js`.

- `DEFAULT_CONFIG.lockMinutesBeforeKickoff` controls the prediction cutoff.
- `DEFAULT_CONFIG.points` controls the scoring system.
- Exact score is treated as a fixed score and does not stack with other scoring bonuses.
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` control the shared database connection.
- `MATCHES` controls fixtures, kick-off times, venues, and labels.
- `TEAM_FLAG_CODES` maps team names to real SVG flags from `flagcdn.com`.

Kick-off values use ISO strings with timezone offsets. The current schedule uses Eastern Time (`-04:00`) from the Kaggle dataset's `time_et` column, for example:

```js
kickoff: "2026-06-11T15:00:00-04:00"
```

## Fixture Source

The seeded fixtures use the full 104-match CSV schedule downloaded with `kagglehub` on 8 June 2026:

- Kaggle dataset: `mjmotebaheri/world-cup-2026-match-schedule-data-csv-json-ics`
- CSV file: `world-cup-2026-schedule.csv`

## ESPN Score Sync

`workers/espn-score-sync.js` is a Cloudflare Worker that polls ESPN's public FIFA World Cup scoreboard and upserts changed scores into the Supabase `results` table. Supabase realtime then refreshes the app and leaderboard.

This is intentionally server-side because it uses the Supabase service role key. Never put `SUPABASE_SERVICE_ROLE_KEY` in `app.js` or any browser code.

Setup:

```powershell
Copy-Item wrangler.score-sync.toml.example wrangler.score-sync.toml
wrangler secret put SUPABASE_URL --config wrangler.score-sync.toml
wrangler secret put SUPABASE_SERVICE_ROLE_KEY --config wrangler.score-sync.toml
wrangler secret put SCORE_SYNC_TOKEN --config wrangler.score-sync.toml
wrangler deploy --config wrangler.score-sync.toml
```

The sample cron runs every minute, but the Worker exits early unless a match is inside the live score sync window. By default it only polls ESPN from 5 minutes before kick-off until 150 minutes after kick-off.

```toml
[triggers]
crons = ["* * * * *"]
```

Optional Worker variables can adjust that window:

```toml
[vars]
SCORE_SYNC_START_MINUTES_BEFORE = "5"
SCORE_SYNC_STOP_MINUTES_AFTER = "150"
```

You can also trigger it manually:

```powershell
Invoke-RestMethod "https://your-worker.workers.dev/sync-scores" -Headers @{ Authorization = "Bearer YOUR_SCORE_SYNC_TOKEN" }
```

Keep the admin results page as a fallback. ESPN is convenient and free to poll, but it is not an official guaranteed API contract for this app.
