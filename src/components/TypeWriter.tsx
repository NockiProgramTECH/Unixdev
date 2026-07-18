import { useState, useEffect, useCallback } from "react";

interface TypeWriterProps {
  texts: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}

export default function TypeWriter({
  texts,
  typeSpeed = 80,
  deleteSpeed = 40,
  pauseDuration = 2000,
}: TypeWriterProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const tick = useCallback(() => {
    const currentText = texts[textIndex];

    if (isPaused) {
      return;
    }

    if (!isDeleting) {
      if (charIndex < currentText.length) {
        setCharIndex((prev) => prev + 1);
      } else {
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (charIndex > 0) {
        setCharIndex((prev) => prev - 1);
      } else {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    }
  }, [charIndex, isDeleting, isPaused, textIndex, texts, pauseDuration]);

  useEffect(() => {
    if (isPaused) return;

    const speed = isDeleting ? deleteSpeed : typeSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, deleteSpeed, typeSpeed, isPaused]);

  return (
    <span className="typewriter">
      {texts[textIndex].substring(0, charIndex)}
      <span className="typewriter-cursor" aria-hidden="true" />
    </span>
  );
}
