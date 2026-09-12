// A hand-built emblem for the hero section: sunburst rays, a bold cup
// silhouette, steam, and scattered bean shapes — drawn in the same
// monochrome, badge-like language as the Mehrdad Coffee packaging,
// instead of reusing the product photo.

function Bean({
  x,
  y,
  size = 1,
  rotate = 0,
  fill = "var(--color-ink)",
}: {
  x: number;
  y: number;
  size?: number;
  rotate?: number;
  fill?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${size})`}>
      <ellipse cx="0" cy="0" rx="13" ry="19" fill={fill} />
      <path
        d="M0 -17 C 6 -8, 6 8, 0 17"
        stroke="var(--color-paper)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

export default function HeroArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 480"
      className={className}
      role="img"
      aria-label="نشان قهوه مهرداد؛ فنجانی در میان اشعه‌های خورشید و دانه‌های قهوه"
    >
      <circle cx="240" cy="240" r="222" fill="var(--color-cream)" />
      <circle
        cx="240"
        cy="240"
        r="222"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2"
      />
      <circle
        cx="240"
        cy="240"
        r="196"
        fill="none"
        stroke="var(--color-line)"
        strokeWidth="1.5"
        strokeDasharray="2 8"
      />

      {/* sunburst rays */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i * 360) / 20;
        return (
          <line
            key={i}
            x1="240"
            y1="240"
            x2="240"
            y2="70"
            stroke="var(--color-ink)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.9"
            transform={`rotate(${angle} 240 240)`}
          />
        );
      })}
      <circle cx="240" cy="240" r="150" fill="var(--color-cream)" />
      <circle
        cx="240"
        cy="240"
        r="150"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2"
      />

      {/* steam */}
      <path
        d="M212 175 C 202 160, 222 150, 212 135"
        stroke="var(--color-coffee)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M240 170 C 230 155, 250 145, 240 128"
        stroke="var(--color-coffee)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M268 175 C 258 160, 278 150, 268 135"
        stroke="var(--color-coffee)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* cup */}
      <path
        d="M178 200 L 190 288 C 191 300 200 309 213 309 L 267 309 C 280 309 289 300 290 288 L 302 200 Z"
        fill="var(--color-ink)"
      />
      <path
        d="M296 216 C 322 216 336 236 328 258 C 322 274 306 282 292 280"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <ellipse cx="240" cy="200" rx="62" ry="10" fill="var(--color-brass)" />

      {/* saucer */}
      <ellipse
        cx="240"
        cy="322"
        rx="86"
        ry="11"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2.5"
      />

      {/* scattered beans */}
      <Bean x={112} y={140} size={0.9} rotate={-25} />
      <Bean x={365} y={150} size={0.75} rotate={20} fill="var(--color-coffee)" />
      <Bean x={100} y={340} size={0.8} rotate={15} fill="var(--color-coffee)" />
      <Bean x={372} y={330} size={0.95} rotate={-15} />
    </svg>
  );
}
