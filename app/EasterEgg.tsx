import React, { useState, useEffect } from "react";
import "./EasterEgg.css"; // Make sure this exists

const SECRET_CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown"];

export default function EasterEgg() {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState<string[]>([]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      setInput((prev) => {
        const next = [...prev, e.key].slice(-SECRET_CODE.length);
        if (next.join(",") === SECRET_CODE.join(",")) {
          setShow(true);
        }
        return next;
      });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!show) return null;

  return (
    <div className="easter-egg-animation">
      <div className="confetti-container">
        {[...Array(30)].map((_, i) => (
          <div key={i} className={`confetti confetti-${i % 6}`}></div>
        ))}
      </div>
      <h1 className="secret-title">🎉 Secret Unlocked! 🎉</h1>
    </div>
  );
}
