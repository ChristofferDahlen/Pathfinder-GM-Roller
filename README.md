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

Special thanks to **Ashley Hemerik** for inspiration from [pathfinderdashboard.com](https://pathfinderdashboard.com/).

## Tech Stack

- [Nuxt 4](https://nuxt.com) — Vue framework
- [PrimeVue](https://primevue.org) — UI components
- [Tailwind CSS](https://tailwindcss.com) — utility styling
- [VueUse](https://vueuse.org) — keyboard shortcut handling
