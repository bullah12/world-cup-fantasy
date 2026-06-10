const DEFAULT_CONFIG = {
  lockMinutesBeforeKickoff: 60,
  points: {
    exactScore: 5,
    correctOutcome: 2,
    correctTeamGoalsBonus: 1,
  },
};

const DEFAULT_LEAGUES = {
  "brum-family": "Brum Family",
  summer2k: "summer2k",
};
const DEFAULT_LEAGUE_ID = "brum-family";
const WORLDWIDE_SCOPE = "worldwide";
const SCORE_SAVE_DEBOUNCE_MS = 1000;
const HISTORY_MIN_SAVE_INTERVAL_MS = 1000;
const BUILT_IN_MODEL_OPTIONS = [
  { id: "elo-poisson-v1", label: "Elo Poisson" },
  { id: "favourite-lean", label: "Favourite lean" },
  { id: "upset-lean", label: "Upset lean" },
];

const SUPABASE_URL = "https://lxawkhvkhbcdpermvqbc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4YXdraHZraGJjZHBlcm12cWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NzMxMjIsImV4cCI6MjA5NjQ0OTEyMn0.nr4Xn2Phw8XNXJai99WUpjJgopL7rIxa1oBEo5ZWmJw";
const supabaseClient = window.supabase?.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);

const MATCHES = [
  {
    id: "M001",
    group: "Group A",
    home: "Mexico",
    away: "South Africa",
    kickoff: "2026-06-11T15:00:00-04:00",
    venue: "Estadio Azteca, Mexico City, Mexico",
  },
  {
    id: "M002",
    group: "Group A",
    home: "Korea Republic",
    away: "Czechia",
    kickoff: "2026-06-11T22:00:00-04:00",
    venue: "Estadio Akron, Guadalajara, Mexico",
  },
  {
    id: "M003",
    group: "Group B",
    home: "Canada",
    away: "Bosnia and Herzegovina",
    kickoff: "2026-06-12T15:00:00-04:00",
    venue: "BMO Field, Toronto, Canada",
  },
  {
    id: "M004",
    group: "Group D",
    home: "United States",
    away: "Paraguay",
    kickoff: "2026-06-12T21:00:00-04:00",
    venue: "SoFi Stadium, Los Angeles",
  },
  {
    id: "M005",
    group: "Group C",
    home: "Haiti",
    away: "Scotland",
    kickoff: "2026-06-13T21:00:00-04:00",
    venue: "Gillette Stadium, Boston",
  },
  {
    id: "M006",
    group: "Group D",
    home: "Australia",
    away: "Türkiye",
    kickoff: "2026-06-13T00:00:00-04:00",
    venue: "BC Place, Vancouver, Canada",
  },
  {
    id: "M007",
    group: "Group C",
    home: "Brazil",
    away: "Morocco",
    kickoff: "2026-06-13T18:00:00-04:00",
    venue: "MetLife Stadium, New York/New Jersey",
  },
  {
    id: "M008",
    group: "Group B",
    home: "Qatar",
    away: "Switzerland",
    kickoff: "2026-06-13T15:00:00-04:00",
    venue: "Levi's Stadium, San Francisco Bay Area",
  },
  {
    id: "M009",
    group: "Group E",
    home: "Côte d’Ivoire",
    away: "Ecuador",
    kickoff: "2026-06-14T19:00:00-04:00",
    venue: "Lincoln Financial Field, Philadelphia",
  },
  {
    id: "M010",
    group: "Group E",
    home: "Germany",
    away: "Curaçao",
    kickoff: "2026-06-14T13:00:00-04:00",
    venue: "NRG Stadium, Houston",
  },
  {
    id: "M011",
    group: "Group F",
    home: "Netherlands",
    away: "Japan",
    kickoff: "2026-06-14T16:00:00-04:00",
    venue: "AT&T Stadium, Dallas",
  },
  {
    id: "M012",
    group: "Group F",
    home: "Sweden",
    away: "Tunisia",
    kickoff: "2026-06-14T22:00:00-04:00",
    venue: "Estadio BBVA, Monterrey, Mexico",
  },
  {
    id: "M013",
    group: "Group H",
    home: "Saudi Arabia",
    away: "Uruguay",
    kickoff: "2026-06-15T18:00:00-04:00",
    venue: "Hard Rock Stadium, Miami",
  },
  {
    id: "M014",
    group: "Group H",
    home: "Spain",
    away: "Cabo Verde",
    kickoff: "2026-06-15T12:00:00-04:00",
    venue: "Mercedes-Benz Stadium, Atlanta",
  },
  {
    id: "M015",
    group: "Group G",
    home: "Iran",
    away: "New Zealand",
    kickoff: "2026-06-15T21:00:00-04:00",
    venue: "SoFi Stadium, Los Angeles",
  },
  {
    id: "M016",
    group: "Group G",
    home: "Belgium",
    away: "Egypt",
    kickoff: "2026-06-15T15:00:00-04:00",
    venue: "Lumen Field, Seattle",
  },
  {
    id: "M017",
    group: "Group I",
    home: "France",
    away: "Senegal",
    kickoff: "2026-06-16T15:00:00-04:00",
    venue: "MetLife Stadium, New York/New Jersey",
  },
  {
    id: "M018",
    group: "Group I",
    home: "Iraq",
    away: "Norway",
    kickoff: "2026-06-16T18:00:00-04:00",
    venue: "Gillette Stadium, Boston",
  },
  {
    id: "M019",
    group: "Group J",
    home: "Argentina",
    away: "Algeria",
    kickoff: "2026-06-16T21:00:00-04:00",
    venue: "Arrowhead Stadium, Kansas City",
  },
  {
    id: "M020",
    group: "Group J",
    home: "Austria",
    away: "Jordan",
    kickoff: "2026-06-16T00:00:00-04:00",
    venue: "Levi's Stadium, San Francisco Bay Area",
  },
  {
    id: "M021",
    group: "Group L",
    home: "Ghana",
    away: "Panama",
    kickoff: "2026-06-17T19:00:00-04:00",
    venue: "BMO Field, Toronto, Canada",
  },
  {
    id: "M022",
    group: "Group L",
    home: "England",
    away: "Croatia",
    kickoff: "2026-06-17T16:00:00-04:00",
    venue: "AT&T Stadium, Dallas",
  },
  {
    id: "M023",
    group: "Group K",
    home: "Portugal",
    away: "Congo DR",
    kickoff: "2026-06-17T13:00:00-04:00",
    venue: "NRG Stadium, Houston",
  },
  {
    id: "M024",
    group: "Group K",
    home: "Uzbekistan",
    away: "Colombia",
    kickoff: "2026-06-17T22:00:00-04:00",
    venue: "Estadio Azteca, Mexico City, Mexico",
  },
  {
    id: "M025",
    group: "Group A",
    home: "Czechia",
    away: "South Africa",
    kickoff: "2026-06-18T12:00:00-04:00",
    venue: "Mercedes-Benz Stadium, Atlanta",
  },
  {
    id: "M026",
    group: "Group B",
    home: "Switzerland",
    away: "Bosnia and Herzegovina",
    kickoff: "2026-06-18T15:00:00-04:00",
    venue: "SoFi Stadium, Los Angeles",
  },
  {
    id: "M027",
    group: "Group B",
    home: "Canada",
    away: "Qatar",
    kickoff: "2026-06-18T18:00:00-04:00",
    venue: "BC Place, Vancouver, Canada",
  },
  {
    id: "M028",
    group: "Group A",
    home: "Mexico",
    away: "Korea Republic",
    kickoff: "2026-06-18T21:00:00-04:00",
    venue: "Estadio Akron, Guadalajara, Mexico",
  },
  {
    id: "M029",
    group: "Group C",
    home: "Brazil",
    away: "Haiti",
    kickoff: "2026-06-19T21:00:00-04:00",
    venue: "Lincoln Financial Field, Philadelphia",
  },
  {
    id: "M030",
    group: "Group C",
    home: "Scotland",
    away: "Morocco",
    kickoff: "2026-06-19T18:00:00-04:00",
    venue: "Gillette Stadium, Boston",
  },
  {
    id: "M031",
    group: "Group D",
    home: "Türkiye",
    away: "Paraguay",
    kickoff: "2026-06-19T23:00:00-04:00",
    venue: "Levi's Stadium, San Francisco Bay Area",
  },
  {
    id: "M032",
    group: "Group D",
    home: "United States",
    away: "Australia",
    kickoff: "2026-06-19T15:00:00-04:00",
    venue: "Lumen Field, Seattle",
  },
  {
    id: "M033",
    group: "Group E",
    home: "Germany",
    away: "Côte d’Ivoire",
    kickoff: "2026-06-20T16:00:00-04:00",
    venue: "BMO Field, Toronto, Canada",
  },
  {
    id: "M034",
    group: "Group E",
    home: "Ecuador",
    away: "Curaçao",
    kickoff: "2026-06-20T20:00:00-04:00",
    venue: "Arrowhead Stadium, Kansas City",
  },
  {
    id: "M035",
    group: "Group F",
    home: "Netherlands",
    away: "Sweden",
    kickoff: "2026-06-20T13:00:00-04:00",
    venue: "NRG Stadium, Houston",
  },
  {
    id: "M036",
    group: "Group F",
    home: "Tunisia",
    away: "Japan",
    kickoff: "2026-06-20T00:00:00-04:00",
    venue: "Estadio BBVA, Monterrey, Mexico",
  },
  {
    id: "M037",
    group: "Group H",
    home: "Uruguay",
    away: "Cabo Verde",
    kickoff: "2026-06-21T18:00:00-04:00",
    venue: "Hard Rock Stadium, Miami",
  },
  {
    id: "M038",
    group: "Group H",
    home: "Spain",
    away: "Saudi Arabia",
    kickoff: "2026-06-21T12:00:00-04:00",
    venue: "Mercedes-Benz Stadium, Atlanta",
  },
  {
    id: "M039",
    group: "Group G",
    home: "Belgium",
    away: "Iran",
    kickoff: "2026-06-21T15:00:00-04:00",
    venue: "SoFi Stadium, Los Angeles",
  },
  {
    id: "M040",
    group: "Group G",
    home: "New Zealand",
    away: "Egypt",
    kickoff: "2026-06-21T21:00:00-04:00",
    venue: "BC Place, Vancouver, Canada",
  },
  {
    id: "M041",
    group: "Group I",
    home: "Norway",
    away: "Senegal",
    kickoff: "2026-06-22T20:00:00-04:00",
    venue: "MetLife Stadium, New York/New Jersey",
  },
  {
    id: "M042",
    group: "Group I",
    home: "France",
    away: "Iraq",
    kickoff: "2026-06-22T17:00:00-04:00",
    venue: "Lincoln Financial Field, Philadelphia",
  },
  {
    id: "M043",
    group: "Group J",
    home: "Argentina",
    away: "Austria",
    kickoff: "2026-06-22T13:00:00-04:00",
    venue: "AT&T Stadium, Dallas",
  },
  {
    id: "M044",
    group: "Group J",
    home: "Jordan",
    away: "Algeria",
    kickoff: "2026-06-22T23:00:00-04:00",
    venue: "Levi's Stadium, San Francisco Bay Area",
  },
  {
    id: "M045",
    group: "Group L",
    home: "England",
    away: "Ghana",
    kickoff: "2026-06-23T16:00:00-04:00",
    venue: "Gillette Stadium, Boston",
  },
  {
    id: "M046",
    group: "Group L",
    home: "Panama",
    away: "Croatia",
    kickoff: "2026-06-23T19:00:00-04:00",
    venue: "BMO Field, Toronto, Canada",
  },
  {
    id: "M047",
    group: "Group K",
    home: "Portugal",
    away: "Uzbekistan",
    kickoff: "2026-06-23T13:00:00-04:00",
    venue: "NRG Stadium, Houston",
  },
  {
    id: "M048",
    group: "Group K",
    home: "Colombia",
    away: "Congo DR",
    kickoff: "2026-06-23T22:00:00-04:00",
    venue: "Estadio Akron, Guadalajara, Mexico",
  },
  {
    id: "M049",
    group: "Group C",
    home: "Scotland",
    away: "Brazil",
    kickoff: "2026-06-24T18:00:00-04:00",
    venue: "Hard Rock Stadium, Miami",
  },
  {
    id: "M050",
    group: "Group C",
    home: "Morocco",
    away: "Haiti",
    kickoff: "2026-06-24T18:00:00-04:00",
    venue: "Mercedes-Benz Stadium, Atlanta",
  },
  {
    id: "M051",
    group: "Group B",
    home: "Switzerland",
    away: "Canada",
    kickoff: "2026-06-24T15:00:00-04:00",
    venue: "BC Place, Vancouver, Canada",
  },
  {
    id: "M052",
    group: "Group B",
    home: "Bosnia and Herzegovina",
    away: "Qatar",
    kickoff: "2026-06-24T15:00:00-04:00",
    venue: "Lumen Field, Seattle",
  },
  {
    id: "M053",
    group: "Group A",
    home: "Czechia",
    away: "Mexico",
    kickoff: "2026-06-24T21:00:00-04:00",
    venue: "Estadio Azteca, Mexico City, Mexico",
  },
  {
    id: "M054",
    group: "Group A",
    home: "South Africa",
    away: "Korea Republic",
    kickoff: "2026-06-24T21:00:00-04:00",
    venue: "Estadio BBVA, Monterrey, Mexico",
  },
  {
    id: "M055",
    group: "Group E",
    home: "Curaçao",
    away: "Côte d’Ivoire",
    kickoff: "2026-06-25T16:00:00-04:00",
    venue: "Lincoln Financial Field, Philadelphia",
  },
  {
    id: "M056",
    group: "Group E",
    home: "Ecuador",
    away: "Germany",
    kickoff: "2026-06-25T16:00:00-04:00",
    venue: "MetLife Stadium, New York/New Jersey",
  },
  {
    id: "M057",
    group: "Group F",
    home: "Japan",
    away: "Sweden",
    kickoff: "2026-06-25T19:00:00-04:00",
    venue: "AT&T Stadium, Dallas",
  },
  {
    id: "M058",
    group: "Group F",
    home: "Tunisia",
    away: "Netherlands",
    kickoff: "2026-06-25T19:00:00-04:00",
    venue: "Arrowhead Stadium, Kansas City",
  },
  {
    id: "M059",
    group: "Group D",
    home: "Türkiye",
    away: "United States",
    kickoff: "2026-06-25T22:00:00-04:00",
    venue: "SoFi Stadium, Los Angeles",
  },
  {
    id: "M060",
    group: "Group D",
    home: "Paraguay",
    away: "Australia",
    kickoff: "2026-06-25T22:00:00-04:00",
    venue: "Levi's Stadium, San Francisco Bay Area",
  },
  {
    id: "M061",
    group: "Group I",
    home: "Norway",
    away: "France",
    kickoff: "2026-06-26T15:00:00-04:00",
    venue: "Gillette Stadium, Boston",
  },
  {
    id: "M062",
    group: "Group I",
    home: "Senegal",
    away: "Iraq",
    kickoff: "2026-06-26T15:00:00-04:00",
    venue: "BMO Field, Toronto, Canada",
  },
  {
    id: "M063",
    group: "Group G",
    home: "Egypt",
    away: "Iran",
    kickoff: "2026-06-26T23:00:00-04:00",
    venue: "Lumen Field, Seattle",
  },
  {
    id: "M064",
    group: "Group G",
    home: "New Zealand",
    away: "Belgium",
    kickoff: "2026-06-26T23:00:00-04:00",
    venue: "BC Place, Vancouver, Canada",
  },
  {
    id: "M065",
    group: "Group H",
    home: "Cabo Verde",
    away: "Saudi Arabia",
    kickoff: "2026-06-26T20:00:00-04:00",
    venue: "NRG Stadium, Houston",
  },
  {
    id: "M066",
    group: "Group H",
    home: "Uruguay",
    away: "Spain",
    kickoff: "2026-06-26T20:00:00-04:00",
    venue: "Estadio Akron, Guadalajara, Mexico",
  },
  {
    id: "M067",
    group: "Group L",
    home: "Panama",
    away: "England",
    kickoff: "2026-06-27T17:00:00-04:00",
    venue: "MetLife Stadium, New York/New Jersey",
  },
  {
    id: "M068",
    group: "Group L",
    home: "Croatia",
    away: "Ghana",
    kickoff: "2026-06-27T17:00:00-04:00",
    venue: "Lincoln Financial Field, Philadelphia",
  },
  {
    id: "M069",
    group: "Group J",
    home: "Algeria",
    away: "Austria",
    kickoff: "2026-06-27T22:00:00-04:00",
    venue: "Arrowhead Stadium, Kansas City",
  },
  {
    id: "M070",
    group: "Group J",
    home: "Jordan",
    away: "Argentina",
    kickoff: "2026-06-27T22:00:00-04:00",
    venue: "AT&T Stadium, Dallas",
  },
  {
    id: "M071",
    group: "Group K",
    home: "Colombia",
    away: "Portugal",
    kickoff: "2026-06-27T19:30:00-04:00",
    venue: "Hard Rock Stadium, Miami",
  },
  {
    id: "M072",
    group: "Group K",
    home: "Congo DR",
    away: "Uzbekistan",
    kickoff: "2026-06-27T19:30:00-04:00",
    venue: "Mercedes-Benz Stadium, Atlanta",
  },
  {
    id: "M073",
    group: "Round of 32",
    home: "Group A Runner-up",
    away: "Group B Runner-up",
    kickoff: "2026-06-28T15:00:00-04:00",
    venue: "SoFi Stadium, Los Angeles",
  },
  {
    id: "M074",
    group: "Round of 32",
    home: "Group E Winner",
    away: "Group A/B/C/D/F 3rd Place",
    kickoff: "2026-06-29T16:30:00-04:00",
    venue: "Gillette Stadium, Boston",
  },
  {
    id: "M075",
    group: "Round of 32",
    home: "Group F Winner",
    away: "Group C Runner-up",
    kickoff: "2026-06-29T21:00:00-04:00",
    venue: "Estadio BBVA, Monterrey, Mexico",
  },
  {
    id: "M076",
    group: "Round of 32",
    home: "Group C Winner",
    away: "Group F Runner-up",
    kickoff: "2026-06-29T13:00:00-04:00",
    venue: "NRG Stadium, Houston",
  },
  {
    id: "M077",
    group: "Round of 32",
    home: "Group I Winner",
    away: "Group C/D/F/G/H 3rd Place",
    kickoff: "2026-06-30T17:00:00-04:00",
    venue: "MetLife Stadium, New York/New Jersey",
  },
  {
    id: "M078",
    group: "Round of 32",
    home: "Group E Runner-up",
    away: "Group I Runner-up",
    kickoff: "2026-06-30T13:00:00-04:00",
    venue: "AT&T Stadium, Dallas",
  },
  {
    id: "M079",
    group: "Round of 32",
    home: "Group A Winner",
    away: "Group C/E/F/H/I 3rd Place",
    kickoff: "2026-06-30T21:00:00-04:00",
    venue: "Estadio Azteca, Mexico City, Mexico",
  },
  {
    id: "M080",
    group: "Round of 32",
    home: "Group L Winner",
    away: "Group E/H/I/J/K 3rd Place",
    kickoff: "2026-07-01T12:00:00-04:00",
    venue: "Mercedes-Benz Stadium, Atlanta",
  },
  {
    id: "M081",
    group: "Round of 32",
    home: "Group D Winner",
    away: "Group B/E/F/I/J 3rd Place",
    kickoff: "2026-07-01T20:00:00-04:00",
    venue: "Levi's Stadium, San Francisco Bay Area",
  },
  {
    id: "M082",
    group: "Round of 32",
    home: "Group G Winner",
    away: "Group A/E/H/I/J 3rd Place",
    kickoff: "2026-07-01T16:00:00-04:00",
    venue: "Lumen Field, Seattle",
  },
  {
    id: "M083",
    group: "Round of 32",
    home: "Group K Runner-up",
    away: "Group L Runner-up",
    kickoff: "2026-07-02T19:00:00-04:00",
    venue: "BMO Field, Toronto, Canada",
  },
  {
    id: "M084",
    group: "Round of 32",
    home: "Group H Winner",
    away: "Group J Runner-up",
    kickoff: "2026-07-02T15:00:00-04:00",
    venue: "SoFi Stadium, Los Angeles",
  },
  {
    id: "M085",
    group: "Round of 32",
    home: "Group B Winner",
    away: "Group E/F/G/I/J 3rd Place",
    kickoff: "2026-07-02T23:00:00-04:00",
    venue: "BC Place, Vancouver, Canada",
  },
  {
    id: "M086",
    group: "Round of 32",
    home: "Group J Winner",
    away: "Group H Runner-up",
    kickoff: "2026-07-03T18:00:00-04:00",
    venue: "Hard Rock Stadium, Miami",
  },
  {
    id: "M087",
    group: "Round of 32",
    home: "Group K Winner",
    away: "Group D/E/I/J/L 3rd Place",
    kickoff: "2026-07-03T21:30:00-04:00",
    venue: "Arrowhead Stadium, Kansas City",
  },
  {
    id: "M088",
    group: "Round of 32",
    home: "Group D Runner-up",
    away: "Group G Runner-up",
    kickoff: "2026-07-03T14:00:00-04:00",
    venue: "AT&T Stadium, Dallas",
  },
  {
    id: "M089",
    group: "Round of 16",
    home: "Match 74 Winner",
    away: "Match 77 Winner",
    kickoff: "2026-07-04T17:00:00-04:00",
    venue: "Lincoln Financial Field, Philadelphia",
  },
  {
    id: "M090",
    group: "Round of 16",
    home: "Match 73 Winner",
    away: "Match 75 Winner",
    kickoff: "2026-07-04T13:00:00-04:00",
    venue: "NRG Stadium, Houston",
  },
  {
    id: "M091",
    group: "Round of 16",
    home: "Match 76 Winner",
    away: "Match 78 Winner",
    kickoff: "2026-07-05T16:00:00-04:00",
    venue: "MetLife Stadium, New York/New Jersey",
  },
  {
    id: "M092",
    group: "Round of 16",
    home: "Match 79 Winner",
    away: "Match 80 Winner",
    kickoff: "2026-07-05T20:00:00-04:00",
    venue: "Estadio Azteca, Mexico City, Mexico",
  },
  {
    id: "M093",
    group: "Round of 16",
    home: "Match 83 Winner",
    away: "Match 84 Winner",
    kickoff: "2026-07-06T15:00:00-04:00",
    venue: "AT&T Stadium, Dallas",
  },
  {
    id: "M094",
    group: "Round of 16",
    home: "Match 81 Winner",
    away: "Match 82 Winner",
    kickoff: "2026-07-06T20:00:00-04:00",
    venue: "Lumen Field, Seattle",
  },
  {
    id: "M095",
    group: "Round of 16",
    home: "Match 86 Winner",
    away: "Match 88 Winner",
    kickoff: "2026-07-07T12:00:00-04:00",
    venue: "Mercedes-Benz Stadium, Atlanta",
  },
  {
    id: "M096",
    group: "Round of 16",
    home: "Match 85 Winner",
    away: "Match 87 Winner",
    kickoff: "2026-07-07T16:00:00-04:00",
    venue: "BC Place, Vancouver, Canada",
  },
  {
    id: "M097",
    group: "Quarter-finals",
    home: "Match 89 Winner",
    away: "Match 90 Winner",
    kickoff: "2026-07-09T16:00:00-04:00",
    venue: "Gillette Stadium, Boston",
  },
  {
    id: "M098",
    group: "Quarter-finals",
    home: "Match 93 Winner",
    away: "Match 94 Winner",
    kickoff: "2026-07-10T15:00:00-04:00",
    venue: "SoFi Stadium, Los Angeles",
  },
  {
    id: "M099",
    group: "Quarter-finals",
    home: "Match 91 Winner",
    away: "Match 92 Winner",
    kickoff: "2026-07-11T17:00:00-04:00",
    venue: "Hard Rock Stadium, Miami",
  },
  {
    id: "M100",
    group: "Quarter-finals",
    home: "Match 95 Winner",
    away: "Match 96 Winner",
    kickoff: "2026-07-11T21:00:00-04:00",
    venue: "Arrowhead Stadium, Kansas City",
  },
  {
    id: "M101",
    group: "Semi-finals",
    home: "Match 97 Winner",
    away: "Match 98 Winner",
    kickoff: "2026-07-14T15:00:00-04:00",
    venue: "AT&T Stadium, Dallas",
  },
  {
    id: "M102",
    group: "Semi-finals",
    home: "Match 99 Winner",
    away: "Match 100 Winner",
    kickoff: "2026-07-15T15:00:00-04:00",
    venue: "Mercedes-Benz Stadium, Atlanta",
  },
  {
    id: "M103",
    group: "Third Place",
    home: "Match 101 Loser",
    away: "Match 102 Loser",
    kickoff: "2026-07-18T17:00:00-04:00",
    venue: "Hard Rock Stadium, Miami",
  },
  {
    id: "M104",
    group: "Final",
    home: "Match 101 Winner",
    away: "Match 102 Winner",
    kickoff: "2026-07-19T15:00:00-04:00",
    venue: "MetLife Stadium, New York/New Jersey",
  },
];

