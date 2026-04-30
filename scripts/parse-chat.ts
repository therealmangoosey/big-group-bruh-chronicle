/**
 * Parses the WhatsApp .txt export into typed JSON files in src/data/.
 * Run with: bun run scripts/parse-chat.ts
 * The output JSON is the entire dataset the site is built from.
 */
import fs from "node:fs";
import path from "node:path";

const SRC = path.join(import.meta.dir, "chat-source.txt");
const OUT = path.join(import.meta.dir, "..", "src", "data");
fs.mkdirSync(OUT, { recursive: true });

type Msg = {
  id: number;
  ts: number;
  date: string;
  hour: number;
  author: string;
  text: string;
  isMedia: boolean;
  isDeleted: boolean;
  isSystem: boolean;
};

const RAW = fs.readFileSync(SRC, "utf8").replace(/\u200E|\u200F/g, "");
const LINE_RE = /^(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}) - (.*)$/;

const lines = RAW.split(/\r?\n/);
const raw: Array<{ ts: number; rest: string }> = [];
for (const line of lines) {
  const m = line.match(LINE_RE);
  if (m) {
    const [, dd, mm, yyyy, hh, mi, rest] = m;
    const ts = Date.UTC(+yyyy, +mm - 1, +dd, +hh, +mi);
    raw.push({ ts, rest });
  } else if (raw.length) {
    raw[raw.length - 1].rest += "\n" + line;
  }
}

const ALIAS: Record<string, string> = {
  You: "Leon",
  "Leon Maher": "Leon",
  "🌷Evie": "Evie",
  "ℛ𝓊𝒷𝓎-𝓁ℴ𝓊𝒾𝓈ℯ 💞✞": "Ruby",
  "𝙴𝚠𝚊𝚗": "Ewan",
  "Emma 🏎️🏁": "Emma",
  "coral:3": "Coral",
  "~ 👍": "Thumbs",
  "Danny & Liam": "Danny&Liam",
};
const canonAuthor = (a: string) => ALIAS[a.trim()] ?? a.trim();

const messages: Msg[] = [];
const groupNameChanges: Array<{ ts: number; date: string; by: string; from: string; to: string }> = [];
const memberAdds: Array<{ ts: number; by: string; added: string[] }> = [];
const memberLeaves: Array<{ ts: number; who: string }> = [];

let id = 0;
for (const { ts, rest } of raw) {
  const firstLine = rest.split("\n")[0];

  const gnc = firstLine.match(/^(.+?) changed the group name from "(.*)" to "(.*)"$/);
  if (gnc) {
    groupNameChanges.push({
      ts,
      date: new Date(ts).toISOString().slice(0, 10),
      by: canonAuthor(gnc[1]),
      from: gnc[2],
      to: gnc[3],
    });
    continue;
  }
  const addM = firstLine.match(/^(.+?) added (.+)$/);
  if (addM && !firstLine.includes(": ")) {
    memberAdds.push({ ts, by: canonAuthor(addM[1]), added: addM[2].split(/, | and /).map(canonAuthor) });
    continue;
  }
  const leftM = firstLine.match(/^(.+?) left$/);
  if (leftM && !firstLine.includes(": ")) {
    memberLeaves.push({ ts, who: canonAuthor(leftM[1]) });
    continue;
  }

  const SYSTEM_HINTS = [
    "created this group", "changed this group's icon", "changed the group description",
    "changed the group settings", "changed their phone number",
    "Messages and calls are end-to-end encrypted", "pinned a message",
    "turned on admin", "turned off admin", "joined using this group's invite link",
    "joined from the community", "Tap to change", "is now an admin",
    "no longer an admin", "deleted this group's icon", "added you", "removed",
  ];
  if (SYSTEM_HINTS.some((h) => firstLine.includes(h)) && !firstLine.includes(": ")) continue;

  const colonIdx = rest.indexOf(": ");
  if (colonIdx === -1) continue;

  const author = canonAuthor(rest.slice(0, colonIdx));
  const text = rest.slice(colonIdx + 2);
  const isMedia = text.startsWith("<Media omitted>");
  const isDeleted = text === "This message was deleted" || text === "You deleted this message";
  const d = new Date(ts);
  messages.push({
    id: id++, ts, date: d.toISOString().slice(0, 10), hour: d.getUTCHours(),
    author, text, isMedia, isDeleted, isSystem: false,
  });
}

