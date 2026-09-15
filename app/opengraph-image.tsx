import { ogImage } from "@/lib/og";
export const alt = "Digital Handyman — We’ll get it done.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return ogImage("Modern tools. Old-fashioned follow-through.");
}