const TEAM_FLAG_CODES = {
  Algeria: "dz",
  Argentina: "ar",
  Australia: "au",
  Austria: "at",
  Belgium: "be",
  "Bosnia and Herzegovina": "ba",
  Brazil: "br",
  "Cabo Verde": "cv",
  Canada: "ca",
  Colombia: "co",
  "Congo DR": "cd",
  Croatia: "hr",
  Curaçao: "cw",
  Czechia: "cz",
  "Côte d’Ivoire": "ci",
  Ecuador: "ec",
  Egypt: "eg",
  England: "gb-eng",
  France: "fr",
  Germany: "de",
  Ghana: "gh",
  Haiti: "ht",
  Iran: "ir",
  Iraq: "iq",
  Japan: "jp",
  Jordan: "jo",
  "Korea Republic": "kr",
  Mexico: "mx",
  Morocco: "ma",
  Netherlands: "nl",
  "New Zealand": "nz",
  Norway: "no",
  Panama: "pa",
  Paraguay: "py",
  Portugal: "pt",
  Qatar: "qa",
  "Saudi Arabia": "sa",
  Scotland: "gb-sct",
  Senegal: "sn",
  "South Africa": "za",
  Spain: "es",
  Sweden: "se",
  Switzerland: "ch",
  Tunisia: "tn",
  Türkiye: "tr",
  "United States": "us",
  Uruguay: "uy",
  Uzbekistan: "uz",
};

const STORAGE_KEY = "fantasyWorldCup2026";
const SCHEDULE_VERSION = "world-cup-2026-kagglehub-v1";
const MATCH_DATE_MIN = "2026-06-01";
const MATCH_DATE_MAX = "2026-08-31";
const MATCH_IDS = new Set(MATCHES.map((match) => match.id));
const TOURNAMENT_PREDICTION_SAVE_DEBOUNCE_MS = 600;

const state = loadState();
let matchesData = [...MATCHES];
let activePlayerId = state.activePlayerId || "";
let viewedPredictionPlayerId = activePlayerId;
let selectedMatchDateKey = "";
let adminUnlocked = false;
let countdownMatchId = "";
let selectedTeamView = "groups";
let leaderboardScope = DEFAULT_LEAGUE_ID;
let selectedModelVersion = "";
let selectedAdminSection = "results";
let allMatchesTeamFilter = "";
let allMatchesGroupFilter = "";

let modelPredictions = [];
const recentPredictionHistoryWrites = new Map();

const els = {
  playerForm: document.querySelector("#player-form"),
  playerUsername: document.querySelector("#player-username"),
  playerDisplayName: document.querySelector("#player-display-name"),
  playerPassword: document.querySelector("#player-password"),
  playerLeague: document.querySelector("#player-league"),
  createdPlayer: document.querySelector("#created-player"),
  playerNavButton: document.querySelector("#player-nav-button"),
  playerNavLabel: document.querySelector("#player-nav-label"),
  activePlayerName: document.querySelector("#active-player-name"),
  playerModal: document.querySelector("#player-modal"),
  closePlayerModal: document.querySelector("#close-player-modal"),
  modalPlayerSelect: document.querySelector("#modal-player-select"),
  modalPlayerPassword: document.querySelector("#modal-player-password"),
  modalLoginPlayer: document.querySelector("#modal-login-player"),
  modalLoginMessage: document.querySelector("#modal-login-message"),
  activeSummary: document.querySelector("#active-player-summary"),
  nextMatches: document.querySelector("#next-matches"),
  matchDayTabs: document.querySelector("#match-day-tabs"),
  matches: document.querySelector("#matches"),
  matchTemplate: document.querySelector("#match-row-template"),
  leaderboardBody: document.querySelector("#leaderboard-body"),
  leaderboardCount: document.querySelector("#leaderboard-count"),
  leaderboardScopeTabs: document.querySelector("#leaderboard-scope-tabs"),
  leaderboardScopeSummary: document.querySelector("#leaderboard-scope-summary"),
  joinLeaguePanel: document.querySelector("#join-league-panel"),
  joinLeagueSelect: document.querySelector("#join-league-select"),
  joinLeagueButton: document.querySelector("#join-league-button"),
  joinLeagueMessage: document.querySelector("#join-league-message"),
  leaveLeagueButton: document.querySelector("#leave-league-button"),
  teamViewTabs: document.querySelectorAll(".team-view-tab"),
  teamsContent: document.querySelector("#teams-content"),
  pointsBreakdownList: document.querySelector("#points-breakdown-list"),
  predictionTotal: document.querySelector("#prediction-total"),
  predictionPlayerSelect: document.querySelector("#prediction-player-select"),
  playerPredictions: document.querySelector("#player-predictions"),
  resultsAdmin: document.querySelector("#results-admin"),
  scoringConfig: document.querySelector("#scoring-config"),
  saveConfig: document.querySelector("#save-config"),
  viewControls: document.querySelectorAll("[data-view-target]"),
  siteFooter: document.querySelector(".site-footer"),
  adminLogin: document.querySelector("#admin-login"),
  adminContent: document.querySelector("#admin-content"),
  adminLoginForm: document.querySelector("#admin-login-form"),
  adminEmail: document.querySelector("#admin-email"),
  adminPassword: document.querySelector("#admin-password"),
  adminLoginMessage: document.querySelector("#admin-login-message"),
  adminSectionTabs: document.querySelectorAll("[data-admin-section]"),
  adminPanels: document.querySelectorAll("[data-admin-panel]"),
  leagueAdminForm: document.querySelector("#league-admin-form"),
  leagueName: document.querySelector("#league-name"),
  leagueAdminMessage: document.querySelector("#league-admin-message"),
  leaguesAdmin: document.querySelector("#leagues-admin"),
  usersAdmin: document.querySelector("#users-admin"),
  modelVersionSelect: document.querySelector("#model-version-select"),
  statsSummary: document.querySelector("#stats-summary"),
  matchPredictions: document.querySelector("#match-predictions"),
  tournamentPredictionForm: document.querySelector("#tournament-prediction-form"),
  tournamentPredictionStatus: document.querySelector(
    "#tournament-prediction-status",
  ),
};

