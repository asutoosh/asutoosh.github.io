# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Static portfolio website (HTML/CSS/JS). No build tools, no package manager, no backend, no database. Served directly as static files via GitHub Pages in production.

### Running locally

Serve the site using any static HTTP server from the repo root:

```
python3 -m http.server 8080
```

Then open `http://localhost:8080` in a browser.

### Key pages

- `index.html` — Homepage with hero, projects, tech stack, links
- `about.html` — About page
- `blog.html` — Blog page
- `pnl.html` — Trading PnL dashboard (loads Chart.js from CDN; charts require Google Sheets API data to populate)
- `styles.css` — All styles
- `script.js` — Theme toggle, mobile nav, scroll animations, copy email

### Notes

- No lint, test, or build commands exist — this is plain HTML/CSS/JS with no tooling.
- The PnL page fetches data from a Google Sheets endpoint; charts will appear empty without that external data (this is expected locally).
- Theme preference is persisted in `localStorage`.
