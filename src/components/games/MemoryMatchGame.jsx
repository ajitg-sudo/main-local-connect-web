import { useEffect, useState } from "react";

const PAIRS = ["⚡", "🔧", "💈", "💊"];

function buildDeck() {
  const cards = [...PAIRS, ...PAIRS].map((emoji, index) => ({ id: index, emoji, matched: false }));
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export default function MemoryMatchGame({ disabled, onWin }) {
  const [cards, setCards] = useState(buildDeck);
  const [flipped, setFlipped] = useState([]);
  const [lock, setLock] = useState(false);
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (flipped.length !== 2) return;
    setLock(true);
    setMoves((m) => m + 1);
    const [a, b] = flipped;
    const match = cards[a].emoji === cards[b].emoji;
    setTimeout(() => {
      setCards((prev) => {
        const next = prev.map((c, i) => {
          if (i === a || i === b) return { ...c, matched: match || c.matched };
          return c;
        });
        if (next.every((c) => c.matched) && !won) {
          setWon(true);
          onWin?.();
        }
        return next;
      });
      setFlipped([]);
      setLock(false);
    }, 700);
  }, [flipped, cards, onWin, won]);

  const flip = (index) => {
    if (disabled || lock || won || cards[index].matched || flipped.includes(index)) return;
    setFlipped((f) => (f.length === 2 ? [index] : [...f, index]));
  };

  const reset = () => {
    setCards(buildDeck());
    setFlipped([]);
    setWon(false);
    setMoves(0);
  };

  return (
    <div>
      <p className="text-body mb-3 text-center text-muted">Match all pairs · Moves: {moves}</p>
      <div className="game-memory-grid">
        {cards.map((card, index) => {
          const show = card.matched || flipped.includes(index);
          return (
            <button
              key={card.id}
              type="button"
              className={`game-memory-card ${show ? "game-memory-card-open" : ""}`}
              onClick={() => flip(index)}
              disabled={disabled || lock || won}
              aria-label={show ? card.emoji : "Hidden card"}
            >
              {show ? card.emoji : "?"}
            </button>
          );
        })}
      </div>
      {won && <p className="text-body mt-4 text-center font-bold text-teal-dark">All matched! Claim your offer below.</p>}
      {!disabled && !won && (
        <button type="button" className="btn-ghost btn-inline mx-auto mt-4 block" onClick={reset}>
          Shuffle again
        </button>
      )}
      {disabled && (
        <p className="text-caption mt-4 text-center text-muted">You can play again tomorrow.</p>
      )}
    </div>
  );
}