els.predictionPlayerSelect.addEventListener("change", () => {
  viewedPredictionPlayerId = els.predictionPlayerSelect.value;
  renderPlayerPredictions();
});

els.modelVersionSelect.addEventListener("change", () => {
  selectedModelVersion = els.modelVersionSelect.value;
  renderStats();
});

els.tournamentPredictionForm.addEventListener(
  "input",
  handleTournamentPredictionInput,
);
els.tournamentPredictionForm.addEventListener(
  "change",
  handleTournamentPredictionInput,
);
els.tournamentPredictionForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

els.playerLeague.addEventListener("change", () => {
  if (!els.playerModal.hidden) renderModalPlayerOptions();
});

els.playerNavButton.addEventListener("click", () => {
  openPlayerModal();
});

els.closePlayerModal.addEventListener("click", closePlayerModal);

els.playerModal.addEventListener("click", (event) => {
  if (event.target === els.playerModal) closePlayerModal();
});

els.modalLoginPlayer.addEventListener("click", async () => {
  const playerId = els.modalPlayerSelect.value;
  const password = els.modalPlayerPassword.value;
  const player = state.players[playerId];
  if (!player) return;

  els.modalLoginMessage.textContent = "";
  try {
    const allowed = await verifyPlayerPassword(player, password);
    if (!allowed) {
      els.modalLoginMessage.textContent = "Incorrect password.";
      return;
    }

    els.modalPlayerPassword.value = "";
    await updatePlayerLastLoggedIn(playerId);
    setActivePlayer(playerId);
    closePlayerModal();
  } catch (error) {
    console.error(error);
    els.modalLoginMessage.textContent =
      error.message || "Could not log in as this player.";
  }
});

els.modalPlayerPassword.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  els.modalLoginPlayer.click();
});

els.viewControls.forEach((control) => {
  control.addEventListener("click", () => {
    showView(control.dataset.viewTarget);
  });
});

els.teamViewTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    selectedTeamView = tab.dataset.teamView;
    renderTeams();
  });
});

els.teamsContent.addEventListener("change", (event) => {
  if (event.target.matches("[data-all-matches-team-filter]")) {
    allMatchesTeamFilter = event.target.value;
    renderTeams();
  }

  if (event.target.matches("[data-all-matches-group-filter]")) {
    allMatchesGroupFilter = event.target.value;
    renderTeams();
  }
});

els.adminSectionTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    selectedAdminSection = tab.dataset.adminSection;
    renderAdminSections();
  });
});

els.leaderboardScopeTabs.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-leaderboard-scope]");
  if (!tab) return;
  leaderboardScope = tab.dataset.leaderboardScope;
  renderLeaderboard();
});

els.joinLeagueButton.addEventListener("click", async () => {
  const leagueId = normalizeLeagueId(els.joinLeagueSelect.value);
  if (!activePlayerId || !leagueId) return;

  els.joinLeagueMessage.textContent = "Joining league...";
  try {
    await joinPlayerLeague(activePlayerId, leagueId);
    leaderboardScope = leagueId;
    els.joinLeagueMessage.textContent = "";
    render();
  } catch (error) {
    console.error(error);
    els.joinLeagueMessage.textContent =
      error.message || "Could not join league.";
  }
});

els.leaveLeagueButton.addEventListener("click", async () => {
  if (!activePlayerId || leaderboardScope === WORLDWIDE_SCOPE) return;

  const leagueLabel = leagueName(leaderboardScope);
  const confirmed = window.confirm(`Leave ${leagueLabel}?`);
  if (!confirmed) return;

  try {
    await leavePlayerLeague(activePlayerId, leaderboardScope);
    leaderboardScope = getPlayerLeagueIds(activePlayerId)[0] || WORLDWIDE_SCOPE;
    render();
  } catch (error) {
    console.error(error);
    window.alert(error.message || "Could not leave league.");
  }
});

els.adminLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  els.adminLoginMessage.textContent = "Checking admin access...";

  try {
    if (!supabaseClient) throw new Error("Supabase is not available.");
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: els.adminEmail.value.trim(),
      password: els.adminPassword.value,
    });
    if (error) throw error;

    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      await supabaseClient.auth.signOut();
      throw new Error("This account is not listed as an admin.");
    }

    adminUnlocked = true;
    els.adminEmail.value = "";
    els.adminPassword.value = "";
    els.adminLoginMessage.textContent = "";
    render();
  } catch (error) {
    adminUnlocked = false;
    els.adminLoginMessage.textContent =
      error.message || "Admin sign in failed.";
  }
});

els.leagueAdminForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!adminUnlocked) return;

  const name = els.leagueName.value.trim();
  if (!name) return;

  try {
    await createLeague(name);
    els.leagueName.value = "";
    els.leagueAdminMessage.textContent = `${name} is ready for players to join.`;
    render();
  } catch (error) {
    console.error(error);
    els.leagueAdminMessage.textContent =
      error.message || "Could not create league.";
  }
});

els.playerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = els.playerUsername.value.trim();
  const displayName = els.playerDisplayName.value.trim();
  const password = els.playerPassword.value;
  const leagueId = normalizeLeagueId(els.playerLeague.value);
  const leagueIds = leagueId ? [leagueId] : [];
  if (!username || !displayName || !password) return;
  if (password.length < 4) {
    els.createdPlayer.textContent = "Use at least 4 characters for the password.";
    return;
  }
  const playerId = createPlayerId(username);

  if (findExistingPlayerId(playerId)) {
    els.createdPlayer.textContent =
      "That username is already taken. Choose a different name.";
    return;
  }

  try {
    const player = {
      id: playerId,
      username,
      name: displayName,
      leagueId,
      leagueIds,
      passwordHash: await hashPlayerPassword(playerId, password),
      createdAt: new Date().toISOString(),
    };

    state.players[player.id] = player;
    await savePlayer(player);
    await updatePlayerLastLoggedIn(player.id);

    setActivePlayer(player.id);
    els.createdPlayer.textContent = "";
    els.playerUsername.value = "";
    els.playerDisplayName.value = "";
    els.playerPassword.value = "";
    els.playerLeague.value = DEFAULT_LEAGUE_ID;
    closePlayerModal();
  } catch (error) {
    delete state.players[playerId];
    els.createdPlayer.textContent = error.message || "Could not create player.";
    renderModalPlayerOptions();
  }
});

els.saveConfig.addEventListener("click", async () => {
  const nextPoints = {};
  els.scoringConfig.querySelectorAll("input").forEach((input) => {
    const value = Number(input.value);
    if (input.name === "lockMinutesBeforeKickoff") {
      state.config.lockMinutesBeforeKickoff = Number.isFinite(value)
        ? value
        : DEFAULT_CONFIG.lockMinutesBeforeKickoff;
      return;
    }
    nextPoints[input.name] = Number.isFinite(value) ? value : 0;
  });
  state.config.points = nextPoints;
  await saveSettings();
  saveState();
  render();
});

document.addEventListener("click", (event) => {
  const tooltipButton = event.target.closest(
    ".form-dot, .prediction-status, .mobile-tooltip-trigger, .leaderboard-league.has-tooltip",
  );
  if (event.target.closest(".status-tooltip, .mobile-tooltip, .league-tooltip")) return;

  document.querySelectorAll(".tooltip-open").forEach((button) => {
    if (button === tooltipButton) return;
    button.classList.remove("tooltip-open");
    button.setAttribute("aria-expanded", "false");
  });

  if (
    !tooltipButton ||
    !tooltipButton.querySelector(".status-tooltip, .mobile-tooltip, .league-tooltip")
  ) {
    return;
  }

  event.preventDefault();
  tooltipButton.classList.toggle("tooltip-open");
  tooltipButton.setAttribute(
    "aria-expanded",
    String(tooltipButton.classList.contains("tooltip-open")),
  );
});

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return normalizeState({});

  try {
    return normalizeState(JSON.parse(saved));
  } catch {
    return normalizeState({});
  }
}

function normalizeState(value) {
  const players = value.players || {};
  const leagues = normalizeLeagues(value.leagues);
  const savedPoints = (value.config && value.config.points) || {};
  const points = Object.fromEntries(
    Object.keys(DEFAULT_CONFIG.points).map((key) => [
      key,
      savedPoints[key] ?? DEFAULT_CONFIG.points[key],
    ]),
  );

  Object.values(players).forEach((player) => {
    player.username = player.username || player.id;
    player.name = player.name || player.username || player.id;
    player.passwordHash = player.passwordHash || player.password_hash || "";
    player.leagueIds = normalizeLeagueIds(
      player.leagueIds ||
        player.league_ids ||
        player.leagueId ||
        player.league_id,
      leagues,
    );
    player.leagueId = player.leagueIds[0] || "";
  });

  return {
    leagues,
    players,
    predictions: value.predictions || {},
    tournamentPredictions: value.tournamentPredictions || {},
    results: value.results || {},
    activePlayerId: value.activePlayerId || "",
    config: {
      ...DEFAULT_CONFIG,
      ...(value.config || {}),
      points,
    },
  };
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      activePlayerId: state.activePlayerId,
      config: state.config,
      leagues: state.leagues,
    }),
  );
}

async function initializeApp() {
  render();
  if (!supabaseClient) {
    els.activeSummary.textContent =
      "Supabase client could not load. Using local browser data only.";
    return;
  }

  try {
    await loadSupabaseState();
    adminUnlocked = await checkAdminAccess();
    setupRealtimeSync();
  } catch (error) {
    console.error(error);
    els.activeSummary.textContent =
      "Could not load Supabase data. Check your project tables and connection.";
  }
  render();
}

async function checkAdminAccess() {
  if (!supabaseClient) return false;
  const { data: sessionData } = await supabaseClient.auth.getSession();
  if (!sessionData.session) return false;

  const { data, error } = await supabaseClient
    .from("admin_users")
    .select("user_id")
    .eq("user_id", sessionData.session.user.id)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

async function loadSupabaseState() {
  await seedSupabaseDefaults();

  const [
    players,
    matches,
    predictions,
    results,
    settings,
    matchPredictions,
    tournamentPredictions,
  ] = await Promise.all([
      supabaseSelect("players"),
      supabaseSelect("matches"),
      supabaseSelect("predictions"),
      supabaseSelect("results"),
      supabaseSelect("app_settings"),
      supabaseSelect("match_predictions"),
      supabaseSelect("player_tournament_picks"),
    ]);

  modelPredictions = matchPredictions || [];
  console.log("Loaded model predictions:", modelPredictions);

  const leaguesSetting = settings.find((setting) => setting.key === "leagues");
  if (leaguesSetting?.value) {
    state.leagues = normalizeLeagues(leaguesSetting.value);
  }

  state.players = Object.fromEntries(
    players.map((player) => [
      player.id,
      {
        id: player.id,
        username: player.username,
        name: player.display_name,
        leagueIds: normalizeLeagueIds(player.league_ids || player.league_id),
        leagueId:
          normalizeLeagueIds(player.league_ids || player.league_id)[0] || "",
        passwordHash: player.password_hash || "",
        lastLoggedIn: player.last_logged_in || "",
        createdAt: player.created_at,
      },
    ]),
  );

  matchesData = mergeMatchesWithDefaults(matches);

  state.predictions = Object.fromEntries(
    predictions.map((prediction) => [
      predictionKey(prediction.player_id, prediction.match_id),
      {
        playerId: prediction.player_id,
        matchId: prediction.match_id,
        homeScore: prediction.home_score,
        awayScore: prediction.away_score,
        updatedAt: prediction.updated_at,
      },
    ]),
  );

  state.tournamentPredictions = Object.fromEntries(
    tournamentPredictions.map((prediction) => [
      prediction.player_id,
      {
        playerId: prediction.player_id,
        mostGoals: prediction.most_goals || "",
        mostAssists: prediction.most_assists || "",
        goldenGlove: prediction.golden_glove || "",
        worldCupWinner: prediction.world_cup_winner || "",
        updatedAt: prediction.updated_at,
      },
    ]),
  );

  state.results = Object.fromEntries(
    results.map((result) => [
      result.match_id,
      {
        matchId: result.match_id,
        homeScore: result.home_score,
        awayScore: result.away_score,
        updatedAt: result.updated_at,
      },
    ]),
  );

  const scoringSetting = settings.find(
    (setting) => setting.key === "scoring_config",
  );
  if (scoringSetting?.value) {
    state.config = normalizeState({
      config: scoringSetting.value,
      leagues: state.leagues,
    }).config;
  }

  if (activePlayerId && !state.players[activePlayerId]) {
    activePlayerId = "";
    state.activePlayerId = "";
    viewedPredictionPlayerId = "";
    saveState();
  }
}

async function seedSupabaseDefaults() {
  try {
    await syncSupabaseMatchesIfNeeded();
  } catch (error) {
    console.warn("Could not sync default matches to Supabase.", error);
  }

  const { data: setting, error: settingError } = await supabaseClient
    .from("app_settings")
    .select("key")
    .eq("key", "scoring_config")
    .maybeSingle();
  if (settingError) throw settingError;

  if (!setting) {
    await saveSettings();
  }

  const { data: leaguesSetting, error: leaguesError } = await supabaseClient
    .from("app_settings")
    .select("key")
    .eq("key", "leagues")
    .maybeSingle();
  if (leaguesError) throw leaguesError;

  if (!leaguesSetting) {
    await saveLeagues();
  }
}

async function syncSupabaseMatchesIfNeeded() {
  const { data: scheduleSetting, error: scheduleError } = await supabaseClient
    .from("app_settings")
    .select("value")
    .eq("key", "schedule_version")
    .maybeSingle();
  if (scheduleError) throw scheduleError;
  if (scheduleSetting?.value === SCHEDULE_VERSION) return;

  await supabaseUpsert("matches", MATCHES.map(matchToRow));
  await deleteStaleSupabaseMatches();
  await supabaseUpsert("app_settings", {
    key: "schedule_version",
    value: SCHEDULE_VERSION,
  });
}

async function deleteStaleSupabaseMatches() {
  const { data, error } = await supabaseClient.from("matches").select("id");
  if (error) throw error;

  const staleIds = (data || [])
    .map((row) => row.id)
    .filter((id) => !MATCH_IDS.has(id));
  if (staleIds.length === 0) return;

  const { error: deleteError } = await supabaseClient
    .from("matches")
    .delete()
    .in("id", staleIds);
  if (deleteError) {
    console.warn("Could not delete stale matches from Supabase.", deleteError);
  }
}

async function supabaseSelect(table) {
  if (!supabaseClient) return [];

  const { data, error } = await supabaseClient.from(table).select("*");

  if (error) {
    console.error(`Error loading ${table}:`, error);
    return [];
  }

  return data || [];
}

async function supabaseUpsert(table, payload, options = {}) {
  if (Array.isArray(payload) && payload.length === 0) return;
  const { error } = await supabaseClient.from(table).upsert(payload, options);
  if (error) throw error;
}

async function savePlayer(player) {
  if (!supabaseClient) return;
  const { error } = await supabaseClient.from("players").insert({
    id: player.id,
    username: player.username,
    display_name: player.name,
    league_id: player.leagueIds[0] || null,
    league_ids: player.leagueIds,
    password_hash: player.passwordHash,
  });
  if (error) {
    if (error.code === "23505")
      throw new Error(
        "That username is already taken. Choose a different name.",
      );
    throw error;
  }
}

async function saveSettings() {
  if (!supabaseClient) return;
  await supabaseUpsert("app_settings", {
    key: "scoring_config",
    value: state.config,
  });
}

async function saveLeagues() {
  if (!supabaseClient) return;
  await supabaseUpsert("app_settings", {
    key: "leagues",
    value: state.leagues,
  });
}

async function savePrediction(prediction) {
  if (!supabaseClient) return;
  await supabaseUpsert("predictions", {
    player_id: prediction.playerId,
    match_id: prediction.matchId,
    home_score: prediction.homeScore,
    away_score: prediction.awayScore,
    updated_at: prediction.updatedAt,
  });
  await savePredictionHistory({
    ...prediction,
    action: "save",
  });
}

async function deletePrediction(playerId, matchId) {
  if (!supabaseClient) return;
  const deletedAt = new Date().toISOString();
  const { error } = await supabaseClient
    .from("predictions")
    .delete()
    .eq("player_id", playerId)
    .eq("match_id", matchId);
  if (error) throw error;
  await savePredictionHistory({
    playerId,
    matchId,
    homeScore: null,
    awayScore: null,
    updatedAt: deletedAt,
    action: "clear",
  });
}

async function saveTournamentPrediction(prediction) {
  if (!supabaseClient) return;
  await supabaseUpsert("player_tournament_picks", {
    player_id: prediction.playerId,
    most_goals: prediction.mostGoals || null,
    most_assists: prediction.mostAssists || null,
    golden_glove: prediction.goldenGlove || null,
    world_cup_winner: prediction.worldCupWinner || null,
    updated_at: prediction.updatedAt,
  });
}

async function savePredictionHistory(prediction) {
  if (!supabaseClient) return;
  const historyKey = `${prediction.playerId}:${prediction.matchId}:${prediction.action}`;
  const savedAt = new Date(prediction.updatedAt).getTime();
  const lastSavedAt = recentPredictionHistoryWrites.get(historyKey) || 0;
  if (
    Number.isFinite(savedAt) &&
    savedAt - lastSavedAt < HISTORY_MIN_SAVE_INTERVAL_MS
  ) {
    return;
  }

  recentPredictionHistoryWrites.set(
    historyKey,
    Number.isFinite(savedAt) ? savedAt : Date.now(),
  );

  const { error } = await supabaseClient.from("prediction_history").insert({
    player_id: prediction.playerId,
    match_id: prediction.matchId,
    home_score: prediction.homeScore,
    away_score: prediction.awayScore,
    action: prediction.action,
    created_at: prediction.updatedAt,
  });
  if (error) {
    console.warn(
      "Could not save prediction history. Add prediction_history in Supabase if you want full history.",
      error,
    );
  }
}

async function saveResult(result) {
  if (!supabaseClient) return;
  await supabaseUpsert("results", {
    match_id: result.matchId,
    home_score: result.homeScore,
    away_score: result.awayScore,
    updated_at: result.updatedAt,
  });
}

async function deleteResult(matchId) {
  if (!supabaseClient) return;
  const { error } = await supabaseClient
    .from("results")
    .delete()
    .eq("match_id", matchId);
  if (error) throw error;
}

async function deletePlayerFromSupabase(playerId) {
  if (!supabaseClient) return;
  const { error } = await supabaseClient
    .from("players")
    .delete()
    .eq("id", playerId);
  if (error) throw error;
}

function setupRealtimeSync() {
  supabaseClient
    .channel("fantasy-world-cup-sync")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "players" },
      refreshFromSupabase,
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "predictions" },
      refreshFromSupabase,
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "player_tournament_picks" },
      refreshFromSupabase,
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "results" },
      refreshFromSupabase,
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "app_settings" },
      refreshFromSupabase,
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "matches" },
      refreshFromSupabase,
    )
    .subscribe();
}

