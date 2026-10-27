import { ImageResponse } from "next/og";

// TODO: replace with designed OG artwork in the theming phase.
// Colours are inlined because ImageResponse can't read CSS variables; keep in sync with theme.css.
export const alt = "AegisZ — AI-driven cybersecurity platforms, built in India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0b0c0e",
          color: "#ececee",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 100 100">
            <path d="M50 22 L13 80 L50 60 L87 80 Z M50 22 V60" fill="none" stroke="#ececee" strokeWidth="5.5" />
            <circle cx="50" cy="20" r="8" fill="#ececee" />
            <circle cx="50" cy="60" r="7.5" fill="#ececee" />
          </svg>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: 6 }}>AEGISZ</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1, maxWidth: 950 }}>
            Security that judges intent, not just permission.
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#a6a8b0" }}>
            AI-driven cybersecurity platforms for enterprises and governments. From India, for the world.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
