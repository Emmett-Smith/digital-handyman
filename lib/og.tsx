import { ImageResponse } from "next/og";
export function ogImage(headline: string, audience = "For the everyday work.") {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#10161D",
        color: "#EDF0F3",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "62px 72px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 26,
        }}
      >
        <span>digital handyman</span>
        <span style={{ fontSize: 19, color: "#b6becc" }}>{audience}</span>
      </div>
      <div
        style={{
          fontSize: 72,
          lineHeight: 1.05,
          letterSpacing: "-3px",
          maxWidth: 970,
        }}
      >
        {headline}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #435065",
          paddingTop: 28,
          fontSize: 22,
        }}
      >
        <span>Less repeat work. More time back.</span>
        <span>Business Tune-Up $2,500</span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