let refreshTimer = 0;
function refreshFromSupabase() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(async () => {
    await loadSupabaseState();
    render();
  }, 250);
}

function mergeMatchesWithDefaults(rows) {
  const remoteMatches = new Map(rows.map((row) => [row.id, matchFromRow(row)]));
  return MATCHES.map((match) => ({
    ...(remoteMatches.get(match.id) || {}),
    ...match,
  })).sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff));
}

function matchToRow(match) {
  return {
    id: match.id,
    group_name: match.group,
    home_team: match.home,
    away_team: match.away,
    kickoff: match.kickoff,
    venue: match.venue,
  };
}

function matchFromRow(row) {
  return {
    id: row.id,
    group: row.group_name,
    home: row.home_team,
    away: row.away_team,
    kickoff: row.kickoff,
    venue: row.venue,
  };
}

function createPlayerId(name) {
  return name.trim();
}

async function hashPlayerPassword(playerId, password) {
  const input = `${playerId.trim().toLowerCase()}:${password}`;
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyPlayerPassword(player, password) {
  if (!player.passwordHash) return true;
  if (!password) return false;
  return (await hashPlayerPassword(player.id, password)) === player.passwordHash;
}

function createLeagueId(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createLeague(name) {
  const leagueName = name.trim();
  const leagueId = createLeagueId(leagueName);
  if (!leagueId) throw new Error("Use at least one letter or number.");
  if (state.leagues[leagueId]) {
    throw new Error("That league already exists.");
  }

  state.leagues = {
    ...state.leagues,
    [leagueId]: leagueName,
  };
  await saveLeagues();
  saveState();
}

async function updateLeagueName(leagueId, name) {
  const leagueName = name.trim();
  if (!normalizeLeagueId(leagueId)) return;
  if (!leagueName) throw new Error("League name cannot be blank.");

  state.leagues = {
    ...state.leagues,
    [leagueId]: leagueName,
  };
  await saveLeagues();
  saveState();
}

function openPlayerModal() {
  els.createdPlayer.textContent = "";
  renderPlayerLeagueOptions();
  renderModalPlayerOptions();
  els.playerModal.hidden = false;
  els.playerModal.scrollTop = 0;
  const modalCard = els.playerModal.querySelector(".modal-card");
  modalCard.scrollTop = 0;
  document.querySelector("#player-modal-title").focus({ preventScroll: true });
}

function closePlayerModal() {
  els.playerModal.hidden = true;
}

function setActivePlayer(playerId) {
  activePlayerId = playerId;
  viewedPredictionPlayerId = playerId;
  state.activePlayerId = playerId;
  leaderboardScope = getPlayerLeagueIds(playerId)[0] || WORLDWIDE_SCOPE;
  saveState();
  render();
}

function normalizeLeagues(value) {
  const source =
    value && typeof value === "object" && !Array.isArray(value)
      ? value
      : DEFAULT_LEAGUES;
  const leagues = Object.fromEntries(
    Object.entries(source)
      .map(([id, name]) => [createLeagueId(id), String(name || "").trim()])
      .filter(([id, name]) => id && name),
  );

  return {
    ...DEFAULT_LEAGUES,
    ...leagues,
  };
}

function normalizeLeagueId(
  leagueId,
  leagues = state?.leagues || DEFAULT_LEAGUES,
) {
  return leagues[leagueId] ? leagueId : "";
}

function normalizeLeagueIds(
  value,
  leagues = state?.leagues || DEFAULT_LEAGUES,
) {
  const values = Array.isArray(value) ? value : [value];
  return [
    ...new Set(
      values.map((id) => normalizeLeagueId(id, leagues)).filter(Boolean),
    ),
  ];
}

function getPlayerLeagueIds(playerId) {
  return normalizeLeagueIds(
    state.players[playerId]?.leagueIds ||
      state.players[playerId]?.leagueId ||
      "",
  );
}

function leagueName(leagueId) {
  return state.leagues[leagueId] || "";
}

function leagueNames(leagueIds) {
  const names = normalizeLeagueIds(leagueIds).map(leagueName).filter(Boolean);
  return names.length ? names.join(", ") : "";
}

function compactLeagueNames(leagueIds) {
  const names = normalizeLeagueIds(leagueIds).map(leagueName).filter(Boolean);
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];

  const others = names.length - 1;
  return `${names[0]} + ${others} other${others === 1 ? "" : "s"}`;
}

async function joinPlayerLeague(playerId, leagueId) {
  const player = state.players[playerId];
  if (!player) return;

  const leagueIds = normalizeLeagueIds([...(player.leagueIds || []), leagueId]);
  player.leagueIds = leagueIds;
  player.leagueId = leagueIds[0] || "";
  await savePlayerLeagues(player);
}

async function leavePlayerLeague(playerId, leagueId) {
  const player = state.players[playerId];
  if (!player) return;

  const leagueIds = normalizeLeagueIds(player.leagueIds).filter(
    (id) => id !== leagueId,
  );
  player.leagueIds = leagueIds;
  player.leagueId = leagueIds[0] || "";
  await savePlayerLeagues(player);
}

async function savePlayerLeagues(player) {
  if (!supabaseClient) return;
  const { error } = await supabaseClient
    .from("players")
    .update({
      league_id: player.leagueId || null,
      league_ids: player.leagueIds,
    })
    .eq("id", player.id);
  if (error) throw error;
}

async function updatePlayerLastLoggedIn(playerId) {
  const player = state.players[playerId];
  if (!player) return;

  const timestamp = new Date().toISOString();
  player.lastLoggedIn = timestamp;

  if (!supabaseClient) return;

  const { error } = await supabaseClient
    .from("players")
    .update({ last_logged_in: timestamp })
    .eq("id", playerId);

  if (error) {
    console.warn("Could not update last_logged_in. Add the column in Supabase if you want login tracking.", error);
  }
}

function renderModalPlayerOptions() {
  els.modalPlayerPassword.value = "";
  els.modalLoginMessage.textContent = "";
  const selectedLeague = normalizeLeagueId(els.playerLeague.value);
  const players = Object.values(state.players)
    .filter((player) => {
      const leagueIds = getPlayerLeagueIds(player.id);
      return selectedLeague
        ? leagueIds.includes(selectedLeague)
        : leagueIds.length === 0;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  if (players.length === 0) {
    els.modalPlayerSelect.innerHTML = `<option>No players in this league</option>`;
    els.modalPlayerSelect.disabled = true;
    els.modalPlayerPassword.disabled = true;
    els.modalLoginPlayer.disabled = true;
    els.modalLoginMessage.textContent = selectedLeague
      ? "No existing players found in this league."
      : "No worldwide-only players found.";
    return;
  }

  els.modalPlayerSelect.innerHTML = players
    .map(
      (player) =>
        `<option value="${escapeHtml(player.id)}">${escapeHtml(player.name)} (${escapeHtml(player.id)})</option>`,
    )
    .join("");
  els.modalPlayerSelect.value =
    activePlayerId && state.players[activePlayerId]
      ? activePlayerId
      : players[0]?.id || "";
  els.modalPlayerSelect.disabled = false;
  els.modalPlayerPassword.disabled = false;
  els.modalLoginPlayer.disabled = false;
}

function renderPlayerLeagueOptions() {
  const previousValue = els.playerLeague.value;
  const hasOptions = els.playerLeague.options.length > 0;
  const selectedLeague = hasOptions
    ? normalizeLeagueId(previousValue)
    : DEFAULT_LEAGUE_ID;
  els.playerLeague.innerHTML = [
    `<option value="">No league - worldwide only</option>`,
    ...Object.entries(state.leagues).map(
      ([leagueId, name]) =>
        `<option value="${escapeHtml(leagueId)}">${escapeHtml(name)}</option>`,
    ),
  ].join("");
  els.playerLeague.value = selectedLeague || "";
}

function findExistingPlayerId(playerId) {
  const normalized = playerId.trim().toLowerCase();
  return Object.keys(state.players).find(
    (id) => id.toLowerCase() === normalized,
  );
}

function render() {
  renderPlayerLeagueOptions();
  renderSummary();
  renderMatches();
  renderLeaderboard();
  renderTeams();
  renderPointsBreakdown();
  renderPlayerPredictions();
  renderTournamentPredictions();
  renderAdminAccess();
  renderAdminSections();
  renderResultsAdmin();
  renderConfig();
  renderLeaguesAdmin();
  renderUsersAdmin();
  renderStats();
}

function showView(viewId) {
  document.querySelectorAll(".app-view").forEach((view) => {
    view.classList.toggle("active", view.id === viewId);
  });
  els.viewControls.forEach((control) => {
    control.classList.toggle("active", control.dataset.viewTarget === viewId);
  });
  els.siteFooter.hidden = viewId !== "main-view";
}

function renderAdminAccess() {
  els.adminLogin.hidden = adminUnlocked;
  els.adminContent.hidden = !adminUnlocked;
}

function renderAdminSections() {
  els.adminSectionTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.adminSection === selectedAdminSection);
  });
  els.adminPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.adminPanel === selectedAdminSection);
  });
}

function renderSummary() {
  const player = state.players[activePlayerId];
  const leagues = player ? leagueNames(player.leagueIds) : "";
  els.activeSummary.textContent = player
    ? `Predicting as ${player.name} (${player.id})${leagues ? ` in ${leagues}` : " with worldwide ranking only"}.`
    : "Create or select your player, then predict each score before the one-hour lockout.";
  els.playerNavLabel.textContent = player ? "Switch player" : "Log in / create player";
  els.activePlayerName.textContent = player ? player.name : "";
  els.playerNavButton.classList.toggle("has-player", Boolean(player));
}

function renderMatches() {
  els.matches.innerHTML = "";
  const fixtures = matchesData.sort(
    (a, b) => new Date(a.kickoff) - new Date(b.kickoff),
  );

  const groupedMatches = groupMatchesByDate(fixtures);
  const closestDateKey = getClosestUpcomingDateKey(groupedMatches);

  if (Object.keys(groupedMatches).length === 0) {
    els.nextMatches.innerHTML = `<p class="muted">No upcoming matches.</p>`;
  } else {
    renderNextMatchesSummary(groupedMatches);
  }

  if (!selectedMatchDateKey) {
    selectedMatchDateKey = closestDateKey || MATCH_DATE_MIN;
  }
  selectedMatchDateKey = clampDateKey(selectedMatchDateKey);

  renderMatchDateNavigatorWithPicker(groupedMatches);
  renderSelectedMatchDay(
    selectedMatchDateKey,
    groupedMatches[selectedMatchDateKey] || [],
  );
}

