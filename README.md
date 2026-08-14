# Pathfinder GM Roller

A real-time skill check tracker for Pathfinder 2e game masters. Set a DC and instantly see how every party member rolls against it across all skills and defenses.

**Live site:** https://christofferdahlen.github.io/Pathfinder-GM-Roller/

## Features

- **Roll table** — displays all characters' skill checks side by side, updated live as the DC changes
- **DC panel** — adjust the DC via input, difficulty buttons (±2, ±5, ±10), or a slider
- **Saved DCs** — store up to 6 DCs with Save / Set / Swap controls and keyboard shortcuts
- **Level Based DCs** — look up DCs by creature or task level
- **Creature Identification** — Recall Knowledge DCs by creature trait
- **Quick Selects** — one-click skill row selection presets
- **Auto Roll** — automatically reroll at a configurable interval
- **Character editor** — set proficiency, attributes, item bonuses and penalties per skill
- **Pathbuilder 2e import** — load characters via build ID or pasted JSON
- **Dark / light mode** — toggle with persistent preference
- **Keyboard shortcuts** — fully configurable

## Result Colors

| Color | Outcome |
|---|---|
| 🟢 Dark green | Critical Success |
| 🔵 Dark blue | Success |
| 🔴 Dark red | Failure |
| 🟠 Orange | Critical Failure |

A lime border indicates a natural 20; an amber border indicates a natural 1.

## Character Server Sync

Sync your party's character data from a remote Pathbuilder JSON server instead of manually importing each character. Useful when a GM manages character sheets centrally.

### How it works

1. Open **Save/Load Party** → click **Update from Server**
2. Enter the server URL (e.g., `http://192.168.1.100:8080` or a Tailscale IP)
3. Select a campaign (if the server supports it) or sync all characters directly
4. Click **Sync Characters** — each character's stats are updated from the latest Pathbuilder JSON

Characters are matched by name (case-insensitive). Existing party members are updated; new characters from the server are added to the party. Nothing is deleted.

The server URL and campaign selection are saved in your browser's localStorage.

### Server API Requirements

Any HTTP server that implements these endpoints works:

| Endpoint | Required | Response |
|----------|----------|----------|
| `GET /api/campaigns` | Optional | `{"campaigns": {"campaign_name": ["player1", "player2"]}}` |
| `GET /api/latest-jsons` | Yes | `{"campaigns": {"name": [...]}}` grouped, or `{"characters": [...]}` flat |
| `GET /api/latest-jsons?campaign=X` | Optional | Filtered to one campaign |
| `GET /api/latest-jsons?flat=true` | Optional | Returns `{"characters": [...]}` as a flat array |
| `GET <download_url>` | Yes | Raw Pathbuilder JSON (`{"build": {...}}`) |

Each character entry in the response must include:
- `name` — character display name
- `level` — character level (number)
- `download_url` — relative URL to fetch the full Pathbuilder JSON

The server must set `Access-Control-Allow-Origin: *` (CORS) for browser access.

If `/api/campaigns` returns a 404 or error, the sync falls back to flat mode automatically.

### Compatible servers

- [CD_PF2e_Campaigns](https://github.com/ChristofferDahlen/CD_PF2e_Campaigns) — the reference implementation (`just serve-public`)

## Development

Install dependencies:

```bash
npm install
```

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

Generate a static build:

```bash
npm run generate
```

Run unit tests:

```bash
npm run test
```

## Deployment

The project deploys automatically to GitHub Pages via GitHub Actions on every push to `main`.

To enable: go to **Settings → Pages** in the repository and set the source to **GitHub Actions**.

## License

MIT — see [LICENSE](LICENSE)

## Acknowledgements

Special thanks to **Ashley Hemerik** (and her community) for the help from [pathfinderdashboard.com](https://pathfinderdashboard.com/).

## Tech Stack

- [Nuxt 4](https://nuxt.com) — Vue framework
- [PrimeVue](https://primevue.org) — UI components
- [Tailwind CSS](https://tailwindcss.com) — utility styling
- [VueUse](https://vueuse.org) — keyboard shortcut handling
