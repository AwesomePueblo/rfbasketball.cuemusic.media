# RF Basketball site

Static site for the Remnant Fellowship Basketball League, deployed by Netlify
(project `rfbball`) to https://rfbball.landhllc.com on every push to `main`.
No build step.

## League data

All league data lives in `data/` and is edited by hand (usually by Claude, from
chat). There is no other database.

- `data/teams.json`: rosters. `teams[].team` is the team number,
  `teams[].players` the player names.
- `data/games.json`: one entry per scheduled game:
  `{"date": "YYYY-MM-DD", "time": "6:30", "teamA": 1, "teamB": 2, "winsA": 3, "winsB": 0}`.
  - Unplayed game: `winsA` and `winsB` are `null`.
  - Matchup not yet decided: `teamA` and `teamB` are `null`.
  - Keep one game per line and the list in date/time order.

Standings (points = total wins, match record, head-to-head) are computed in
the browser by `league.js`, which every data page loads; never store totals.
The schedule on `rules.html` is also generated from `data/games.json`.

### Recording results from chat

When told something like "Team 3 beat Team 5 2 to 1 tonight":
1. Find the matching game in `data/games.json` (same two teams, the date given
   or the most recent unscored one). If none matches or it is ambiguous, ask.
2. Set `winsA`/`winsB` according to which team is `teamA`.
3. Validate: `python3 -c "import json; json.load(open('data/games.json'))"`.
4. Commit with a message like `Record 05/19: Team 3 2-1 Team 5` and push to
   `main`. Tell the user the new point totals.

## Design

`styles.css` holds all styling; `theme.js` swaps the five color themes by
setting `--primary*`, `--accent` and the `*-rgb` variables. Each page repeats
the same top bar and footer markup (no build step), so keep them in sync.