function renderMatchRow(match) {
  const card = els.matchTemplate.content.firstElementChild.cloneNode(true);
  const kickoff = new Date(match.kickoff);
  const prediction = getPrediction(activePlayerId, match.id);
  const locked = isLocked(match);

  card.classList.toggle("locked", locked);
  card.querySelector(".match-time").textContent = formatTime(kickoff);
  card.querySelector(".match-time").dateTime = match.kickoff;
  card.querySelector(".match-group").textContent = match.group;
  card.querySelector(".venue").textContent = match.venue;
  card.querySelector(".home-label").innerHTML = teamHtml(match.home);
  card.querySelector(".away-label").innerHTML = teamHtml(match.away);

  const form = card.querySelector("form");
  form.dataset.matchId = match.id;
  form.dataset.playerId = activePlayerId;
  form.homeScore.value = prediction ? prediction.homeScore : "";
  form.awayScore.value = prediction ? prediction.awayScore : "";
  form.homeScore.disabled = locked || !activePlayerId;
  form.awayScore.disabled = locked || !activePlayerId;
  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("input", handlePredictionInput);

  const lockMessage = card.querySelector(".lock-message");
  if (!activePlayerId) {
    lockMessage.textContent =
      "Create or select a player to predict this match.";
  } else if (locked) {
    lockMessage.textContent = "Predictions are locked for this match.";
  } else if (prediction) {
    lockMessage.textContent = `Saved prediction: ${prediction.homeScore}-${prediction.awayScore}`;
  } else {
    lockMessage.textContent = `Locks ${state.config.lockMinutesBeforeKickoff} minutes before kick-off.`;
  }

  return card;
}

function renderNextMatchesSummary(groupedMatches) {
  const closestDateKey =
    getClosestUpcomingDateKey(groupedMatches) || Object.keys(groupedMatches)[0];
  const matches = groupedMatches[closestDateKey];
  const heading = isTodayKey(closestDateKey)
    ? "Today's matches"
    : "Next matches";
  const nextMatch = getNextUpcomingMatch();
  countdownMatchId = nextMatch?.id || "";

  els.nextMatches.innerHTML = `
    ${
      nextMatch
        ? `
      <section class="match-countdown">
        <p class="eyebrow">Next match starts in</p>
        <time class="countdown-clock" dateTime="${escapeHtml(nextMatch.kickoff)}" data-countdown-target="${escapeHtml(nextMatch.kickoff)}">
          ${countdownHtml(nextMatch.kickoff)}
        </time>
      </section>
    `
        : `
      <section class="match-countdown is-complete">
        <p class="eyebrow">Tournament status</p>
        <strong>All scheduled matches have kicked off.</strong>
      </section>
    `
    }
    <div class="next-matches-head">
      <div>
        <p class="eyebrow">${heading}</p>
        <h3>${formatDateHeading(new Date(matches[0].kickoff))}</h3>
      </div>
      <button class="secondary" type="button" id="jump-next-day">View day</button>
    </div>
    <div class="next-match-list">
      ${matches
        .map(
          (match) => `
        <button class="next-match-chip" type="button" data-date-key="${closestDateKey}">
          <span>${formatTime(new Date(match.kickoff))}</span>
          <span class="next-match-details">
            <strong>${teamHtml(match.home)} <span>vs</span> ${teamHtml(match.away)}</strong>
            <small>${escapeHtml(match.venue)}</small>
          </span>
        </button>
      `,
        )
        .join("")}
    </div>
  `;

  els.nextMatches
    .querySelector("#jump-next-day")
    .addEventListener("click", () => {
      selectedMatchDateKey = closestDateKey;
      renderMatches();
    });
  els.nextMatches.querySelectorAll(".next-match-chip").forEach((button) => {
    button.addEventListener("click", () => {
      selectedMatchDateKey = button.dataset.dateKey;
      renderMatches();
    });
  });
  updateNextMatchCountdown();
}

function renderMatchDateNavigator(groupedMatches) {
  const selectedDate = parseDateKey(selectedMatchDateKey);
  const matches = groupedMatches[selectedMatchDateKey] || [];
  const previousDateKey = shiftDateKey(selectedMatchDateKey, -1);
  const nextDateKey = shiftDateKey(selectedMatchDateKey, 1);

  els.matchDayTabs.innerHTML = `
    <button class="day-step" type="button" data-direction="-1" ${previousDateKey ? "" : "disabled"} aria-label="Previous day">‹</button>
    <div class="day-tab active">
      <span>${formatTabDate(selectedDate)}</span>
      <small>${matches.length} match${matches.length === 1 ? "" : "es"}</small>
    </div>
    <button class="day-step" type="button" data-direction="1" ${nextDateKey ? "" : "disabled"} aria-label="Next day">›</button>
  `;

  els.matchDayTabs.querySelectorAll(".day-step").forEach((button) => {
    button.addEventListener("click", () => {
      selectedMatchDateKey =
        shiftDateKey(selectedMatchDateKey, Number(button.dataset.direction)) ||
        selectedMatchDateKey;
      renderMatches();
    });
  });
}

function renderMatchDateNavigatorWithPicker(groupedMatches) {
  const selectedDate = parseDateKey(selectedMatchDateKey);
  const matches = groupedMatches[selectedMatchDateKey] || [];
  const previousDateKey = shiftDateKey(selectedMatchDateKey, -1);
  const nextDateKey = shiftDateKey(selectedMatchDateKey, 1);

  els.matchDayTabs.innerHTML = `
    <button class="day-step" type="button" data-direction="-1" ${previousDateKey ? "" : "disabled"} aria-label="Previous day">&lt;</button>
    <div class="day-tab active">
      <span>${formatTabDate(selectedDate)}</span>
      <small>${matches.length} match${matches.length === 1 ? "" : "es"}</small>
    </div>
    <button class="day-step" type="button" data-direction="1" ${nextDateKey ? "" : "disabled"} aria-label="Next day">&gt;</button>
    <button class="day-step calendar-step" type="button" data-open-date-picker aria-label="Choose match date">📅</button>
    <input class="match-date-picker" type="date" min="${MATCH_DATE_MIN}" max="${MATCH_DATE_MAX}" value="${escapeHtml(selectedMatchDateKey)}" aria-label="Choose match date" />
  `;

  els.matchDayTabs.querySelectorAll(".day-step").forEach((button) => {
    button.addEventListener("click", () => {
      selectedMatchDateKey =
        shiftDateKey(selectedMatchDateKey, Number(button.dataset.direction)) ||
        selectedMatchDateKey;
      renderMatches();
    });
  });

  const datePicker = els.matchDayTabs.querySelector(".match-date-picker");
  els.matchDayTabs
    .querySelector("[data-open-date-picker]")
    .addEventListener("click", () => {
      if (typeof datePicker.showPicker === "function") {
        datePicker.showPicker();
      } else {
        datePicker.focus();
      }
    });
  datePicker.addEventListener("change", () => {
    if (!datePicker.value) return;
    selectedMatchDateKey = clampDateKey(datePicker.value);
    renderMatches();
  });
}

function renderSelectedMatchDay(dateKey, matches) {
  const dayPanel = document.createElement("section");
  dayPanel.className = "match-day panel";
  dayPanel.innerHTML = `
    <div class="match-day-head">
      <div>
        <p class="eyebrow">${dateKey}</p>
        <h3>${formatDateHeading(parseDateKey(dateKey))}</h3>
      </div>
      <span class="pill">${matches.length} match${matches.length === 1 ? "" : "es"}</span>
    </div>
    <div class="match-day-list"></div>
  `;

  const list = dayPanel.querySelector(".match-day-list");
  if (matches.length === 0) {
    list.innerHTML = `<p class="muted empty-state">No matches scheduled for this day.</p>`;
  } else {
    matches.forEach((match) => {
      list.append(renderMatchRow(match));
    });
  }

  els.matches.append(dayPanel);
}

function renderStats() {
  if (!els.statsSummary || !els.matchPredictions) return;

  renderModelVersionOptions();
  const activePredictions = getActiveModelPredictions();

  if (!activePredictions.length) {
    els.statsSummary.innerHTML = `
      <section class="stats-hero">
        <div>
          <p class="eyebrow">Predictor hub</p>
          <h3>No model predictions yet</h3>
          <p class="muted">Once match predictions are loaded, this page will show score picks, win chances, and the strongest calls.</p>
        </div>
      </section>
    `;
    els.matchPredictions.innerHTML = "";
    return;
  }

  const predictionSummaries = activePredictions.map(modelPredictionSummary);
  const strongestFavourite = [...predictionSummaries].sort(
    (a, b) => b.topProbability - a.topProbability,
  )[0];
  const drawLeans = predictionSummaries.filter(
    (prediction) => prediction.topOutcome === "Draw",
  ).length;
  const tournament = buildTournamentPrediction(activePredictions);
  const openGroups = tournament.groups
    .map(([group, table]) => ({
      group,
      spread: table[0].points - table[2].points,
    }))
    .sort((a, b) => a.spread - b.spread);

  els.statsSummary.innerHTML = `
    <section class="stats-hero">
      <div>
        <p class="eyebrow">Predictor hub</p>
        <h3>Stats & Predictions</h3>
        <p class="muted">Model score calls, match win chances, and the fixtures where the numbers have a clear favourite.</p>
      </div>
      <div class="stats-spotlight">
        <span>Strongest call (Dark horse)</span>
        <strong>${strongestFavourite.topOutcome === "Draw" ? "Draw" : teamHtml(strongestFavourite.teamName)}</strong>
        <p>${strongestFavourite.topProbability}%</p>
      </div>
    </section>
    <div class="stats-grid">
      <article class="stat-card">
        <span>Fixtures predicted</span>
        <strong>${activePredictions.length}</strong>
      </article>
      <article class="stat-card">
        <span>Projected champion</span>
        <strong>${teamHtml(tournament.champion || "TBD")}</strong>
      </article>
      <article class="stat-card">
        <span>Closest group</span>
        <strong>${escapeHtml(openGroups[0]?.group || "TBD")}</strong>
      </article>
      <article class="stat-card">
        <span>Draw leans</span>
        <strong>${drawLeans}</strong>
      </article>
    </div>
  `;

  els.matchPredictions.innerHTML = `
    ${tournamentPredictionHtml(tournament)}
    <section class="stats-section">
      <div class="section-head small">
        <div>
          <p class="eyebrow">Group projections</p>
          <h3>Predicted tables</h3>
        </div>
      </div>
      <div class="group-projection-grid">
        ${tournament.groups.map(groupProjectionHtml).join("")}
      </div>
    </section>
    <section class="stats-section">
      <div class="section-head small">
        <div>
          <p class="eyebrow">Fixture model</p>
          <h3>Match-by-match predictions</h3>
        </div>
      </div>
      <div class="stats-list">
        ${activePredictions.map(modelPredictionCardHtml).join("")}
      </div>
    </section>
  `;
}

function renderModelVersionOptions() {
  const versions = getModelVersions();
  if (!selectedModelVersion || !versions.includes(selectedModelVersion)) {
    selectedModelVersion = versions[0] || "";
  }

  els.modelVersionSelect.innerHTML = versions
    .map(
      (version) =>
        `<option value="${escapeHtml(version)}">${escapeHtml(modelLabel(version))}</option>`,
    )
    .join("");
  els.modelVersionSelect.value = selectedModelVersion;
  els.modelVersionSelect.disabled = versions.length <= 1;
}

function getModelVersions() {
  const storedVersions = [
    ...new Set(
      modelPredictions
        .map((prediction) => prediction.model_version || "default")
        .filter(Boolean),
    ),
  ].sort();

  return [
    ...BUILT_IN_MODEL_OPTIONS.map((model) => model.id),
    ...storedVersions.filter(
      (version) =>
        !BUILT_IN_MODEL_OPTIONS.some((model) => model.id === version),
    ),
  ];
}

function getActiveModelPredictions() {
  const version = selectedModelVersion || getModelVersions()[0] || "";
  const baseVersion = getStoredModelVersion(version);
  const predictions = modelPredictions.filter(
    (prediction) => (prediction.model_version || "default") === baseVersion,
  );

  if (version === "favourite-lean") {
    return predictions.map((prediction) =>
      adjustPredictionConfidence(prediction, 1.16),
    );
  }

  if (version === "upset-lean") {
    return predictions.map((prediction) =>
      adjustPredictionConfidence(prediction, 0.86),
    );
  }

  return predictions;
}

function getStoredModelVersion(version) {
  const storedVersions = [
    ...new Set(
      modelPredictions
        .map((prediction) => prediction.model_version || "default")
        .filter(Boolean),
    ),
  ];
  if (storedVersions.includes(version)) return version;
  if (storedVersions.includes("elo-poisson-v1")) return "elo-poisson-v1";
  return storedVersions[0] || "";
}

function adjustPredictionConfidence(prediction, exponent) {
  const probabilities = [
    Number(prediction.home_win_prob) || 0,
    Number(prediction.draw_prob) || 0,
    Number(prediction.away_win_prob) || 0,
  ].map((value) => Math.pow(Math.max(value, 0.01), exponent));
  const total = probabilities.reduce((sum, value) => sum + value, 0);
  const [home, draw, away] = probabilities.map((value) =>
    roundPercent((value / total) * 100),
  );

  return {
    ...prediction,
    home_win_prob: home,
    draw_prob: draw,
    away_win_prob: away,
  };
}

function roundPercent(value) {
  return Math.round(value * 100) / 100;
}

function modelLabel(version) {
  const builtIn = BUILT_IN_MODEL_OPTIONS.find((model) => model.id === version);
  if (builtIn) return builtIn.label;
  if (version === "elo-poisson-v1") return "Elo Poisson";
  return version;
}

function modelPredictionSummary(prediction) {
  const outcomes = [
    {
      label: prediction.home_team,
      probability: Number(prediction.home_win_prob) || 0,
      teamName: prediction.home_team,
    },
    {
      label: "Draw",
      probability: Number(prediction.draw_prob) || 0,
      teamName: prediction.home_team,
    },
    {
      label: prediction.away_team,
      probability: Number(prediction.away_win_prob) || 0,
      teamName: prediction.away_team,
    },
  ];
  const top = outcomes.sort((a, b) => b.probability - a.probability)[0];

  return {
    ...prediction,
    teamName: top.teamName,
    topOutcome: top.label,
    topProbability: top.probability,
  };
}

function modelPredictionCardHtml(prediction) {
  const summary = modelPredictionSummary(prediction);
  return `
    <article class="model-prediction-card">
      <div class="model-fixture">
        <div class="model-team-row">
          ${teamHtml(prediction.home_team)}
          <span class="model-score">${escapeHtml(prediction.predicted_score)}</span>
          ${teamHtml(prediction.away_team)}
        </div>
        <p class="muted">Predicted score</p>
      </div>
      <div class="model-pick">
        <span>Likely result</span>
        <strong>${escapeHtml(summary.topOutcome)}</strong>
        <p>${summary.topProbability}% confidence</p>
      </div>
      <div class="prediction-probs">
        ${probabilityRowHtml(prediction.home_team, prediction.home_win_prob, true)}
        ${probabilityRowHtml("Draw", prediction.draw_prob)}
        ${probabilityRowHtml(prediction.away_team, prediction.away_win_prob, true)}
      </div>
    </article>
  `;
}

