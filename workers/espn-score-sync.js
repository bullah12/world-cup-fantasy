const ESPN_SCOREBOARD_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";
const DEFAULT_SYNC_START_MINUTES_BEFORE = 5;
const DEFAULT_SYNC_STOP_MINUTES_AFTER = 150;

const TEAM_ALIASES = {
  "cote divoire": "cote divoire",
  "cote d ivoire": "cote divoire",
  "ivory coast": "cote divoire",
  "czech republic": "czechia",
  "korea republic": "south korea",
  "south korea": "south korea",
  "united states": "united states",
  usa: "united states",
  usmnt: "united states",
  turkey: "turkiye",
  turkiye: "turkiye",
  "dr congo": "congo dr",
  "congo dr": "congo dr",
  "democratic republic of congo": "congo dr",
  curacao: "curacao",
  "cape verde": "cabo verde",
  "cabo verde": "cabo verde",
};

export default {
  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(syncScores(env));
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/sync-scores") {
      return json({ ok: false, error: "Not found" }, 404);
    }

    const authHeader = request.headers.get("authorization") || "";
    if (env.SCORE_SYNC_TOKEN) {
      const expected = `Bearer ${env.SCORE_SYNC_TOKEN}`;
      if (authHeader !== expected) {
        return json({ ok: false, error: "Unauthorized" }, 401);
      }
    }

    try {
      const result = await syncScores(env);
      return json({ ok: true, ...result });
    } catch (error) {
      return json({ ok: false, error: error.message }, 500);
    }
  },
};

async function syncScores(env) {
  assertEnv(env, "SUPABASE_URL");
  assertEnv(env, "SUPABASE_SERVICE_ROLE_KEY");

  const matches = await fetchSupabase(
    env,
    "/rest/v1/matches?select=id,home_team,away_team,kickoff",
  );
  const activeMatches = getActiveSyncMatches(matches, env);

  if (activeMatches.length === 0) {
    return {
      skipped: true,
      reason: "No matches are inside the live score sync window.",
      checkedMatches: matches.length,
      checkedDates: [],
      espnEvents: 0,
      mappedEvents: 0,
      changedResults: 0,
      changed: [],
    };
  }

  const checkedDates = getEspnDateKeysForMatches(activeMatches);
  const scoreboards = await Promise.all(
    checkedDates.map((date) => fetchEspnScoreboard(date)),
  );

  const events = scoreboards.flatMap((scoreboard) => scoreboard.events || []);
  const updates = events
    .map((event) => mapEspnEventToResult(event, matches))
    .filter(Boolean);

  const changed = [];
  for (const update of updates) {
    const current = await fetchSupabase(
      env,
      `/rest/v1/results?match_id=eq.${encodeURIComponent(update.match_id)}&select=match_id,home_score,away_score`,
    );
    const existing = current[0];
    if (
      existing &&
      Number(existing.home_score) === update.home_score &&
      Number(existing.away_score) === update.away_score
    ) {
      continue;
    }

    await upsertResult(env, update);
    changed.push(update);
  }

  return {
    skipped: false,
    activeMatches: activeMatches.length,
    checkedDates,
    espnEvents: events.length,
    mappedEvents: updates.length,
    changedResults: changed.length,
    changed,
  };
}

function getActiveSyncMatches(matches, env, now = new Date()) {
  const startBefore =
    Number(env.SCORE_SYNC_START_MINUTES_BEFORE) ||
    DEFAULT_SYNC_START_MINUTES_BEFORE;
  const stopAfter =
    Number(env.SCORE_SYNC_STOP_MINUTES_AFTER) ||
    DEFAULT_SYNC_STOP_MINUTES_AFTER;
  const nowMs = now.getTime();

  return matches.filter((match) => {
    const kickoff = new Date(match.kickoff).getTime();
    if (!Number.isFinite(kickoff)) return false;
    const start = kickoff - startBefore * 60 * 1000;
    const stop = kickoff + stopAfter * 60 * 1000;
    return nowMs >= start && nowMs <= stop;
  });
}

function getEspnDateKeysForMatches(matches) {
  return [
    ...new Set(
      matches.map((match) =>
        new Date(match.kickoff).toISOString().slice(0, 10).replaceAll("-", ""),
      ),
    ),
  ];
}

async function fetchEspnScoreboard(dateKey) {
  const url = new URL(ESPN_SCOREBOARD_URL);
  url.searchParams.set("dates", dateKey);
  const response = await fetch(url.toString(), {
    headers: { accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`ESPN request failed: ${response.status}`);
  }
  return response.json();
}

function mapEspnEventToResult(event, matches) {
  const competition = event.competitions?.[0];
  const competitors = competition?.competitors || [];
  const home = competitors.find((team) => team.homeAway === "home");
  const away = competitors.find((team) => team.homeAway === "away");
  const state = competition?.status?.type?.state || event.status?.type?.state;

  if (!home || !away || state === "pre") return null;
  if (home.score === undefined || away.score === undefined) return null;

  const homeScore = Number(home.score);
  const awayScore = Number(away.score);
  if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore)) return null;

  const match = findMatchingMatch(
    matches,
    getEspnTeamNames(home),
    getEspnTeamNames(away),
    competition?.date || event.date,
  );
  if (!match) return null;

  return {
    match_id: match.id,
    home_score: homeScore,
    away_score: awayScore,
    updated_at: new Date().toISOString(),
    espn_event_id: event.id,
    espn_status: competition?.status?.type?.description || "",
  };
}

function findMatchingMatch(matches, homeNames, awayNames, espnDate) {
  const kickoff = espnDate ? new Date(espnDate).getTime() : null;

  return matches.find((match) => {
    const homeMatches = homeNames.some((name) => sameTeam(name, match.home_team));
    const awayMatches = awayNames.some((name) => sameTeam(name, match.away_team));
    const reversedHomeMatches = homeNames.some((name) =>
      sameTeam(name, match.away_team),
    );
    const reversedAwayMatches = awayNames.some((name) =>
      sameTeam(name, match.home_team),
    );
    const teamsMatch =
      (homeMatches && awayMatches) || (reversedHomeMatches && reversedAwayMatches);
    if (!teamsMatch) return false;
    if (!Number.isFinite(kickoff)) return true;

    const localKickoff = new Date(match.kickoff).getTime();
    const diffHours = Math.abs(localKickoff - kickoff) / 36e5;
    return diffHours <= 12;
  });
}

function getEspnTeamNames(competitor) {
  const team = competitor.team || {};
  return [
    team.displayName,
    team.shortDisplayName,
    team.name,
    team.location,
    team.abbreviation,
  ].filter(Boolean);
}

function sameTeam(left, right) {
  return normalizeTeam(left) === normalizeTeam(right);
}

function normalizeTeam(value) {
  const key = String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
  return TEAM_ALIASES[key] || key;
}

async function upsertResult(env, result) {
  const payload = {
    match_id: result.match_id,
    home_score: result.home_score,
    away_score: result.away_score,
    updated_at: result.updated_at,
  };

  await fetchSupabase(env, "/rest/v1/results?on_conflict=match_id", {
    method: "POST",
    headers: {
      "Prefer": "resolution=merge-duplicates",
    },
    body: JSON.stringify(payload),
  });
}

async function fetchSupabase(env, path, options = {}) {
  const response = await fetch(`${env.SUPABASE_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "content-type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${body}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

function assertEnv(env, key) {
  if (!env[key]) throw new Error(`Missing ${key}`);
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: { "content-type": "application/json" },
  });
}