console.log(`Parsed ${messages.length} messages, ${groupNameChanges.length} group name changes`);

// Members: anyone with >=5 messages
const authorCounts = new Map<string, number>();
for (const m of messages) authorCounts.set(m.author, (authorCounts.get(m.author) ?? 0) + 1);
const memberNames = [...authorCounts.entries()].filter(([, c]) => c >= 5).map(([n]) => n);
const memberSet = new Set(memberNames);
const realMessages = messages.filter((m) => memberSet.has(m.author));

const PALETTE = [
  "#ff3ea5","#00e0ff","#a3ff00","#ffd400","#ff6b00","#9d00ff","#00ff88","#ff0044",
  "#00b4ff","#ff8ad4","#ffe600","#7cffb2","#ff4d6d","#41ead4","#fbff12","#b537f2",
  "#ff9f1c","#2ec4b6","#e71d36","#8338ec","#3a86ff","#ffbe0b","#fb5607","#06ffa5",
  "#ff006e","#8ac926","#1982c4","#6a4c93",
];

const members = memberNames
  .sort((a, b) => (authorCounts.get(b)! - authorCounts.get(a)!))
  .map((name, i) => ({
    name,
    initials: name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || "??",
    color: PALETTE[i % PALETTE.length],
    messageCount: authorCounts.get(name)!,
  }));

// Stats
const totalMessages = realMessages.length;
const totalMedia = realMessages.filter((m) => m.isMedia).length;
const totalDeleted = realMessages.filter((m) => m.isDeleted).length;
const lateNight = realMessages.filter((m) => m.hour >= 0 && m.hour < 5).length;
const dateSet = new Set(realMessages.map((m) => m.date));
const daysCovered = dateSet.size;

const hourHist = Array(24).fill(0) as number[];
for (const m of realMessages) hourHist[m.hour]++;

const monthHist = new Map<string, number>();
for (const m of realMessages) {
  const k = m.date.slice(0, 7);
  monthHist.set(k, (monthHist.get(k) ?? 0) + 1);
}

// Profanity
const PROFANITY = ["fuck","shit","bitch","cunt","wank","bastard","dick","cock","piss","twat","arse","ass","fag","faggot","slut","whore","bollocks","prick","knob","nonce","retard"];
const PROF_RE = new RegExp(`\\b(${PROFANITY.join("|")})\\w*\\b`, "gi");
const profanityCount = (t: string) => (t ? (t.match(PROF_RE)?.length ?? 0) : 0);

const profByAuthor = new Map<string, number>();
const lateByAuthor = new Map<string, number>();
const delByAuthor = new Map<string, number>();
const mediaByAuthor = new Map<string, number>();
const lenByAuthor = new Map<string, { sum: number; n: number }>();
const hourByAuthor = new Map<string, number[]>();
const firstLast = new Map<string, { first: number; last: number }>();
const wordsByAuthor = new Map<string, Map<string, number>>();
const emojiByAuthor = new Map<string, Map<string, number>>();
const allCapsByAuthor = new Map<string, number>();