function probabilityRowHtml(label, probability, showFlag = false) {
  const value = Math.max(0, Math.min(100, Number(probability) || 0));
  return `
    <div class="probability-row">
      <span>${showFlag ? teamHtml(label) : escapeHtml(label)}</span>
      <div class="probability-meter" aria-hidden="true">
        <span style="width: ${value}%"></span>
      </div>
      <strong>${value}%</strong>
    </div>
  `;
}

function buildTournamentPrediction(predictions) {
  const predictionByMatch = new Map(
    predictions.map((prediction) => [prediction.match_id, prediction]),
  );
  const groups = buildPredictedGroups(predictionByMatch);
  const thirdPlaceTeams = groups
    .map(([group, table]) => ({ ...table[2], group }))
    .sort(compareGroupTeams)
    .slice(0, 8);
  const matchWinners = {};
  const usedThirdPlaceTeams = new Set();
  const knockoutMatches = MATCHES.filter(
    (match) => !/^Group [A-L]$/.test(match.group),
  );
  const bracket = [];

  knockoutMatches.forEach((match) => {
    const home = resolveKnockoutSlot(
      match.home,
      groups,
      thirdPlaceTeams,
      matchWinners,
      usedThirdPlaceTeams,
    );
    const away = resolveKnockoutSlot(
      match.away,
      groups,
      thirdPlaceTeams,
      matchWinners,
      usedThirdPlaceTeams,
    );
    const prediction = predictKnockoutMatch(home, away, groups);

    matchWinners[match.id] = {
      winner: prediction.winner,
      loser: prediction.loser,
    };
    bracket.push({
      id: match.id,
      round: match.group,
      home,
      away,
      ...prediction,
    });
  });

  return {
    groups,
    bracket,
    champion: matchWinners.M104?.winner || "",
  };
}

function buildPredictedGroups(predictionByMatch) {
  const groupMap = new Map();
  MATCHES.filter((match) => /^Group [A-L]$/.test(match.group)).forEach(
    (match) => {
      if (!groupMap.has(match.group)) groupMap.set(match.group, new Map());
      const table = groupMap.get(match.group);
      [match.home, match.away].forEach((team) => {
        if (!table.has(team)) {
          table.set(team, {
            team,
            played: 0,
            points: 0,
            gf: 0,
            ga: 0,
            gd: 0,
            modelScore: 0,
          });
        }
      });

      const prediction = predictionByMatch.get(match.id);
      if (!prediction) return;

      const home = table.get(match.home);
      const away = table.get(match.away);
      const homeGoals = Number(prediction.predicted_home_goals) || 0;
      const awayGoals = Number(prediction.predicted_away_goals) || 0;
      const homeWinProb = Number(prediction.home_win_prob) || 0;
      const drawProb = Number(prediction.draw_prob) || 0;
      const awayWinProb = Number(prediction.away_win_prob) || 0;

      home.played += 1;
      away.played += 1;
      home.gf += homeGoals;
      home.ga += awayGoals;
      away.gf += awayGoals;
      away.ga += homeGoals;
      home.points += (homeWinProb * 3 + drawProb) / 100;
      away.points += (awayWinProb * 3 + drawProb) / 100;
      home.modelScore += homeWinProb + drawProb / 2;
      away.modelScore += awayWinProb + drawProb / 2;
    },
  );

  return [...groupMap.entries()]
    .map(([group, table]) => [
      group,
      [...table.values()]
        .map((team) => ({
          ...team,
          gd: team.gf - team.ga,
        }))
        .sort(compareGroupTeams),
    ])
    .sort(([groupA], [groupB]) =>
      groupA.localeCompare(groupB, undefined, { numeric: true }),
    );
}

function compareGroupTeams(a, b) {
  return (
    b.points - a.points ||
    b.gd - a.gd ||
    b.gf - a.gf ||
    b.modelScore - a.modelScore ||
    a.team.localeCompare(b.team)
  );
}

function resolveKnockoutSlot(
  slot,
  groups,
  thirdPlaceTeams,
  matchWinners,
  usedThirdPlaceTeams,
) {
  const winnerMatch = slot.match(/^Match (\d+) Winner$/);
  if (winnerMatch) {
    return matchWinners[matchIdFromNumber(winnerMatch[1])]?.winner || slot;
  }

  const loserMatch = slot.match(/^Match (\d+) Loser$/);
  if (loserMatch) {
    return matchWinners[matchIdFromNumber(loserMatch[1])]?.loser || slot;
  }

  const groupSlot = slot.match(/^Group ([A-L]) (Winner|Runner-up)$/);
  if (groupSlot) {
    const group = groups.find(([name]) => name === `Group ${groupSlot[1]}`);
    return group?.[1]?.[groupSlot[2] === "Winner" ? 0 : 1]?.team || slot;
  }

  const thirdSlot = slot.match(/^Group ([A-L/]+) 3rd Place$/);
  if (thirdSlot) {
    const allowedGroups = thirdSlot[1]
      .split("/")
      .map((group) => `Group ${group}`);
    const thirdTeam =
      thirdPlaceTeams.find(
        (team) =>
          allowedGroups.includes(team.group) &&
          !usedThirdPlaceTeams.has(team.team),
      ) || thirdPlaceTeams.find((team) => !usedThirdPlaceTeams.has(team.team));
    if (!thirdTeam) return slot;
    usedThirdPlaceTeams.add(thirdTeam.team);
    return thirdTeam.team;
  }

  return slot;
}

function matchIdFromNumber(matchNumber) {
  return `M${String(matchNumber).padStart(3, "0")}`;
}

function predictKnockoutMatch(home, away, groups) {
  const homePower = teamTournamentPower(home, groups);
  const awayPower = teamTournamentPower(away, groups);
  const winner = homePower >= awayPower ? home : away;
  const loser = winner === home ? away : home;
  const confidence = Math.min(
    82,
    Math.max(52, Math.round(55 + Math.abs(homePower - awayPower) * 4)),
  );

  return {
    winner,
    loser,
    confidence,
  };
}

function teamTournamentPower(teamName, groups) {
  for (const [, table] of groups) {
    const team = table.find((row) => row.team === teamName);
    if (team)
      return team.points * 3 + team.gd * 1.5 + team.gf + team.modelScore / 30;
  }

  return 0;
}

function tournamentPredictionHtml(tournament) {
  const rounds = groupBracketByRound(tournament.bracket);
  const final = rounds.get("Final")?.[0];

  return `
    <section class="stats-section tournament-predictor">
      <div class="section-head small">
        <div>
          <p class="eyebrow">Tournament predictor</p>
          <h3>Projected knockout route</h3>
          <p class="muted">Group tables use expected points from the selected model. Knockout winners use projected group strength, with the best available third-place teams slotted into the official route.</p>
        </div>
        <span class="pill">${final ? `${escapeHtml(final.confidence)}% final call` : "Projected"}</span>
      </div>
      <div class="champion-card">
        <span>Projected winner</span>
        <strong>${teamHtml(tournament.champion || "TBD")}</strong>
      </div>
      <div class="bracket-grid">
        ${[...rounds.entries()].map(bracketRoundHtml).join("")}
      </div>
    </section>
  `;
}

function groupBracketByRound(bracket) {
  const roundOrder = [
    "Round of 32",
    "Round of 16",
    "Quarter-finals",
    "Semi-finals",
    "Final",
  ];
  const rounds = new Map(roundOrder.map((round) => [round, []]));
  bracket
    .filter((match) => rounds.has(match.round))
    .forEach((match) => rounds.get(match.round).push(match));
  return rounds;
}

function bracketRoundHtml([round, matches]) {
  return `
    <section class="bracket-round">
      <h4>${escapeHtml(round)}</h4>
      ${matches
        .map(
          (match) => `
            <article class="bracket-match">
              <span>${escapeHtml(match.id.replace("M", "Match "))}</span>
              <strong class="bracket-winner">${teamFlagHtml(match.winner, { className: "winner-flag", tooltip: true })}</strong>
              <p>${teamFlagHtml(match.home, { tooltip: true })}<span>vs</span>${teamFlagHtml(match.away, { tooltip: true })}</p>
            </article>
          `,
        )
        .join("")}
    </section>
  `;
}

function groupProjectionHtml([group, table]) {
  return `
    <section class="group-projection-card">
      <h4>${escapeHtml(group)}</h4>
      ${table
        .map(
          (team, index) => `
            <div class="group-projection-row ${index < 2 ? "qualifies" : index === 2 ? "third-place" : ""}">
              <span>${index + 1}</span>
              <strong>${teamHtml(team.team, { className: "mobile-tooltip-trigger", tooltip: true })}</strong>
              <em>${formatTableNumber(team.points)} pts</em>
              <small>${formatTableNumber(team.gf)}-${formatTableNumber(team.ga)}</small>
            </div>
          `,
        )
        .join("")}
    </section>
  `;
}

function formatTableNumber(value) {
  return Number(value).toFixed(1).replace(/\.0$/, "");
}

function groupMatchesByDate(matches) {
  return matches.reduce((groups, match) => {
    const date = new Date(match.kickoff);
    const key = getDateKey(date);
    groups[key] = groups[key] || [];
    groups[key].push(match);
    return groups;
  }, {});
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getClosestUpcomingDateKey(groupedMatches) {
  const now = Date.now();
  const futureMatch = Object.values(groupedMatches)
    .flat()
    .sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff))
    .find((match) => new Date(match.kickoff).getTime() >= now);
  return futureMatch
    ? getDateKey(new Date(futureMatch.kickoff))
    : Object.keys(groupedMatches)[0];
}

function getNextUpcomingMatch() {
  const now = Date.now();
  return [...matchesData]
    .sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff))
    .find((match) => new Date(match.kickoff).getTime() > now);
}

function updateNextMatchCountdown() {
  const clock = els.nextMatches.querySelector("[data-countdown-target]");
  if (!clock) return;

  const target = clock.dataset.countdownTarget;
  const remaining = new Date(target).getTime() - Date.now();
  if (remaining <= 0) {
    clock.textContent = "Kick-off";
    const nextMatch = getNextUpcomingMatch();
    if (nextMatch?.id !== countdownMatchId) renderMatches();
    return;
  }

  const parts = getCountdownParts(target);
  clock.querySelectorAll(".countdown-value").forEach((valueEl) => {
    const nextValue = parts[valueEl.dataset.unit];
    if (!nextValue || valueEl.textContent === nextValue) return;

    valueEl.textContent = nextValue;
    valueEl.classList.remove("is-flipping");
    void valueEl.offsetWidth;
    valueEl.classList.add("is-flipping");
  });
}

function countdownHtml(kickoff) {
  const parts = getCountdownParts(kickoff);
  return [
    ["days", parts.days],
    ["hours", parts.hours],
    ["minutes", parts.minutes],
    ["seconds", parts.seconds],
  ]
    .map(
      ([unit, value]) => `
    <span class="countdown-unit">
      <span class="countdown-value" data-unit="${unit}">${value}</span>
      <span class="countdown-label">${unit}</span>
    </span>
  `,
    )
    .join("");
}

function getCountdownParts(kickoff) {
  const remaining = Math.max(0, new Date(kickoff).getTime() - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function shiftDateKey(dateKey, amount) {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + amount);
  const nextKey = getDateKey(date);
  if (nextKey < MATCH_DATE_MIN || nextKey > MATCH_DATE_MAX) return "";
  return nextKey;
}

function clampDateKey(dateKey) {
  if (dateKey < MATCH_DATE_MIN) return MATCH_DATE_MIN;
  if (dateKey > MATCH_DATE_MAX) return MATCH_DATE_MAX;
  return dateKey;
}

function isTodayKey(dateKey) {
  return dateKey === getDateKey(new Date());
}

function handlePredictionInput(event) {
  const form = event.currentTarget;
  const matchId = form.dataset.matchId;
  const match = matchesData.find((item) => item.id === matchId);
  if (!activePlayerId || !match || isLocked(match)) return;

  clearTimeout(form.saveTimer);
  updateAutosaveMessage(form, "Saving...");
  form.saveTimer = setTimeout(() => {
    savePredictionForm(form).catch((error) => {
      console.error(error);
      updateAutosaveMessage(form, "Save failed.");
    });
  }, SCORE_SAVE_DEBOUNCE_MS);
}

async function savePredictionForm(form) {
  const playerId = form.dataset.playerId;
  const matchId = form.dataset.matchId;
  const match = matchesData.find((item) => item.id === matchId);
  if (!playerId || !match || isLocked(match)) return;

  const homeValue = form.homeScore.value;
  const awayValue = form.awayScore.value;
  if (homeValue === "" && awayValue === "") {
    delete state.predictions[predictionKey(playerId, matchId)];
    await deletePrediction(playerId, matchId);
    saveState();
    updateAutosaveMessage(form, "Prediction cleared.");
    renderPlayerPredictions();
    return;
  }
  if (homeValue === "" || awayValue === "") return;

  const prediction = {
    playerId,
    matchId,
    homeScore: Number(homeValue),
    awayScore: Number(awayValue),
    updatedAt: new Date().toISOString(),
  };

  state.predictions[predictionKey(activePlayerId, matchId)] = prediction;
  await savePrediction(prediction);
  saveState();
  updateAutosaveMessage(
    form,
    `Saved prediction: ${prediction.homeScore}-${prediction.awayScore}`,
  );
  renderPlayerPredictions();
}

function updateAutosaveMessage(form, message) {
  const row = form.closest(".match-row");
  if (!row) return;
  row.querySelector(".lock-message").textContent = message;
}

function renderLeaderboard() {
  const activeLeagueIds = getPlayerLeagueIds(activePlayerId);
  if (
    leaderboardScope !== WORLDWIDE_SCOPE &&
    !activeLeagueIds.includes(leaderboardScope)
  ) {
    leaderboardScope = activeLeagueIds[0] || WORLDWIDE_SCOPE;
  }

  const scopes = [
    ...activeLeagueIds.map((leagueId) => [leagueId, leagueName(leagueId)]),
    [WORLDWIDE_SCOPE, "Worldwide"],
  ];

  els.leaderboardScopeTabs.innerHTML = scopes
    .map(
      ([scope, label]) => `
    <button class="leaderboard-scope-tab ${leaderboardScope === scope ? "active" : ""}" type="button" data-leaderboard-scope="${escapeHtml(scope)}">
      ${escapeHtml(label)}
    </button>
  `,
    )
    .join("");

  renderJoinLeagueControls(activeLeagueIds);
  els.leaveLeagueButton.hidden =
    !activePlayerId ||
    leaderboardScope === WORLDWIDE_SCOPE ||
    !activeLeagueIds.includes(leaderboardScope);

  const rows = Object.values(state.players)
    .filter(
      (player) =>
        leaderboardScope === WORLDWIDE_SCOPE ||
        getPlayerLeagueIds(player.id).includes(leaderboardScope),
    )
    .map((player) => ({ player, stats: calculatePlayerStats(player.id) }))
    .sort(
      (a, b) =>
        b.stats.points - a.stats.points ||
        b.stats.correctPredictions - a.stats.correctPredictions,
    );

  els.leaderboardCount.textContent = `${rows.length} players`;
  els.leaderboardScopeSummary.textContent =
    leaderboardScope !== WORLDWIDE_SCOPE
      ? `Showing ${leagueName(leaderboardScope)} rankings.`
      : "Showing every player across all leagues and players without a league.";
  els.leaderboardBody.innerHTML =
    rows
      .map(
        (row, index) => `
        <tr class="leaderboard-row">
          <td><span class="rank-badge">${index + 1}</span></td>
          <td>
            <strong class="leaderboard-name">${escapeHtml(row.player.name)}</strong>
            <span class="leaderboard-id">${escapeHtml(row.player.id)}</span>
            ${leaderboardLeagueHtml(row.player.leagueIds)}
          </td>
          <td><strong class="leaderboard-points">${row.stats.points}</strong></td>
          <td>${row.stats.correctPredictions}</td>
          <td>${leaderboardFormHtml(row.player.id)}</td>
        </tr>
      `,
      )
      .join("") ||
    `<tr><td colspan="5" class="muted">${leaderboardScope !== WORLDWIDE_SCOPE ? "No players in this league yet." : "No players yet."}</td></tr>`;
}

function leaderboardLeagueHtml(leagueIds) {
  const fullLabel = leagueNames(leagueIds) || "Worldwide only";
  const compactLabel = compactLeagueNames(leagueIds) || "Worldwide only";
  const showTooltip = fullLabel !== compactLabel;

  return `
    <span class="leaderboard-league ${showTooltip ? "has-tooltip" : ""}" ${showTooltip ? 'tabindex="0"' : ""}>
      ${escapeHtml(compactLabel)}
      ${showTooltip ? `<span class="league-tooltip">${escapeHtml(fullLabel)}</span>` : ""}
    </span>
  `;
}

function renderJoinLeagueControls(activeLeagueIds) {
  const availableLeagues = Object.entries(state.leagues).filter(
    ([leagueId]) => !activeLeagueIds.includes(leagueId),
  );
  els.joinLeaguePanel.hidden = !activePlayerId || availableLeagues.length === 0;
  if (els.joinLeaguePanel.hidden) return;

  els.joinLeagueSelect.innerHTML = availableLeagues
    .map(
      ([leagueId, name]) =>
        `<option value="${escapeHtml(leagueId)}">${escapeHtml(name)}</option>`,
    )
    .join("");
}

function renderTeams() {
  els.teamViewTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.teamView === selectedTeamView);
  });

  if (selectedTeamView === "groups") {
    els.teamsContent.innerHTML = groupStageTeamsHtml();
    return;
  }

  if (selectedTeamView === "knockout") {
    els.teamsContent.innerHTML = knockoutTeamsHtml();
    return;
  }

  els.teamsContent.innerHTML = allMatchesListHtml();
}

