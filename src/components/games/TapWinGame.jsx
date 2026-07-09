import { useEffect, useRef, useState } from "react";

const TARGET_TAPS = 12;
const DURATION_SEC = 10;

export default function TapWinGame({ disabled, onWin }) {
  const [playing, setPlaying] = useState(false);
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION_SEC);
  const [targetPos, setTargetPos] = useState({ top: 40, left: 40 });
  const [finished, setFinished] = useState(false);
  const wonRef = useRef(false);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setPlaying(false);
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [playing]);

  const moveTarget = () => {
    setTargetPos({
      top: 10 + Math.random() * 70,
      left: 10 + Math.random() * 70
    });
  };

  const start = () => {
    if (disabled) return;
    wonRef.current = false;
    setTaps(0);
    setTimeLeft(DURATION_SEC);
    setFinished(false);
    setPlaying(true);
    moveTarget();
  };

  const tap = () => {
    if (!playing || disabled) return;
    const next = taps + 1;
    setTaps(next);
    moveTarget();
    if (next >= TARGET_TAPS && !wonRef.current) {
      wonRef.current = true;
      setPlaying(false);
      setFinished(true);
      onWin?.();
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-body text-muted">
        <span>Taps: {taps} / {TARGET_TAPS}</span>
        <span>Time: {timeLeft}s</span>
      </div>
      <div className="game-tap-arena">
        {playing && (
          <button
            type="button"
            className="game-tap-target"
            style={{ top: `${targetPos.top}%`, left: `${targetPos.left}%` }}
            onClick={tap}
          >
            Tap!
          </button>
        )}
        {!playing && !finished && (
          <p className="text-body text-center text-muted">Tap {TARGET_TAPS} targets in {DURATION_SEC} seconds to unlock an offer.</p>
        )}
        {finished && taps >= TARGET_TAPS && (
          <p className="text-body text-center font-bold text-teal-dark">Great reflexes! Claim your offer below.</p>
        )}
        {finished && taps < TARGET_TAPS && (
          <p className="text-body text-center text-rose">Time up — try again!</p>
        )}
      </div>
      <button
        type="button"
        className="btn-primary mt-4 w-full"
        onClick={start}
        disabled={disabled || playing}
      >
        {disabled ? "Available tomorrow" : playing ? "Playing..." : finished ? "Play again" : "Start game"}
      </button>
    </div>
  );
}
