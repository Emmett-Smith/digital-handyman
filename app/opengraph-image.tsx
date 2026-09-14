import { ogImage } from "@/lib/og";
export const alt = "Throughline AI — Good people. Less repeat work.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return ogImage("Good people. Too much repeat work.");
}
