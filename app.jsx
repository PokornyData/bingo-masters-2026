// Pixel Bingo 2026 — React app
const { useState, useEffect, useMemo } = React;

const STATE_LABELS = ["nerozhodnuto", "získáno", "ztraceno"];
const STORAGE_KEY = "pixelBingo2026.v1";

// Pixel sound effect via WebAudio (chunky 8-bit blip)
const audioCtx = (() => {
  try { return new (window.AudioContext || window.webkitAudioContext)(); }
  catch { return null; }
})();
function blip(freq = 440, dur = 0.08) {
  if (!audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = "square";
  o.frequency.value = freq;
  g.gain.value = 0.04;
  o.connect(g); g.connect(audioCtx.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
  o.stop(audioCtx.currentTime + dur + 0.02);
}

// Load saved state from localStorage and merge into the default data.
function loadInitial() {
  const base = window.BINGO_PLAYERS.map(p => ({
    ...p,
    cells: p.cells.map(c => ({ ...c })),
  }));
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved) return base;
    for (const p of base) {
      const s = saved.players?.[p.id];
      if (!s) continue;
      if (s.character) p.character = s.character;
      if (Array.isArray(s.states)) {
        s.states.forEach((st, i) => { if (p.cells[i]) p.cells[i].state = st; });
      }
    }
    return base;
  } catch { return base; }
}

function savePlayers(players) {
  const out = { players: {} };
  for (const p of players) {
    out.players[p.id] = {
      character: p.character,
      states: p.cells.map(c => c.state),
    };
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
}

// Detect winning bingo lines (rows / cols / diagonals of 4 "won" cells).
function bingoLines(cells) {
  const idx = (r, c) => r * 4 + c;
  const lines = [];
  for (let r = 0; r < 4; r++) lines.push([0,1,2,3].map(c => idx(r, c)));
  for (let c = 0; c < 4; c++) lines.push([0,1,2,3].map(r => idx(r, c)));
  lines.push([0,1,2,3].map(i => idx(i, i)));
  lines.push([0,1,2,3].map(i => idx(i, 3 - i)));
  return lines.filter(line => line.every(i => cells[i].state === 1));
}

function computeStats(cells) {
  let won = 0, lost = 0, pending = 0;
  for (const c of cells) {
    if (c.state === 1) won++;
    else if (c.state === 2) lost++;
    else pending++;
  }
  const decided = won + lost;
  const pct = decided === 0 ? null : Math.round((won / decided) * 100);
  return { won, lost, pending, decided, pct };
}

function StatPill({ label, value, color }) {
  return (
    <div className="stat-pill" style={{ borderColor: color }}>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color }}>{value}</div>
    </div>
  );
}

function PlayerPortrait({ player, selected, rank, onSelect }) {
  const stats = computeStats(player.cells);
  return (
    <button
      className={"portrait-card" + (selected ? " selected" : "")}
      onClick={() => { onSelect(player.id); blip(660, 0.06); }}
      style={{ "--accent": player.accent }}
    >
      <div className="portrait-rank">#{rank}</div>
      <div className="portrait-frame">
        <img
          src={`characters/${player.character}.jpg`}
          alt={player.name}
          draggable={false}
        />
      </div>
      <div className="portrait-name">{player.name}</div>
      <div className="portrait-pct">
        {stats.pct === null ? "--%" : stats.pct + "%"}
      </div>
      <div className="portrait-meta">
        <span className="dot won" />{stats.won}
        <span className="dot lost" />{stats.lost}
        <span className="dot pending" />{stats.pending}
      </div>
    </button>
  );
}

function BingoCell({ cell, index, onCycle, inBingo }) {
  const stateClass = cell.state === 1 ? "won" : cell.state === 2 ? "lost" : "pending";
  return (
    <button
      className={`bingo-cell ${stateClass}` + (inBingo ? " bingo-line" : "")}
      onClick={() => onCycle(index)}
      title={STATE_LABELS[cell.state]}
    >
      <span className="cell-text">{cell.text}</span>
      <span className="cell-stamp">
        {cell.state === 1 && "✓"}
        {cell.state === 2 && "✗"}
      </span>
    </button>
  );
}

