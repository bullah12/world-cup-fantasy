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

Kick-off values use ISO strings with timezone offsets, for example:

```js
kickoff: "2026-06-11T13:00:00-06:00"
```

## Fixture Sources Checked

The seeded fixtures use a small editable starter set based on public schedule checks made on 8 June 2026:

- FIFA says the tournament begins on 11 June 2026 and ends with the final on 19 July 2026.
- FIFA confirmed Mexico vs South Africa as the opening match in Mexico City.
- Recent fixture coverage lists England in Group L with Croatia, Ghana, and Panama.

For production use, replace or expand `MATCHES` from FIFA's official schedule page.

Useful source links:

- FIFA schedule page: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums
- FIFA opening ceremony release: https://inside.fifa.com/organisation/media-releases/world-cup-2026-opening-ceremony-mexico-city
- FIFA updated schedule release: https://vod.fifa.com/media-releases/updated-world-cup-2026-match-schedule-venues-kick-off-times-104-matches
- Sky Sports Group L guide: https://www.skysports.com/football/news/12098/13543108/world-cup-2026-group-l-guide-fixtures-schedule-standings-and-odds-for-england-croatia-ghana-and-panama
