// Shared data loading and standings math for all pages.

async function fetchJSON(url) {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.json();
}

async function loadLeague() {
  const [teamsData, gamesData] = await Promise.all([
    fetchJSON('data/teams.json'),
    fetchJSON('data/games.json'),
  ]);
  const teams = teamsData.teams;
  const games = gamesData.games;
  return { season: teamsData.season, teams, games, table: buildTable(teams, games) };
}

function isPlayed(g) {
  return g.teamA != null && g.teamB != null && g.winsA != null && g.winsB != null;
}

// One row per team: points = individual games won; a match is won by taking
// more of its games. Sorted by points, then team number. Tied points share a rank.
function buildTable(teams, games) {
  const rows = new Map(teams.map(t => [t.team, {
    team: t.team, pts: 0, played: 0, w: 0, l: 0, t: 0, form: [],
  }]));

  games.filter(isPlayed).forEach(g => {
    [[g.teamA, g.winsA, g.winsB], [g.teamB, g.winsB, g.winsA]].forEach(([team, mine, theirs]) => {
      const r = rows.get(team);
      if (!r) return;
      r.pts += mine;
      r.played += 1;
      const res = mine > theirs ? 'w' : mine < theirs ? 'l' : 't';
      r[res] += 1;
      r.form.push(res);
    });
  });

  const sorted = [...rows.values()].sort((a, b) => b.pts - a.pts || a.team - b.team);
  sorted.forEach((r, i) => {
    r.rank = i > 0 && r.pts === sorted[i - 1].pts ? sorted[i - 1].rank : i + 1;
  });
  return sorted;
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function initials(name) {
  return name.split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function formatDate(iso, opts = { month: 'short', day: 'numeric' }) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', opts);
}

function showError(el, what) {
  el.innerHTML = `<p class="status error">Couldn't load ${what}. Please refresh to try again.</p>`;
}
