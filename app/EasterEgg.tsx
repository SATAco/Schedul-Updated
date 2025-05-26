import React, { useState, useEffect } from "react";
import "./EasterEgg.css"; // Create this for your animation style

const SECRET_CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", 
                     "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

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
      {/* Replace this with your custom animation */}
      <h1>🎉 Secret Unlocked! 🎉</h1>
    </div>
  );
}