function groupStageTeamsHtml() {
  const groups = getGroupStageTeams();
  return `
    <div class="team-group-grid">
      ${groups
        .map(
          ([group, teams]) => `
        <section class="team-group-card">
          <div class="team-group-head">
            <h3>${escapeHtml(group)}</h3>
            <span class="pill">${teams.length} teams</span>
          </div>
          <div class="team-list">
            ${teams.map((team) => teamCardHtml(team)).join("")}
          </div>
        </section>
      `,
        )
        .join("")}
    </div>
  `;
}

function knockoutTeamsHtml() {
  return `
    <section class="knockout-empty">
      <p class="eyebrow">Knockout stage</p>
      <h3>Knockout teams will appear here later.</h3>
      <p class="muted">This view will be filled once the tournament has officially started and the qualified teams are known.</p>
    </section>
  `;
}

function allMatchesHtml() {
  return `
    <div class="all-matches-list">
      ${[...matchesData]
        .sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff))
        .map(
          (match) => `
            <article class="all-match-card">
              <div>
                <p class="eyebrow">${escapeHtml(match.id)} · ${escapeHtml(match.group)}</p>
                <strong>${teamHtml(match.home)} <span>vs</span> ${teamHtml(match.away)}</strong>
              </div>
              <div class="all-match-meta">
                <time dateTime="${escapeHtml(match.kickoff)}">${formatDate(new Date(match.kickoff))}</time>
                <span>${escapeHtml(match.venue)}</span>
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function allMatchesListHtml() {
  const filteredMatches = [...matchesData]
    .filter(
      (match) =>
        !allMatchesTeamFilter ||
        match.home === allMatchesTeamFilter ||
        match.away === allMatchesTeamFilter,
    )
    .filter(
      (match) => !allMatchesGroupFilter || match.group === allMatchesGroupFilter,
    )
    .sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff));
  const groupedMatches = groupMatchesByDate(
    filteredMatches,
  );

  return `
    <div class="all-match-filters">
      <label>
        Country
        <select data-all-matches-team-filter>
          <option value="">All countries</option>
          ${getAllMatchTeams()
            .map(
              (team) =>
                `<option value="${escapeHtml(team)}" ${allMatchesTeamFilter === team ? "selected" : ""}>${escapeHtml(team)}</option>`,
            )
            .join("")}
        </select>
      </label>
      <label>
        Group / round
        <select data-all-matches-group-filter>
          <option value="">All groups and rounds</option>
          ${getAllMatchGroups()
            .map(
              (group) =>
                `<option value="${escapeHtml(group)}" ${allMatchesGroupFilter === group ? "selected" : ""}>${escapeHtml(group)}</option>`,
            )
            .join("")}
        </select>
      </label>
    </div>
    <div class="all-matches-list">
      ${
        Object.entries(groupedMatches)
          .map(
            ([dateKey, matches]) => `
            <section class="match-day panel all-match-day">
              <div class="match-day-head">
                <div>
                  <p class="eyebrow">${escapeHtml(dateKey)}</p>
                  <h3>${formatDateHeading(parseDateKey(dateKey))}</h3>
                </div>
              </div>
              <div class="match-day-list all-match-day-list">
                ${matches
                  .map(
                    (match) => `
                      <article class="all-match-card">
                        <time class="all-match-time" dateTime="${escapeHtml(match.kickoff)}">${formatTime(new Date(match.kickoff))}</time>
                        <div class="all-match-fixture">
                          <p class="eyebrow">${escapeHtml(match.id)} - ${escapeHtml(match.group)}</p>
                          <strong>${teamHtml(match.home)} <span>vs</span> ${teamHtml(match.away)}</strong>
                        </div>
                        <div class="all-match-meta">
                          <span>${escapeHtml(match.venue)}</span>
                        </div>
                      </article>
                    `,
                  )
                  .join("")}
              </div>
            </section>
          `,
          )
          .join("") ||
        `<p class="muted">No matches found for those filters.</p>`
      }
    </div>
  `;
}

function getAllMatchTeams() {
  return [
    ...new Set(matchesData.flatMap((match) => [match.home, match.away])),
  ].sort((a, b) => a.localeCompare(b));
}

function getAllMatchGroups() {
  return [...new Set(matchesData.map((match) => match.group))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  );
}

function getGroupStageTeams() {
  const groups = new Map();
  MATCHES.filter((match) => /^Group [A-L]$/.test(match.group)).forEach(
    (match) => {
      [match.home, match.away].forEach((team) => {
        if (!groups.has(match.group)) groups.set(match.group, new Set());
        groups.get(match.group).add(team);
      });
    },
  );

  return [...groups.entries()]
    .sort(([groupA], [groupB]) =>
      groupA.localeCompare(groupB, undefined, { numeric: true }),
    )
    .map(([group, teams]) => [
      group,
      [...teams].sort((a, b) => a.localeCompare(b)),
    ]);
}

function teamCardHtml(team) {
  return `
    <article class="team-card">
      ${teamFlagHtml(team)}
      <strong>${escapeHtml(team)}</strong>
    </article>
  `;
}

function renderPointsBreakdown() {
  const rules = [
    [
      "Perfect score",
      state.config.points.exactScore,
      "Exact scoreline. This replaces all other bonuses.",
    ],
    [
      "Correct result",
      state.config.points.correctOutcome,
      "Right winner, or correctly predicted a draw.",
    ],
    [
      "Team goals",
      state.config.points.correctTeamGoalsBonus,
      "One team's goals exactly right.",
    ],
  ];

  els.pointsBreakdownList.innerHTML = rules
    .map(
      ([label, points, description]) => `
      <article class="points-rule">
        <strong>${escapeHtml(label)}</strong>
        <span class="points-rule-value">${points} pt${points === 1 ? "" : "s"}</span>
        <p>${escapeHtml(description)}</p>
      </article>
    `,
    )
    .join("");
}

function renderTournamentPredictions() {
  const form = els.tournamentPredictionForm;
  const prediction = getTournamentPrediction(activePlayerId);
  const locked = isTournamentPredictionLocked();
  const hasPlayer = Boolean(activePlayerId && state.players[activePlayerId]);
  const disabled = !hasPlayer || locked;

  form.mostGoals.value = prediction?.mostGoals || "";
  form.mostAssists.value = prediction?.mostAssists || "";
  form.goldenGlove.value = prediction?.goldenGlove || "";
  form.worldCupWinner.innerHTML = `
    <option value="">Select winner</option>
    ${getTournamentWinnerTeams()
      .map(
        (team) =>
          `<option value="${escapeHtml(team)}" ${prediction?.worldCupWinner === team ? "selected" : ""}>${escapeHtml(team)}</option>`,
      )
      .join("")}
  `;

  Array.from(form.elements).forEach((field) => {
    field.disabled = disabled;
  });

  if (!hasPlayer) {
    els.tournamentPredictionStatus.textContent =
      "Create or select your player to make tournament predictions.";
  } else if (locked) {
    els.tournamentPredictionStatus.textContent =
      "Tournament predictions are locked now the World Cup has started.";
  } else if (prediction) {
    els.tournamentPredictionStatus.textContent =
      "Saved for this player. You can edit these until the World Cup starts.";
  } else {
    els.tournamentPredictionStatus.textContent =
      "Pick your tournament calls before the World Cup starts.";
  }
}

function handleTournamentPredictionInput(event) {
  const form = event.currentTarget;
  if (!activePlayerId || isTournamentPredictionLocked()) return;

  clearTimeout(form.saveTimer);
  els.tournamentPredictionStatus.textContent = "Saving tournament predictions...";
  form.saveTimer = setTimeout(() => {
    saveTournamentPredictionForm(form).catch((error) => {
      console.error(error);
      els.tournamentPredictionStatus.textContent =
        error.message || "Could not save tournament predictions.";
    });
  }, TOURNAMENT_PREDICTION_SAVE_DEBOUNCE_MS);
}

async function saveTournamentPredictionForm(form) {
  if (!activePlayerId || isTournamentPredictionLocked()) return;

  const prediction = {
    playerId: activePlayerId,
    mostGoals: form.mostGoals.value.trim(),
    mostAssists: form.mostAssists.value.trim(),
    goldenGlove: form.goldenGlove.value.trim(),
    worldCupWinner: form.worldCupWinner.value,
    updatedAt: new Date().toISOString(),
  };

  state.tournamentPredictions[activePlayerId] = prediction;
  await saveTournamentPrediction(prediction);
  saveState();
  els.tournamentPredictionStatus.textContent = "Tournament predictions saved.";
}

function getTournamentPrediction(playerId) {
  return state.tournamentPredictions[playerId];
}

function getTournamentWinnerTeams() {
  return getAllMatchTeams().filter(
    (team) => !team.startsWith("Group ") && !team.startsWith("Match "),
  );
}

function isTournamentPredictionLocked() {
  return Date.now() >= getTournamentStartTime();
}

function getTournamentStartTime() {
  return Math.min(
    ...matchesData.map((match) => new Date(match.kickoff).getTime()),
  );
}

function leaderboardFormHtml(playerId) {
  const recent = getRecentPlayerForm(playerId);
  const items = [...recent];
  while (items.length < 5) items.push(null);

  return `
    <div class="form-strip" aria-label="Recent form">
      ${items.map((item) => (item ? formDotHtml(item) : `<span class="form-dot form-empty" aria-label="No result yet"></span>`)).join("")}
    </div>
  `;
}

