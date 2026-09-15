import { interfaceCopy } from "@/content/interface";
const copy = interfaceCopy.Icon;
export function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    plus: <path d="M12 5v14M5 12h14" />,
    close: <path d="m6 6 12 12M6 18 12-12" />,
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m8 5 7 7-7 7" />,
    down: <path d="m5 9 7 7 7-7" />,
    play: <path d="m9 5 11 7-11 7Z" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 6 9 7 9-7" />
      </>
    ),
    phone: (
      <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-7-7l2-2Z" />
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    shield: (
      <>
        <path d="m12 3 8 3v6c0 4-5 8-8 9-3-1-8-5-8-9V6Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    file: (
      <>
        <path d="M14 3H5v18h14V8Z" />
        <path d="M14 3v5h5M8 12h8M8 16h6" />
      </>
    ),
    spark: (
      <>
        <path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 11h18M7 15h2M13 15h2" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="12" height="13" rx="2" />
        <path d="M16 8V3H3v13h5" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name] || paths.spark}
    </svg>
  );
}
export function Logo({ large = false }: { large?: boolean }) {
  return (
    <span
      className={`wordmark ${large ? "wordmark-large" : ""}`}
      role="img"
      aria-label={copy.digital_handyman}
    >
      <svg
        width="31"
        height="28"
        viewBox="0 0 31 28"
        fill="none"
        aria-hidden="true"
      >
        <path d="M2 4h12v9H2z" fill="currentColor" stroke="none" />
        <path d="M16 5h13M16 9h13M2 17h27M2 21h27M2 25h27" stroke="currentColor" strokeWidth="2" />
        <path d="m8 6 .75 1.5 1.65.25-1.2 1.15.3 1.65L8 9.8l-1.5.75.3-1.65-1.2-1.15 1.65-.25Z" fill="#fff" stroke="none" />
      </svg>
      <span>
        {copy.brand_name}
        <span className="logo-ai">{copy.ai}</span>
      </span>
    </span>
  );
}

export function AmericanFlag({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 190 100"
      role="img"
      aria-label="American flag"
    >
      <rect width="190" height="100" rx="3" fill="#f7f3e8" />
      {[0, 2, 4, 6, 8, 10, 12].map((stripe) => (
        <rect key={stripe} y={(stripe * 100) / 13} width="190" height={100 / 13} fill="#b32632" />
      ))}
      <rect width="76" height={(7 * 100) / 13} fill="#163a63" />
      {Array.from({ length: 20 }, (_, index) => (
        <circle
          key={index}
          cx={9 + (index % 5) * 14.5}
          cy={8 + Math.floor(index / 5) * 12}
          r="2.1"
          fill="#fff"
        />
      ))}
    </svg>
  );
}
