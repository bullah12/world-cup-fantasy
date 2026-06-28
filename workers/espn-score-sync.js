const ESPN_SCOREBOARD_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";
const DEFAULT_SYNC_START_MINUTES_BEFORE = 5;
const DEFAULT_SYNC_STOP_MINUTES_AFTER = 210;

const TEAM_ALIASES = {
  "bosnia herzegovina": "bosnia and herzegovina",
  "bosnia and herzegovina": "bosnia and herzegovina",
  "cote divoire": "cote d ivoire",
  "cote d ivoire": "cote d ivoire",
  "ivory coast": "cote d ivoire",
  "czech republic": "czechia",
  czechia: "czechia",
  "korea republic": "korea republic",
  "south korea": "korea republic",
  "united states": "united states",
  "united states of america": "united states",
  usa: "united states",
  usmnt: "united states",
  turkey: "turkiye",
  turkiye: "turkiye",
  "dr congo": "congo dr",
  "congo dr": "congo dr",
  "democratic republic of congo": "congo dr",
  "democratic republic congo": "congo dr",
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
    if (!["/sync-scores", "/espn-teams", "/mapping-check"].includes(url.pathname)) {
      return json({ ok: false, error: "Not found" }, 404);
    }

    const unauthorized = checkAuthorization(request, env);
    if (unauthorized) return unauthorized;

    if (url.pathname === "/espn-teams") {
      try {
        const result = await getEspnTeams(env);
        return json({ ok: true, ...result });
      } catch (error) {
        return json({ ok: false, error: error.message }, 500);
      }
    }

    if (url.pathname === "/mapping-check") {
      try {
        const result = await getMappingCheck(env);
        return json({ ok: true, ...result });
      } catch (error) {
        return json({ ok: false, error: error.message }, 500);
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

function checkAuthorization(request, env) {
  const authHeader = request.headers.get("authorization") || "";
  if (!env.SCORE_SYNC_TOKEN) return null;

  const expected = `Bearer ${env.SCORE_SYNC_TOKEN}`;
  if (authHeader === expected) return null;

  return json({ ok: false, error: "Unauthorized" }, 401);
}

async function syncScores(env) {
  assertEnv(env, "SUPABASE_URL");
  assertEnv(env, "SUPABASE_SERVICE_ROLE_KEY");

  const matches = await fetchAllMatches(env);
  const activeMatches = getActiveSyncMatches(matches, env);
  const checkedDates = getScoreboardDateKeys(activeMatches);
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
      `/rest/v1/results?match_id=eq.${encodeURIComponent(update.match_id)}&select=match_id,home_score,away_score,penalty_winner`,
    );
    const existing = current[0];
    if (
      existing &&
      Number(existing.home_score) === update.home_score &&
      Number(existing.away_score) === update.away_score &&
      (existing.penalty_winner || "") === (update.penalty_winner || "")
    ) {
      continue;
    }

    await upsertResult(env, update);
    changed.push(update);
  }

  return {
    skipped: false,
    checkedMatches: matches.length,
    activeMatches: activeMatches.length,
    checkedDates,
    espnEvents: events.length,
    mappedEvents: updates.length,
    changedResults: changed.length,
    changed,
  };
}

async function getEspnTeams(env) {
  const matches = await fetchAllMatches(env);
  const checkedDates = getEspnDateKeysForMatches(matches);
  const scoreboards = await Promise.all(
    checkedDates.map((date) => fetchEspnScoreboard(date)),
  );
  const events = scoreboards.flatMap((scoreboard) => scoreboard.events || []);
  const teamMap = new Map();

  events.forEach((event) => {
    const competition = event.competitions?.[0];
    (competition?.competitors || []).forEach((competitor) => {
      const team = competitor.team || {};
      if (!team.id) return;
      teamMap.set(team.id, {
        espnTeamId: team.id,
        abbreviation: team.abbreviation || "",
        displayName: team.displayName || "",
        shortDisplayName: team.shortDisplayName || "",
        name: team.name || "",
        location: team.location || "",
        normalizedDisplayName: normalizeTeam(team.displayName || team.name),
      });
    });
  });

  return {
    checkedDates,
    eventCount: events.length,
    teams: [...teamMap.values()].sort((a, b) =>
      a.displayName.localeCompare(b.displayName),
    ),
  };
}

async function getMappingCheck(env) {
  const matches = await fetchAllMatches(env);
  const checkedDates = getEspnDateKeysForMatches(matches);
  const scoreboards = await Promise.all(
    checkedDates.map((date) => fetchEspnScoreboard(date)),
  );
  const events = scoreboards.flatMap((scoreboard) => scoreboard.events || []);
  const mappings = events.map((event) => {
    const competition = event.competitions?.[0];
    const competitors = competition?.competitors || [];
    const home = competitors.find((team) => team.homeAway === "home");
    const away = competitors.find((team) => team.homeAway === "away");
    const match =
      home && away
        ? findMatchingMatch(
            matches,
            getEspnTeamNames(home),
            getEspnTeamNames(away),
            competition?.date || event.date,
          )
        : null;

    return {
      espnEventId: event.id,
      espnDate: competition?.date || event.date || "",
      espnHome: home?.team?.displayName || "",
      espnAway: away?.team?.displayName || "",
      matched: Boolean(match),
      supabaseMatchId: match?.id || "",
      supabaseHome: match?.home_team || "",
      supabaseAway: match?.away_team || "",
      supabaseKickoff: match?.kickoff || "",
    };
  });

  return {
    checkedDates,
    eventCount: events.length,
    mappedCount: mappings.filter((mapping) => mapping.matched).length,
    unmappedCount: mappings.filter((mapping) => !mapping.matched).length,
    mappings,
  };
}

async function fetchAllMatches(env) {
  assertEnv(env, "SUPABASE_URL");
  assertEnv(env, "SUPABASE_SERVICE_ROLE_KEY");
  return fetchSupabase(
    env,
    "/rest/v1/matches?select=id,home_team,away_team,kickoff",
  );
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

function getScoreboardDateKeys(activeMatches, now = new Date()) {
  return [
    ...new Set([
      formatEspnDateKey(now),
      ...getEspnDateKeysForMatches(activeMatches),
    ]),
  ];
}

function getEspnDateKeysForMatches(matches) {
  return [
    ...new Set(
      matches.flatMap((match) =>
        getAdjacentEspnDateKeys(new Date(match.kickoff)),
      ),
    ),
  ];
}

function getAdjacentEspnDateKeys(date) {
  if (!Number.isFinite(date.getTime())) return [];
  return [-1, 0, 1].map((offset) => {
    const adjacent = new Date(date);
    adjacent.setUTCDate(adjacent.getUTCDate() + offset);
    return formatEspnDateKey(adjacent);
  });
}

function formatEspnDateKey(date) {
  return date.toISOString().slice(0, 10).replaceAll("-", "");
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

  const mapping = findMatchMapping(
    matches,
    getEspnTeamNames(home),
    getEspnTeamNames(away),
    competition?.date || event.date,
  );
  if (!mapping) return null;

  const { match, reversed } = mapping;
  const penaltyWinner = getPenaltyWinner(
    home,
    away,
    homeScore,
    awayScore,
    state,
  );

  return {
    match_id: match.id,
    home_score: reversed ? awayScore : homeScore,
    away_score: reversed ? homeScore : awayScore,
    penalty_winner:
      penaltyWinner === "HOME"
        ? reversed
          ? "AWAY"
          : "HOME"
        : penaltyWinner === "AWAY"
          ? reversed
            ? "HOME"
            : "AWAY"
          : null,
    updated_at: new Date().toISOString(),
    espn_event_id: event.id,
    espn_status: competition?.status?.type?.description || "",
  };
}

function findMatchingMatch(matches, homeNames, awayNames, espnDate) {
  return findMatchMapping(matches, homeNames, awayNames, espnDate)?.match || null;
}

function findMatchMapping(matches, homeNames, awayNames, espnDate) {
  const kickoff = espnDate ? new Date(espnDate).getTime() : null;

  for (const match of matches) {
    const homeMatches = homeNames.some((name) => sameTeam(name, match.home_team));
    const awayMatches = awayNames.some((name) => sameTeam(name, match.away_team));
    const reversedHomeMatches = homeNames.some((name) =>
      sameTeam(name, match.away_team),
    );
    const reversedAwayMatches = awayNames.some((name) =>
      sameTeam(name, match.home_team),
    );
    const direct = homeMatches && awayMatches;
    const reversed = reversedHomeMatches && reversedAwayMatches;
    if (!direct && !reversed) continue;
    if (!Number.isFinite(kickoff)) return { match, reversed: !direct && reversed };

    const localKickoff = new Date(match.kickoff).getTime();
    const diffHours = Math.abs(localKickoff - kickoff) / 36e5;
    if (diffHours <= 36) return { match, reversed: !direct && reversed };
  }

  return null;
}

function getPenaltyWinner(home, away, homeScore, awayScore, state) {
  if (state !== "post" || homeScore !== awayScore) return "";

  const homeShootoutScore = Number(home.shootoutScore);
  const awayShootoutScore = Number(away.shootoutScore);
  if (
    Number.isFinite(homeShootoutScore) &&
    Number.isFinite(awayShootoutScore) &&
    homeShootoutScore !== awayShootoutScore
  ) {
    return homeShootoutScore > awayShootoutScore ? "HOME" : "AWAY";
  }

  if (home.winner === true && away.winner !== true) return "HOME";
  if (away.winner === true && home.winner !== true) return "AWAY";
  return "";
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
  const key = fixCommonTeamEncoding(String(value || ""))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
  return TEAM_ALIASES[key] || key;
}

function fixCommonTeamEncoding(value) {
  return value
    .replace(/T.{1,16}rkiye/gi, "Turkiye")
    .replace(/C.{1,32}Ivoire/gi, "Cote d Ivoire")
    .replace(/Cura.{1,12}ao/gi, "Curacao");
}

function fixMojibake(value) {
  return value
    .replace(/TÃƒÂ¼rkiye|TÃ¼rkiye|TÃ¼rkiye/g, "Turkiye")
    .replace(/CÃƒÂ´te dÃ¢Â€Â™Ivoire|CÃ´te dâ€™Ivoire/g, "Cote d Ivoire")
    .replace(/CuraÃƒÂ§ao|CuraÃ§ao/g, "Curacao");
}

async function upsertResult(env, result) {
  const payload = {
    match_id: result.match_id,
    home_score: result.home_score,
    away_score: result.away_score,
    penalty_winner: result.penalty_winner,
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