function App() {
  const [players, setPlayers] = useState(loadInitial);
  const [activeId, setActiveId] = useState(players[0].id);
  const [tweaksOpen, setTweaksOpen] = useState(false);

  useEffect(() => { savePlayers(players); }, [players]);

  // Tweaks toolbar integration
  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === "__activate_edit_mode") setTweaksOpen(true);
      else if (e.data?.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const ranked = useMemo(() => {
    return [...players]
      .map(p => ({ id: p.id, pct: computeStats(p.cells).pct ?? -1, won: computeStats(p.cells).won }))
      .sort((a, b) => b.pct - a.pct || b.won - a.won);
  }, [players]);
  const rankMap = Object.fromEntries(ranked.map((r, i) => [r.id, i + 1]));

  const active = players.find(p => p.id === activeId);
  const stats = computeStats(active.cells);
  const lines = bingoLines(active.cells);
  const bingoCells = new Set(lines.flat());

  const cycleCell = (i) => {
    setPlayers(prev => prev.map(p => {
      if (p.id !== activeId) return p;
      const next = { ...p, cells: p.cells.map(c => ({ ...c })) };
      const cur = next.cells[i].state;
      const nv = (cur + 1) % 3;
      next.cells[i].state = nv;
      // sound depending on new state
      if (nv === 1) blip(880, 0.1);
      else if (nv === 2) blip(220, 0.12);
      else blip(440, 0.05);
      return next;
    }));
  };

  const resetActive = () => {
    if (!confirm(`Resetovat všechna políčka hráče ${active.name}?`)) return;
    setPlayers(prev => prev.map(p => p.id === activeId
      ? { ...p, cells: p.cells.map(c => ({ ...c, state: 0 })) }
      : p));
  };

  const reassignCharacter = (playerId, character) => {
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, character } : p));
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="title-block">
          <div className="title-glow">BINGO MASTERS 2026</div>
        </div>
        <div className="leaderboard">
          {ranked.map((r, i) => {
            const p = players.find(x => x.id === r.id);
            return (
              <div key={r.id} className={"lb-row" + (i === 0 ? " gold" : "")}>
                <span className="lb-rank">#{i + 1}</span>
                <span className="lb-name" style={{ color: p.accent }}>{p.name}</span>
                <span className="lb-pct">{r.pct < 0 ? "--%" : r.pct + "%"}</span>
              </div>
            );
          })}
        </div>
      </header>

      <section className="character-select">
        {players.map(p => (
          <PlayerPortrait
            key={p.id}
            player={p}
            rank={rankMap[p.id]}
            selected={p.id === activeId}
            onSelect={setActiveId}
          />
        ))}
      </section>

      <main className="card-stage" style={{ "--accent": active.accent }}>
        <aside className="player-side">
          <div className="big-portrait">
            <img src={`characters/${active.character}.jpg`} alt={active.name} draggable={false} />
            <div className="player-banner">{active.name}</div>
          </div>
          <div className="stats-grid">
            <StatPill label="ÚSPĚŠNOST" value={stats.pct === null ? "--%" : stats.pct + "%"} color={active.accent} />
            <StatPill label="ZÍSKÁNO" value={stats.won} color="#7CFFB2" />
            <StatPill label="ZTRACENO" value={stats.lost} color="#FF6B6B" />
            <StatPill label="ČEKÁ" value={stats.pending} color="#f5d76e" />
          </div>
          <div className="progress-wrap">
            <div className="progress-label">
              {stats.decided} / 16 rozhodnuto
            </div>
            <div className="progress-track">
              <div className="progress-fill won" style={{ width: `${(stats.won/16)*100}%` }} />
              <div className="progress-fill lost" style={{ width: `${(stats.lost/16)*100}%` }} />
            </div>
          </div>
          <button className="reset-btn" onClick={resetActive}>↺ RESET KARTY</button>
        </aside>

        <div className="grid-wrap">
          <div className="grid-header">
            <span>KARTA · {active.name.toUpperCase()}</span>
            <span className="hint">klik → získáno · klik → ztraceno · klik → reset</span>
          </div>
          <div className="bingo-grid">
            {active.cells.map((c, i) => (
              <BingoCell
                key={i}
                cell={c}
                index={i}
                onCycle={cycleCell}
                inBingo={bingoCells.has(i)}
              />
            ))}
          </div>
        </div>
      </main>

      {tweaksOpen && (
        <TweaksPanel
          players={players}
          onAssign={reassignCharacter}
          onClose={() => {
            setTweaksOpen(false);
            window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
          }}
        />
      )}
    </div>
  );
}

function TweaksPanel({ players, onAssign, onClose }) {
  const portraits = [
    { id: "char-mustache-glasses", label: "Knír + brýle" },
    { id: "char-dreads", label: "Dredy + červená" },
    { id: "char-beard-carrier", label: "Vous + nosítko" },
    { id: "char-beanie-cards", label: "Čepice + karty" },
  ];
  return (
    <div className="tweaks-panel">
      <div className="tweaks-head">
        <span>★ TWEAKS</span>
        <button onClick={onClose}>×</button>
      </div>
      <div className="tweaks-body">
        <div className="tweaks-note">Přiřaď postavičku ke hráči:</div>
        {players.map(p => (
          <div key={p.id} className="tweak-row">
            <div className="tweak-label" style={{ color: p.accent }}>{p.name}</div>
            <div className="tweak-options">
              {portraits.map(pr => (
                <button
                  key={pr.id}
                  className={"tweak-thumb" + (p.character === pr.id ? " active" : "")}
                  onClick={() => onAssign(p.id, pr.id)}
                  title={pr.label}
                >
                  <img src={`characters/${pr.id}.jpg`} alt={pr.label} draggable={false} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
