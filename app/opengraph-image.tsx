import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "The Third Freedom by Shailesh Gupta";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "node_modules", "@fontsource");
const [serifBold, uiSemi, coverPng] = await Promise.all([
  readFile(join(fontDir, "source-serif-4", "files", "source-serif-4-latin-700-normal.woff")),
  readFile(join(fontDir, "archivo", "files", "archivo-latin-600-normal.woff")),
  readFile(join(process.cwd(), "content", "the-third-freedom", "cover.png")),
]);
const cover = `data:image/png;base64,${coverPng.toString("base64")}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#0b1631",
          borderTop: "10px solid #e88a2e",
          borderBottom: "10px solid #1f8a4c",
          padding: "0 80px",
          gap: 72,
        }}
      >
        <img src={cover} width={340} height={510} alt="" style={{ borderRadius: 8, boxShadow: "0 20px 50px rgba(0,0,0,.45)" }} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontFamily: "Archivo", fontSize: 26, letterSpacing: 6, color: "#f0a04b" }}>
            1947. 1991. NOW.
          </div>
          <div style={{ fontFamily: "Source Serif", fontSize: 92, lineHeight: 1.02, color: "#fbf6ef", marginTop: 18 }}>
            The Third Freedom
          </div>
          <div style={{ fontFamily: "Archivo", fontSize: 30, lineHeight: 1.35, color: "#c9cfe0", marginTop: 26 }}>
            India&apos;s unfinished freedom: from developing to developed nation in one generation
          </div>
          <div style={{ fontFamily: "Archivo", fontSize: 26, letterSpacing: 4, color: "#ffffff", marginTop: 40 }}>
            SHAILESH GUPTA
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Source Serif", data: serifBold, style: "normal", weight: 700 },
        { name: "Archivo", data: uiSemi, style: "normal", weight: 600 },
      ],
    },
  );
}