const EMOJI_RE = /\p{Extended_Pictographic}/gu;
const STOP = new Set(
  "i a an the and or but if then it its is am are was were be been being to of in on at for with from by as not no yes do does did so up down out you your yours my me we us our ours they them their he she his her him this that these those there here just like got get go going come came have has had will would could should can cant don't dont wont won't im i'm u ur he's shes she's hes its it's all any some what when where who why how about into onto off over under again very also more most less only own same than too each both other another which whom whose because oh ok okay yeah yh yea nah na lol lmao bruh bro idk imo tbh wtf wym say said tell told think thought know knew want wanted need needed make made take took give gave see saw look looked feel felt".split(/\s+/),
);

for (const m of realMessages) {
  if (m.isDeleted) {
    delByAuthor.set(m.author, (delByAuthor.get(m.author) ?? 0) + 1);
    continue;
  }
  if (m.isMedia) {
    mediaByAuthor.set(m.author, (mediaByAuthor.get(m.author) ?? 0) + 1);
    continue;
  }
  profByAuthor.set(m.author, (profByAuthor.get(m.author) ?? 0) + profanityCount(m.text));
  if (m.hour >= 0 && m.hour < 5) lateByAuthor.set(m.author, (lateByAuthor.get(m.author) ?? 0) + 1);

  const cur = lenByAuthor.get(m.author) ?? { sum: 0, n: 0 };
  cur.sum += m.text.length; cur.n++;
  lenByAuthor.set(m.author, cur);

  const hh = hourByAuthor.get(m.author) ?? Array(24).fill(0);
  hh[m.hour]++; hourByAuthor.set(m.author, hh);

  const fl = firstLast.get(m.author) ?? { first: m.ts, last: m.ts };
  fl.first = Math.min(fl.first, m.ts); fl.last = Math.max(fl.last, m.ts);
  firstLast.set(m.author, fl);

  const letters = m.text.replace(/[^A-Za-z]/g, "");
  if (letters.length >= 4 && letters === letters.toUpperCase()) {
    allCapsByAuthor.set(m.author, (allCapsByAuthor.get(m.author) ?? 0) + 1);
  }

  const wmap = wordsByAuthor.get(m.author) ?? new Map<string, number>();
  for (const w of m.text.toLowerCase().split(/[^a-z']+/)) {
    if (w.length < 3 || STOP.has(w)) continue;
    wmap.set(w, (wmap.get(w) ?? 0) + 1);
  }
  wordsByAuthor.set(m.author, wmap);

  const emap = emojiByAuthor.get(m.author) ?? new Map<string, number>();
  const ems = m.text.match(EMOJI_RE);
  if (ems) for (const e of ems) emap.set(e, (emap.get(e) ?? 0) + 1);
  emojiByAuthor.set(m.author, emap);
}

const globalWords = new Map<string, number>();
const globalEmoji = new Map<string, number>();
for (const m of realMessages) {
  if (m.isMedia || m.isDeleted) continue;
  for (const w of m.text.toLowerCase().split(/[^a-z']+/)) {
    if (w.length < 3 || STOP.has(w)) continue;
    globalWords.set(w, (globalWords.get(w) ?? 0) + 1);
  }
  const ems = m.text.match(EMOJI_RE);
  if (ems) for (const e of ems) globalEmoji.set(e, (globalEmoji.get(e) ?? 0) + 1);
}

// Daily counts + top quote of the day
const dayMap = new Map<string, { count: number; topMsg?: Msg }>();
for (const m of realMessages) {
  const d = dayMap.get(m.date) ?? { count: 0 };
  d.count++;
  if (!m.isMedia && !m.isDeleted) {
    const score = (mm: Msg) => Math.min(mm.text.length, 200) + (mm.text === mm.text.toUpperCase() ? 20 : 0);
    if (!d.topMsg || score(m) > score(d.topMsg)) d.topMsg = m;
  }
  dayMap.set(m.date, d);
}

// Reply chemistry within 2 minutes
const pairCounts = new Map<string, number>();
for (let i = 1; i < realMessages.length; i++) {
  const a = realMessages[i], b = realMessages[i - 1];
  if (a.author === b.author) continue;
  if (a.ts - b.ts > 2 * 60 * 1000) continue;
  if (a.isMedia || a.isDeleted || b.isMedia || b.isDeleted) continue;
  const k = `${a.author}|${b.author}`;
  pairCounts.set(k, (pairCounts.get(k) ?? 0) + 1);
}

// Drama per day
const dramaByDay = new Map<string, number>();
for (const m of realMessages) {
  if (m.isMedia || m.isDeleted) continue;
  let s = profanityCount(m.text) * 3;
  if (m.hour >= 0 && m.hour < 5) s += 1;
  const letters = m.text.replace(/[^A-Za-z]/g, "");
  if (letters.length >= 4 && letters === letters.toUpperCase()) s += 2;
  dramaByDay.set(m.date, (dramaByDay.get(m.date) ?? 0) + s);
}

// Curse Wall — Leon talking about/at Charlie
const CURSE_VOCAB = /\b(curse|hex|may|hope|shall|forever|misfortune|plague|wrath|doom|smite|condemn|damn|rot|die|cry|suffer|lose|fail|fall)\b/i;
const curseWall = realMessages
  .filter((m) => m.author === "Leon" && !m.isMedia && !m.isDeleted)
  .filter((m) => /\bcharlie\b/i.test(m.text) || CURSE_VOCAB.test(m.text))
  .filter((m) => m.text.length > 25 && m.text.length < 600)
  .slice(0, 80);

// Emma hospital
const HOSP_RE = /\b(hospital|a&e|ambulance|surgery|doctor|nurse|ward|er|stitches|injection|pain|sick|ill|operation|operated|admitted|discharged|antibiotic|medication|seizure|faint|collapse|blood)\b/i;
const emmaSaga = realMessages
  .filter((m) => !m.isMedia && !m.isDeleted)
  .filter((m) => (m.author === "Emma" && HOSP_RE.test(m.text)) || (/\bemma\b/i.test(m.text) && HOSP_RE.test(m.text)))
  .slice(0, 100);

// Hall of fame
const sortedByLen = [...realMessages]
  .filter((m) => !m.isMedia && !m.isDeleted && m.text.length < 800)
  .sort((a, b) => b.text.length - a.text.length);
const hof = {
  longest: sortedByLen.slice(0, 12),
  shouty: [...realMessages]
    .filter((m) => !m.isMedia && !m.isDeleted)
    .filter((m) => {
      const letters = m.text.replace(/[^A-Za-z]/g, "");
      return letters.length >= 8 && letters === letters.toUpperCase();
    })
    .sort((a, b) => b.text.length - a.text.length).slice(0, 12),
  cursed: [...realMessages]
    .filter((m) => !m.isMedia && !m.isDeleted)
    .map((m) => ({ m, p: profanityCount(m.text) }))
    .filter((x) => x.p >= 3)
    .sort((a, b) => b.p - a.p).slice(0, 12).map((x) => x.m),
};

// Unhinged incidents
const unhinged: Array<{ ts: number; date: string; messages: Msg[] }> = [];
{
  let i = 0;
  while (i < realMessages.length) {
    const start = realMessages[i];
    let j = i, prof = 0;
    while (j < realMessages.length && realMessages[j].ts - start.ts < 10 * 60 * 1000) {
      prof += profanityCount(realMessages[j].text);
      j++;
    }
    if (prof >= 10 && j - i >= 8) {
      unhinged.push({ ts: start.ts, date: start.date, messages: realMessages.slice(i, j).filter((m) => !m.isMedia).slice(0, 30) });
      i = j;
    } else i++;
  }
}
const unhingedTop = unhinged.sort((a, b) => b.messages.length - a.messages.length).slice(0, 12);

// Beef
const beef: Array<{ a: string; b: string; score: number; sample: Msg[] }> = [];
{
  const pairBeef = new Map<string, { score: number; sample: Msg[] }>();
  for (let i = 1; i < realMessages.length; i++) {
    const a = realMessages[i], b = realMessages[i - 1];
    if (a.author === b.author) continue;
    if (a.ts - b.ts > 3 * 60 * 1000) continue;
    if (a.isMedia || a.isDeleted) continue;
    const p = profanityCount(a.text);
    if (p === 0) continue;
    const key = [a.author, b.author].sort().join("|");
    const cur = pairBeef.get(key) ?? { score: 0, sample: [] };
    cur.score += p;
    if (cur.sample.length < 8) cur.sample.push(a);
    pairBeef.set(key, cur);
  }
  for (const [k, v] of pairBeef) {
    if (v.score < 8) continue;
    const [x, y] = k.split("|");
    beef.push({ a: x, b: y, score: v.score, sample: v.sample });
  }
  beef.sort((x, y) => y.score - x.score);
}

// Awards
const topBy = (map: Map<string, number>, n = 1) =>
  [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);

const awards = [
  { id: "yapper", title: "Yapper of the Year", desc: "Most messages sent overall", winner: topBy(authorCounts, 3).filter(([n]) => memberSet.has(n)) },
  { id: "potty", title: "Most Cursed Mouth", desc: "Highest profanity count", winner: topBy(profByAuthor, 3) },
  { id: "owl", title: "Night Owl Supreme", desc: "Most messages between midnight and 5am", winner: topBy(lateByAuthor, 3) },
  { id: "ghost", title: "Ghost Mode Award", desc: "Most messages deleted", winner: topBy(delByAuthor, 3) },
  { id: "media", title: "The Spammer", desc: "Most media shared", winner: topBy(mediaByAuthor, 3) },
  {
    id: "verbose", title: "Essay Writer", desc: "Longest average message",
    winner: [...lenByAuthor.entries()]
      .filter(([, v]) => v.n >= 50)
      .map(([k, v]) => [k, Math.round(v.sum / v.n)] as [string, number])
      .sort((a, b) => b[1] - a[1]).slice(0, 3),
  },
  { id: "shout", title: "ALL CAPS CHAMPION", desc: "Most all-caps messages", winner: topBy(allCapsByAuthor, 3) },
];

const summarise = (name: string): string => {
  const total = authorCounts.get(name) ?? 0;
  const prof = profByAuthor.get(name) ?? 0;
  const late = lateByAuthor.get(name) ?? 0;
  const med = mediaByAuthor.get(name) ?? 0;
  const len = lenByAuthor.get(name);
  const avg = len ? Math.round(len.sum / Math.max(1, len.n)) : 0;
  const hh = hourByAuthor.get(name) ?? Array(24).fill(0);
  const peakHour = hh.reduce((acc, v, i) => (v > hh[acc] ? i : acc), 0);
  const traits: string[] = [];
  if (total > 1000) traits.push("certified yapper");
  else if (total > 300) traits.push("regular contributor");
  else traits.push("lurker");
  if (prof / Math.max(1, total) > 0.3) traits.push("absolutely foul-mouthed");
  else if (prof / Math.max(1, total) > 0.1) traits.push("casually profane");
  if (late / Math.max(1, total) > 0.15) traits.push("nocturnal menace");
  if (med / Math.max(1, total) > 0.4) traits.push("walking media spam");
  if (avg > 80) traits.push("essay writer");
  else if (avg > 0 && avg < 20) traits.push("one-word merchant");
  return `${traits.join(", ")} — peak posting hour ${String(peakHour).padStart(2, "0")}:00.`;
};

const memberDetail = members.map((m) => {
  const len = lenByAuthor.get(m.name);
  const wmap = wordsByAuthor.get(m.name) ?? new Map<string, number>();
  const emap = emojiByAuthor.get(m.name) ?? new Map<string, number>();
  const fl = firstLast.get(m.name);
  const hh = hourByAuthor.get(m.name) ?? Array(24).fill(0);
  return {
    ...m,
    profanity: profByAuthor.get(m.name) ?? 0,
    lateNight: lateByAuthor.get(m.name) ?? 0,
    deleted: delByAuthor.get(m.name) ?? 0,
    media: mediaByAuthor.get(m.name) ?? 0,
    allCaps: allCapsByAuthor.get(m.name) ?? 0,
    avgLen: len ? Math.round(len.sum / len.n) : 0,
    peakHour: hh.reduce((acc, v, i) => (v > hh[acc] ? i : acc), 0),
    hourHist: hh,
    firstTs: fl?.first ?? null,
    lastTs: fl?.last ?? null,
    topWords: [...wmap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12),
    topEmoji: [...emap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8),
    summary: summarise(m.name),
  };
});

const leaderboards = {
  activity: [...authorCounts.entries()].filter(([n]) => memberSet.has(n)).sort((a, b) => b[1] - a[1]),
  profanity: [...profByAuthor.entries()].sort((a, b) => b[1] - a[1]),
  lateNight: [...lateByAuthor.entries()].sort((a, b) => b[1] - a[1]),
  deleted: [...delByAuthor.entries()].sort((a, b) => b[1] - a[1]),
  media: [...mediaByAuthor.entries()].sort((a, b) => b[1] - a[1]),
  allCaps: [...allCapsByAuthor.entries()].sort((a, b) => b[1] - a[1]),
};

const daily = [...dayMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  .map(([date, v]) => ({
    date,
    count: v.count,
    drama: dramaByDay.get(date) ?? 0,
    topQuote: v.topMsg ? { author: v.topMsg.author, text: v.topMsg.text, ts: v.topMsg.ts } : null,
  }));

const vocab = {
  words: [...globalWords.entries()].sort((a, b) => b[1] - a[1]).slice(0, 200),
  emoji: [...globalEmoji.entries()].sort((a, b) => b[1] - a[1]).slice(0, 60),
};

const pairs = [...pairCounts.entries()]
  .map(([k, c]) => { const [a, b] = k.split("|"); return { from: a, to: b, count: c }; })
  .filter((e) => memberSet.has(e.from) && memberSet.has(e.to))
  .sort((a, b) => b.count - a.count).slice(0, 250);

// Ships
const SHIP_RE = /\b(ship|love|marry|kiss|gf|girlfriend|bf|boyfriend|wife|husband|simp|simping|crush|date|dating)\b/i;
const shipPairs = new Map<string, number>();
for (const m of realMessages) {
  if (m.isMedia || m.isDeleted) continue;
  if (!SHIP_RE.test(m.text)) continue;
  const mentioned = members
    .filter((mm) => new RegExp(`\\b${mm.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(m.text))
    .map((mm) => mm.name);
  if (mentioned.length >= 2) {
    for (let i = 0; i < mentioned.length; i++)
      for (let j = i + 1; j < mentioned.length; j++) {
        const k = [mentioned[i], mentioned[j]].sort().join("|");
        shipPairs.set(k, (shipPairs.get(k) ?? 0) + 1);
      }
  } else if (mentioned.length === 1 && mentioned[0] !== m.author) {
    const k = [mentioned[0], m.author].sort().join("|");
    shipPairs.set(k, (shipPairs.get(k) ?? 0) + 1);
  }
}
const ships = [...shipPairs.entries()]
  .map(([k, c]) => { const [a, b] = k.split("|"); return { a, b, count: c }; })
  .sort((a, b) => b.count - a.count).slice(0, 40);

// Monthly report cards
const monthly: Array<{
  month: string; count: number; topAuthors: Array<[string, number]>;
  topQuote: { author: string; text: string; ts: number } | null;
  defining: string; mood: string;
}> = [];
const byMonth = new Map<string, Msg[]>();
for (const m of realMessages) {
  const k = m.date.slice(0, 7);
  if (!byMonth.has(k)) byMonth.set(k, []);
  byMonth.get(k)!.push(m);
}
for (const [month, msgs] of [...byMonth.entries()].sort()) {
  const aCount = new Map<string, number>(), wMap = new Map<string, number>();
  let prof = 0;
  let topQuote: Msg | undefined;
  for (const m of msgs) {
    aCount.set(m.author, (aCount.get(m.author) ?? 0) + 1);
    if (m.isMedia || m.isDeleted) continue;
    prof += profanityCount(m.text);
    for (const w of m.text.toLowerCase().split(/[^a-z']+/)) {
      if (w.length < 4 || STOP.has(w)) continue;
      wMap.set(w, (wMap.get(w) ?? 0) + 1);
    }
    if (!topQuote || (m.text.length > topQuote.text.length && m.text.length < 240)) topQuote = m;
  }
  const top = [...aCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  const defining = [...wMap.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  const ratio = prof / Math.max(1, msgs.length);
  const mood = ratio > 0.25 ? "FERAL" : ratio > 0.15 ? "Spicy" : ratio > 0.07 ? "Lively" : "Civil-ish";
  monthly.push({
    month, count: msgs.length, topAuthors: top,
    topQuote: topQuote ? { author: topQuote.author, text: topQuote.text, ts: topQuote.ts } : null,
    defining, mood,
  });
}

// Write
const write = (name: string, data: unknown) => {
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data));
  console.log(`  wrote ${name} (${(fs.statSync(path.join(OUT, name)).size / 1024).toFixed(1)} KB)`);
};

write("stats.json", {
  totalMessages, totalMedia, totalDeleted, lateNight, daysCovered,
  hourHist, monthHist: [...monthHist.entries()].sort(),
  firstTs: realMessages[0]?.ts, lastTs: realMessages[realMessages.length - 1]?.ts,
  memberCount: members.length,
});
write("members.json", memberDetail);
write("leaderboards.json", leaderboards);
write("daily.json", daily);
write("vocab.json", vocab);
write("pairs.json", pairs);
write("ships.json", ships);
write("name-saga.json", groupNameChanges);
write("curse-wall.json", curseWall);
write("emma-saga.json", emmaSaga);
write("hall-of-fame.json", hof);
write("unhinged.json", unhingedTop);
write("beef.json", beef.slice(0, 12));
write("awards.json", awards);
write("monthly.json", monthly);
write("member-events.json", { adds: memberAdds.slice(0, 200), leaves: memberLeaves.slice(0, 200) });

// Per-month message chunks for lazy loading
const messagesDir = path.join(OUT, "messages");
fs.mkdirSync(messagesDir, { recursive: true });
const monthIndex: Array<{ month: string; count: number }> = [];
for (const [month, list] of [...byMonth.entries()].sort()) {
  const slim = list.map((m) => ({
    id: m.id, ts: m.ts, author: m.author, text: m.text, isMedia: m.isMedia, isDeleted: m.isDeleted,
  }));
  fs.writeFileSync(path.join(messagesDir, `${month}.json`), JSON.stringify(slim));
  monthIndex.push({ month, count: list.length });
}
write("messages-index.json", monthIndex);

// Search inverted index
const inv = new Map<string, number[]>();
for (const m of realMessages) {
  if (m.isMedia || m.isDeleted) continue;
  const seen = new Set<string>();
  for (const w of m.text.toLowerCase().split(/[^a-z']+/)) {
    if (w.length < 3 || STOP.has(w)) continue;
    if (seen.has(w)) continue;
    seen.add(w);
    const arr = inv.get(w) ?? [];
    if (arr.length < 400) arr.push(m.id);
    inv.set(w, arr);
  }
}
const searchIdx: Record<string, number[]> = {};
for (const [w, ids] of inv) if (ids.length >= 2) searchIdx[w] = ids;
write("search-index.json", searchIdx);

console.log("Done.");
