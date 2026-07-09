import { useState } from "react";

const SEGMENTS = [
  { label: "10% off", color: "#0d9488" },
  { label: "Free delivery", color: "#2563eb" },
  { label: "BOGO deal", color: "#d97706" },
  { label: "Rs.50 off", color: "#7c3aed" },
  { label: "15% off", color: "#059669" },
  { label: "Lucky coupon", color: "#db2777" }
];

export default function SpinWheelGame({ disabled, onWin }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (disabled || spinning) return;
    setSpinning(true);
    const extra = 1440 + Math.floor(Math.random() * 360);
    setRotation((r) => r + extra);
    setTimeout(() => {
      setSpinning(false);
      onWin?.();
    }, 4200);
  };

  const segmentAngle = 360 / SEGMENTS.length;

  return (
    <div className="flex flex-col items-center">
      <div className="game-wheel-wrap">
        <div className="game-wheel-pointer" aria-hidden="true" />
        <div
          className="game-wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 4s cubic-bezier(0.15, 0.85, 0.2, 1)" : "none"
          }}
        >
          {SEGMENTS.map((seg, i) => (
            <div
              key={seg.label}
              className="game-wheel-segment"
              style={{
                transform: `rotate(${i * segmentAngle}deg) skewY(${90 - segmentAngle}deg)`,
                background: seg.color
              }}
            >
              <span style={{ transform: `skewY(${segmentAngle - 90}deg) rotate(${segmentAngle / 2}deg)` }}>
                {seg.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="btn-primary mt-6"
        onClick={spin}
        disabled={disabled || spinning}
      >
        {spinning ? "Spinning..." : disabled ? "Available tomorrow" : "Spin the wheel"}
      </button>
    </div>
  );
}
