## Big Group Bruh — The Archive

A loud, deeply-teenage Y2K/MSN-era tribute site to the Big Group Bruh WhatsApp chat. Pixel fonts, gradient chrome, blinking stars, glitter dividers, custom cursors, "now playing" winamp widgets, MySpace-style member profiles — but underneath it's a serious, fast, data-driven single-page experience built from the real chat export. Names, numbers, profanity and curses kept verbatim.

### Visual language
- Palette: hot pink / cyan / lime / black on tiled gradient backgrounds, with white "window" cards that look like XP/MSN dialogs (title bars, close buttons that wiggle but don't close).
- Type: pixel display font (Press Start 2P / VT323) for headings, Tahoma/Verdana for body. Marquee tickers, blinking `<blink>`-style accents, sparkle GIFs, hit counters.
- Motion: cursor trails, hover sparkles, window drag/jiggle, CRT scanlines toggle, MIDI-style mute button (no actual audio unless approved later).
- Custom CSS only — no images required beyond a few inline SVG sparkles/stars.

### Data pipeline (one-time, build-time)
A Node script (`scripts/parse-chat.ts`) reads the WhatsApp `.txt` export and emits typed JSON into `src/data/`:
- `members.json` — canonical member list, aliases merged (e.g. unsaved +44 numbers stay as-is per your choice), join events, message totals.
- `messages.json` — every message: `{ ts, author, text, isMedia, isDeleted, isSystem }`.
- `stats.json` — totals, deleted count, late-night count (00:00–05:00), per-member breakdowns, profanity counts, hour histogram, day histogram, month buckets.
- `leaderboards.json` — activity, profanity, late-night, deleted, media-share, avg msg length, longest streak.
- `pairs.json` — reply-chemistry matrix (who replies to whom within 2 min).
- `vocab.json` — top words & emojis, weighted, with stopword filtering.
- `daily.json` — per-day counts + top quote of the day (longest non-media, non-deleted message).
- `events.json` — hand-curated + auto-detected: group name changes, member adds, "Emma hospital" mentions, Leon→Charlie curses, beefs (heuristic: dense back-and-forth with profanity between two specific members).

The script runs once via `bun run parse-chat`, output is committed. Site has zero runtime backend.

### Sections (all interactive)

1. **Front Page / Splash** — animated MSN-style logon screen. Big counters tick up: total messages, members, deleted, late-night, days covered. "Enter the chat" button.
2. **Activity Heatmap Calendar** — GitHub-style grid of every day Nov 2025→present. Hover any cell: popover with count + top quote of that day.
3. **Message Leaderboard** — tabs for Activity / Profanity / Late Night / Deleted / Media. Animated rank bars, podium for top 3.
4. **Member Profiles** — grid of MySpace cards. Click → full dossier window: avatar (auto-generated initials in their accent color), top stats, signature words, top emoji, peak hour, first/last message, an auto-generated "personality summary" derived from their stats (template-based, not LLM).
5. **Hall of Fame** — curated longest/funniest/most-reacted messages as framed "trophies" with shimmer borders.
6. **The Curse Wall** — every Leon→Charlie curse pulled by keyword heuristic, shown as torn parchment scraps on a corkboard, draggable.
7. **Group Name Saga** — horizontal timeline of every "subject changed" event, scrubbable, with timestamp and who did it.
8. **Beef Section** — auto-detected conflicts as case files; expandable timeline of the actual back-and-forth.
9. **Emma's Hospital Saga** — vertical chronological timeline of every Emma/hospital-related message, styled like a medical chart.
10. **Unhinged Incidents** — filed reports (manila folder UI), each opens to show the offending message thread.
11. **Pair Chemistry Graph** — interactive force-directed graph (D3-style, custom SVG); thicker edges = more replies. Click a node to isolate.
12. **Vocabulary Cloud** — interactive word cloud, sized by frequency, click a word to see every message containing it.
13. **Ships & Situationships** — relationship map; nodes = members, edges = ship intensity (mention pairs, romantic-keyword density). Toggle between "canon" and "delusional".
14. **Activity Graphs** — by-hour radial clock chart + by-month bar chart, both with hover tooltips and per-member filter.
15. **Awards Ceremony** — animated envelope-open reveals. Each award (Most Cursed, Night Owl, Yapper of the Year, etc.) backed by real stats. Auto-plays or step-through.
16. **AI System Updates** — fictional "patch notes" lore section written in changelog style referencing real moments.
17. **Patch Notes** — site version history (meta).

### Interactive features (cross-cutting)

- **Chat Replay Mode** — floating phone-frame UI; plays messages back chronologically. Scrubable timeline, speed toggle (1×/4×/16×/64×), jump-to-date, pause. Renders as authentic WhatsApp bubbles.
- **Member Voice Meter** — stacked area chart of each member's share-of-voice across months; hover a band to highlight one member.
- **Drama Thermometer** — line chart of "tension score" per day (profanity + reply velocity + caps ratio). Auto-labelled peaks ("Group Name Night", "Charlie Curse Spike", etc.).
- **Message Search** — instant client-side fuzzy search across all messages; results show author, timestamp, click to open in Replay Mode at that point.
- **Spin the Wheel of Chaos** — big spinnable wheel; lands on a random message and shows it in a popup window.
- **Member Rivalry Viewer** — pick two members from dropdowns → head-to-head card: messages, profanity, late-night, replies-to-each-other, who-curses-whom, longest exchange.
- **Night Owl Tracker** — radial 24-hour clock visualising every after-midnight message as a glowing dot, filterable by member.
- **Monthly Report Cards** — one card per month: biggest story, top quote, mood (derived from sentiment-ish heuristics), top 3 talkers, defining word.

### Tech notes (for the technical reader)
- TanStack Start with file-based routes: one route per major section so each is shareable, plus `/` as the splash hub. Section pages share a persistent floating Replay Mode dock.
- All data static JSON imported at build time; no DB, no Lovable Cloud needed.
- Charts: hand-rolled SVG + a tiny amount of D3-scale; no heavy chart lib.
- Search: prebuilt inverted index in JSON for instant lookup.
- Strict TS, every route has `errorComponent` + `notFoundComponent`, root has `head()` per page.
- Performance: `messages.json` (~40k lines, ~2.4 MB) is split into monthly chunks loaded on demand by Replay Mode and Search; aggregate JSONs stay tiny so initial load is fast.

### Build order
1. Parse script + JSON dataset (foundation for everything).
2. Y2K design system (CSS tokens, window component, pixel fonts, marquee, sparkle utilities).
3. Splash + global layout + floating Replay dock + section nav.
4. Stats-driven sections: Front page counters, Leaderboard, Activity graphs, Heatmap, Voice Meter, Drama Thermometer, Night Owl, Vocab cloud, Pair graph, Ships map.
5. Narrative sections: Member Profiles, Hall of Fame, Curse Wall, Group Name Saga, Beef, Emma Hospital, Unhinged Incidents, Monthly Report Cards, Awards Ceremony, AI System Updates, Patch Notes.
6. Interactive tools: Search, Wheel of Chaos, Rivalry Viewer, full Replay Mode polish.
7. QA pass + responsive tuning for mobile (your current viewport is 408px wide — every section will adapt).