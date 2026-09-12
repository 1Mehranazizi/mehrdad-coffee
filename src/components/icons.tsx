// Small brand motifs borrowed from the Mehrdad Coffee packaging:
// the four-point ornamental sparkle, and the sunburst/bean mark.

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 1c.7 4.7 2.1 7.4 6.5 8.7.4.1.4.7 0 .8-4.4 1.3-5.8 4-6.5 8.7-.1.4-.7.4-.8 0-.7-4.7-2.1-7.4-6.5-8.7-.4-.1-.4-.7 0-.8 4.4-1.3 5.8-4 6.5-8.7.1-.4.7-.4.8 0Z" />
    </svg>
  );
}

export function SunburstMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1.5" />
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16;
        return (
          <line
            key={i}
            x1="50"
            y1="50"
            x2="50"
            y2="6"
            stroke="currentColor"
            strokeWidth="2"
            transform={`rotate(${angle} 50 50)`}
          />
        );
      })}
      <circle cx="50" cy="50" r="22" fill="currentColor" />
      <ellipse cx="50" cy="50" rx="3" ry="20" fill="var(--color-paper)" />
    </svg>
  );
}
