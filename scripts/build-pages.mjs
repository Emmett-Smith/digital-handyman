import { cp, mkdir, readFile, writeFile, rm, symlink, readdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";

// Make a separate distribution; the full Next application remains unchanged.
const root = resolve(import.meta.dirname, "..");
const stage = join(root, ".publish/pages");
const basePath = process.env.PAGES_BASE_PATH ?? "/digital-handyman";
if (basePath && !/^\/[a-zA-Z0-9_-]+$/.test(basePath)) throw Error("PAGES_BASE_PATH must be empty or one repository path segment");
const origin = process.env.NEXT_PUBLIC_SITE_URL || `https://emmett-smith.github.io${basePath}`;
await rm(stage, { recursive: true, force: true });
await mkdir(stage, { recursive: true });
for (const name of ["app", "components", "content", "lib", "public", "package.json", "package-lock.json", "postcss.config.mjs", "tsconfig.json", "next-env.d.ts"]) {
  await cp(join(root, name), join(stage, name), { recursive: true });
}
await symlink(join(root, "node_modules"), join(stage, "node_modules"), "dir");
for (const name of ["app/api", "app/personalized", "app/c"]) await rm(join(stage, name), { recursive: true, force: true });
await writeFile(join(stage, "next.config.ts"), `import type { NextConfig } from "next";
const config: NextConfig = { output: "export", basePath: ${JSON.stringify(basePath)}, trailingSlash: true, poweredByHeader: false, images: { unoptimized: true }, experimental: { optimizePackageImports: ["framer-motion", "gsap"] } };
export default config;
`);

async function transformTree(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) { await transformTree(file); continue; }
    if (!/\.tsx?$/.test(entry.name)) continue;
    let source = await readFile(file, "utf8");
    // Plain browser links need a prefix; Next Link already applies basePath.
    source = source.replace(/href="\/(?!\/)([^"]*)"/g, (_, path) => `href="${basePath}/${path}"`);
    source = source.replace('site.scheduler || "/#booking"', `site.scheduler || "${basePath}/#booking"`);
    source = source.replace('location.href = `/for/', `location.href = \`${basePath}/for/`);
    if (file.endsWith("layout.tsx")) source = source.replace('icon: "/icon.svg"', `icon: "${basePath}/icon.svg"`).replace("metadataBase: new URL(site.url)", "metadataBase: new URL(new URL(site.url).origin)");
    // Metadata absolute paths otherwise resolve to the GitHub account root.
    if (file.endsWith("/app/for/[industry]/page.tsx")) {
      source = source.replace('canonical: `/for/', `canonical: \`${basePath}/for/`);
      source = source.replace('images: [`/for/', `images: [\`${basePath}/for/`);
    }
    if (file.endsWith("/lib/analytics.ts")) {
      source = source.replace('location.pathname.startsWith("/for/")', `location.pathname.startsWith("${basePath}/for/")`);
      source = source.replace('location.pathname.split("/")[2]', 'location.pathname.split("/")[3]');
    }
    // Sample-only distribution does not send visitors' text or email to a server.
    if (file.endsWith("/components/Demo.tsx")) {
      source = source.replace('const response = await fetch("/api/demo", {', 'const response = await sampleRequest("/api/demo", {');
      source += `\nasync function sampleRequest(_url: string, options: RequestInit) {
  const body = JSON.parse(String(options.body));
  const example = demoExamples.find((item) => item.id === body.example) || demoExamples[0];
  return Response.json({ mode: "sample", input: example.input, result: example.result });
}\n`;
    }
    if (source.includes('fetch("/api/email", {')) {
      source = source.replaceAll('fetch("/api/email", {', 'unavailableEmail("/api/email", {');
      source += `\nasync function unavailableEmail(_url: string, _options: RequestInit) {
  return Response.json({ error: "Email delivery is not connected. Download your copy instead." }, { status: 503 });
}\n`;
    }
    if (/\/(robots|sitemap)\.ts$/.test(file) || /opengraph-image\.tsx$/.test(file)) source += '\nexport const dynamic = "force-static";\n';
    await writeFile(file, source);
  }
}
await transformTree(join(stage, "app"));
await transformTree(join(stage, "components"));
await transformTree(join(stage, "lib"));
const result = spawnSync(process.execPath, [join(root, "node_modules/next/dist/bin/next"), "build"], {
  cwd: stage,
  env: { ...process.env, NEXT_PUBLIC_SITE_URL: origin, NEXT_TELEMETRY_DISABLED: "1" },
  stdio: "inherit",
});
if (result.status !== 0) process.exit(result.status || 1);
await writeFile(join(stage, "out/.nojekyll"), "");
console.log(`Static preview ready: ${join(stage, "out")}\nPublic origin: ${origin}`);