function getRecentPlayerForm(playerId) {
  return matchesData
    .map((match) => {
      const prediction = getPrediction(playerId, match.id);
      const result = state.results[match.id];
      if (!prediction || !result) return null;
      return {
        match,
        result,
        score: scorePrediction(prediction, result),
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.match.kickoff) - new Date(a.match.kickoff))
    .slice(0, 5);
}

function formDotHtml(item) {
  const status = getPredictionStatus(item.score);
  const tooltip = leaderboardBreakdownHtml(item.match, item.result, item.score);
  const label = `${item.match.home} ${item.result.homeScore}-${item.result.awayScore} ${item.match.away}. ${pointsLabel(item.score.points)}.`;
  return `
    <button class="form-dot ${status.className}" type="button" aria-label="${escapeHtml(label)}" aria-expanded="false">
      <span class="status-tooltip">${tooltip}</span>
    </button>
  `;
}

function renderPlayerPredictions() {
  syncViewedPredictionPlayer();
  renderPredictionPlayerOptions();

  const player = state.players[viewedPredictionPlayerId];
  if (!player) {
    els.predictionTotal.textContent = "0";
    els.playerPredictions.innerHTML = `<p class="muted">No active player loaded.</p>`;
    return;
  }

  const predictions = matchesData
    .map((match) => {
      const prediction = getPrediction(viewedPredictionPlayerId, match.id);
      const result = state.results[match.id];
      const score =
        prediction && result ? scorePrediction(prediction, result) : null;
      return { match, prediction, result, score };
    })
    .filter((item) => item.prediction);

  const stats = calculatePlayerStats(player.id);
  els.predictionTotal.textContent = stats.points;

  els.playerPredictions.innerHTML =
    predictions
      .map(({ match, prediction, result, score }) => {
        const status = getPredictionStatus(score);
        const details = result
          ? predictionBreakdownHtml(match, result, score)
          : `<strong>Result pending</strong><span>${escapeHtml(match.home)} vs ${escapeHtml(match.away)}</span>`;
        const detailsLabel = result
          ? `Result: ${match.home} ${result.homeScore}-${result.awayScore} ${match.away}. ${pointsLabel(score.points)}.`
          : `Result pending for ${match.home} vs ${match.away}.`;

        return `
        <article class="prediction-item compact-prediction">
          <time>${formatShortDate(new Date(match.kickoff))}</time>
          <div class="prediction-fixture">
            <strong class="prediction-teams">
              ${teamHtml(match.home)}
              <span class="prediction-score">${prediction.homeScore}-${prediction.awayScore}</span>
              ${teamHtml(match.away)}
            </strong>
            <span>${escapeHtml(match.group)}</span>
          </div>
          <button class="prediction-status ${status.className}" type="button" aria-label="${escapeHtml(detailsLabel)}" aria-expanded="false">
            <span>${status.pointsText}</span>
            <span class="status-tooltip">${details}</span>
          </button>
        </article>
      `;
      })
      .join("") ||
    `<p class="muted">This player has not made any predictions yet.</p>`;
}

function syncViewedPredictionPlayer() {
  if (viewedPredictionPlayerId && state.players[viewedPredictionPlayerId])
    return;
  viewedPredictionPlayerId =
    activePlayerId && state.players[activePlayerId]
      ? activePlayerId
      : Object.keys(state.players)[0] || "";
}

function renderPredictionPlayerOptions() {
  const players = Object.values(state.players).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  els.predictionPlayerSelect.innerHTML = players
    .map(
      (player) =>
        `<option value="${escapeHtml(player.id)}">${escapeHtml(player.name)} (${escapeHtml(player.id)})</option>`,
    )
    .join("");
  els.predictionPlayerSelect.value = viewedPredictionPlayerId;
  els.predictionPlayerSelect.disabled = players.length === 0;
}

function getPredictionStatus(score) {
  if (!score) {
    return {
      className: "status-pending",
      label: "Result pending",
      pointsText: "-",
    };
  }

  if (score.exactScore) {
    return {
      className: "status-perfect",
      label: `Perfect score, ${pointsLabel(score.points)}`,
      pointsText: score.points,
    };
  }

  if (score.correctOutcome) {
    return {
      className: "status-winner",
      label: `Correct result, ${pointsLabel(score.points)}`,
      pointsText: score.points,
    };
  }

  return {
    className: "status-zero",
    label: "No points",
    pointsText: score.points,
  };
}

function predictionBreakdownHtml(match, result, score) {
  const rows = score.breakdown.length
    ? score.breakdown
        .map(
          (item) =>
            `<span>${escapeHtml(item.label)} <strong>${item.points}</strong></span>`,
        )
        .join("")
    : `<span>No points <strong>0</strong></span>`;

  return `
    <strong>Result: ${teamFlagHtml(match.home)} ${result.homeScore}-${result.awayScore} ${teamFlagHtml(match.away)}</strong>
    ${rows}
    <span>Total <strong>${score.points}</strong></span>
  `;
}

function leaderboardBreakdownHtml(match, result, score) {
  const rows = score.breakdown.length
    ? score.breakdown
        .map(
          (item) =>
            `<span>${escapeHtml(item.label)} <strong>${item.points}</strong></span>`,
        )
        .join("")
    : `<span>No points <strong>0</strong></span>`;

  return `
    <strong>${teamFlagHtml(match.home)} ${result.homeScore}-${result.awayScore} ${teamFlagHtml(match.away)}</strong>
    ${rows}
    <span>Total <strong>${score.points}</strong></span>
  `;
}

function pointsLabel(points) {
  return points === 0 ? "No points" : `${points} pt${points === 1 ? "" : "s"}`;
}

function renderResultsAdmin() {
  if (!adminUnlocked) return;

  els.resultsAdmin.innerHTML = matchesData
    .map((match) => {
      const result = state.results[match.id] || {};
      return `
      <form class="admin-row" data-match-id="${match.id}">
        <div class="admin-match-meta">
          <strong>${escapeHtml(match.id)}</strong>
          <p class="muted">${escapeHtml(match.group)} - ${formatDate(new Date(match.kickoff))}</p>
        </div>
        <label class="admin-score-label">
          ${teamHtml(match.home, { className: "admin-team-name mobile-tooltip-trigger", tooltip: true })}
          <input type="number" min="0" max="30" name="homeScore" value="${result.homeScore ?? ""}" />
        </label>
        <label class="admin-score-label">
          ${teamHtml(match.away, { className: "admin-team-name mobile-tooltip-trigger", tooltip: true })}
          <input type="number" min="0" max="30" name="awayScore" value="${result.awayScore ?? ""}" />
        </label>
        <p class="admin-save-status muted" aria-live="polite">${result.matchId ? "Saved" : "Enter score"}</p>
      </form>
    `;
    })
    .join("");

  els.resultsAdmin.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (event) => event.preventDefault());
    form.addEventListener("input", handleAdminResultInput);
  });
}

function handleAdminResultInput(event) {
  const form = event.currentTarget;
  const status = form.querySelector(".admin-save-status");
  clearTimeout(form.saveTimer);
  status.textContent = "Saving...";
  form.saveTimer = setTimeout(() => {
    saveAdminResultForm(form).catch((error) => {
      console.error(error);
      status.textContent = "Save failed";
    });
  }, SCORE_SAVE_DEBOUNCE_MS);
}

async function saveAdminResultForm(form) {
  const matchId = form.dataset.matchId;
  const status = form.querySelector(".admin-save-status");
  const homeValue = form.homeScore.value;
  const awayValue = form.awayScore.value;

  if (homeValue === "" && awayValue === "") {
    delete state.results[matchId];
    await deleteResult(matchId);
    saveState();
    status.textContent = "Cleared";
    renderLeaderboard();
    renderPlayerPredictions();
    return;
  }

  if (homeValue === "" || awayValue === "") {
    status.textContent = "Enter both scores";
    return;
  }

  const homeScore = Number(homeValue);
  const awayScore = Number(awayValue);
  if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore)) {
    status.textContent = "Invalid score";
    return;
  }

  const result = {
    matchId,
    homeScore,
    awayScore,
    updatedAt: new Date().toISOString(),
  };
  state.results[matchId] = result;
  await saveResult(result);
  saveState();
  status.textContent = "Saved";
  renderLeaderboard();
  renderPlayerPredictions();
}

function renderConfig() {
  if (!adminUnlocked) return;

  const controls = [
    ["lockMinutesBeforeKickoff", state.config.lockMinutesBeforeKickoff],
    ...Object.entries(state.config.points),
  ];

  els.scoringConfig.innerHTML = controls
    .map(
      ([key, value]) => `
        <label>
          ${labelize(key)}
          <input type="number" name="${key}" value="${value}" />
        </label>
      `,
    )
    .join("");
}

function renderLeaguesAdmin() {
  if (!adminUnlocked) return;

  els.leaguesAdmin.innerHTML = Object.entries(state.leagues)
    .map(
      ([leagueId, name]) => `
        <form class="admin-league-row" data-league-id="${escapeHtml(leagueId)}">
          <label>
            League name
            <input name="leagueName" value="${escapeHtml(name)}" required />
          </label>
          <p class="muted">${escapeHtml(leagueId)}</p>
          <span class="pill">${countPlayersInLeague(leagueId)} players</span>
          <p class="admin-save-status muted" aria-live="polite">Saved</p>
        </form>
      `,
    )
    .join("");

  els.leaguesAdmin.querySelectorAll(".admin-league-row").forEach((form) => {
    form.addEventListener("submit", (event) => event.preventDefault());
    form.addEventListener("input", handleLeagueNameInput);
  });
}

function handleLeagueNameInput(event) {
  const form = event.currentTarget;
  const status = form.querySelector(".admin-save-status");
  clearTimeout(form.saveTimer);
  status.textContent = "Saving...";
  form.saveTimer = setTimeout(() => {
    saveLeagueNameForm(form).catch((error) => {
      console.error(error);
      status.textContent = error.message || "Save failed";
    });
  }, 450);
}

async function saveLeagueNameForm(form) {
  const leagueId = form.dataset.leagueId;
  const input = form.elements.leagueName;
  const status = form.querySelector(".admin-save-status");
  const newName = input.value.trim();

  if (!newName) {
    status.textContent = "Name required";
    return;
  }

  if (newName === leagueName(leagueId)) {
    status.textContent = "Saved";
    return;
  }

  await updateLeagueName(leagueId, newName);
  status.textContent = "Saved";
  renderPlayerLeagueOptions();
  renderLeaderboard();
  renderSummary();
  renderPlayerPredictions();
}

function countPlayersInLeague(leagueId) {
  return Object.values(state.players).filter((player) =>
    getPlayerLeagueIds(player.id).includes(leagueId),
  ).length;
}

function renderUsersAdmin() {
  if (!adminUnlocked) return;

  const players = Object.values(state.players).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  els.usersAdmin.innerHTML =
    players
      .map((player) => {
        const stats = calculatePlayerStats(player.id);
        const playerLeagueIds = getPlayerLeagueIds(player.id);
        const predictionCount = Object.values(state.predictions).filter(
          (prediction) => prediction.playerId === player.id,
        ).length;
        const lastLoggedIn = player.lastLoggedIn
          ? formatDate(new Date(player.lastLoggedIn))
          : "Never logged";
        const removeLeagueControl = playerLeagueIds.length
          ? `
            <form class="kick-league-form" data-player-id="${escapeHtml(player.id)}">
              <select name="leagueId" aria-label="League to remove">
                ${playerLeagueIds
                  .map(
                    (leagueId) =>
                      `<option value="${escapeHtml(leagueId)}">${escapeHtml(leagueName(leagueId))}</option>`,
                  )
                  .join("")}
              </select>
              <button class="danger-button" type="submit">Remove league</button>
            </form>
          `
          : "";
        return `
        <article class="user-admin-row">
          <div>
            <strong>${escapeHtml(player.name)}</strong>
            <p class="muted">${escapeHtml(player.id)} - ${escapeHtml(leagueNames(player.leagueIds) || "Worldwide only")} - ${stats.points} pts - ${predictionCount} predictions - Last login: ${escapeHtml(lastLoggedIn)}</p>
          </div>
          <div class="user-admin-actions">
            ${removeLeagueControl}
            <button class="secondary delete-user" type="button" data-player-id="${escapeHtml(player.id)}">Delete</button>
          </div>
        </article>
      `;
      })
      .join("") || `<p class="muted">No users to delete yet.</p>`;

  els.usersAdmin.querySelectorAll(".delete-user").forEach((button) => {
    button.addEventListener("click", () => {
      deleteUser(button.dataset.playerId);
    });
  });

  els.usersAdmin.querySelectorAll(".kick-league-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      kickPlayerFromLeague(form.dataset.playerId, form.elements.leagueId.value);
    });
  });
}

async function kickPlayerFromLeague(playerId, leagueId) {
  const player = state.players[playerId];
  if (!player || !normalizeLeagueId(leagueId)) return;

  const confirmed = window.confirm(
    `Remove ${player.name} from ${leagueName(leagueId)}?`,
  );
  if (!confirmed) return;

  await leavePlayerLeague(playerId, leagueId);
  if (leaderboardScope === leagueId && playerId === activePlayerId) {
    leaderboardScope = getPlayerLeagueIds(playerId)[0] || WORLDWIDE_SCOPE;
  }
  render();
}

async function deleteUser(playerId) {
  const player = state.players[playerId];
  if (!player) return;

  const confirmed = window.confirm(
    `Delete ${player.name} and all of their predictions?`,
  );
  if (!confirmed) return;

  await deletePlayerFromSupabase(playerId);
  delete state.players[playerId];
  Object.keys(state.predictions).forEach((key) => {
    if (state.predictions[key].playerId === playerId) {
      delete state.predictions[key];
    }
  });
  delete state.tournamentPredictions[playerId];

  if (activePlayerId === playerId) {
    activePlayerId = "";
    state.activePlayerId = "";
  }

  if (viewedPredictionPlayerId === playerId) {
    viewedPredictionPlayerId = activePlayerId;
  }

  saveState();
  render();
}

function calculatePlayerStats(playerId) {
  return matchesData.reduce(
    (stats, match) => {
      const prediction = getPrediction(playerId, match.id);
      const result = state.results[match.id];
      if (!prediction || !result) return stats;

      const score = scorePrediction(prediction, result);
      stats.points += score.points;
      if (score.correctOutcome) stats.correctPredictions += 1;
      return stats;
    },
    { points: 0, correctPredictions: 0 },
  );
}

function scorePrediction(prediction, result) {
  const predictedOutcome = outcome(prediction.homeScore, prediction.awayScore);
  const actualOutcome = outcome(result.homeScore, result.awayScore);
  const exactScore =
    prediction.homeScore === result.homeScore &&
    prediction.awayScore === result.awayScore;
  const correctOutcome = predictedOutcome === actualOutcome;
  const correctTeamGoals =
    prediction.homeScore === result.homeScore ||
    prediction.awayScore === result.awayScore;

  let points = 0;
  const breakdown = [];

  if (exactScore) {
    points = state.config.points.exactScore;
    breakdown.push({
      label: "Perfect score",
      points: state.config.points.exactScore,
    });
    return { points, exactScore, correctOutcome, breakdown };
  }

  if (correctOutcome) {
    points += state.config.points.correctOutcome;
    breakdown.push({
      label: "Correct result",
      points: state.config.points.correctOutcome,
    });
  }
  if (correctTeamGoals) {
    points += state.config.points.correctTeamGoalsBonus;
    breakdown.push({
      label: "Team goals",
      points: state.config.points.correctTeamGoalsBonus,
    });
  }

  return { points, exactScore, correctOutcome, breakdown };
}

function outcome(homeScore, awayScore) {
  if (homeScore > awayScore) return "HOME";
  if (homeScore < awayScore) return "AWAY";
  return "DRAW";
}

function isLocked(match) {
  const lockAt =
    new Date(match.kickoff).getTime() -
    state.config.lockMinutesBeforeKickoff * 60 * 1000;
  return Date.now() >= lockAt;
}

function getPrediction(playerId, matchId) {
  return state.predictions[predictionKey(playerId, matchId)];
}

function predictionKey(playerId, matchId) {
  return `${playerId}:${matchId}`;
}

function teamHtml(team, options = {}) {
  const flagCode = TEAM_FLAG_CODES[team];
  const classes = ["team-name", options.className].filter(Boolean).join(" ");
  const title = options.title ? ` title="${escapeHtml(team)}"` : "";
  const tooltip = options.tooltip
    ? `<span class="mobile-tooltip">${escapeHtml(team)}</span>`
    : "";
  const tooltipAttrs = options.tooltip
    ? ` tabindex="0" role="button" aria-expanded="false"`
    : "";
  const name = `<span class="${escapeHtml(classes)}"${title}${tooltipAttrs}>${escapeHtml(team)}${tooltip}</span>`;
  if (!flagCode) return name;
  return `${teamFlagHtml(team)}${name}`;
}

function teamFlagHtml(team, options = {}) {
  const flagCode = TEAM_FLAG_CODES[team];
  const classes = ["flag", options.className].filter(Boolean).join(" ");
  const title = options.title ? ` title="${escapeHtml(team)}"` : "";
  const ariaHidden = options.tooltip ? "" : ` aria-hidden="true"`;
  const tooltip = options.tooltip
    ? `<span class="mobile-tooltip">${escapeHtml(team)}</span>`
    : "";
  const tooltipAttrs = options.tooltip
    ? ` tabindex="0" role="button" aria-expanded="false"`
    : "";
  const fallback = team
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  if (!flagCode) {
    return `
      <span class="${escapeHtml(classes)} flag-missing ${options.tooltip ? "mobile-tooltip-trigger" : ""}"${ariaHidden}${title}${tooltipAttrs}>
        <span class="flag-fallback">${escapeHtml(fallback)}</span>
        ${tooltip}
      </span>
    `;
  }

  return `
    <span class="${escapeHtml(classes)} ${options.tooltip ? "mobile-tooltip-trigger" : ""}"${ariaHidden}${title}${tooltipAttrs}>
      <img src="https://flagcdn.com/${flagCode}.svg" alt="" loading="lazy" onerror="this.closest('.flag').classList.add('flag-missing'); this.remove();" />
      <span class="flag-fallback">${escapeHtml(fallback)}</span>
      ${tooltip}
    </span>
  `;
}

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDateHeading(date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatTime(date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatTabDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(date);
}

function labelize(value) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

initializeApp();
setInterval(updateNextMatchCountdown, 1000);
