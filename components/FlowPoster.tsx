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
          <stop stopColor="#B32632" stopOpacity=".04" />
          <stop offset=".38" stopColor="#C94B55" stopOpacity=".62" />
          <stop offset=".72" stopColor="#E8EDF5" stopOpacity=".72" />
          <stop offset="1" stopColor="#F5F2EA" stopOpacity=".03" />
        </linearGradient>
        <radialGradient id="field-light">
          <stop stopColor="#174A7A" stopOpacity=".2" />
          <stop offset="1" stopColor="#071B33" stopOpacity="0" />
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
