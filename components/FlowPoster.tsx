export function FlowPoster() {
  return (
    <svg
      className="flow-poster"
      viewBox="0 0 1000 650"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="thread-color" x1="0" x2="1">
          <stop stopColor="#2B2BD9" stopOpacity=".04" />
          <stop offset=".38" stopColor="#6868FF" stopOpacity=".65" />
          <stop offset=".72" stopColor="#CAD1FF" stopOpacity=".7" />
          <stop offset="1" stopColor="#EDF0F3" stopOpacity=".03" />
        </linearGradient>
        <radialGradient id="field-light">
          <stop stopColor="#3838BD" stopOpacity=".17" />
          <stop offset="1" stopColor="#10161D" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="590" cy="330" rx="400" ry="300" fill="url(#field-light)" />
      {Array.from({ length: 64 }, (_, i) => {
        const k = i / 63;
        const start = 50 + k * 550;
        const end = 245 + k * 155;
        return (
          <path
            key={i}
            d={`M -70 ${start} C ${160 + k * 100} ${start + Math.sin(k * 10) * 170}, ${285 + k * 90} ${80 + k * 460}, 500 ${305 + Math.sin(k * 4) * 125} S 735 ${end}, 1090 ${end}`}
            fill="none"
            stroke="url(#thread-color)"
            strokeWidth={i % 6 === 0 ? 1.05 : 0.5}
          />
        );
      })}
    </svg>
  );
}
